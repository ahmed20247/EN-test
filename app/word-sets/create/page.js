"use client";

import CSCModal from "@/components/UI/createSetConfirmModal";
import NewWordCard from "@/components/WordSet/NewWordCard";
import { useTheme } from "@/contexts/theme-context";
import { UserContext } from "@/contexts/user-context";
import { createClient } from "@/utils/supabase/client";
import { Button, Divider, TextField } from "@mui/material";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";

export default function CreateWordSet() {
  const supabase = createClient();
  const [setName, setSetName] = useState("");
  const [isSetCreated, setIsSetCreated] = useState(false);
  const { client, setLoading, setWordSets, wordSets, cards, setCards } =
    useContext(UserContext);
  const [wordSetId, setWordSetId] = useState(null);
  const [nameChanged, setNameChanged] = useState(null);
  const [error, setError] = useState(null);
  const [error2, setError2] = useState(null);
  const router = useRouter();
  const { darkMode } = useTheme();

  useEffect(() => {
    setCards([]);
  }, []);
  const handleCreate = async (from = "def") => {
    if (setName === "") {
      if (from === "top" || from === "def") {
        setError2("Please add set title first!");
        setTimeout(() => {
          setError2(null);
        }, 3000);
      }
      if (from === "bottom") {
        setError("Please add set title first!");
        setTimeout(() => {
          setError(null);
        }, 3000);
      }
      return;
    }
    try {
      setLoading(true);
      const id = await handleCreateSet();
      for (const card of cards) {
        if (card.title === "") continue;
        // Insert into words
        const { data: word, error: wordError } = await supabase
          .from("words")
          .insert([{ word: card.title, word_set_id: id }])
          .select();

        if (wordError) {
          console.error("Error inserting word:", wordError);
          continue;
        }

        for (const definition of card.definitions) {
          if (definition.text === "") continue;
          // Insert into definitions
          const { data: def, error: defError } = await supabase
            .from("definitions")
            .insert([{ definition: definition.text, word_id: word[0].id }])
            .select();

          if (defError) {
            console.error("Error inserting definition:", defError);
            continue;
          }

          for (const example of definition.examples) {
            // Insert into examples
            if (example.text !== "") {
              const { error: exampleError } = await supabase
                .from("examples")
                .insert([
                  { example_text: example.text, definition_id: def[0].id },
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

  const handleCreateSet = async () => {
    console.log("client: ", client);
    try {
      // setLoading(true);
      const { data, error } = await supabase
        .from("word_sets")
        .insert({
          user_id: client.id,
          name: setName,
        })
        .select();

      if (!error) {
        console.log("word set inserted successfully:", data);
        setIsSetCreated(true);
        setWordSetId(data[0].id);
        setWordSets((prev) => [...prev, data[0]]);
        setNameChanged("Set created successfuly!");
        setTimeout(() => {
          setNameChanged(null);
        }, 3000);
        return data[0].id;
      } else {
        console.log(error);
      }
    } catch (error) {
      console.log(error);
    } finally {
      // setLoading(false);
    }
  };

  return (
    <div className="p-4 lg:pt-32 bg-gray-50 min-w-screen min-h-screen dark:bg-slate-800">
      <div
        className={`w-full md:w-2/3 m-auto h-full flex flex-col md:flex-row items-start justify-center gap-5`}
      >
        <div className="relative w-full flex flex-col">
          <TextField
            required
            disabled={isSetCreated ? true : false}
            id="outlined-required"
            label="Set title"
            value={setName}
            onChange={(e) => setSetName(e.target.value)}
            fullWidth
            // className="bg-white "
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
          {error2 && <p className="text-red-500 text-sm mt-1">{error2}</p>}
        </div>
        <div className="w-1/2 md:w-32 flex items-start flex-1 pt-1">
          <Button
            variant="contained"
            className="tracking-wider text-lg md:text-base "
            onClick={() => handleCreate("top")}
            fullWidth
            disabled={isSetCreated ? true : false}
            sx={{
              textTransform: "capitalize",
              pt: "0.75rem",
              pb: "0.75rem",
              fontWeight: "700",
              borderRadius: "0.5rem",
              bgcolor: "#435d82",
            }}
          >
            Create
          </Button>
        </div>
      </div>
      <Divider
        className="md:w-2/3"
        sx={{ width: "100%", m: "auto", mt: "1.5rem", mb: "1.5rem" }}
      />
      <NewWordCard
        wordSetId={wordSetId}
        isSetCreated={isSetCreated}
        error={error}
        handleCreate={handleCreate}
      />
      <CSCModal handleCreate={handleCreate} />
    </div>
  );
}
