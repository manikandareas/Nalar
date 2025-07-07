"use client";


import { Button, buttonVariants } from "@/components/ui/button";
import { SignInButton, SignUpButton, UserButton } from "@clerk/clerk-react";
import { useConvexAuth } from "convex/react";
import { Loader2 } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const { isAuthenticated, isLoading } = useConvexAuth()
  return (
    <div className="relative flex flex-col items-center">
      <Navbar isAuthenticated={isAuthenticated} isLoading={isLoading} />
      <div className="max-w-7xl flex flex-col">
        <div className="absolute inset-y-0 left-0 h-full w-px bg-neutral-200/80 dark:bg-neutral-800/80">
          <div className="absolute top-0 h-40 w-px bg-gradient-to-b from-transparent via-blue-500 to-transparent" />
        </div>
        <div className="absolute inset-y-0 right-0 h-full w-px bg-neutral-200/80 dark:bg-neutral-800/80">
          <div className="absolute h-40 w-px bg-gradient-to-b from-transparent via-blue-500 to-transparent" />
        </div>
        <div className="absolute inset-x-0 bottom-0 h-px w-full bg-neutral-200/80 dark:bg-neutral-800/80">
          <div className="absolute mx-auto h-px w-40 bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
        </div>
        <div className="px-4 py-10 md:py-20">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.5 }}
            className="relative z-10 mb-4 text-center text-lg font-semibold text-blue-500"
          >
            Mitra Belajar Personalmu
          </motion.div>
          <h1 className="relative z-10 mx-auto max-w-4xl text-center text-2xl font-bold text-slate-700 md:text-4xl lg:text-7xl dark:text-slate-300">
            {"Tingkatkan Potensi Belajarmu dengan Tutor AI Pribadi"
              .split(" ")
              .map((word, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, filter: "blur(4px)", y: 10 }}
                  animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                  transition={{
                    duration: 0.3,
                    delay: index * 0.1,
                    ease: "easeInOut",
                  }}
                  className="mr-2 inline-block"
                >
                  {word}
                </motion.span>
              ))}
          </h1>
          <motion.p
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            transition={{
              duration: 0.3,
              delay: 0.8,
            }}
            className="relative z-10 mx-auto max-w-xl py-4 text-center text-lg font-normal text-neutral-600 dark:text-neutral-400"
          >
            Nalar adalah teman belajar AI yang membantumu memahami konsep sulit, mengatasi kesenjangan pengetahuan, dan belajar dengan caramu sendiri.
          </motion.p>
          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            transition={{
              duration: 0.3,
              delay: 1,
            }}
            className="relative z-10 mt-8 flex flex-wrap items-center justify-center gap-4"
          >

            {isLoading && (
              <button className="w-24 transform rounded-lg bg-black px-6 py-2 font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-gray-800 md:w-32 dark:bg-white dark:text-black dark:hover:bg-gray-200">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              </button>
            )}
            {
              !isLoading && !isAuthenticated ? (
                <SignUpButton mode="modal" fallbackRedirectUrl={"/onboarding/username"} signInFallbackRedirectUrl={"/rooms"}>
                  <Button>
                    Coba Sekarng
                  </Button>
                </SignUpButton>
              ) :
                <div className="flex items-center gap-2">
                  <Link href="/rooms" className={buttonVariants()}>
                    Go to rooms
                  </Link>
                </div>
            }
            <Button variant={"outline"}>
              Pelajari Lebih Lanjut
            </Button>
          </motion.div>
          <motion.div
            initial={{
              opacity: 0,
              y: 10,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.3,
              delay: 1.2,
            }}
            className="relative z-10 mt-20 rounded-3xl border border-neutral-200 bg-neutral-100 p-4 shadow-md dark:border-neutral-800 dark:bg-neutral-900"
          >
            <div className="w-full overflow-hidden rounded-xl border border-gray-300 dark:border-gray-700">
              <Image
                src="/assets/home.png"
                alt="Landing page preview"
                className="h-auto w-full object-cover"
                height={1000}
                width={1000}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

const Navbar = ({ isAuthenticated, isLoading }: { isAuthenticated: boolean, isLoading: boolean }) => {
  return (
    <nav className=" max-w-7xl flex w-full items-center justify-between border-t border-b border-neutral-200 px-4 py-4 dark:border-neutral-800">
      <div className="flex items-center gap-2">
        <div className="size-7 rounded-full bg-gradient-to-br from-violet-500 to-pink-500" />
        <h1 className="text-base font-bold md:text-2xl">Nalar</h1>
      </div>

      {isLoading && (
        <button className="w-24 transform rounded-lg bg-black px-6 py-2 font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-gray-800 md:w-32 dark:bg-white dark:text-black dark:hover:bg-gray-200">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        </button>
      )}
      {
        !isLoading && !isAuthenticated ? (
          <SignInButton mode="modal" fallbackRedirectUrl={"/rooms"} signUpFallbackRedirectUrl={"/onboarding/username"}>
            <Button size={"sm"}>
              Login
            </Button>
          </SignInButton>

        ) : <div className="flex items-center gap-2">
          <Link href="/rooms" className={buttonVariants({ size: "sm" })}>
            Start Learning
          </Link>
          <UserButton />
        </div>
      }

    </nav>
  );
};
