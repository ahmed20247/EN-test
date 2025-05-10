import { useTheme } from "@/contexts/theme-context";
import { Button, Modal, Typography } from "@mui/material";

export default function DeleteConfirm({
  isOpen,
  handleOpenDelete,
  handleDelete,
}) {
  const { darkMode } = useTheme();
  return (
    <Modal open={isOpen} onClose={handleOpenDelete}>
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
            Are you sure you want to delete the word set?
          </Typography>

          <div className="flex w-full justify-center gap-4">
            <Button
              variant="contained"
              sx={{
                p: "8px",
                width: "40%",
                borderRadius: "8px",
                fontWeight: "600",
                bgcolor: "#435d82",
              }}
              onClick={handleOpenDelete}
              //   fullWidth
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              sx={{
                bgcolor: "rgb(239 68 68 / var(--tw-text-opacity, 1))",
                width: "40%",
                p: "8px",
                borderRadius: "8px",
                fontWeight: "600",
              }}
              onClick={handleDelete}
              //   fullWidth
            >
              Delete
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
