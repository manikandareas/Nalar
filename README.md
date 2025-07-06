# 🧠 Nalar – AI-Powered Adaptive Learning Platform

Nalar adalah platform pembelajaran adaptif yang memanfaatkan kekuatan Generative AI untuk memberikan pengalaman belajar personal, seolah-olah pengguna memiliki tutor pribadi. Dibangun untuk membantu siswa SMA, mahasiswa, dan lifelong learners dalam memahami konsep-konsep kompleks secara efektif, Nalar menggabungkan Agentic AI, Retrieval-Augmented Generation (RAG), dan vector search untuk mendukung pembelajaran yang kontekstual, interaktif, dan relevan.

## 🚀 Demo

👉 [Live Demo](https://nalar-gold.vercel.app/)

---

## 📌 Features

- 💬 **AI Tutor Chat (Nalar)**  
  Chat interaktif dengan AI yang memahami konteks pengguna, membuat quiz otomatis, dan mengambil resource terpercaya dari internet.

- 📊 **Adaptive Learning Assessment**  
  Menilai baseline knowledge dan gaya belajar pengguna secara otomatis, serta menyesuaikan kesulitan materi secara dinamis.

- 🗺️ **Personalized Learning Plan**  
  Rencana belajar yang dihasilkan berdasarkan hasil assessment dan preferensi gaya belajar.

- ✅ **Practice Problems + Feedback Instan**  
  Soal latihan yang disesuaikan dengan topik dan level pemahaman, dengan evaluasi langsung dari AI.

- 🧠 **Study Session Planner**  
  Perencana sesi belajar berbasis AI dengan spaced repetition dan smart reminders.

---

## 🧑‍💻 Tech Stack

| Layer        | Tools/Frameworks                     |
|--------------|--------------------------------------|
| Frontend     | Next.js 15, TypeScript, TailwindCSS  |
| State Mgmt   | TanStack Query                       |
| Backend      | Convex (DB + Logic + Vector Search)  |
| Deployment   | Vercel                               |
| AI Models    | OpenAI GPT-4.1, GPT-4.1 Mini, Text-Embedding-3-Small |
| Dev Tools    | Gemini 2.5 Pro (ideation), IBM Granite (debug & docs) |

---

## 🧠 AI & Prompting Strategy

- **Agentic AI**: Nalar dibangun menggunakan pendekatan agent AI dengan memory dan tool usage.
- **RAG (Retrieval-Augmented Generation)**: Mengambil konteks tambahan dari resource terpercaya untuk menjawab pertanyaan secara akurat dan mencegah halusinasi.
- **Prompt Engineering**: Disusun untuk mengarahkan AI bertindak sebagai tutor, evaluator, dan planner secara bergantian sesuai konteks percakapan.

---

## 🛠️ Development Setup

```bash
# 1. Clone the repo
git clone https://github.com/your-username/nalar.git
cd nalar

# 2. Install dependencies
npm install

# 3. Setup environment variables
cp .env.example .env
# 🔑 Add your OpenAI key, Convex project ID, etc.

# 4. Start the dev server
npm run dev
