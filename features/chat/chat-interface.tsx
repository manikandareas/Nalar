"use client"
import {
  optimisticallySendMessage,
  toUIMessages,
  useSmoothText,
  useThreadMessages,
  type UIMessage,
} from "@convex-dev/agent/react";
import { api } from "@cvx/_generated/api";
import { useMutation } from "convex/react";

import { useEffect, useState } from "react";
import ReactMarkdown from 'react-markdown';
import rehypeKatex from 'rehype-katex';
import remarkGfm from "remark-gfm";
import remarkMath from 'remark-math';

function getThreadIdFromHash() {
  return window.location.hash.replace(/^#/, "") || undefined;
}

export default function ChatInterface() {
  const createThread = useMutation(api.chat.mutations.createThread);
  const [threadId, setThreadId] = useState<string | undefined>(
    typeof window !== "undefined" ? getThreadIdFromHash() : undefined,
  );

  // Listen for hash changes
  useEffect(() => {
    function onHashChange() {
      setThreadId(getThreadIdFromHash());
    }
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  // On mount or when threadId changes, if no threadId, create one and set hash
  useEffect(() => {
    if (!threadId) {
      void createThread({
        prompt: ""
      }).then((newId) => {
        window.location.hash = newId;
        setThreadId(newId);
      });
    }
  }, [createThread, threadId]);

  // Reset handler: create a new thread and update hash
  const handleReset = () => {
    void createThread({
      prompt: ""
    }).then((newId) => {
      window.location.hash = newId;
      setThreadId(newId);
    });
  };

  return (
    <>
      <div className="min-h-screen flex flex-col ">
        <main className="flex-1 flex items-center justify-center p-8">
          {threadId ? (
            <>
              <Chat threadId={threadId} reset={handleReset} />
            </>
          ) : (
            <div className="text-center text-gray-500">Loading...</div>
          )}
        </main>
      </div>
    </>
  );
}

function Chat({ threadId, reset }: { threadId: string; reset: () => void }) {
  const messages = useThreadMessages(
    api.chat.queries.listThreadMessages,
    { threadId },
    { initialNumItems: 10, stream: true },
  );
  const sendMessage = useMutation(
    api.chat.mutations.streamChatAsynchronously,
  ).withOptimisticUpdate(
    optimisticallySendMessage(api.chat.queries.listThreadMessages),
  );
  const [prompt, setPrompt] = useState("");

  function onSendClicked() {
    if (prompt.trim() === "") return;
    void sendMessage({ threadId, prompt }).catch(() => setPrompt(prompt));
    setPrompt("");
  }

  return (
    <>
      <div className="w-full max-w-2xl rounded-xl shadow-lg p-6 flex flex-col gap-6">
        {messages.results?.length > 0 && (
          <div className="flex flex-col gap-4 overflow-y-auto mb-4">
            {toUIMessages(messages.results ?? []).map((m) => (
              <Message key={m.key} message={m} />
            ))}
          </div>
        )}
        <form
          className="flex gap-2 items-center"
          onSubmit={(e) => {
            e.preventDefault();
            onSendClicked();
          }}
        >
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50"
            placeholder={
              messages.results?.length > 0
                ? "Continue the conversation..."
                : "Ask a question..."
            }
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition font-semibold disabled:opacity-50"
            disabled={!prompt.trim()}
          >
            Send
          </button>
          {messages.results?.length > 0 && (
            <button
              className="px-4 py-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition font-medium self-end"
              onClick={() => reset()}
              type="button"
            >
              Reset
            </button>
          )}
        </form>
      </div>
    </>
  );
}

function Message({ message }: { message: UIMessage }) {
  const isUser = message.role === "user";
  const [visibleText] = useSmoothText(message.content);
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`rounded-lg px-4 py-2 max-w-lg whitespace-pre-wrap shadow-sm ${isUser ? "bg-blue-100 text-blue-900" : "bg-gray-200 text-gray-800"
          }`}
      >
        <ReactMarkdown
          remarkPlugins={[remarkMath, remarkGfm]}
          rehypePlugins={[rehypeKatex]}
        >
          {visibleText}
        </ReactMarkdown>
      </div>
    </div>
  );
}