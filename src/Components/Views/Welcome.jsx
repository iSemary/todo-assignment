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

    // Filter todos from user id provided
    setTodos(Todos.filter((item) => item.userId === e.target.value));
  };
  // Toggling Completed Todo
  const handleCompletedChange = (e) => {
    // Toggle todos completed/All

    // const dataToShow = filter
    // ? data.filter(d => d.id === filter)
    // : data

    // TodosType.checked ?
    // setTodos((prevTodos) => ({...prevTodos})) :
    // setTodos(Todos.filter((item) => item.completed !== TodosType.checked))

    // return Todos.filter((item) => item.completed !== TodosType.checked);

    if (!TodosType.checked) {
      const filteredData = Todos.filter((item) => {
        return item.completed !== TodosType.checked;
      });
      setFilteredTodos(filteredData);
    } else {
      setFilteredTodos(Todos);
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
    setTodo({ ...Todo, error_list: null });
    const data = {
      title: Todo.title,
      userId: Todo.userId,
      completed: false,
    };
    axios
      .post(`${baseURL}/todos`, data)
      .then((response) => {
        iziToast.success({
          title: "Success",
          message: "You created a new todo!",
        });

        let row = TodoTable.current.insertRow(-1);
        let Td1 = row.insertCell(0);
        let Td2 = row.insertCell(1);
        let Td3 = row.insertCell(2);
        let Td4 = row.insertCell(3);
        let Td5 = row.insertCell(4);
        Td1.innerHTML = response.data.id;
        Td2.innerHTML = Todo.userId;
        Td3.innerHTML = Todo.title;
        Td4.innerHTML = ReactDOMServer.renderToString(
          <VscError size={30} color={variables.errorColor} />
        );
        Td5.innerHTML = ReactDOMServer.renderToString(
          <>
            <IconButton
              aria-label="delete"
              color="error"
              onClick={() => DeleteTodo(response.data.id)}
            >
              <RiDeleteBin6Fill />
            </IconButton>
            <IconButton
              aria-label="complete"
              color="success"
              onClick={() => CompleteTodo(Todo.data.id)}
            >
              <BsCheckLg size={17} />{" "}
            </IconButton>
          </>
        );

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

  // let TodosSection = null;
  // if (Object.keys(Todos).length > 0) {
  //   TodosSection = currentTodos.map((Todo, index) => {
  //     return (
  //       <tr key={Todo.id} ref={(el) => (CurrentTodo.current[Todo.id] = el)}>
  //         <td>{Todo.id}</td>
  //         <td>{Todo.userId}</td>
  //         <td>{Todo.title}</td>
  //         {Todo.completed ? (
  //           <td data-type="completed">
  //             <FaClipboardCheck size={30} color={variables.successColor} />
  //           </td>
  //         ) : (
  //           <td data-type="uncompleted">
  //             <VscError size={30} color={variables.errorColor} />
  //           </td>
  //         )}
  //         <td>
  //           <IconButton
  //             aria-label="delete"
  //             color="error"
  //             onClick={() => DeleteTodo(Todo.id)}
  //           >
  //             <RiDeleteBin6Fill />
  //           </IconButton>
  //           {Todo.completed ? (
  //             <IconButton
  //               aria-label="complete"
  //               color="error"
  //               onClick={() => CompleteTodo(Todo.id)}
  //             >
  //               <MdClose size={17} />
  //             </IconButton>
  //           ) : (
  //             <IconButton
  //               aria-label="complete"
  //               color="success"
  //               onClick={() => CompleteTodo(Todo.id)}
  //             >
  //               <BsCheckLg size={17} />{" "}
  //             </IconButton>
  //           )}
  //         </td>
  //       </tr>
  //     );
  //   });
  // }

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
                  User ID
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
                      <td>{Todo.userId}</td>
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
                      <td>{Todo.userId}</td>
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
                required
                rows={5}
              />
            </FormControl>
            <FormControl sx={{ marginBottom: "7px" }}>
              <Button
                variant="outlined"
                onClick={TodoSubmitHandler}
                color="error"
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
        </Grid>
      </Grid>
    </Box>
  );
}

export default Welcome;
