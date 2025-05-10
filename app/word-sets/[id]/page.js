"use client";

import BackButton from "@/components/BackButton";
import DisplayWordCard from "@/components/WordSet/DisplayWordCard";
import WordsNavigation from "@/components/WordSet/WordsNavigation";
import { UserContext } from "@/contexts/user-context";
import { createClient } from "@/utils/supabase/client";
import { useContext, useEffect, useState } from "react";

export default function Page({ params }) {
  const { id } = params;
  const supabase = createClient();
  const [words, setWords] = useState([]);
  const { setLoading, currentWordIndex, setCurrentWordIndex } =
    useContext(UserContext);
  const [autoPlayAudio, setAutoPlayAudio] = useState(false);

  useEffect(() => {
    console.log("test slug", id);
    const getWords = async () => {
      try {
        setLoading(true);
        const { data: firstWords, error } = await supabase
          .from("words")
          .select("*")
          .eq("word_set_id", id);

        if (!error) {
          console.log("firstWords: ", firstWords);
          // setWords(firstWords)
          const NewWords = await Promise.all(
            firstWords.map(async (word) => {
              const { data: definitions, error } = await supabase
                .from("definitions")
                .select("*")
                .eq("word_id", word.id);
              if (!error) {
                console.log("definitions", definitions);
                const defWithExamples = await Promise.all(
                  definitions.map(async (definition) => {
                    const { data: examples, error } = await supabase
                      .from("examples")
                      .select("*")
                      .eq("definition_id", definition.id);
                    if (!error) {
                      console.log("examples:", examples);
                    }
                    return {
                      ...definition,
                      examples: examples,
                    };
                  })
                );

                return {
                  ...word,
                  definitions: defWithExamples,
                };
              } else {
                return { ...word };
              }
            })
          );
          console.log("NewWords:", NewWords);
          setWords(NewWords);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    getWords();
  }, [id]);

  return (
    <div className="p-4 pb-10 lg:pt-28 pt-8 bg-gray-50 dark:bg-slate-800 min-w-screen min-h-screen flex flex-col items-center justify-start">
      <div className="w-full md:w-2/3 lg:w-2/3 h-auto ">
        <BackButton />
      </div>
      <DisplayWordCard
        words={words}
        currentWordIndex={currentWordIndex}
        autoPlayAudio={autoPlayAudio}
      />
      <WordsNavigation
        words={words}
        autoPlayAudio={autoPlayAudio}
        setAutoPlayAudio={setAutoPlayAudio}
      />
    </div>
  );
}
