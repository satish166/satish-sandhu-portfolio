"use client";

import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faUser, faFile, faLaptopCode, faAddressBook, faSun, faMoon, 
  faMapMarkerAlt, faEnvelope, faPaperPlane, faDownload, faIdCard,
  faChevronRight, faPhone, faGear
} from "@fortawesome/free-solid-svg-icons";
import { faLinkedin, faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import "./ryancv.scss";

const getProjectTechTags = (name: string): string[] => {
  const n = name.toLowerCase();
  if (n.includes("poppins") || n.includes("poppin")) {
    return ["Salesforce CC", "SCSS", "JavaScript", "UX Design"];
  }
  if (n.includes("kimball")) {
    return ["Salesforce CC", "APIs Integration", "Bootstrap", "Vanilla JS"];
  }
  if (n.includes("star furniture application") || (n.includes("star") && n.includes("angular"))) {
    return ["Angular 14", "TypeScript", "RxJS", "SCSS Layouts"];
  }
  if (n.includes("star furniture") || n.includes("star")) {
    return ["Magento 2", "PHP", "Less CSS", "E-commerce"];
  }
  return ["Web Development", "HTML5", "CSS3"];
};

interface RyanCVLayoutProps {
  data: any;
  layoutStyle: string;
  onLayoutChange: (style: string) => void;
}

export default function RyanCVLayout({ data, layoutStyle, onLayoutChange }: RyanCVLayoutProps) {
  const profile = data?.profile || {};
  const socials = data?.socials || {};
  
  const [activeTab, setActiveTab] = useState<string>("about");
  const [theme, setTheme] = useState<string>("dark");
  
  // Animated subtitle typing variables
  const [subtitleText, setSubtitleText] = useState("");
  const subtitles = profile.subtitles || ["Frontend Developer", "UI/UX Designer", "Web Developer"];
  const [subtitleIndex, setSubtitleIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  // Contact form variables
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });
  const [sending, setSending] = useState(false);
  const [contactStatus, setContactStatus] = useState<{ type: "success" | "error" | null; message: string }>({
    type: null,
    message: ""
  });

  // Theme loading on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("portfolio_theme") || "dark";
    setTheme(savedTheme);
    if (savedTheme === "light") {
      document.body.classList.add("light-theme");
    } else {
      document.body.classList.remove("light-theme");
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem("portfolio_theme", nextTheme);
    if (nextTheme === "light") {
      document.body.classList.add("light-theme");
    } else {
      document.body.classList.remove("light-theme");
    }
  };

  // Subtitle Typing Animation Effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    const currentFullText = subtitles[subtitleIndex];

    if (isDeleting) {
      timer = setTimeout(() => {
        setSubtitleText(currentFullText.substring(0, charIndex - 1));
        setCharIndex(prev => prev - 1);
      }, 70);
    } else {
      timer = setTimeout(() => {
        setSubtitleText(currentFullText.substring(0, charIndex + 1));
        setCharIndex(prev => prev + 1);
      }, 100);
    }

    if (!isDeleting && charIndex === currentFullText.length) {
      timer = setTimeout(() => setIsDeleting(true), 1500);
    } else if (isDeleting && charIndex === 0) {
      setIsDeleting(false);
      setSubtitleIndex(prev => (prev + 1) % subtitles.length);
    }

    return () => clearTimeout(timer);
  }, [charIndex, isDeleting, subtitleIndex, subtitles]);

  // Contact Form Handlers
  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setContactStatus({ type: null, message: "" });

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const resData = await res.json();

      if (res.ok) {
        setContactStatus({
          type: "success",
          message: resData.message || "Message sent successfully!"
        });
        
        try {
          const waText = encodeURIComponent(`Hi Satish,\n\nI just sent you a message through your portfolio contact form (RyanCV Layout).\n\nName: ${formData.name}\nEmail: ${formData.email}\nMessage: ${formData.message}`);
          window.open(`https://wa.me/918278860269?text=${waText}`, "_blank");
        } catch (waErr) {
          console.warn("WhatsApp redirect failed", waErr);
        }
        
        setFormData({ name: "", email: "", message: "" });
      } else {
        setContactStatus({
          type: "error",
          message: resData.error || "Failed to send message."
        });
      }
    } catch (err) {
      setContactStatus({
        type: "error",
        message: "An unexpected error occurred. Please try again."
      });
    } finally {
      setSending(false);
    }
  };

  // Helper to map skill names to approximate levels
  const getSkillLevel = (name: string): number => {
    const normalized = name.toLowerCase();
    if (normalized.includes("html") || normalized.includes("css") || normalized.includes("html5")) return 95;
    if (normalized.includes("react") || normalized.includes("angular") || normalized.includes("next")) return 90;
    if (normalized.includes("javascript") || normalized.includes("scss") || normalized.includes("sass")) return 92;
    if (normalized.includes("salesforce") || normalized.includes("sfcc")) return 88;
    if (normalized.includes("git") || normalized.includes("figma") || normalized.includes("wordpress")) return 85;
    return 80;
  };

  return (
    <div className={`ryancv-container ${theme === "light" ? "light-theme-mode" : ""}`}>
      <div className="ryancv-wrapper">
        
        {/* Profile Card (Left Pane) */}
        <div className="ryancv-profile-card">
          <div className="profile-cover">
            <div className="layout-switch-corner">
              <button onClick={() => onLayoutChange("default")} title="Switch to Classic Layout">
                <FontAwesomeIcon icon={faIdCard} /> Classic View
              </button>
            </div>
          </div>
          
          <div className="profile-avatar-container">
            <img 
              src={profile.avatar || "/uploads/1781243499421-242023870.jpg"} 
              alt={profile.name} 
              className="profile-avatar"
            />
          </div>
          
          <h1 className="profile-name">{profile.name || "Satish Kumar"}</h1>
          <div className="profile-subtitle">
            <span>{subtitleText}</span>
            <span className="typed-cursor">|</span>
          </div>
          
          <div className="profile-socials">
            {socials.linkedin && (
              <a href={socials.linkedin} target="_blank" rel="noopener noreferrer" title="LinkedIn">
                <FontAwesomeIcon icon={faLinkedin} />
              </a>
            )}
            {socials.whatsapp && (
              <a href={socials.whatsapp} target="_blank" rel="noopener noreferrer" title="WhatsApp">
                <FontAwesomeIcon icon={faWhatsapp} />
              </a>
            )}
          </div>
          
          <div className="profile-actions">
            {profile.resumeUrl ? (
              <a href={profile.resumeUrl} target="_blank" rel="noopener noreferrer" className="profile-action-btn">
                Download CV <FontAwesomeIcon icon={faDownload} className="ms-2" />
              </a>
            ) : (
              <span className="profile-action-btn">No CV Added</span>
            )}
            <button onClick={() => setActiveTab("contact")} className="profile-action-btn">
              Contact Me <FontAwesomeIcon icon={faPaperPlane} className="ms-2" />
            </button>
          </div>
        </div>

        {/* Content Wrapper (Middle Navbar & Content Card) */}
        <div className="ryancv-content-wrapper">
          
          {/* Header Navigation tabs */}
          <nav className="ryancv-navbar">
            <button 
              className={`nav-tab-btn ${activeTab === "about" ? "active" : ""}`}
              onClick={() => setActiveTab("about")}
            >
              <FontAwesomeIcon icon={faUser} className="nav-tab-icon" />
              <span>About</span>
            </button>
            <button 
              className={`nav-tab-btn ${activeTab === "skills" ? "active" : ""}`}
              onClick={() => setActiveTab("skills")}
            >
              <FontAwesomeIcon icon={faFile} className="nav-tab-icon" />
              <span>Skills</span>
            </button>
            <button 
              className={`nav-tab-btn ${activeTab === "live" ? "active" : ""}`}
              onClick={() => setActiveTab("live")}
            >
              <FontAwesomeIcon icon={faLaptopCode} className="nav-tab-icon" />
              <span>Live</span>
            </button>
            <button 
              className={`nav-tab-btn ${activeTab === "personal" ? "active" : ""}`}
              onClick={() => setActiveTab("personal")}
            >
              <FontAwesomeIcon icon={faLaptopCode} className="nav-tab-icon" />
              <span>Personal</span>
            </button>
            <button 
              className={`nav-tab-btn ${activeTab === "contact" ? "active" : ""}`}
              onClick={() => setActiveTab("contact")}
            >
              <FontAwesomeIcon icon={faAddressBook} className="nav-tab-icon" />
              <span>Contact</span>
            </button>
            
            {/* Dark Mode switcher within card tabs */}
            <button 
              className="nav-tab-btn" 
              onClick={toggleTheme}
              title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              <FontAwesomeIcon icon={theme === "dark" ? faSun : faMoon} className="nav-tab-icon" />
              <span>Mode</span>
            </button>

            {/* Admin settings page gear button */}
            <a href="/admin" className="nav-tab-btn" title="Admin Control Panel">
              <FontAwesomeIcon icon={faGear} className="nav-tab-icon" style={{ animation: "spin 8s linear infinite" }} />
              <span>Admin</span>
            </a>
          </nav>

          {/* Tabbed Content Card Panel */}
          <div className="ryancv-content-card">
            
            {/* ABOUT SECTION */}
            {activeTab === "about" && (
              <div id="about-section" className="tab-section">
                <h2 className="section-title">About Me</h2>
                <div className="about-text" style={{ fontSize: "14px", lineHeight: "1.8", color: theme === "light" ? "#555555" : "#9ca3af" }}>
                  <p>{profile.about || "I am a Frontend Developer..."}</p>
                </div>
                
                <h4 className="section-subtitle mt-5">Personal Details</h4>
                <div className="info-list-grid">
                  {profile.birthday && (
                    <div className="info-list-item">
                      <span>Birthday</span>
                      <strong>{profile.birthday}</strong>
                    </div>
                  )}
                  {profile.age && (
                    <div className="info-list-item">
                      <span>Age</span>
                      <strong>{profile.age}</strong>
                    </div>
                  )}
                  {profile.email && (
                    <div className="info-list-item">
                      <span>Email</span>
                      <strong><a href={`mailto:${profile.email}`} style={{ color: "inherit", textDecoration: "none" }}>{profile.email}</a></strong>
                    </div>
                  )}
                  {profile.phone && (
                    <div className="info-list-item">
                      <span>Phone</span>
                      <strong><a href={`tel:${profile.phone}`} style={{ color: "inherit", textDecoration: "none" }}>{profile.phone}</a></strong>
                    </div>
                  )}
                  {profile.degree && (
                    <div className="info-list-item">
                      <span>Degree</span>
                      <strong>{profile.degree}</strong>
                    </div>
                  )}
                  {profile.address && (
                    <div className="info-list-item">
                      <span>Address</span>
                      <strong>{profile.address}</strong>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* SKILLS SECTION */}
            {activeTab === "skills" && (
              <div id="skills-section" className="tab-section">
                <h2 className="section-title">Skills & Professional Expertise</h2>
                
                {(data?.skills || []).map((cat: any, idx: number) => (
                  <div className="mb-5" key={idx}>
                    <h4 className="section-subtitle">{cat.category}</h4>
                    <div className="skills-grid-vcard">
                      {(cat.items || []).map((item: any, itemIdx: number) => {
                        const level = getSkillLevel(item.name);
                        return (
                          <div className="skill-meter-vcard" key={itemIdx}>
                            <div className="skill-info-vcard">
                              <span className="skill-name-vcard">{item.name}</span>
                              <span className="skill-percentage-vcard">{level}%</span>
                            </div>
                            <div className="skill-progress-bg">
                              <div 
                                className="skill-progress-bar" 
                                style={{ width: `${level}%`, backgroundColor: item.color || "#78cc6d" }}
                              ></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* LIVE PROJECTS SECTION */}
            {activeTab === "live" && (
              <div id="live-section" className="tab-section">
                <h2 className="section-title">Live Client Projects</h2>
                <div className="projects-grid-vcard">
                  {(data?.liveProjects || []).map((proj: any) => (
                    <a 
                      href={proj.link} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="project-card-vcard" 
                      key={proj.id}
                    >
                      {proj.image && (
                        <div className="project-image-vcard">
                          <img src={proj.image} alt={proj.name} />
                          <div className="project-hover-overlay-vcard">
                            <span className="visit-btn-vcard">Visit Live Site</span>
                          </div>
                        </div>
                      )}
                      <div className="project-body-vcard">
                        <div className="project-tags-vcard">
                          {getProjectTechTags(proj.name).map((tag: string, idx: number) => (
                            <span className="tech-badge-vcard" key={idx}>{tag}</span>
                          ))}
                        </div>
                        <h5 className="project-title-vcard">{proj.name}</h5>
                        <p className="project-desc-vcard">{proj.description}</p>
                        <div className="project-footer-vcard">
                          <span className="visit-text-vcard">Visit Live Site</span>
                          <FontAwesomeIcon icon={faChevronRight} className="arrow-icon-vcard" />
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* PERSONAL PROJECTS SECTION */}
            {activeTab === "personal" && (
              <div id="personal-section" className="tab-section">
                <h2 className="section-title">Personal Portfolio Projects</h2>
                <div className="projects-grid-vcard">
                  {(data?.personalProjects || []).map((proj: any) => (
                    <a 
                      href={proj.link} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="project-card-vcard" 
                      key={proj.id}
                    >
                      {proj.image && (
                        <div className="project-image-vcard">
                          <img src={proj.image} alt={proj.name} />
                          <div className="project-hover-overlay-vcard">
                            <span className="visit-btn-vcard">{proj.btnText || "Visit Project"}</span>
                          </div>
                        </div>
                      )}
                      <div className="project-body-vcard">
                        <div className="project-tags-vcard">
                          {getProjectTechTags(proj.name).map((tag: string, idx: number) => (
                            <span className="tech-badge-vcard" key={idx}>{tag}</span>
                          ))}
                        </div>
                        <h5 className="project-title-vcard">{proj.name}</h5>
                        <p className="project-desc-vcard">{proj.description}</p>
                        <div className="project-footer-vcard">
                          <span className="visit-text-vcard">{proj.btnText || "Visit Project"}</span>
                          <FontAwesomeIcon icon={faChevronRight} className="arrow-icon-vcard" />
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* CONTACT SECTION */}
            {activeTab === "contact" && (
              <div id="contact-section" className="tab-section">
                <h2 className="section-title">Get In Touch</h2>
                
                <div className="contact-info-grid">
                  {profile.address && (
                    <div className="contact-card-item">
                      <FontAwesomeIcon icon={faMapMarkerAlt} className="contact-icon" />
                      <h6>Location</h6>
                      <p>{profile.address}</p>
                    </div>
                  )}
                  {profile.email && (
                    <div className="contact-card-item">
                      <FontAwesomeIcon icon={faEnvelope} className="contact-icon" />
                      <h6>Email</h6>
                      <p><a href={`mailto:${profile.email}`}>{profile.email}</a></p>
                    </div>
                  )}
                </div>

                <h4 className="section-subtitle mt-4">Send a message</h4>
                
                {contactStatus.type && (
                  <div className={`alert ${contactStatus.type === "success" ? "alert-success" : "alert-danger"} mb-4`} role="alert">
                    {contactStatus.message}
                  </div>
                )}

                <form onSubmit={handleContactSubmit} className="contact-form-vcard">
                  <input 
                    type="text" 
                    id="name" 
                    placeholder="Full Name" 
                    value={formData.name}
                    onChange={handleContactChange}
                    required
                  />
                  <input 
                    type="email" 
                    id="email" 
                    placeholder="Email Address" 
                    value={formData.email}
                    onChange={handleContactChange}
                    required
                  />
                  <textarea 
                    id="message" 
                    placeholder="Your Message..." 
                    value={formData.message}
                    onChange={handleContactChange}
                    required
                  />
                  <button 
                    type="submit" 
                    className="submit-btn-vcard"
                    disabled={sending}
                  >
                    {sending ? "Sending..." : (
                      <>
                        Send Message <FontAwesomeIcon icon={faPaperPlane} />
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}
            
          </div>
        </div>

      </div>
    </div>
  );
}
