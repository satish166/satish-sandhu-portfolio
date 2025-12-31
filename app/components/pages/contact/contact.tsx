import "./contact.scss";

import Image from "next/image";
import Address from "../../../assets/images/address.svg";
import Phone from "../../../assets/images/phone.svg";
import Mail from "../../../assets/images/mail.svg";
import Linkdin from "../../../assets/images/linkdin.svg";
import Whatsapp from "../../../assets/images/whatsapp.svg";

export default function Contact() {
  return (
    <>
      <section className="contact-section" id="contactus">
        <div className="work-content container">
            <div className="row">
              <div className="left-section col-lg-5">
                <h2 className="heading">Contact Us
              </h2>
              <div className="contact-us">
                <ul>
                  <li className="list-item">
                     <Image  src={Address} alt="Hero" className="h-auto contact-us-icons" />
                     <div className="">
                        <h6>Address</h6>
                        <p>Una (H.P)</p>
                     </div>
                  </li>
                  <li className="list-item">
                    <Image  src={Phone} alt="Hero" className="h-auto contact-us-icons" />
                     <div className="">
                        <h6>Call Us</h6>
                        <p><a href="tel:8278860269">8278860269</a></p>

                     </div>
                  </li>
                  <li className="list-item">
                    <Image  src={Mail} alt="Hero" className="h-auto contact-us-icons" />
                     <div className="">
                        <h6>Address</h6>
                        <p>Una (H.P)</p>
                     </div>
                  </li>
                </ul>

                  <ul className="social-links">
                    <li>
                      <a href="">
                       <Image  src={Linkdin} alt="Hero" className="h-auto contact-us-icons" />
                      </a>
                    </li>
                    <li> 
                      <a href="https://wa.me/8278860269">
                        <Image  src={Whatsapp} alt="Hero" className="h-auto contact-us-icons" />
                      </a>
                    </li>
                  </ul>
              </div>
              </div>
              <div className="right-section col-lg-12">
                <div className="row">
                  <div className="col-xl-5 d-none d-lg-block">
    
                  </div>
                  <div className="col-xl-7">
                    <div className="get-in-touch">
                          <h2 className="heading">Let's Work Together</h2>
                          <p>Have a project in mind or want to collaborate? I'm just a message away</p>
                          <form action="" method="get">
                              <div className="field">
                                <label htmlFor="Name">Name</label>
                                <input type="text" placeholder="Enter Your Name" />
                              </div>
                              <div className="field">
                                <label htmlFor="Name">Email</label>
                                <input type="email" placeholder="Enter Your Name" />
                              </div>
                              <div className="field">
                                <label htmlFor="Name">Message</label>
                                <textarea name="Message" id="message" placeholder="Enter Message">
                                  
                                </textarea>
                              </div>
                              <div className="field">
                              <button className="button button-primary" type="submit">Send Message</button>
                              </div>

                          </form>
                    </div>

                  </div>
                </div>
              </div>

            </div>
        </div>

      </section>
    </>
  );
}