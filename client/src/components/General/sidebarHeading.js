import React from "react";
import "./sidebarHeading.css";

// Sidebar in chats
const SidebarHeading = (props) => {
  return <div className="SidebarHeading">{props.heading}</div>;
};

export default SidebarHeading;
