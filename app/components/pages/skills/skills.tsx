
import "./skills.scss";
import Image from "next/image";
import TailwindIcon from "../../../assets/images/tailwind-icon.svg";
import nextJs from "../../../assets/images/nextJs-icon.svg";
import photoShop from "../../../assets/images/photoshop-icon.svg";
import illustrator from "../../../assets/images/illustrator-icon.svg";
import xd from "../../../assets/images/xd-icon.svg";
import canva from "../../../assets/images/canva-icon.svg";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHtml5, faCss3Alt, faSass, faJs, faReact, faWordpress, faFigma, faGithub, faLess, faAngular, faSalesforce } from "@fortawesome/free-brands-svg-icons";


export default function Skills() {
  return (
    <>
      <section className="skill-section">
        <div className="skills-content container">
          <h2 className="heading">Skill & Expertise</h2>
          <div className="row">
            <div className="col-lg-4">
              <div className="skill-box">
                <h3>Frontend Development</h3>
                <ul className="skill-list">
                  <li>
                    <FontAwesomeIcon icon={faHtml5} />
                    <h5> HTML</h5>
                  </li>
                  <li>
                    <FontAwesomeIcon icon={faCss3Alt} />
                    <h5>
                      CSS</h5>
                  </li>
                  <li>
                    <FontAwesomeIcon icon={faSass} />
                    <h5> Scss</h5>
                  </li>
                  <li>
                    <FontAwesomeIcon icon={faLess} />
                    <h5> Scss</h5>
                  </li>
                  <li>
                     <Image src={TailwindIcon} alt="Hero" className="h-auto" /> 
                    <h5>Tailwind</h5>
                  </li>
                  <li>
                    <FontAwesomeIcon icon={faJs} />
                    <h5> Javascript</h5>
                  </li>
                  <li>
                    <Image src={nextJs} alt="Next js" className="h-auto" />
                    <h5> Next JS</h5>
                  </li>
                  <li>
                    <FontAwesomeIcon icon={faAngular} />
                    <h5> Angular</h5>
                  </li>
                  <li>
                    <FontAwesomeIcon icon={faReact} />
                    <h5> React</h5>
                  </li>
               
                </ul>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="skill-box">
                <h3>CMS Tools</h3>
                <ul className="skill-list">
                   <li>
                    <FontAwesomeIcon icon={faWordpress} />
                    <h5> Wordpress</h5>
                  </li>
                   <li>
                    <FontAwesomeIcon icon={faSalesforce} />
                    <h5> Salesforce</h5>
                  </li>
                  <li>
                    <Image src={canva} alt="Adobe XD" className="h-auto" />
                    <h5> Canva</h5>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="skill-box">
                <h3>Other Tools</h3>
                <ul className="skill-list">
                  
                  <li>
                    <FontAwesomeIcon icon={faGithub} />
                    <h5> Github</h5>
                  </li>
                  <li>
                    <FontAwesomeIcon icon={faFigma} />
                    <h5> Figma</h5>
                  </li>
                  <li>
                    <Image src={photoShop} alt="Photoshop" className="h-auto" />
                    <h5> Photoshop</h5>
                  </li>
                  <li>
                    <Image src={illustrator} alt="Illustrator" className="h-auto" />
                    <h5>Illustrator</h5>
                  </li>
                  <li>
                    <Image src={xd} alt="Adobe XD" className="h-auto" />
                    <h5> XD</h5>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

      </section>
    </>
  );
}