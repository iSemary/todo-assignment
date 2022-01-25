import React from "react";
import {
  Box,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Button,
} from "@mui/material";
import { FcTodoList } from "react-icons/fc";
import variables from "../assets/App.scss";
function Header() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar sx={{ backgroundColor: variables.mainColor }}>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
          >
            <FcTodoList />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Todo Assignment
          </Typography>
          <Typography
            component="span"
            sx={{
              flexGrow: 0,
              fontSize: "13px",
              color: variables.secondaryColor,
            }}
          >
            Based on Json-Placeholder API
          </Typography>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default Header;
