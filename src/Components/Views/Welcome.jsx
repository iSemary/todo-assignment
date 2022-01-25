import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  FormGroup,
  FormControlLabel,
  FormLabel,
  Pagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  TextField,
  Button,
  CircularProgress,
  LinearProgress,
} from "@mui/material";
import { FcTodoList } from "react-icons/fc";
import { styled } from "@mui/material/styles";
import Switch from "@mui/material/Switch";
import Typography from "@mui/material/Typography";
import variables from "../../assets/App.scss";
import axios from "axios";
import iziToast from "izitoast";
import { FaClipboardCheck } from "react-icons/fa";
import { VscError } from "react-icons/vsc";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { MdEditNote } from "react-icons/md";
import { AiOutlineNumber,AiOutlineControl } from "react-icons/ai";
import { BsCheckLg } from "react-icons/bs";
import {HiOutlineUser} from "react-icons/hi"
import {RiTodoLine} from "react-icons/ri"


// Custom Toggle Button Style
const ToggleTodoSwitch = styled(Switch)(({ theme }) => ({
  width: 62,
  height: 34,
  padding: 7,
  "& .MuiSwitch-switchBase": {
    margin: 1,
    padding: 0,
    transform: "translateX(6px)",
    "&.Mui-checked": {
      color: "#fff",
      transform: "translateX(22px)",
      "& .MuiSwitch-thumb:before": {
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
          "#fff"
        )}" d="M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z"/></svg>')`,
      },
      "& + .MuiSwitch-track": {
        opacity: 1,
        backgroundColor: theme.palette.mode === "dark" ? "#8796A5" : "#aab4be",
      },
    },
  },
  "& .MuiSwitch-thumb": {
    backgroundColor: theme.palette.mode === "dark" ? "#003892" : "#001e3c",
    width: 32,
    height: 32,
    "&:before": {
      content: "''",
      position: "absolute",
      width: "100%",
      height: "100%",
      left: 0,
      top: 0,
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center",
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
        "#fff"
      )}" d="M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z"/></svg>')`,
    },
  },
  "& .MuiSwitch-track": {
    opacity: 1,
    backgroundColor: theme.palette.mode === "dark" ? "#8796A5" : "#aab4be",
    borderRadius: 20 / 2,
  },
}));

function Welcome() {
  // -Todos State
  const [Todo, setTodo] = useState([]);
  const [Todos, setTodos] = useState([]);
  const [Users, setUsers] = useState([]);

  useEffect(() => {
    axios
      .get("https://jsonplaceholder.typicode.com/todos")
      .then(function (response) {
        setTodos(response.data);
      })
      .catch(function (error) {
        iziToast.error({
          title: "Error",
          message: "Something went with getting todos, please try again!",
        });
      });
  }, []);

  let TodosSection = null;
  if (Object.keys(Todos).length > 0) {
    TodosSection = Todos.map((Todo, index) => {
      return (
        <tr key={Todo.id}>
          <td>{Todo.id}</td>
          <td>{Todo.userId}</td>
          <td>{Todo.title}</td>
          <td>
            {Todo.completed ? (
              <FaClipboardCheck size={30} color={variables.successColor} />
            ) : (
              <VscError size={30} color={variables.errorColor} />
            )}
          </td>
          <td>
            <IconButton aria-label="delete" color="error">
              <RiDeleteBin6Fill />
            </IconButton>
            <IconButton aria-label="update" color="primary">
              <MdEditNote />
            </IconButton>
            <IconButton aria-label="complete" color="success">
              <BsCheckLg size={17} />
            </IconButton>
          </td>
        </tr>
      );
    });
  }

  useEffect(() => {
    axios
      .get("https://jsonplaceholder.typicode.com/users")
      .then(function (response) {
        setUsers(response.data);
        console.log(response.data)
      })
      .catch(function (error) {
        iziToast.error({
          title: "Error",
          message: "Something went with getting users, please try again!",
        });
      });
  }, []);

  let UsersSection = null;
  if (Object.keys(Users).length > 0) {
    UsersSection = Todos.map((User, index) => {
      return (
        <MenuItem value={User.id} key={User.id}>
          {User.name}
        </MenuItem>
      );
    });
  }

  return (
    <Box component="section" sx={{ p: 2 }}>
      <Grid
        component="article"
        container
        alignItems="center"
        justifyContent="center"
        sx={{ my: 1 }}
        spacing={2}
      >
        <Grid item xs={6}>
          {/* Toggle Completed/All Todo */}
          <Grid
            component="label"
            container
            alignItems="center"
            justifyContent="center"
            sx={{ my: 1, width: "fit-content", margin: "0 auto" }}
            spacing={1}
          >
            <Grid item>
              <Typography variant="h6" style={{ color: variables.mainColor }}>
                All Todos
              </Typography>
            </Grid>
            <Grid item>
              <ToggleTodoSwitch />
            </Grid>
            <Grid item>
              <Typography
                variant="h6"
                style={{ color: variables.successColor }}
              >
                Completed Todos
              </Typography>
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={6}>
          {/* Dropdown option for users and  */}
          <FormControl sx={{ width: "50%", margin: "0 auto" }}>
            <InputLabel id="usersLabel">Users</InputLabel>
            <Select
              labelId="usersLabel"
              id="usersLabel"
              label="Users"
              value=""
              // onChange={handleChange}
            >
              <MenuItem value="">Select User</MenuItem>
              {UsersSection}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {/* 20 Todo List */}
      <Grid
        component="article"
        container
        alignItems="center"
        justifyContent="center"
        spacing={1}
        sx={{ my: 1 }}
      >
        <Grid item>
          <table aria-label="custom pagination table">
            <thead>
              <tr>
                <th><AiOutlineNumber /> ID</th>
                <th><HiOutlineUser />User ID</th>
                <th><RiTodoLine /> Title</th>
                <th><FaClipboardCheck /> Completed</th>
                <th><AiOutlineControl /> Action</th>
              </tr>
            </thead>
            <tbody>
              {TodosSection ? (
                TodosSection
              ) : (
                <tr>
                  <th>
                    <LinearProgress />
                  </th>
                </tr>
              )}
            </tbody>
          </table>
        </Grid>
      </Grid>

      {/* Pagination */}
      <Grid
        component="article"
        container
        alignItems="center"
        justifyContent="center"
        spacing={1}
        sx={{ my: 1 }}
      >
        <Grid item>
          <Pagination
            count={10}
            variant="outlined"
            shape="rounded"
            color="error"
          />
        </Grid>
      </Grid>
      {/* Create Todo */}
      <Grid
        component="article"
        container
        alignItems="center"
        justifyContent="center"
        spacing={1}
        sx={{ my: 1 }}
      >
        <Grid item sx={{ width:"75%" }}>
          <Typography variant="h6" color="initial">Create Your Todo</Typography>
          <FormGroup >
            <FormControl sx={{ marginBottom: "7px" }}>
              <TextField
                label="Title"
                variant="outlined"
                name="title"
                // onChange={HandleInput}
                // defaultValue={Note.title}
              />
            </FormControl>
            <FormControl sx={{ marginBottom: "7px" }}>
              <InputLabel id="userLabel">User</InputLabel>
              <Select
                label="User"
                labelId="userLabel"
                id="userLabel"
                defaultValue=""
                value=""
                name="user_id"
                // onChange={HandleInput}
              >
                {UsersSection}
              </Select>
            </FormControl>
            <FormControl sx={{ marginBottom: "7px" }}>
              <TextField
                multiline
                placeholder="Write something you want to achieve..."
                // onChange={HandleInput}
                name="title"
                required
                rows={5}
              />
            </FormControl>
            <FormControl sx={{ marginBottom: "7px" }}>
              <Button
                variant="text"
                // onClick={NoteSubmitHandler}
              >
                {/* {Note.error_list === null ? <CircularProgress /> : ""} */}
                &nbsp; Create New Todo
              </Button>
            </FormControl>
          </FormGroup>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Welcome;
