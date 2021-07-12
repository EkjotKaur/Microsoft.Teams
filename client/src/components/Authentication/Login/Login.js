import React, { useContext, useState } from "react";
import "../Authentication.css";
import MsLogo from "../../../assets/images/Microsoft Logo.svg";
import Details from "../Details";

import * as userApi from "../../../api/auth";
import { useHistory } from "react-router";
import { UserContext } from "../../../App";
import { ToastContainer, toast } from "react-toastify";

const Login = (props) => {
  const { state, dispatch } = useContext(UserContext);

  const history = useHistory();
  const initialCredentials = {
    email: "",
    password: "",
  };
  const [credentials, setCredentials] = useState(initialCredentials);
  const [step, setStep] = useState(1);

  // on changing the input value this function is called
  const onChangeHandler = (e) => {
    setCredentials((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };

  // changing the slide for login
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

  // When user press the submit button to login
  const onSubmitHandler = async () => {
    if (!credentials.password) {
      return;
    }

    userApi
      .login({
        email: credentials.email,
        password: credentials.password,
      })
      .then((result) => {
        localStorage.setItem("jwt", result.data.data.token);
        localStorage.setItem("user", JSON.stringify(result.data.data));
        dispatch({ type: "USER", payload: result.data.data });
      })
      .catch((err) => {
        console.log(err);
        setCredentials(initialCredentials);
        setStep(1);
        toast(
          `${
            err.response && err.response.data
              ? err.response.data.message
              : "Something went wrong."
          }`
        );
      });
  };

  return (
    <React.Fragment>
      <ToastContainer />
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
        <div className="OtherAuth" onClick={() => history.push("/signup")}>
          Don't have an account? Click to Signup
        </div>
      </div>
    </React.Fragment>
  );
};

export default Login;
