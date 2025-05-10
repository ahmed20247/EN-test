"use state";

import { createClient } from "@/utils/supabase/client";
import { Close, Delete, Rectangle } from "@mui/icons-material";
import {
  Button,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { useContext, useState } from "react";
import { useRouter } from "next/navigation";
import { UserContext } from "@/contexts/user-context";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Card from "./Card";

export default function NewWordCard({ handleCreate, error }) {
  const supabase = createClient();
  const { loading, setLoading, cards, setCards } = useContext(UserContext);

  const addCard = () => {
    setCards((prevCards) => [
      ...prevCards,
      {
        id: Date.now(),
        title: "",
        definitions: [
          {
            id: Date.now(),
            text: "",
            examples: [{ id: Date.now(), text: "" }],
          },
        ],
      },
    ]);
  };

  const moveCard = (fromIndex, toIndex) => {
    const updatedCards = [...cards];
    const [movedCard] = updatedCards.splice(fromIndex, 1);
    updatedCards.splice(toIndex, 0, movedCard);
    setCards(updatedCards);
  };

  const renderCards = cards.map((card, index) => (
    <Card key={card.id} card={card} index={index} moveCard={moveCard} />
  ));

  if (loading) return <div></div>;

  return (
    <div
      className={`w-full md:w-2/3 m-auto h-full flex flex-col items-center justify-start gap-5`}
    >
      <DndProvider backend={HTML5Backend}>
        <div className="w-full h-auto overflow-hidden flex flex-col items-center justify-start gap-5">
          {renderCards}
        </div>
      </DndProvider>

      <div className="w-full h-auto overflow-hidden	flex rounded-lg bg-white dark:bg-slate-700 shadow-sm ">
        <div
          className="w-4 md:w-4 flex items-center justify-center text-white"
          style={{ backgroundColor: "rgb(67 93 130)" }}
        ></div>
        <div className="p-8 flex flex-1 items-center justify-center">
          <Button
            variant="outlined"
            className="w-3/4 text-xl"
            onClick={addCard}
            sx={{
              border: "1px dashed rgb(156 163 175)",
              textTransform: "capitalize",
              p: "1rem 1.5rem",
              fontWeight: "700",
              borderRadius: "0.75rem",
              color: "rgb(156 163 175)",
            }}
          >
            Add a card
          </Button>
        </div>
      </div>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      <div className="w-full h-auto overflow-hidden	flex ">
        <div className="flex flex-1 items-center justify-end">
          <Button
            variant="contained"
            className="py-2 w-1/2 md:w-32 tracking-wider text-lg md:text-base"
            onClick={() => handleCreate("bottom")}
            // disabled={isSetCreated ? true : false}
            disabled={cards.length === 0}
            sx={{
              textTransform: "capitalize",
              pt: "0.5rem",
              pb: "0.5rem",
              fontWeight: "700",
              borderRadius: "0.5rem",
              bgcolor: "#435d82",
            }}
          >
            Create
          </Button>
        </div>
      </div>
    </div>
  );
}
