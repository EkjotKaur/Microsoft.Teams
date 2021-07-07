import React, { useState } from "react";
import "../Authentication.css";
import MsLogo from "../../../assets/images/Microsoft Logo.svg";
import Details from "../Details";

import * as userApi from "../../../api/auth";
import { useHistory } from "react-router";

const Signup = (props) => {
  const history = useHistory();
  const initialCredentials = {
    email: "",
    password: "",
    use: "",
    name: "",
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
    } else if (step === 2) {
      if (credentials.email && credentials.use) setStep(3);
    } else if (step === 3) {
      if (credentials.email && credentials.use && credentials.name) setStep(4);
    }
  };

  const onSubmitHandler = async () => {
    if (!credentials.password) {
      return;
    }

    userApi
      .signup({
        email: credentials.email,
        password: credentials.password,
        use: credentials.use,
        name: credentials.name
      })
      .then((result) => {
        console.log(result);
        if (result.status == false) console.log(result.message);
        else {
          console.log(result.data);
          history.push("/");
        }
      })
      .catch((err) => {
        console.log(err);
        setStep(1);
        setCredentials(initialCredentials);
      });
  };

  console.log(credentials);

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
              name="use"
              type="radio"
              value={credentials.use}
              placeholder="Enter use"
              heading="How do you want to use Teams?"
              onChangeHandler={onChangeHandler}
              options={[
                {
                  heading: "For school",
                  description:
                    "To connect students and faculty for courses and projects, in a classroom or online",
                },
                {
                  heading: "For friends and family",
                  description:
                    "For everyday life, to make audio or video calls",
                },
                {
                  heading: "For work and organizations",
                  description: "To work with teammates wherever they are",
                },
              ]}
            />
          )}
          {step === 3 && (
            <Details
              name="name"
              type="text"
              value={credentials.name}
              placeholder="John Doe"
              heading="Enter your full name"
              onChangeHandler={onChangeHandler}
            />
          )}
          {step === 4 && (
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
          {step < 4 ? (
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

export default Signup;