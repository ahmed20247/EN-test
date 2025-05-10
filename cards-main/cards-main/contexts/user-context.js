"use client";

import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

const { createContext, useState, useEffect } = require("react");

export const UserContext = createContext();

const UserContextProvider = ({ children }) => {
  const supabase = createClient();
  const [client, setClient] = useState(null);
  const [user, setUser] = useState(null);
  const [wordSets, setWordSets] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cards, setCards] = useState([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);

  const router = useRouter();

  useEffect(() => {
    try {
      setLoading(true);

      const getData = async () => {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        console.log("test", user);

        const { data, error } = await supabase
          .from("users")
          .select("*")
          .eq("id", user?.id);

        if (data) {
          setClient(data[0]);
          router.push("/word-sets");
          const { data: wordSetsData, error: wordError } = await supabase
            .from("word_sets")
            .select("*")
            .eq("user_id", user?.id);
          if (!wordError) {
            console.log("test word stes ", wordSetsData);
            setWordSets(wordSetsData);
          }
        }

        console.log(data);
      };
      getData();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  console.log(client);
  const contextValue = {
    client,
    setClient,
    loading,
    setLoading,
    wordSets,
    setWordSets,
    user,
    setUser,
    cards,
    setCards,
    currentWordIndex,
    setCurrentWordIndex,
  };

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
};

export default UserContextProvider;
