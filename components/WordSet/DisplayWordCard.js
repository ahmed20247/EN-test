import { Rectangle, Square, VolumeUp } from "@mui/icons-material";
import { IconButton, Typography } from "@mui/material";
import { useEffect, useState } from "react";

export default function DisplayWordCard({
  words,
  currentWordIndex,
  autoPlayAudio,
}) {
  const currentWord = words[currentWordIndex] || {};
  const [playText, setPlayText] = useState(autoPlayAudio);

  const handlePlayText = () => {
    let text = currentWord?.word;
    let working = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(working);
    console.log(text);
    setPlayText(true);
    const words = text?.split(/\s+/).filter(Boolean).length; // Count words
    const timeInMinutes = words / 100;
    const timeInSeconds = Math.ceil(timeInMinutes * 60) * 1000; // Convert to seconds
    console.log(timeInSeconds);
    setTimeout(() => {
      setPlayText(false);
    }, timeInSeconds);
  };

  useEffect(() => {
    if (autoPlayAudio) {
      handlePlayText();
    }
  }, [autoPlayAudio, currentWord]);

  const renderDef = currentWord?.definitions?.map((def) => {
    return (
      <div className="pl-1 md:pl-2 py-1 flex flex-col">
        <Typography
          variant="h6"
          gutterBottom
          className="font-bold text-base md:text-lg dark:text-white"
          sx={{
            fontWeight: "bold",
          }}
        >
          <Square sx={{ width: "0.5em", pr: "2px" }} /> {def?.definition}
        </Typography>

        {def?.examples?.map((ex, index) => {
          return (
            <div className="pl-4 md:pl-8 flex flex-col gap-0.5">
              <Typography
                variant="body2"
                gutterBottom
                className="text-sm dark:text-white"
              >
                {index + 1 + "- "} {ex?.example_text}
              </Typography>
            </div>
          );
        })}
      </div>
    );
  });

  return (
    <div
      style={{ overflow: "auto" }}
      class="relative max-h-80 min-h-80 md:max-h-96 md:min-h-96 flex flex-col my-2 bg-white dark:bg-slate-700 shadow rounded-xl w-full md:w-2/3 lg:w-2/3"
    >
      <div class="py-10 md:py-16 px-4 md:px-8 w-full h-full flex flex-col items-start justify-center">
        <Typography
          variant="h4"
          gutterBottom
          className="font-bold text-3xl md:text-4xl border-b-2 px-1 md:px-2 border-solid border-orange-200 dark:text-white"
        >
          {currentWord?.word}
        </Typography>
        {renderDef}
      </div>
      <IconButton
        className={`${playText ? "text-green-300" : "text-gray-300"}`}
        sx={{
          position: "absolute",
          right: "0",
        }}
        onClick={handlePlayText}
      >
        <VolumeUp />
      </IconButton>
    </div>
  );
}
