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
import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { UserContext } from "@/contexts/user-context";
import ESCModal from "../UI/editSetConfirmModal";
import { useTheme } from "@/contexts/theme-context";

export default function EditWordCard({ wordSetId, handleCreate }) {
  const [error, setError] = useState(null);
  const supabase = createClient();
  const router = useRouter();
  const { loading, setLoading, cards, setCards } = useContext(UserContext);
  console.log(cards);
  const { darkMode } = useTheme();

  const addCard = () => {
    setCards((prevCards) => [
      ...prevCards,
      {
        id: Date.now(),
        word: "",
        definitions: [
          {
            id: Date.now(),
            definition: "",
            examples: [{ id: Date.now(), example_text: "" }],
          },
        ],
      },
    ]);
  };

  const addDefinition = (cardId) => {
    setCards((prevCards) =>
      prevCards.map((card) =>
        card.id === cardId
          ? {
              ...card,
              showDefBtn: false,
              definitions: [
                ...card.definitions,
                {
                  id: Date.now(),
                  definition: "",
                  examples: [{ id: 1, example_text: "" }],
                },
              ],
            }
          : card
      )
    );
  };

  const addExample = (cardId, definitionId) => {
    setCards((prevCards) =>
      prevCards.map((card) =>
        card.id === cardId
          ? {
              ...card,
              definitions: card.definitions.map((definition) =>
                definition.id === definitionId
                  ? {
                      ...definition,
                      examples: [
                        ...definition.examples,
                        { id: Date.now(), example_text: "" },
                      ],
                    }
                  : definition
              ),
            }
          : card
      )
    );
  };

  const handleCardTitleChange = (cardId, value) => {
    setCards((prevCards) =>
      prevCards.map((card) =>
        card.id === cardId
          ? {
              ...card,
              word: value,
            }
          : card
      )
    );
  };
  const handleDefinitionChange = (cardId, definitionId, value) => {
    // check if the last defination in the current card is not empty
    const currentCard = cards.find((card) => card.id === cardId);
    if (currentCard) {
      const lastDefinition =
        currentCard.definitions[currentCard.definitions.length - 1];
      if (lastDefinition && lastDefinition.id === definitionId) {
        if (value.trim !== "") {
          setCards((prevCards) =>
            prevCards.map((card) =>
              card.id === cardId
                ? {
                    ...card,
                    showDefBtn: true,
                    definitions: card.definitions.map((definition) =>
                      definition.id === definitionId
                        ? { ...definition, definition: value }
                        : definition
                    ),
                  }
                : card
            )
          );
        } else if (value === "") {
          setCards((prevCards) =>
            prevCards.map((card) =>
              card.id === cardId
                ? {
                    ...card,
                    showDefBtn: false,
                    definitions: card.definitions.map((definition) =>
                      definition.id === definitionId
                        ? { ...definition, definition: value }
                        : definition
                    ),
                  }
                : card
            )
          );
        }
      }
    }
  };

  const handleExampleChange = (cardId, definitionId, exampleId, value) => {
    setCards((prevCards) =>
      prevCards.map((card) =>
        card.id === cardId
          ? {
              ...card,
              definitions: card.definitions.map((definition) =>
                definition.id === definitionId
                  ? {
                      ...definition,
                      examples: definition.examples.map((example) =>
                        example.id === exampleId
                          ? { ...example, example_text: value }
                          : example
                      ),
                    }
                  : definition
              ),
            }
          : card
      )
    );

    // Check if the last example in the current definition is not empty
    const currentCard = cards.find((card) => card.id === cardId);
    const currentDefinition = currentCard?.definitions.find(
      (definition) => definition.id === definitionId
    );

    if (currentDefinition) {
      const lastExample =
        currentDefinition.examples[currentDefinition.examples.length - 1];
      if (lastExample && lastExample.id === exampleId && value.trim() !== "") {
        addExample(cardId, definitionId);
      }
    }
  };

  const handleDeleteCard = (cardId) => {
    const newCards = cards.filter((card) => card.id !== cardId);
    setCards(newCards);
  };
  const handleDeleteDef = (cardId, defId) => {
    const newCards = cards.map((card) => {
      if (card.id === cardId) {
        const newDef = card.definitions.filter((def) => def.id !== defId);
        console.log("newDef:", newDef);
        return {
          ...card,
          definitions: newDef, // Update the definitions array
        };
      } else {
        return card; // Keep the card as is
      }
    });
    console.log("newCards:", newCards);
    setCards(newCards); // Update the state
  };

  const handleDeleteEx = (cardId, defId, exId) => {
    let flag = false;
    const newCards = cards.map((card) => {
      if (card.id === cardId) {
        const newDef = card.definitions.map((def) => {
          if (def.id === defId) {
            const newEx = def.examples.filter((ex) => ex.id !== exId);
            if (newEx[newEx.length - 1].example_text !== "") {
              console.log("newEx[-1]", newEx[newEx.length - 1]);
              // addExample(cardId, defId);
              flag = true;
            }
            return {
              ...def,
              examples: newEx,
            };
          } else {
            return def;
          }
        });
        console.log("newDef:", newDef);
        return {
          ...card,
          definitions: newDef, // Update the definitions array
        };
      } else {
        return card; // Keep the card as is
      }
    });
    console.log("newCards:", newCards);
    setCards(newCards); // Update the state
    if (flag) addExample(cardId, defId);
  };

  const renderCards = cards.map((card, index) => (
    <div
      key={card.id}
      className="relative w-full h-auto overflow-hidden	flex rounded-lg bg-white dark:bg-slate-700 shadow-sm "
    >
      <div
        className="w-4 md:w-4 flex items-center justify-center text-white"
        style={{ backgroundColor: "rgb(67 93 130)" }}
      >
        {index + 1}
      </div>
      <div className="p-4 w-full flex flex-col gap-2">
        <div className="w-44 font-bold text-2xl">
          <TextField
            variant="standard"
            placeholder="Write a word"
            value={card.word}
            onChange={(e) => handleCardTitleChange(card.id, e.target.value)}
            sx={{
              "& .MuiInputBase-input": {
                fontSize: "1.5rem",
                fontWeight: "700",
                color: darkMode && "white",
              },
            }}
          />
        </div>
        {card.definitions.map((definition) => (
          <div key={definition.id} className="px-2 py-1">
            <TextField
              variant="standard"
              placeholder="Write a defination"
              fullWidth
              value={definition.definition}
              onChange={(e) =>
                handleDefinitionChange(card.id, definition.id, e.target.value)
              }
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Rectangle
                      sx={{
                        color: definition.definition === "" ? "gray" : "#000",
                        fontSize: ".75rem",
                      }}
                    />
                  </InputAdornment>
                ),
                endAdornment: card.definitions.length > 1 && (
                  <InputAdornment position="end">
                    <Close
                      onClick={() => handleDeleteDef(card.id, definition.id)}
                      sx={{
                        color: "red",
                        fontSize: ".75rem",
                        cursor: "pointer",
                      }}
                    />
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiInputBase-input": {
                  fontSize: "1rem",
                  fontWeight: "600",
                  color: darkMode && "white",
                },
              }}
            />
            {definition.examples.map((example, index) => (
              <div key={example.id} className="px-2 py-0.5">
                <TextField
                  variant="standard"
                  placeholder={`${index + 1}- Write an example`}
                  fullWidth
                  value={example.example_text}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Typography>
                          {example.example_text !== "" && index + 1 + "- "}
                        </Typography>
                      </InputAdornment>
                    ),
                    endAdornment: definition.examples.length > 1 && (
                      <InputAdornment position="end">
                        <Close
                          onClick={() =>
                            handleDeleteEx(card.id, definition.id, example.id)
                          }
                          sx={{
                            color: "red",
                            fontSize: ".75rem",
                            cursor: "pointer",
                          }}
                        />
                      </InputAdornment>
                    ),
                  }}
                  onChange={(e) =>
                    handleExampleChange(
                      card.id,
                      definition.id,
                      example.id,
                      e.target.value
                    )
                  }
                  sx={{
                    "& .MuiInputBase-input": {
                      fontSize: "1rem",
                      color: darkMode && "white",
                    },
                  }}
                />
              </div>
            ))}
          </div>
        ))}
        <div className="px-2 py-1">
          <Button
            variant="outlined"
            // className={`${card.showDefBtn === false && "hidden"}`}
            onClick={() => addDefinition(card.id)}
            sx={{
              display: card.showDefBtn ? "block" : "none",
              borderColor: "#435d82",
              color: darkMode ? "#FFF" : "#435d82",
              borderRadius: "20px",
              fontWeight: "bold",
              textTransform: "capitalize",
            }}
          >
            Add Definition
          </Button>
        </div>
      </div>
      <IconButton
        onClick={() => handleDeleteCard(card.id)}
        sx={{
          position: "absolute",
          top: "0",
          right: "0.25rem",
          color: "rgb(209 213 219)",
        }}
      >
        <Delete />
      </IconButton>
    </div>
  ));

  if (loading) return <div></div>;
  return (
    <div
      className={`w-full md:w-2/3 m-auto h-full flex flex-col items-center justify-start gap-5`}
    >
      {renderCards}

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
            onClick={handleCreate}
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
            Save
          </Button>
        </div>
      </div>
      {/* <ESCModal handleEdit={handleEdit} handleCreate={handleCreate} /> */}
    </div>
  );
}
