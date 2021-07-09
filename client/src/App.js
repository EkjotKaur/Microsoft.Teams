import React, {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";
import {
  BrowserRouter,
  Redirect,
  Route,
  Switch,
  useHistory,
} from "react-router-dom";
import CreateRoom from "./components/CreateRoom";
import Room from "./components/Room";
import Chat from "./components/Chatting/Chat";
import Teams from "./components/Teams/Teams";
import CreateTeamsPage from "./components/Teams/CreateTeamPage/CreateTeamsPage";
import TeamsChat from "./components/TeamChat/TeamChat";
import Signup from "./components/Authentication/Signup/Signup";
import Login from "./components/Authentication/Login/Login";
import SideNavbar from "./components/Navbars/SideNavbar/SideNavbar";
import HeadBar from "./components/Navbars/HeadBar/HeadBar";
import { initialState, reducer } from "./reducer/userReducer";
import "bootstrap/dist/css/bootstrap.min.css";
import NewChat from "./components/NewChat/NewChat";

export const UserContext = createContext();

const Routing = () => {
  const initial = (
    <Switch className="margin">
      <Route path="/signup">
        <Signup />
      </Route>
      <Route path="/login">
        <Login />
      </Route>
    </Switch>
  );

  const history = useHistory();
  const { state, dispatch } = useContext(UserContext);
  const [routers, setRouters] = useState(initial);
  const [user, setUser] = useState();

  // useEffect(() => {
  //   if (!user) {
  //     setUser(state);
  //   } else if (user && !state) {
  //     setUser(null);
  //   }
  // }, [state]);
  useEffect(() => {
    const userTemp = JSON.parse(localStorage.getItem("user"));
    setUser(userTemp);
    if (userTemp) dispatch({ type: "USER", payload: userTemp });
    // log
  }, []);
  return (
    <React.Fragment>
      {(state || user) && <HeadBar />}
      {(state || user) && <SideNavbar />}
      <Switch>
        {(state || user) && <Route path="/" exact component={CreateRoom} />}
        {(state || user) && <Route path="/room/:roomID" component={Room} />}
        {(state || user) && (
          <Route path="/chat">
            <Chat />
          </Route>
        )}
        {(state || user) && (
          <Route path="/teams" exact>
            <Teams />
          </Route>
        )}
        {(state || user) && (
          <Route path="/createTeams">
            <CreateTeamsPage />
          </Route>
        )}
        {(state || user) && (
          <Route path="/teams/:teamId">
            <TeamsChat />
          </Route>
        )}
        {(state || user) && (
          <Route path="/newChat/:userId/:userName">
            <NewChat />
          </Route>
        )}
        {!state && !user && (
          <Route path="/signup">
            <Signup />
          </Route>
        )}
        {!state && !user && (
          <Route path="/login">
            <Login />
          </Route>
        )}
        {(state || user) && <Redirect to="/teams" exact />}
        {<Redirect to="/login" exact />}
      </Switch>
    </React.Fragment>
  );
};

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <UserContext.Provider value={{ state, dispatch }}>
      <BrowserRouter>
        {/* <SideNavbar /> */}
        <Routing />
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
