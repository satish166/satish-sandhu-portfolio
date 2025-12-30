
import "./work.scss";
import Image from "next/image";
import starfurniture from "../../../assets/images/star-furniture.png";
import kimball from "../../../assets/images/kimball.png";
import poppin from "../../../assets/images/poppin.png";



export default function Work() {
  return (
    <>
      <section className="work-section">
        <div className="work-content container">
          <h2 className="heading">Live Projects</h2>
          <h6 className="">A showcase of projects that blend creativity with functionality.</h6>
          <div className="row">
            <div className="col-lg-6">
              <div className="work-box">
                <a className="visit-site" href="https://www.poppin.com/" target="_blank">
                  <Image src={poppin} alt="Poppins" className="h-auto" />
                  <div className="visit-text">
                    <p>Visit site</p>
                  </div>
                </a>
                <div className="about-project">
                  <h4>Poppins (Salesforce)</h4>
                  <p>Poppin is a modern design-driven company based in New York City that aims to reimagine everyday workspaces by creating well-designed office products and furniture that help people “work happy.” The company started by asking a simple question: what if common office tools like staplers were reimagined in a way that was both functional and visually inspiring? From that idea, Poppin was born with a mission to make work more enjoyable through innovative, colorful, and thoughtfully designed products.</p>
                  <a href="https://www.poppin.com/" target="_blank" className="button button-outline-primary my-2">Live Preview</a>
                </div>

              </div>
            </div>
            <div className="col-lg-6">
              <div className="work-box">
               
                <a className="visit-site" href="https://www.kimballinternational.com/home" target="_blank">
                  <Image src={kimball} alt="Kimball International" className="h-auto" />
                  <div className="visit-text">
                    <p>Visit site</p>
                  </div>
                </a>
                 <div className="about-project">
                  <h4>Kimball International (Salesforce)</h4>
                   <p>Kimball International is a long-established American commercial furnishings company known for creating high-quality, design-driven solutions for workspaces, healthcare environments, educational settings, and hospitality spaces. With roots dating back to 1950, the company combines a heritage of craftsmanship with modern design thinking to help shape functional, inspiring places where people work, learn, heal, and gather.</p>
                   <a href="https://www.kimballinternational.com/home" target="_blank" className="button button-outline-primary my-2">Live Preview</a>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="work-box">
                <a className="visit-site" href="https://starfurniture.com/" target="_blank">
                  <Image src={starfurniture} alt="Star Furniture" className="h-auto" />
                  <div className="visit-text">
                    <p>Visit site</p>
                  </div>
                </a>
                 <div className="about-project">
                  <h4>Star Furniture (Magento)</h4>
                   <p>Star Furniture is a century-old American home furnishings retailer based in Texas, offering a wide range of quality furniture and décor with a focus on style, comfort, and customer satisfaction.</p>
                   <a href="https://starfurniture.com/" target="_blank" className="button button-outline-primary my-2">Live Preview</a>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="work-box">
                
                <a className="visit-site" href="https://starfurniture.com/" target="_blank">
                  <Image src={starfurniture} alt="Star Furniture" className="h-auto" />
                  <div className="visit-text">
                    <p>Visit site</p>
                  </div>
                </a>
                <div className="about-project">
                  <h4>Star Furniture Application (Angular)</h4>
                   <p>Star Furniture is a century-old American home furnishings retailer based in Texas, offering a wide range of quality furniture and décor with a focus on style, comfort, and customer satisfaction.</p>
                 <a href="https://starfurniture.com/" target="_blank" className="button button-outline-primary my-2">Live Preview</a>
                </div>
              </div>
            </div>

          </div>
        </div>

      </section>
    </>
  );
}