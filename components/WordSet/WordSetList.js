import { Button } from "@mui/material";
import { useRouter } from "next/navigation";
import WordSetCard from "./WordSetCard";
import { useContext } from "react";
import { UserContext } from "@/contexts/user-context";
import { useTheme } from "@/contexts/theme-context";

export default function WordSetList() {
  const router = useRouter();

  const handleCreateSetClick = () => {
    router.push("/word-sets/create");
  };

  const { wordSets } = useContext(UserContext);

  const renderWordSets = wordSets?.map((wordset) => {
    return <WordSetCard key={wordset.id} wordset={wordset} />;
  });

  return (
    <div
      className={`bg-gray-50 dark:bg-slate-800 lg:pt-32  w-screen min-h-screen flex flex-col items-center justify-start gap-6 py-8 px-4`}
    >
      {renderWordSets}
      <div className="w-full md:w-2/3 h-auto overflow-hidden	flex items-center justify-end">
        <Button
          variant="contained"
          onClick={handleCreateSetClick}
          sx={{
            textTransform: "none",
            fontWeight: "700",
            borderRadius: "0.33rem",
            bgcolor: "#435d82",
          }}
        >
          Create a set
        </Button>
      </div>
    </div>
  );
}
