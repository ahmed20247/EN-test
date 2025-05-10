import { ArrowBack, ChevronLeft } from "@mui/icons-material";
import { Button } from "@mui/material";
import { useRouter } from "next/navigation";

export default function BackButton() {
  const router = useRouter();

  return (
    <Button
      variant="text"
      startIcon={<ChevronLeft sx={{ fontWeight: "bold" }} />}
      sx={{
        textTransform: "none",
        "&& .MuiButton-startIcon": {
          mr: "2px",
          ml: "-8px",
        },
        "&& .MuiSvgIcon-root": {
          fontSize: "25px",
        },
        color: "rgb(156 163 175)",
        fontWeight: "bold",
        p: "0",
      }}
      className="text-base"
      onClick={() => {
        router.push("/word-sets");
      }}
    >
      Back to sets
    </Button>
  );
}
