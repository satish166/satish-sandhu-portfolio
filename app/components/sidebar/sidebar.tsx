
import "./sidebar.scss";

import Image from "next/image";

import MyImage from "../../assets/images/my-profile-img.jpg";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faHouse, faUser, faFile, faAddressBook, faLaptopCode } from "@fortawesome/free-solid-svg-icons";
export default function SideBar() {
  return (
    <>
      <div className="sidebar-section d-none d-lg-block">
        <div className="">
          <div className="sidebar-content">
            <div className="profile-image">

              <Image src={MyImage} alt="Hero" className="w-full h-auto" />
            </div>
            <div className="profile-name">
              <h4>Satish Kumar</h4>
            </div>
            <div className="social-icons">
              <ul>
                <li>
                  <a href="">insta</a>
                  <i className="bi bi-twitter-x" />
                </li>
              </ul>
            </div>
          </div>

          <div className="sidebar-menu">
            <ul>
              <li>
                <a href="#yoko"><FontAwesomeIcon icon={faHouse} />  Home</a>
              </li>
              <li>
                <a href="#"><FontAwesomeIcon icon={faUser} /> About</a>
              </li>
              <li>
                <a href="#"><FontAwesomeIcon icon={faFile} /> Resume</a>
              </li>
              <li>
                <a href="#"><FontAwesomeIcon icon={faLaptopCode} /> Work</a>
              </li>
              <li>
                <a href="#"><FontAwesomeIcon icon={faAddressBook} /> Contact</a>
              </li>

            </ul>

          </div>

        </div>

      </div>
       <div className="sidebar-section offcanvas offcanvas-start d-lg-none"  id="offcanvasExample" aria-labelledby="offcanvasExampleLabel">
        <div className="">
          <div className="sidebar-content">
            <div className="profile-image">

              <Image src={MyImage} alt="Hero" className="w-full h-auto" />
            </div>
            <div className="profile-name">
              <h4>Satish Kumar</h4>
            </div>
            <div className="social-icons">
              <ul>
                <li>
                  <a href="">insta</a>
                  <i className="bi bi-twitter-x" />
                </li>
              </ul>
            </div>
          </div>

          <div className="sidebar-menu">
            <ul>
              <li>
                <a href="#yoko"><FontAwesomeIcon icon={faHouse} />  Home</a>
              </li>
              <li>
                <a href="#"><FontAwesomeIcon icon={faUser} /> About</a>
              </li>
              <li>
                <a href="#"><FontAwesomeIcon icon={faFile} /> Resume</a>
              </li>
              <li>
                <a href="#"><FontAwesomeIcon icon={faLaptopCode} /> Work</a>
              </li>
              <li>
                <a href="#"><FontAwesomeIcon icon={faAddressBook} /> Contact</a>
              </li>

            </ul>

          </div>

        </div>

      </div>
    </>
  );
}