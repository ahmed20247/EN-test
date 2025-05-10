"use client";

import { UserContext } from "@/contexts/user-context";
import { createClient } from "@/utils/supabase/client";
import { Delete, Edit, MoreVert } from "@mui/icons-material";
import {
  Chip,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import { format } from "date-fns";
import { redirect, useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import DeleteConfirm from "./DeleteConfirm";

export default function WordSetCard({ wordset }) {
  const supabase = createClient();
  const [words, setWords] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const { client, wordSets, setWordSets } = useContext(UserContext);
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenDelete = async () => {
    setIsOpen(!isOpen);
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    router.push(`/word-sets/edit/${wordset.id}`);
  };
  const handleDelete = async () => {
    console.log("wordset: ", wordset);
    try {
      const { error } = await supabase
        .from("word_sets")
        .delete()
        .eq("id", wordset?.id);
      if (!error) {
        const newWordSets = wordSets.filter((item) => item.id !== wordset.id);
        console.log("newWordSets", newWordSets);
        setWordSets(newWordSets);
        console.log("Word set deleted successfuly");
      }
    } catch (error) {}
  };

  useEffect(() => {
    try {
      const fetchWords = async () => {
        const { data, error } = await supabase
          .from("words")
          .select("*")
          .eq("word_set_id", wordset.id);
        if (!error && data) {
          setWords(data?.length);
          console.log("words: ", data);
        }
        console.log("wordset: ", wordset);
      };
      fetchWords();
    } catch (error) {
      console.log(error);
    }
  }, [wordset]);

  const handleCardClick = (id) => {
    if (words) {
      router.push(`/word-sets/${id}`);
    }
  };

  return (
    <div
      key={wordset.id}
      className="w-full md:w-2/3 h-20 overflow-hidden	flex rounded-lg bg-white dark:bg-slate-700 shadow-sm"
    >
      <div
        className="w-4 md:w-4 h-full"
        style={{ backgroundColor: "rgb(67 93 130)" }}
      ></div>
      <div className="flex pl-3 py-2 justify-between flex-1 items-center">
        <div
          className="flex flex-col gap-0.5 cursor-pointer w-full"
          onClick={() => {
            handleCardClick(wordset.id);
          }}
        >
          <p className="font-bold dark:text-white text-xl capitalize">
            {wordset.name}
          </p>
          <div className="flex items-center gap-2 justify-start">
            <Chip
              label={`${words} words`}
              size="small"
              className="text-gray-400	"
            />
            <Typography
              variant="body2"
              sx={{ display: "block" }}
              className="text-gray-400	"
            >
              {format(Date(wordset.created_at), "MM/dd/yyyy")}
            </Typography>
          </div>
        </div>
        <div>
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
            color="inherit"
          >
            <MoreVert className="text-gray-400	" />
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            sx={{
              "& .MuiMenu-list": {
                bgcolor: "rgb(51 65 85)",
              },
            }}
          >
            <MenuItem
              className="text-gray-400 dark:text-gray-300"
              onClick={handleEdit}
            >
              <ListItemIcon>
                <Edit className="text-gray-400 dark:text-gray-300	" />
              </ListItemIcon>
              <ListItemText>Edit</ListItemText>
            </MenuItem>
            <MenuItem
              className="text-gray-400 dark:text-gray-300 "
              onClick={handleOpenDelete}
            >
              <ListItemIcon>
                <Delete className="text-gray-400 dark:text-gray-300	" />
              </ListItemIcon>
              <ListItemText>Delete</ListItemText>
            </MenuItem>
          </Menu>
        </div>
      </div>
      <DeleteConfirm
        isOpen={isOpen}
        handleOpenDelete={handleOpenDelete}
        handleDelete={handleDelete}
      />
    </div>
  );
}
