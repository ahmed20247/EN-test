import { NavContext } from "@/contexts/nav-context";
import { useTheme } from "@/contexts/theme-context";
import { Button, Modal, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { useContext } from "react";

export default function CSCModal({ handleCreate }) {
  const { isCSCOpen, setIsCSCOpen } = useContext(NavContext);
  const router = useRouter();
  const { darkMode } = useTheme();

  const handleClose = () => {
    setIsCSCOpen(false);
  };
  const confirm = () => {
    setIsCSCOpen(false);
    handleCreate();
  };
  const cancel = () => {
    router.push("/word-sets");
    setIsCSCOpen(false);
  };

  return (
    <Modal open={isCSCOpen} onClose={handleClose}>
      <div className="w-full h-full flex items-center justify-center">
        <div className="w-80 h-80 rounded-xl bg-white dark:bg-slate-800 flex flex-col items-center justify-center p-4 gap-5 ">
          <Typography
            variant="body1"
            sx={{
              textAlign: "center",
              fontSize: "20px",
              fontWeight: "700",
              color: darkMode && "#FFF",
            }}
          >
            Do you want to save your changes?
          </Typography>

          <div className="flex w-full justify-center gap-4">
            <Button
              variant="contained"
              sx={{
                bgcolor: "rgb(239 68 68 / var(--tw-text-opacity, 1))",
                width: "40%",
                p: "8px",
                borderRadius: "8px",
                fontWeight: "600",
              }}
              onClick={cancel}
              //   fullWidth
            >
              Discard
            </Button>
            <Button
              variant="contained"
              sx={{
                p: "8px",
                width: "40%",
                borderRadius: "8px",
                fontWeight: "600",
                bgcolor: "#435d82",
              }}
              onClick={confirm}
              //   fullWidth
            >
              Create
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
