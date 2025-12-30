
import "./main.scss";

import Image from "next/image";

import MyImage from "../../assets/images/my-profile-img.jpg";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faHouse, faUser, faFile, faAddressBook, faLaptopCode  } from "@fortawesome/free-solid-svg-icons";
import MainBanner from "../pages/main-banner/banner";
import About from "../pages/about/about";
import Skills from "../pages/skills/skills";
import Work from "../pages/work/work";
import Contact from "../pages/contact/contact";
import PersonalProject from "../pages/personal-project/personal-project";
export default function MainContent() {
  return (
    <>
      <div className="main-content">
          <MainBanner></MainBanner>
          <About></About>
          <Skills></Skills>
          <Work></Work>
          <PersonalProject></PersonalProject>
          <Contact></Contact>
      </div>
    </>
  );
}