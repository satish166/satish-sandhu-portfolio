
import "./about.scss";

import Image from "next/image";

import MyImage from "../../../assets/images/my-profile-img.jpg";

export default function About() {
  return (
    <>
      <section className="container about-section" id="about">
           <div className="about-content">
              <h2 className="heading">About</h2>
              <h6 className="">I am a Frontend Developer with 5 years of experience in building scalable, high-performance, and user-centric web applications. I specialize in React, Angular, Next.js, and Salesforce Commerce Cloud (SFCC), with strong expertise in modern styling solutions like SCSS and Tailwind CSS. I focus on writing clean, maintainable code and creating seamless user experiences across devices.</h6>
           </div>
            <div className="personal-info">
           <div className="row align-items-center">
            <div className="col-md-4">
               <div className="about-image">
                <Image src={MyImage} alt="s" className="h-auto" />
               </div>
            </div>
            <div className="col-md-8">
              <h3>UI/UX Designer & Web Developer.</h3>
              <div className="prsonal-details">
                <ul>
                  <li>
                    <p className="font-semibold">Birthday:</p>
                    <p>10 Jan 2000</p>
                  </li>
                  <li>
                    <p className="font-semibold">Phone:</p>
                    <p><a href="tel:8278860269">+91 8278860269</a></p>
                  </li>
                  <li>
                    <p className="font-semibold">Age:</p>
                    <p>25 Years</p>
                  </li>
                  <li>
                    <p className="font-semibold">Email:</p>
                    <p><a href="mailto:sandhusatish166@gmail.com">sandhusatish166@gmail.com</a></p>
                  </li>
                  <li>
                    <p className="font-semibold">Degree:</p>
                    <p>Bachelor of Computer Applications (BCA)</p>
                  </li>
                  <li>
                    <p className="font-semibold">Address:</p>
                    <p>Una (H.P)</p>
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