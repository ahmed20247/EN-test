import { useTheme } from "@/contexts/theme-context";
import { UserContext } from "@/contexts/user-context";
import { Close, Delete, DragHandle, Rectangle } from "@mui/icons-material";
import {
  Button,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { useContext } from "react";
import { useDrag, useDrop } from "react-dnd";

const ItemType = "CARD";

export default function Card({ card, index, moveCard }) {
  const { loading, setLoading, cards, setCards } = useContext(UserContext);
  const { darkMode } = useTheme();

  // Use Drag Hook
  const [, dragRef] = useDrag({
    type: ItemType,
    item: { index },
  });

  // Use Drop Hook
  const [, dropRef] = useDrop({
    accept: ItemType,
    hover: (draggedItem) => {
      if (draggedItem.index !== index) {
        moveCard(draggedItem.index, index);
        draggedItem.index = index; // Update the index in the dragged item
      }
    },
  });

  const addDefinition = (cardId) => {
    setCards((prevCards) =>
      prevCards.map((card) =>
        card.id === cardId
          ? {
              ...card,
              showDefBtn: false,
              definitions: [
                ...card.definitions,
                { id: Date.now(), text: "", examples: [{ id: 1, text: "" }] },
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
                        { id: Date.now(), text: "" },
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
              title: value,
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
                        ? { ...definition, text: value }
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
                        ? { ...definition, text: value }
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
                          ? { ...example, text: value }
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
            if (newEx[newEx.length - 1].text !== "") {
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

  return (
    <div
      ref={(node) => dragRef(dropRef(node))}
      key={card.id}
      className="relative w-full h-auto overflow-hidden	flex rounded-lg bg-white dark:bg-slate-700 shadow-sm "
      style={{
        cursor: "grab",
        transition: "transform 0.5s ease",
      }}
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
            value={card.title}
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
              value={definition.text}
              onChange={(e) =>
                handleDefinitionChange(card.id, definition.id, e.target.value)
              }
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Rectangle
                      sx={{
                        color: definition.text === "" ? "gray" : "#000",
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
                  value={example.text}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Typography>
                          {example.text !== "" && index + 1 + "- "}
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
      <div
        style={{
          position: "absolute",
          top: "0",
          right: "0.25rem",
        }}
      >
        <IconButton
          sx={{
            color: "rgb(209 213 219)",
          }}
        >
          <DragHandle />
        </IconButton>
        <IconButton
          onClick={() => handleDeleteCard(card.id)}
          sx={{
            color: "rgb(209 213 219)",
          }}
        >
          <Delete />
        </IconButton>
      </div>
    </div>
  );
}
