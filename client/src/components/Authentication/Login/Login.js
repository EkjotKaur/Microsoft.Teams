import React, { useContext, useState } from "react";
import "../Authentication.css";
import MsLogo from "../../../assets/images/Microsoft Logo.svg";
import Details from "../Details";

import * as userApi from "../../../api/auth";
import { useHistory } from "react-router";
import { UserContext } from "../../../App";

const Login = (props) => {
  const { state, dispatch } = useContext(UserContext);

  const history = useHistory();
  const initialCredentials = {
    email: "",
    password: "",
  };
  const [credentials, setCredentials] = useState(initialCredentials);
  const [step, setStep] = useState(1);

  const onChangeHandler = (e) => {
    setCredentials((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };

  const changeStep = () => {
    if (step === 1) {
      if (
        credentials.email &&
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
          credentials.email
        )
      )
        setStep(2);
    }
  };

  const onSubmitHandler = async () => {
    if (!credentials.password) {
      return;
    }

    try {
      const res = await userApi.login({
        email: credentials.email,
        password: credentials.password,
        use: credentials.use,
      });
      if (!res.status) console.log(res.message);
      else {
        localStorage.setItem("jwt", res.data.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.data));
        dispatch({ type: "USER", payload: res.data.data });
        // history.push("/chat");
      }
    } catch (err) {
      console.log(err);
      setStep(1);
      setCredentials(initialCredentials);
    }
  };

  return (
    <div className="auth">
      <div>
        <h1 className="authTeamsHeading">Microsoft Teams</h1>
      </div>
      <div className="authCard">
        <div>
          <img src={MsLogo} alt="logo" />

          {step === 1 && (
            <Details
              name="email"
              type="email"
              value={credentials.email}
              placeholder="someone@email.com"
              heading="Enter an email"
              description="We'll use this email to set up Teams. If you already have a Microsoft account, feel free to use that email here."
              onChangeHandler={onChangeHandler}
            />
          )}

          {step === 2 && (
            <Details
              email={credentials.email}
              name="password"
              type="password"
              value={credentials.password}
              placeholder="Password"
              heading="Enter password"
              onChangeHandler={onChangeHandler}
            />
          )}
        </div>
        <div>
          {step < 2 ? (
            <button
              className="authBtn"
              onClick={changeStep}
              //   disabled={
              //     !(step === 1 && credentials.email) &&
              //     !(step === 2 && credentials.use)
              //   }
            >
              Next
            </button>
          ) : (
            <button className="authBtn" onClick={onSubmitHandler}>
              Submit
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
