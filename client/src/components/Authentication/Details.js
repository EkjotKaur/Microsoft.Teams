import React from "react";

// Returns the inputs taken through authentications
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
          {props.options.map((option, i) => (
            <div className="authRadio" key={i}>
              <input
                name={props.name}
                onChange={(e) => {
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
