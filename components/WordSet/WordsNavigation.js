import { useTheme } from "@/contexts/theme-context";
import { UserContext } from "@/contexts/user-context";
import {
  ChevronLeft,
  ChevronRight,
  Keyboard,
  VolumeUpRounded,
} from "@mui/icons-material";
import { Button, IconButton, Typography } from "@mui/material";
import { useContext, useEffect, useState } from "react";

export default function WordsNavigation({
  words,
  autoPlayAudio,
  setAutoPlayAudio,
}) {
  const { currentWordIndex, setCurrentWordIndex } = useContext(UserContext);
  const [wordsLength, setWordsLength] = useState(words.length);
  // const currentWord = words[currentWordIndex] || {};
  const { darkMode } = useTheme();

  console.log(words.length);
  useEffect(() => {
    setWordsLength(words.length);
  }, [words.length]);

  const handleKeyDown = (event) => {
    if (event.key === "ArrowLeft") {
      console.log("Left arrow pressed", currentWordIndex);
      handlePrev();
    } else if (event.key === "ArrowRight") {
      console.log("Right arrow pressed", currentWordIndex);
      handleNext();
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [words]);

  const handleNext = () => {
    setCurrentWordIndex((prev) => {
      return prev < words?.length - 1 ? prev + 1 : prev;
    });
  };

  const handlePrev = () => {
    setCurrentWordIndex((prev) => {
      return prev > 0 ? prev - 1 : prev;
    });
  };

  const handleAuto = () => {
    setAutoPlayAudio(!autoPlayAudio);
  };

  return (
    <div className="flex items-center justify-between w-full md:w-2/3 lg:w-2/3 mt-4">
      <Button
        variant="conatined"
        sx={{
          bgcolor: darkMode ? "rgb(51 65 85)" : "white",
          textTransform: "none",
          fontSize: "10px",
          py: "6px",
          px: 1.4,
          minWidth: "auto",
          minHeight: "auto",
          height: "fit-content",
          borderRadius: "15px",
          color: autoPlayAudio ? "rgb(34 197 94)" : "rgb(156 163 175)",
        }}
        startIcon={
          <VolumeUpRounded
            sx={{
              color: autoPlayAudio ? "rgb(34 197 94)" : "white",
              backgroundColor: autoPlayAudio
                ? "rgb(220 252 231)"
                : "rgb(209 213 219)",
              borderRadius: "50%",
              p: "0.25rem",
            }}
            className="text-md"
          />
        }
        onClick={handleAuto}
      >
        Auto-play
      </Button>
      <div className="flex items-center bg-white dark:bg-slate-700 p-2 rounded-full gap-2">
        <IconButton
          disabled={currentWordIndex === 0 ? true : false}
          sx={{
            // bgcolor: "rgb(59 130 246)",
            color: "white",
            p: "0.25rem",
          }}
          className="bg-main"
          onClick={handlePrev}
        >
          <ChevronLeft
            className="text-xl"
            sx={{ fontWeight: "800", color: darkMode && "white" }}
          />
        </IconButton>
        <Typography variant="body2" sx={{ color: darkMode && "white" }}>
          {currentWordIndex + 1} / {wordsLength}
        </Typography>
        <IconButton
          disabled={currentWordIndex + 1 === wordsLength ? true : false}
          sx={{
            // bgcolor: "rgb(59 130 246)",
            color: "white",
            p: "0.25rem",
          }}
          className="bg-main"
          onClick={handleNext}
        >
          <ChevronRight
            className="text-xl"
            sx={{ fontWeight: "800", color: darkMode && "white" }}
          />
        </IconButton>
      </div>
      <IconButton
        sx={{
          bgcolor: darkMode ? "rgb(51 65 85)" : "white",
          color: "rgb(209 213 219)",
          p: "0.25rem",
        }}
      >
        <Keyboard />
      </IconButton>
    </div>
  );
}
