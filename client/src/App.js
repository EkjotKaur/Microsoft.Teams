import React, {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";
import { BrowserRouter, Route, Switch, useHistory } from "react-router-dom";
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

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      dispatch({ type: "USER", payload: user });
      setRouters(
        <React.Fragment>
          <HeadBar />
          <SideNavbar />
          <Switch>
            <Route path="/" exact component={CreateRoom} />
            <Route path="/room/:roomID" component={Room} />
            <Route path="/chat">
              <Chat />
            </Route>
            <Route path="/teams" exact>
              <Teams />
            </Route>
            <Route path="/createTeams">
              <CreateTeamsPage />
            </Route>
            <Route path="/teams/:teamId">
              <TeamsChat />
            </Route>
          </Switch>
        </React.Fragment>
      );
    } else {
      setRouters(initial);
    }
  }, [dispatch]);
  return routers;
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
