import { generateObject } from "ai";
import { v } from "convex/values";
import { internalAction } from "../_generated/server";
import { GENERATE_QUIZ_MODEL } from "../model";
import { quizSchema } from "./validations";




export const generateQuiz = internalAction({
    args: {
        title: v.string(),
        description: v.optional(v.string()),
        topic: v.string(),
        difficulty: v.union(
            v.literal("easy"),
            v.literal("medium"),
            v.literal("hard")
        ),
    },
    handler: async (ctx, args) => {
        const response = await generateObject({
            model: GENERATE_QUIZ_MODEL,
            schema: quizSchema,
            prompt: `
            # Quiz Generation Instructions (Bahasa Indonesia)
            
            Buat kuis komprehensif dengan detail berikut:
            - Judul: "${args.title}"
            - Topik: ${args.topic}
            - Tingkat Kesulitan: ${args.difficulty.toUpperCase()}
            ${args.description ? `- Deskripsi: ${args.description}` : ''}
            
            ## Persyaratan:
            1. Gunakan Bahasa Indonesia yang baik dan benar
            2. Istilah teknis dalam bahasa Inggris bisa dipertahankan (contoh: "function", "variable", "algorithm")
            3. Buat 5-10 pertanyaan dengan tingkat kesulitan yang meningkat
            4. Variasikan tipe pertanyaan antara pilihan ganda dan benar/salah
            5. Pastikan opsi jawaban masuk akal dan hanya ada satu jawaban yang benar
            6. Sertakan penjelasan rinci untuk setiap jawaban
            7. Sesuaikan dengan tingkat kesulitan yang ditentukan
            8. Cakup berbagai aspek topik yang dibahas
            9. Hindari pertanyaan yang ambigu atau menjebak
            10. Gunakan bahasa yang jelas dan sesuai dengan tingkat kesulitan
            
            ## Format Pertanyaan:
            Untuk setiap pertanyaan, berikan:
            - questionNumber: Nomor urut
            - question: Pertanyaan dalam Bahasa Indonesia
            - options: Daftar opsi jawaban dalam Bahasa Indonesia (istilah teknis dalam bahasa Inggris bisa dipertahankan)
            - correctOptionIndex: Indeks jawaban yang benar
            - explanation: Penjelasan mengapa jawaban tersebut benar (dalam Bahasa Indonesia)
            - type: "multiple_choice" atau "true_false"
            - difficulty: "easy", "medium", atau "hard"
            
            ## Contoh:
            {
              "question": "Apa fungsi dari perintah 'console.log()' dalam JavaScript?",
              "options": [
                "Untuk menampilkan pesan ke konsol",
                "Untuk membuat variabel baru",
                "Untuk menghentikan eksekusi kode",
                "Untuk mengimpor modul"
              ],
              "correctOptionIndex": 0,
              "explanation": "'console.log()' digunakan untuk menampilkan pesan atau nilai ke konsol browser atau terminal, berguna untuk proses debugging.",
              "type": "multiple_choice",
              "difficulty": "easy"
            }
            
            Fokus pada pembuatan pertanyaan yang menguji pemahaman konsep daripada sekadar hafalan.
            Pastikan bahasa yang digunakan natural dan mudah dipahami oleh penutur Bahasa Indonesia.
            `
        });

        return response.object
    }
})