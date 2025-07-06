"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuth } from "@clerk/nextjs";
import { api } from "@cvx/_generated/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "convex/react";
import { Loader2, SendHorizonal } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  username: z.string().min(3, {
    message: "Username must be at least 3 characters.",
  }),
});

export default function UsernamePage() {
  const { isLoaded } = useAuth();
  const router = useRouter();
  const completeOnboardingUsername = useMutation(api.users.mutations.completeOnboardingUsername);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await completeOnboardingUsername({ username: values.username });
      router.push("/onboarding/plans");
    } catch (error) {
      console.error("Failed to complete onboarding:", error);
    }
  }

  if (!isLoaded) {
    return null; // Or a loading spinner
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-lg p-8 space-y-6">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold">Welcome to <span className="text-accent">Nalar</span></h1>
          <p className="">
            Your personal AI Learning companion for any subject of you want.
          </p>
          <p className="text-muted-foreground text-sm">
            Let&apos;s get your account set up. Please choose a username.
          </p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="e.g., manikandareas" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className=""
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting
                ? <>
                  <Loader2 size={16} className="animate-spin" />Saving...
                </>
                : <>
                  Get Started <SendHorizonal size={16} />
                </>}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}