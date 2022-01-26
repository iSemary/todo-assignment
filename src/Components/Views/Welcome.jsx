import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  Grid,
  FormGroup,
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
  Divider,
} from "@mui/material";
import CheckSVG from "../../assets/svg/checked.svg";
import AllSVG from "../../assets/svg/all.svg";
import LoadingButton from "@mui/lab/LoadingButton";
import { FcTodoList } from "react-icons/fc";
import { styled } from "@mui/material/styles";
import Switch from "@mui/material/Switch";
import Typography from "@mui/material/Typography";
import variables from "../../assets/App.scss";
import axios from "axios";
import ReactDOMServer from "react-dom/server";
import iziToast from "izitoast";
import { FaClipboardCheck } from "react-icons/fa";
import { VscError } from "react-icons/vsc";
import { RiDeleteBin6Fill, RiTodoLine } from "react-icons/ri";
import { MdClose, MdSave } from "react-icons/md";
import { AiOutlineNumber, AiOutlineControl } from "react-icons/ai";
import { BsCheckLg } from "react-icons/bs";
import { HiOutlineUser } from "react-icons/hi";

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
        backgroundImage: `url(${CheckSVG})`,
      },
      "& + .MuiSwitch-track": {
        opacity: 1,
        backgroundColor: "#aab4be",
      },
    },
  },
  "& .MuiSwitch-thumb": {
    backgroundColor: variables.mainColor,
    width: 32,
    height: 32,
    "&:before": {
      content: "''",
      position: "absolute",
      width: "60%",
      height: "65%",
      left: "7px",
      top: "5px",
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center",
      backgroundImage: `url(${AllSVG})`,
    },
  },
  "& .MuiSwitch-track": {
    opacity: 1,
    backgroundColor: "#aab4be",
    borderRadius: 20 / 2,
  },
}));

// Base API url
const baseURL = "https://jsonplaceholder.typicode.com";

function Welcome() {
  // -Todos State
  const initialTodo = {
    userId: "",
    title: "",
    completed: false,
    error_list: [],
  };
  const CurrentTodo = useRef({});
  const TodoTable = useRef({});

  const [Todo, setTodo] = useState(initialTodo);
  const [Todos, setTodos] = useState([]);
  const [FilteredTodos, setFilteredTodos] = useState([]);
  const [User, setUser] = useState({ id: "" });
  const [TodosType, setTodosType] = useState({ checked: false });
  const [Users, setUsers] = useState([]);

  // Pagination
  const [currentPage, setcurrentPage] = useState(1);
  const [todosPerPage, settodosPerPage] = useState(20);

  // Pagination Configuration
  const indexOfLastTodo = currentPage * todosPerPage;
  const indexOfFirstTodo = indexOfLastTodo - todosPerPage;
  const currentTodos = Todos.slice(indexOfFirstTodo, indexOfLastTodo);

  // OnChange Pagination Buttons
  const TodoPaginate = (e, value) => {
    setcurrentPage(value);
  };

  // Toggling User Dropdown
  const handleUserChange = (e) => {
    // Set the user id to User State
    setUser({ ...User, [e.target.name]: e.target.value });

    if (e.target.value !== "") {
      const filteredData = Todos.filter((item) => {
        return item.userId === e.target.value;
      });
      setFilteredTodos(filteredData);
    } else {
      setFilteredTodos([]);
    }
  };
  // Toggling Completed Todo
  const handleCompletedChange = (e) => {
    // Toggle todos completed/All

    if (!TodosType.checked) {
      const filteredData = Todos.filter((item) => {
        return item.completed !== TodosType.checked;
      });
      setFilteredTodos(filteredData);
    } else {
      setFilteredTodos([]);
    }

    // Change checked button state
    setTodosType({ checked: !TodosType.checked });
  };
  // Deleting Todo
  const DeleteTodo = (e) => {
    axios
      .delete(`${baseURL}/todos/${e}`)
      .then((response) => {
        iziToast.success({
          title: "Success",
          message: `You deleted Todo Number ${e}!`,
        });

        // 2 Methods for removing the todo from table
        // Remove from state (Recommended)
        setTodos(Todos.filter((item) => item.id !== e));
        // Hide the removed todo in the table
        // CurrentTodo.current[e].style.display = "none";
      })
      .catch(function (error) {
        iziToast.error({
          title: "Error",
          message:
            "Something went wrong while deleting todo, please try again!",
        });
      });
  };
  // Completing Todo
  const CompleteTodo = (e) => {
    const CurrentTodoStatus = CurrentTodo.current[e].childNodes[3].dataset.type;
    if (CurrentTodoStatus === "uncompleted") {
      axios
        .put(`${baseURL}/todos/${e}`, { completed: true })
        .then((response) => {
          iziToast.success({
            title: "Success",
            message: `You completed Todo Number ${e}!`,
          });
          // Change Completed icon
          CurrentTodo.current[e].childNodes[3].innerHTML =
            ReactDOMServer.renderToString(
              <FaClipboardCheck size={30} color={variables.successColor} />
            );
          CurrentTodo.current[e].childNodes[3].dataset.type = "completed";
          // Change Check Button
          CurrentTodo.current[e].childNodes[4].childNodes[1].innerHTML =
            ReactDOMServer.renderToString(
              <IconButton
                aria-label="complete"
                color="error"
                onClick={() => CompleteTodo(e)}
              >
                <MdClose size={17} />
              </IconButton>
            );
        })
        .catch(function (error) {
          iziToast.error({
            title: "Error",
            message:
              "Something went wrong while completing todo, please try again!",
          });
        });
    } else {
      axios
        .put(`${baseURL}/todos/${e}`, { completed: false })
        .then((response) => {
          iziToast.success({
            title: "Success",
            message: `You uncompleted Todo Number ${e}!`,
          });
          // Change Completed icon
          CurrentTodo.current[e].childNodes[3].innerHTML =
            ReactDOMServer.renderToString(
              <VscError size={30} color={variables.errorColor} />
            );
          CurrentTodo.current[e].childNodes[3].dataset.type = "uncompleted";
          // Change Check Button
          CurrentTodo.current[e].childNodes[4].childNodes[1].innerHTML =
            ReactDOMServer.renderToString(
              <IconButton
                aria-label="complete"
                color="success"
                onClick={() => CompleteTodo(e)}
              >
                <BsCheckLg size={17} />{" "}
              </IconButton>
            );
        })
        .catch(function (error) {
          iziToast.error({
            title: "Error",
            message:
              "Something went wrong while un-completing todo, please try again!",
          });
        });
    }
  };

  // Creating Todo
  const HandleCreateInput = (e) => {
    setTodo({ ...Todo, [e.target.name]: e.target.value });
  };
  const TodoSubmitHandler = (e) => {
    e.preventDefault();
    setTodo({ ...Todo, error_list: null });
    const data = {
      userId: Todo.userId,
      title: Todo.title,
      completed: false,
    };
    axios
      .post(`${baseURL}/todos`, data)
      .then((response) => {
        iziToast.success({
          title: "Success",
          message: "You created a new todo!",
        });

        setTodos([...Todos, Todo]);
        setTodo({ ...initialTodo });
      })
      .catch(function (error) {
        iziToast.error({
          title: "Error",
          message:
            "Something went wrong while creating your todo, please try again!",
        });
      });
  };
  // Getting Todos List
  useEffect(() => {
    axios
      .get(`${baseURL}/todos`)
      .then(function (response) {
        setTodos(response.data);
      })
      .catch(function (error) {
        iziToast.error({
          title: "Error",
          message: "Something went wrong with getting todos, please try again!",
        });
      });
  }, []);

  // Getting users list
  useEffect(() => {
    axios
      .get(`${baseURL}/users`)
      .then(function (response) {
        setUsers(response.data);
      })
      .catch(function (error) {
        iziToast.error({
          title: "Error",
          message: "Something went wrong with getting users, please try again!",
        });
      });
  }, []);

  let UsersSection = null;
  if (Object.keys(Users).length > 0) {
    UsersSection = Users.map((User, index) => {
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
        <Grid
          item
          xs={6}
          sx={{ borderRight: "1px solid" + variables.lightMainColor }}
        >
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
              <ToggleTodoSwitch
                checked={TodosType.checked}
                onChange={handleCompletedChange}
              />
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
              value={User.id}
              defaultValue=""
              name="id"
              onChange={handleUserChange}
            >
              <MenuItem value="">Select User</MenuItem>
              {UsersSection}
            </Select>
          </FormControl>
        </Grid>
      </Grid>
      <Divider />

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
                <th>
                  <AiOutlineNumber /> ID
                </th>
                <th>
                  <HiOutlineUser />
                  User
                </th>
                <th>
                  <RiTodoLine /> Title
                </th>
                <th>
                  <FaClipboardCheck /> Completed
                </th>
                <th>
                  <AiOutlineControl /> Action
                </th>
              </tr>
            </thead>
            <tbody ref={TodoTable}>
              {/* let TodosSection = null; */}
              {Object.keys(FilteredTodos).length > 0 ? (
                FilteredTodos.map((Todo, index) => {
                  return (
                    <tr
                      key={Todo.id}
                      ref={(el) => (CurrentTodo.current[Todo.id] = el)}
                    >
                      <td>{Todo.id}</td>
                      <td>
                        {Object.keys(Users).length > 1
                          ? Users.find((o) => o.id === Todo.userId).name +
                            " : " +
                            Todo.userId
                          : Todo.userId}
                      </td>
                      <td>{Todo.title}</td>
                      {Todo.completed ? (
                        <td data-type="completed">
                          <FaClipboardCheck
                            size={30}
                            color={variables.successColor}
                          />
                        </td>
                      ) : (
                        <td data-type="uncompleted">
                          <VscError size={30} color={variables.errorColor} />
                        </td>
                      )}
                      <td>
                        <IconButton
                          aria-label="delete"
                          color="error"
                          onClick={() => DeleteTodo(Todo.id)}
                        >
                          <RiDeleteBin6Fill />
                        </IconButton>
                        {Todo.completed ? (
                          <IconButton
                            aria-label="complete"
                            color="error"
                            onClick={() => CompleteTodo(Todo.id)}
                          >
                            <MdClose size={17} />
                          </IconButton>
                        ) : (
                          <IconButton
                            aria-label="complete"
                            color="success"
                            onClick={() => CompleteTodo(Todo.id)}
                          >
                            <BsCheckLg size={17} />
                          </IconButton>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : Object.keys(Todos).length > 0 ? (
                currentTodos.map((Todo, index) => {
                  return (
                    <tr
                      key={Todo.id}
                      ref={(el) => (CurrentTodo.current[Todo.id] = el)}
                    >
                      <td>{Todo.id}</td>
                      <td>
                        {Object.keys(Users).length > 1
                          ? Users.find((o) => o.id === Todo.userId).name +
                            " : " +
                            Todo.userId
                          : Todo.userId}
                      </td>
                      <td>{Todo.title}</td>
                      {Todo.completed ? (
                        <td data-type="completed">
                          <FaClipboardCheck
                            size={30}
                            color={variables.successColor}
                          />
                        </td>
                      ) : (
                        <td data-type="uncompleted">
                          <VscError size={30} color={variables.errorColor} />
                        </td>
                      )}
                      <td>
                        <IconButton
                          aria-label="delete"
                          color="error"
                          onClick={() => DeleteTodo(Todo.id)}
                        >
                          <RiDeleteBin6Fill />
                        </IconButton>
                        {Todo.completed ? (
                          <IconButton
                            aria-label="complete"
                            color="error"
                            onClick={() => CompleteTodo(Todo.id)}
                          >
                            <MdClose size={17} />
                          </IconButton>
                        ) : (
                          <IconButton
                            aria-label="complete"
                            color="success"
                            onClick={() => CompleteTodo(Todo.id)}
                          >
                            <BsCheckLg size={17} />{" "}
                          </IconButton>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <th colSpan="5" className="widly-th">
                    <LinearProgress color="error" />
                    <Typography variant="h5" color="error" sx={{ mt: 1 }}>
                      Please wait for the todos to be processed...
                    </Typography>
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
            count={Math.ceil(Todos.length / todosPerPage)}
            page={currentPage}
            onChange={TodoPaginate}
            variant="outlined"
            shape="rounded"
            color="error"
          />
        </Grid>
      </Grid>
      <Divider />
      {/* Create Todo */}
      <Grid
        component="article"
        container
        alignItems="center"
        justifyContent="center"
        spacing={1}
        sx={{ my: 1 }}
      >
        <Grid item sx={{ width: "75%" }}>
          <Typography variant="h6" color="initial">
            <RiTodoLine /> Create Your Todo
          </Typography>
          <Box component="form" autoComplete="true" onSubmit={TodoSubmitHandler}>
            <FormGroup>
              <FormControl sx={{ marginBottom: "7px" }}>
                <InputLabel id="userLabel">User</InputLabel>
                <Select
                  label="User"
                  id="userLabel"
                  defaultValue={Todo.userId}
                  value={Todo.userId}
                  required
                  name="userId"
                  onChange={HandleCreateInput}
                >
                  {UsersSection}
                </Select>
              </FormControl>
              <FormControl sx={{ marginBottom: "7px" }}>
                <TextField
                  placeholder="Write something you want to achieve..."
                  onChange={HandleCreateInput}
                  defaultValue={Todo.title}
                  value={Todo.title}
                  name="title"
                  required={true}
                  rows={5}
                />
              </FormControl>
              <FormControl sx={{ marginBottom: "7px" }}>
                <Button
                  variant="outlined"
                  color="error"
                  type="submit"
                >
                  {Todo.error_list === null ? (
                    <CircularProgress size={20} />
                  ) : (
                    <MdSave size={20} />
                  )}
                  &nbsp;Create New Todo
                </Button>
              </FormControl>
            </FormGroup>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Welcome;
