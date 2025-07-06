"use client"
import { useConvexAuth } from "convex/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const OnboardingLayout = ({ children }: { children: React.ReactNode }) => {
    const { isAuthenticated, isLoading } = useConvexAuth()
    const router = useRouter()

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push("/")
        }
    }, [isAuthenticated, isLoading, router])
    return <div className="relative h-screen w-full">

        {children}
        <Image src={"/assets/girl-riding-scooter.svg"} alt="Girl Riding Scooter" width={500} height={500} className="fixed bottom-0 left-0 transform -translate-x-1/5 hidden lg:block" />
    </div>;
};


export default OnboardingLayout;
