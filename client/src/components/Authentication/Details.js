import React, { useState } from "react";
// import "../Authentication.css";
// import MsLogo from "../../../assets/images/Microsoft Logo.svg";

const Details = (props) => {
  return (
    <div className="details">
      {props.email && <div className="emailDetail">{props.email}</div>}
      <div className="detailsHeading">{props.heading}</div>
      {props.description && (
        <div className="detailsDesc">{props.description}</div>
      )}

      {props.type === "radio" ? (
        <div>
          {props.options.map((option) => (
            <div className="authRadio">
              <input
                name={props.name}
                onChange={(e) => {
                  // console.log(props.onChangeHandler, e);
                  return props.onChangeHandler(e);
                }}
                type="radio"
                value={option.heading + "." + option.description}
                className="radioBtn"
              />

              <div>
                <div className="optionHeading">{option.heading}</div>
                <div className="optionDesc">{option.description}</div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <input
          name={props.name}
          className="authInput"
          placeholder={props.placeholder}
          onChange={(e) => {
            // console.log(props.onChangeHandler, e);
            return props.onChangeHandler(e);
          }}
          value={props.value}
          type={props.type}
        />
      )}
    </div>
  );
};

export default Details;
