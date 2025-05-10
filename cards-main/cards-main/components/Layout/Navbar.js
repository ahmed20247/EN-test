"use client";

import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import AdbIcon from "@mui/icons-material/Adb";
import logoIcon from "@/assets/logo.svg";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { usePathname, useRouter } from "next/navigation";
import { UserContext } from "@/contexts/user-context";
import { NavContext } from "@/contexts/nav-context";
import { useTheme } from "@/contexts/theme-context";
import { Logout } from "@mui/icons-material";
import { ListItemIcon } from "@mui/material";

const settings = ["Logout"];

function Navbar() {
  const router = useRouter();
  const pathName = usePathname();
  const { setIsCSCOpen, setIsESCOpen } = React.useContext(NavContext);

  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const { client, setClient, setLoading } = React.useContext(UserContext);
  const { darkMode } = useTheme();

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogoClick = () => {
    if (pathName === "/word-sets/create") {
      setIsCSCOpen(true);
      console.log("test router from nav create", pathName);
    } else if (pathName.includes("/word-sets/edit")) {
      setIsESCOpen(true);
      console.log("test router from nav edit", pathName);
    } else {
      router.push("/word-sets");
    }
  };
  const handleLogout = async () => {
    try {
      setLoading(true);
      fetch("/auth/signout", {
        method: "Post",
      }).then((response) => {
        if (response.statusText === "OK") {
          console.log("Loged out successfuly");
          setClient(null);
          window.location.href = "/";
        }
      });
    } catch (error) {
      console.log("Error logging out:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignin = () => {
    router.push("/login");
  };
  const handleSignup = () => {
    router.push("/signup");
  };

  return (
    <AppBar
      sx={{
        bgcolor: "rgb(67 93 130)",
        boxShadow: "none",
        position: {
          xs: "static", // Static position on small screens
          lg: "fixed", // Fixed position on medium and larger screens
        },
      }}
    >
      <Container maxWidth="xl">
        <Toolbar
          disableGutters
          sx={{ display: "flex", justifyContent: "space-between" }}
        >
          {/* <AdbIcon sx={{ display: { xs: 'flex', md: 'flex' }, mr: 1 }} /> */}
          <Image
            src={logoIcon}
            onClick={handleLogoClick}
            style={{ cursor: "pointer" }}
            width={100}
            height={50}
          />
          {!client && (
            <Box className="flex gap-2">
              <button
                type="button"
                onClick={handleSignin}
                class="inline-block rounded-full border-primary px-6 pb-[6px] pt-2 text-xs font-medium uppercase leading-normal text-primary transition duration-150 ease-in-out hover:border-primary-accent-300 hover:bg-primary-50/50 hover:text-primary-accent-300 focus:border-primary-600 focus:bg-primary-50/50 focus:text-primary-600 focus:outline-none focus:ring-0 active:border-primary-700 active:text-primary-700 motion-reduce:transition-none dark:text-primary-500 dark:hover:bg-blue-950 dark:focus:bg-blue-950"
                data-twe-ripple-init
              >
                Log in
              </button>
              <button
                type="button"
                onClick={handleSignup}
                class="inline-block rounded-full border-2 border-primary px-6 pb-[6px] pt-2 text-xs font-medium uppercase leading-normal text-primary transition duration-150 ease-in-out hover:border-primary-accent-300 hover:bg-primary-50/50 hover:text-primary-accent-300 focus:border-primary-600 focus:bg-primary-50/50 focus:text-primary-600 focus:outline-none focus:ring-0 active:border-primary-700 active:text-primary-700 motion-reduce:transition-none dark:text-primary-500 dark:hover:bg-blue-950 dark:focus:bg-blue-950"
                data-twe-ripple-init
              >
                Sign up
              </button>
            </Box>
          )}
          {client && (
            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar>{client.name.slice(0, 1)}</Avatar>
                </IconButton>
              </Tooltip>
              <Menu
                sx={{
                  mt: "45px",
                  "& .MuiMenu-list": {
                    bgcolor: "rgb(51 65 85)",
                  },
                }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {settings.map((setting) => {
                  const isLogout = setting === "Logout";
                  return (
                    <MenuItem
                      key={setting}
                      onClick={() => {
                        handleCloseUserMenu();
                        isLogout && handleLogout();
                      }}
                      sx={{
                        color: darkMode && "white",
                      }}
                    >
                      <ListItemIcon>
                        <Logout className="text-gray-400 dark:text-gray-300	" />
                      </ListItemIcon>
                      <Typography sx={{ textAlign: "center" }}>
                        {setting}
                      </Typography>
                    </MenuItem>
                  );
                })}
              </Menu>
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default Navbar;
