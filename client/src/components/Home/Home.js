import React from "react";
import "./Home.css";
import MSlogo from "../../assets/images/Microsoft Logo.svg";
import HomeImg from "../../assets/images/Home/Home.webp";
import { useHistory } from "react-router-dom";


// Home page of the site
const Home = (props) => {
  const history = useHistory();
  return (
    <div className="Home">
      <div className="NavHome">
        {" "}
        <img src={MSlogo} alt="logo" />{" "}
        <div className="teamsHeadingHome"> Teams</div>
      </div>
      <div className="lineMs">
        Now use Microsoft Teams with family and friends to call, chat, and make
        plans.
      </div>
      <div className="homePgRow">
        <div className="homePgCol colLeft">
          <div className="homePgMSHeading">Microsoft Teams</div>
          <div className="desc">
            Meet, chat, call, and collaborate in just one place.
          </div>
          <div>
            <div className="signupHome" onClick={() => history.push("/signup")}>
              Sign up for free
            </div>
            <div className="signinHome" onClick={() => history.push("/login")}>
              Sign in
            </div>
          </div>
        </div>
        <div className="homePgCol">
          <img src={HomeImg} alt="home" className="homeImg" />
        </div>
      </div>
    </div>
  );
};

export default Home;
