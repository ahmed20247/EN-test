"use client";

import ESCModal from "@/components/UI/editSetConfirmModal";
import EditWordCard from "@/components/WordSet/EditWordCard";
import NewWordCard from "@/components/WordSet/NewWordCard";
import { useTheme } from "@/contexts/theme-context";
import { UserContext } from "@/contexts/user-context";
import { createClient } from "@/utils/supabase/client";
import { Button, Divider, TextField } from "@mui/material";
import { redirect, useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";

export default function EditWordSet({ params }) {
  const { id } = params;
  const supabase = createClient();
  const [setName, setSetName] = useState("");
  const {
    client,
    setWordSets,
    wordSets,
    loading,
    setLoading,
    cards,
    setCards,
  } = useContext(UserContext);
  const [wordSetId, setWordSetId] = useState();
  const [words, setWords] = useState([]);
  const [nameChanged, setNameChanged] = useState(null);
  const router = useRouter();
  const { darkMode } = useTheme();

  useEffect(() => {
    const getSet = async () => {
      try {
        setLoading(true);
        const { data: setData, error } = await supabase
          .from("word_sets")
          .select("*")
          .eq("id", id);
        if (!error) {
          console.log("setData:", setData);
          setSetName(setData[0].name);
          setWordSetId(setData[0].id);
        } else {
          redirect("/error");
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    getSet();
  }, [id]);

  useEffect(() => {
    const getWords = async () => {
      try {
        setLoading(true);
        const { data: firstWords, error } = await supabase
          .from("words")
          .select("*")
          .eq("word_set_id", wordSetId);

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
                  showDefBtn: true,
                  definitions: defWithExamples,
                };
              } else {
                return { ...word, showDefBtn: true };
              }
            })
          );
          console.log("NewWords:", NewWords);
          setCards(NewWords);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    getWords();
  }, [wordSetId]);

  const handleEdit = async () => {
    if (setName === "") return;
    console.log("client: ", client);
    try {
      // setLoading(true);
      const { data, error } = await supabase
        .from("word_sets")
        .update({
          name: setName,
        })
        .eq("id", id)
        .eq("user_id", client.id);

      if (!error) {
        console.log("word set inserted successfully:", wordSets);

        const newSets = wordSets.map((set) => {
          if (set.id === id) {
            return {
              ...set,
              name: setName,
            };
          } else return set;
        });

        console.log("newSets", newSets);

        setWordSets(newSets);
        setNameChanged("Set name changed successfuly!");
        setTimeout(() => {
          setNameChanged(null);
        }, 3000);
      } else {
        console.log(error);
      }
    } catch (error) {
      console.log(error);
    } finally {
      // setLoading(false);
    }
  };

  const handleCreate = async () => {
    try {
      setLoading(true);
      handleEdit();
      const { error } = await supabase
        .from("words")
        .delete()
        .eq("word_set_id", wordSetId);
      if (error) return;

      for (const card of cards) {
        // Insert into words
        if (card.word === "") continue;
        const { data: word, error: wordError } = await supabase
          .from("words")
          .insert([{ word: card.word, word_set_id: wordSetId }])
          .select();

        if (wordError) {
          console.error("Error inserting word:", wordError);
          continue;
        }

        for (const definition of card.definitions) {
          // Insert into definitions
          if (definition.definition === "") continue;
          const { data: def, error: defError } = await supabase
            .from("definitions")
            .insert([
              { definition: definition.definition, word_id: word[0].id },
            ])
            .select();

          if (defError) {
            console.error("Error inserting definition:", defError);
            continue;
          }

          for (const example of definition.examples) {
            // Insert into examples
            if (example.example_text !== "") {
              const { error: exampleError } = await supabase
                .from("examples")
                .insert([
                  {
                    example_text: example.example_text,
                    definition_id: def[0].id,
                  },
                ]);

              if (exampleError) {
                console.error("Error inserting example:", exampleError);
              } else {
                console.log("Example inserted:", example);
              }
            }
          }
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      router.push("/word-sets");
      setLoading(false);
    }
  };

  return (
    <div className="p-4 lg:pt-32 bg-gray-50 dark:bg-slate-800 min-w-screen min-h-screen">
      <div
        className={`w-full md:w-2/3 m-auto h-full flex flex-col md:flex-row items-start justify-center gap-5`}
      >
        <div className="relative w-full flex flex-col">
          <TextField
            required
            id="outlined-required"
            label="Set title"
            value={setName}
            onChange={(e) => setSetName(e.target.value)}
            fullWidth
            // className="bg-white rounded-xl"
            sx={{
              bgcolor: darkMode ? "rgb(51 65 85)" : "white",
              borderRadius: "0.75rem",
              "& .MuiOutlinedInput-notchedOutline": {
                border: "none !important",
              },
              "& .MuiInputBase-input": {
                color: darkMode ? "white" : "black",
              },
            }}
          />
          {nameChanged && (
            <p className="text-green-500 text-sm mt-1">{nameChanged}</p>
          )}
        </div>
        <div className="w-1/2 md:w-32 flex items-start flex-1 pt-1">
          <Button
            variant="contained"
            className="tracking-wider text-lg md:text-base "
            onClick={handleCreate}
            disabled={loading}
            sx={{
              textTransform: "capitalize",
              pt: "0.75rem",
              pb: "0.75rem",
              fontWeight: "700",
              borderRadius: "0.5rem",
              bgcolor: "#435d82",
            }}
          >
            Save
          </Button>
        </div>
      </div>
      <Divider
        className="md:w-2/3"
        sx={{ width: "100%", m: "auto", mt: "1.5rem", mb: "1.5rem" }}
      />
      <EditWordCard wordSetId={wordSetId} handleCreate={handleCreate} />
      <ESCModal handleCreate={handleCreate} />
    </div>
  );
}
