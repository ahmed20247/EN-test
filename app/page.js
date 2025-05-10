"use client";

import Image from "next/image";
import sImage from "@/assets/study.svg";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

const Landing = () => {
  const router = useRouter();
  return (
    <div className=" py-6 w-lvw bg-gray-50 text-gray-900 transition-all dark:bg-csecond dark:text-gray-50 md:h-lvh">
      <div className="container h-full">
        <main className="h-full flex items-center justify-center gap-5 overflow-hidden max-lg:flex-col-reverse">
          <div className="flex flex-1 flex-col gap-5">
            <h1 className="text-3xl md:text-4xl font-bold text-main dark:text-white dark:brightness-125">
              Make it once study it to master it
            </h1>
            <h2 class="max-w-[66ch] text-l text-gray-700 font-medium md:font-bold dark:text-gray-300">
              Take your language learning to new heights with our tailored
              flashcard website! Uniquely crafted for language learners, Cards
              is here to assist you in memorizing vocabulary and cementing it in
              your memory
            </h2>
            <div class="mt-5 flex gap-5 max-lg:flex-col-reverse">
              <a
                class="inline-flex items-center justify-center whitespace-nowrap text-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-main text-white hover:bg-main/90 h-10 px-4 py-2 w-40 rounded-full font-bold dark:text-white max-lg:w-full"
                href="/signup"
              >
                Sign up
              </a>
              <a
                class="inline-flex items-center justify-center whitespace-nowrap text-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 w-40 rounded-full border-[3px] border-main bg-transparent font-bold text-main dark:text-white max-lg:w-full"
                href="/login"
              >
                Log in
              </a>
            </div>
          </div>
          <div class="flex flex-initial justify-center">
            <Image src={sImage} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Landing;
