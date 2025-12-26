
import React from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faCoffee } from "@fortawesome/free-solid-svg-icons"

import SideBar from "./components/sidebar/sidebar";
import MainContent from "./components/main-content/main";

export default function Portfolio() {
  return (
   <>
   <div className="page-layout">
    <SideBar></SideBar>
    <MainContent></MainContent>
   </div>
   </>
  );
}