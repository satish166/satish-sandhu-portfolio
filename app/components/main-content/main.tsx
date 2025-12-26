
import "./main.scss";

import Image from "next/image";

import MyImage from "../../assets/images/my-profile-img.jpg";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faHouse, faUser, faFile, faAddressBook, faLaptopCode  } from "@fortawesome/free-solid-svg-icons";
import MainBanner from "../pages/main-banner/banner";
export default function MainContent() {
  return (
    <>
      <div className="main-content">
          <MainBanner></MainBanner>
      </div>
    </>
  );
}