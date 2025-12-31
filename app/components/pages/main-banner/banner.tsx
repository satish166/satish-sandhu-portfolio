
import "./banner.scss";

import Image from "next/image";

import MyImage from "../../../assets/images/hero-bg.jpg";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faHouse, faUser, faFile, faAddressBook, faLaptopCode  } from "@fortawesome/free-solid-svg-icons";
export default function MainBanner() {
  return (
    <>
      <section className="main-banner">
           <div className="banner-image">
                <Image src={MyImage} alt="Hero" className="" />
           </div>
           <div className="container banner-content">
              <h1>Satish Kumar</h1>
              <h3 className="cursor typewriter-animation">I'm Frontend Developer</h3>
           </div>
      </section>
    </>
  );
}