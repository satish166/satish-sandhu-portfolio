
import "./banner.scss";

import Image from "next/image";

import MyImage from "../../../assets/images/hero-bg.jpg";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faHouse, faUser, faFile, faAddressBook, faLaptopCode  } from "@fortawesome/free-solid-svg-icons";
export default function MainBanner() {
  return (
    <>
      <div className="main-banner">
           <div className="banner-image">
                <Image src={MyImage} alt="Hero" className="" />
           </div>
           <div className="banner-content">
              <h1>Satish Kumar</h1>
              <h6 className="cursor typewriter-animation">I'm Frontend Developer</h6>
           </div>
      </div>
    </>
  );
}