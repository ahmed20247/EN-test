"use client";

import { useContext, useEffect } from "react";
import { UserContext } from "@/contexts/user-context";

import { createClient } from "@/utils/supabase/client";
import NoWordSets from "@/components/WordSet/NoWordSets";
import WordSetList from "@/components/WordSet/WordSetList";

export default function WordSets() {
  const supabase = createClient();

  const { wordSets } = useContext(UserContext);

  return <div>{wordSets?.length === 0 ? <NoWordSets /> : <WordSetList />}</div>;
}
