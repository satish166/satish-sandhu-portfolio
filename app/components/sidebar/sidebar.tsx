
import "./sidebar.scss";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faUser, faFile, faAddressBook, faLaptopCode, faGear } from "@fortawesome/free-solid-svg-icons";
import { faLinkedin, faWhatsapp } from "@fortawesome/free-brands-svg-icons";

interface SideBarProps {
  data: any;
}

export default function SideBar({ data }: SideBarProps) {
  const profile = data?.profile || {};
  const socials = data?.socials || {};
  const avatarSrc = profile.avatar || "/uploads/my-profile-img.jpg";

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="sidebar-section d-none d-xxl-block">
        <div className="sidebar-container">
          <div className="sidebar-content">
            <div className="profile-image">
              <img src={avatarSrc} alt={profile.name || "Satish Kumar"} className="w-full h-auto" />
            </div>
            <div className="profile-name">
              <h4>{profile.name || "Satish Kumar"}</h4>
              <p className="profile-title">{profile.title || "Frontend Developer"}</p>
            </div>
            <div className="social-icons">
              <ul>
                {socials.linkedin && (
                  <li>
                    <a href={socials.linkedin} target="_blank" rel="noopener noreferrer" title="LinkedIn">
                      <FontAwesomeIcon icon={faLinkedin} />
                    </a>
                  </li>
                )}
                {socials.whatsapp && (
                  <li>
                    <a href={socials.whatsapp} target="_blank" rel="noopener noreferrer" title="WhatsApp">
                      <FontAwesomeIcon icon={faWhatsapp} />
                    </a>
                  </li>
                )}
                <li>
                  <a href="/admin" title="Admin Settings">
                    <FontAwesomeIcon icon={faGear} />
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="sidebar-menu">
            <ul>
              <li>
                <a href="#home"><FontAwesomeIcon icon={faHouse} />  Home</a>
              </li>
              <li>
                <a href="#about"><FontAwesomeIcon icon={faUser} /> About</a>
              </li>
              <li>
                <a href="#skills"><FontAwesomeIcon icon={faFile} /> Skills</a>
              </li>
              <li>
                <a href="#liveprojects"><FontAwesomeIcon icon={faLaptopCode} /> Live Projects</a>
              </li>
              <li>
                <a href="#personalprojects"><FontAwesomeIcon icon={faLaptopCode} /> Personal Projects</a>
              </li>
              <li>
                <a href="#contactus"><FontAwesomeIcon icon={faAddressBook} /> Contact</a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Mobile Offcanvas Sidebar */}
      <div className="sidebar-section offcanvas offcanvas-start d-xxl-none" id="offcanvasExample" aria-labelledby="offcanvasExampleLabel">
        <div className="sidebar-container">
          <div className="sidebar-content">
            <div className="profile-image">
              <img src={avatarSrc} alt={profile.name || "Satish Kumar"} className="w-full h-auto" />
            </div>
            <div className="profile-name">
              <h4>{profile.name || "Satish Kumar"}</h4>
              <p className="profile-title">{profile.title || "Frontend Developer"}</p>
            </div>
            <div className="social-icons">
              <ul>
                {socials.linkedin && (
                  <li>
                    <a href={socials.linkedin} target="_blank" rel="noopener noreferrer">
                      <FontAwesomeIcon icon={faLinkedin} />
                    </a>
                  </li>
                )}
                {socials.whatsapp && (
                  <li>
                    <a href={socials.whatsapp} target="_blank" rel="noopener noreferrer">
                      <FontAwesomeIcon icon={faWhatsapp} />
                    </a>
                  </li>
                )}
                <li>
                  <a href="/admin">
                    <FontAwesomeIcon icon={faGear} />
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="sidebar-menu">
            <ul>
              <li>
                <a href="#home" data-bs-dismiss="offcanvas"><FontAwesomeIcon icon={faHouse} />  Home</a>
              </li>
              <li>
                <a href="#about" data-bs-dismiss="offcanvas"><FontAwesomeIcon icon={faUser} /> About</a>
              </li>
              <li>
                <a href="#skills" data-bs-dismiss="offcanvas"><FontAwesomeIcon icon={faFile} /> Skills</a>
              </li>
              <li>
                <a href="#liveprojects" data-bs-dismiss="offcanvas"><FontAwesomeIcon icon={faLaptopCode} /> Live Projects</a>
              </li>
              <li>
                <a href="#personalprojects" data-bs-dismiss="offcanvas"><FontAwesomeIcon icon={faLaptopCode} /> Personal Projects</a>
              </li>
              <li>
                <a href="#contactus" data-bs-dismiss="offcanvas"><FontAwesomeIcon icon={faAddressBook} /> Contact</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}