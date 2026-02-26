
import "./banner.scss";

import Image from "next/image";

import MyImage from "../../../assets/images/hero-bg.jpg";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faHouse, faUser, faFile, faAddressBook, faLaptopCode  } from "@fortawesome/free-solid-svg-icons";
import DownloadResumeButton from "../../DownloadResumeButton";
export default function MainBanner() {
  
  return (
    <>
      <section className="main-banner" id="home"  data-aos="fade-up">
           <div className="banner-image">
                <Image src={MyImage} alt="Hero" className="" />
           </div>
           <div className="container banner-content">
              <h1 data-aos="fade-up" data-aos-delay="300">Satish Kumar</h1>
              <h3 className="cursor typewriter-animation" data-aos="fade-up" data-aos-delay="400">I'm Frontend Developer</h3>
              <div className="download-resume mt-3" data-aos="fade-up" data-aos-delay="500" >
                <DownloadResumeButton />
              </div>

           </div>
      </section>
    </>
  );
}