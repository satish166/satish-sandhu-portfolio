"use client";

import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faUser, faFile, faLaptopCode, faAddressBook, faSun, faMoon, 
  faMapMarkerAlt, faEnvelope, faPaperPlane, faDownload, faIdCard,
  faChevronRight, faPhone, faGear
} from "@fortawesome/free-solid-svg-icons";
import { 
  faLinkedin, faWhatsapp,
  faHtml5, faCss3Alt, faSass, faJs, faReact, faWordpress, 
  faFigma, faGithub, faLess, faAngular, faSalesforce
} from "@fortawesome/free-brands-svg-icons";
import "./ryancv.scss";

const fontAwesomeMap: Record<string, any> = {
  faHtml5,
  faCss3Alt,
  faSass,
  faJs,
  faReact,
  faWordpress,
  faFigma,
  faGithub,
  faLess,
  faAngular,
  faSalesforce
};

const renderIcon = (icon: string, name: string) => {
  if (icon === "nextjs") {
    return (
      <svg viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="nextjs-icon" style={{ width: '100%', height: '100%', fill: 'currentColor' }}>
        <path fillRule="evenodd" clipRule="evenodd" d="M0 7.5C0 3.35786 3.35786 0 7.5 0C11.6421 0 15 3.35786 15 7.5C15 10.087 13.6902 12.3681 11.6975 13.7163L4.90687 4.20942C4.78053 4.03255 4.5544 3.95756 4.34741 4.02389C4.14042 4.09022 4 4.28268 4 4.50004V12H5V6.06027L10.8299 14.2221C9.82661 14.7201 8.696 15 7.5 15C3.35786 15 0 11.6421 0 7.5ZM10 10V4H11V10H10Z"/>
      </svg>
    );
  }
  
  if (icon === "tailwind") {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
        <path d="M12.0001 7.75C11.1793 7.75 10.4736 7.97153 9.91973 8.4463C9.36982 8.91765 9.01007 9.60383 8.81051 10.4591C8.76695 10.6458 8.86194 10.8371 9.03695 10.9152C9.21197 10.9934 9.41782 10.9364 9.52774 10.7794C9.78104 10.4175 10.034 10.2 10.277 10.0884C10.5123 9.98033 10.766 9.95844 11.0566 10.0363C11.3498 10.1148 11.5768 10.3449 11.9332 10.7324L11.9447 10.7324L11.9447 10.745C12.2133 11.0372 12.541 11.3936 12.9892 11.6701C13.4543 11.9571 14.033 12.15 14.8001 12.15C15.6209 12.15 16.3266 11.9285 16.8805 11.4537C17.4304 10.9823 17.7901 10.2962 17.9897 9.44089C18.0332 9.25418 17.9382 9.06291 17.7632 8.98476C17.5882 8.90661 17.3823 8.96358 17.2724 9.12061C17.0191 9.48247 16.7662 9.7 16.5232 9.81163C16.2878 9.9197 16.0341 9.94159 15.7436 9.86373C15.4504 9.78518 15.2234 9.55515 14.867 9.16757L14.8555 9.15505C14.5869 8.86287 14.2592 8.50645 13.811 8.22998C13.3459 7.94297 12.7672 7.75 12.0001 7.75Z" fill="#38BDF8"/>
        <path d="M7.00012 12.25C6.17932 12.25 5.47359 12.4715 4.91973 12.9463C4.36982 13.4177 4.01007 14.1038 3.81051 14.9591C3.76695 15.1458 3.86194 15.3371 4.03695 15.4152C4.21197 15.4934 4.41782 15.4364 4.52774 15.2794C4.78104 14.9175 5.034 14.7 5.27702 14.5884C5.51235 14.4803 5.76602 14.4584 6.05663 14.5363C6.34978 14.6148 6.57682 14.8449 6.93322 15.2324L6.94472 15.245C7.21332 15.5372 7.54101 15.8936 7.9892 16.1701C8.45434 16.4571 9.03303 16.65 9.80012 16.65C10.6209 16.65 11.3266 16.4285 11.8805 15.9537C12.4304 15.4823 12.7901 14.7962 12.9897 13.9409C13.0332 13.7542 12.9382 13.5629 12.7632 13.4848C12.5882 13.4066 12.3823 13.4636 12.2724 13.6206C12.0191 13.9825 11.7662 14.2 11.5232 14.3116C11.2878 14.4197 11.0341 14.4416 10.7436 14.3637C10.4504 14.2852 10.2234 14.0551 9.86699 13.6676L9.85549 13.655C9.58691 13.3629 9.25922 13.0065 8.81102 12.7299C8.3459 12.443 7.76722 12.25 7.00012 12.25Z" fill="#0EA5E9"/>
      </svg>
    );
  }

  if (icon === "photoshop") {
    return (
      <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
        <rect width="512" height="512" rx="72" fill="#001e36"/>
        <rect x="18" y="18" width="476" height="476" rx="54" fill="none" stroke="#31a8ff" strokeWidth="24"/>
        <path d="M120 160h90c40 0 65 20 65 55s-25 55-65 55h-50v82h-40V160zm40 75h45c18 0 28-8 28-22s-10-23-28-23h-45v45z" fill="#31a8ff"/>
        <path d="M305 275c10-25 35-42 65-42 35 0 55 22 55 52v72h-35v-68c0-15-8-22-22-22s-28 10-28 28v62h-35V160h35v110z" fill="#31a8ff"/>
      </svg>
    );
  }

  if (icon === "illustrator") {
    return (
      <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
        <rect width="512" height="512" rx="72" fill="#261300"/>
        <rect x="18" y="18" width="476" height="476" rx="54" fill="none" stroke="#ff9a00" strokeWidth="24"/>
        <path d="M200 326h-80l-16 26h-34l72-192h36l72 192h-34l-16-26zm-12-24l-28-52-28 52h56z" fill="#ff9a00"/>
        <path d="M260 200h35v152h-35V200zm0-40h35v25h-35v-25z" fill="#ff9a00"/>
      </svg>
    );
  }

  if (icon === "xd") {
    return (
      <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
        <rect width="512" height="512" rx="72" fill="#2c001e"/>
        <rect x="18" y="18" width="476" height="476" rx="54" fill="none" stroke="#ff61f6" strokeWidth="24"/>
        <path d="M110 160h70c45 0 75 25 75 70s-30 70-75 70h-70V160zm40 105h30c22 0 35-12 35-35s-13-35-35-35h-30v70z" fill="#ff61f6"/>
        <path d="M280 270c10-25 35-42 65-42 35 0 55 20 55 52v72h-35v-68c0-15-8-22-22-22s-28 10-28 28v62h-35V160h35v110z" fill="#ff61f6"/>
      </svg>
    );
  }

  if (icon === "canva") {
    return (
      <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
        <defs>
          <linearGradient id="canvaG" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00C4CC" />
            <stop offset="100%" stopColor="#7D2AE8" />
          </linearGradient>
        </defs>
        <rect width="512" height="512" rx="72" fill="url(#canvaG)"/>
        <path d="M160 360c-25-10-45-30-55-60-8-20-10-45-5-70 10-40 40-75 80-95s80-25 115-10c25 10 40 30 45 55 5 20 0 45-10 65-15 25-35 40-65 45h-10c-5 0-10-5-10-10s5-10 10-10c20-3 35-12 45-28 8-12 10-28 5-42-5-12-18-20-35-25H250c-20 0-45 10-65 25-30 20-50 50-55 85-3 20-3 40 5 60 10 25 30 40 55 45 35 6 75-10 100-35 15-15 25-30 35-50 2-3 5-6 10-6s10 3 10 7c0 5-5 12-10 18-20 30-50 55-85 65-20 6-45 6-65-2z" fill="#FFFFFF"/>
      </svg>
    );
  }

  if (fontAwesomeMap[icon]) {
    return <FontAwesomeIcon icon={fontAwesomeMap[icon]} style={{ width: '100%', height: '100%' }} />;
  }
  
  const customSvgMap: Record<string, string> = {
    tailwind: "/uploads/tailwind-icon.svg",
    nextjs: "/uploads/nextJs-icon.svg",
    photoshop: "/uploads/photoshop-icon.svg",
    illustrator: "/uploads/illustrator-icon.svg",
    xd: "/uploads/xd-icon.svg",
    canva: "/uploads/canva-icon.svg"
  };
  const srcPath = customSvgMap[icon] ? `${customSvgMap[icon]}?v=4` : `${icon}?v=4`;
  return <img src={srcPath} alt={name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />;
};

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

  // Helper to split heading text into two-color format
  const renderSplitTitle = (title: string) => {
    const words = title.split(" ");
    if (words.length <= 1) return title;
    const firstWord = words[0];
    const restOfTitle = words.slice(1).join(" ");
    return (
      <>
        {firstWord} <span style={{ color: "var(--primary-color)" }}>{restOfTitle}</span>
      </>
    );
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
              <a href={socials.linkedin} target="_blank" rel="noopener noreferrer" title="LinkedIn" className="social-linkedin">
                <FontAwesomeIcon icon={faLinkedin} />
              </a>
            )}
            {socials.whatsapp && (
              <a href={socials.whatsapp} target="_blank" rel="noopener noreferrer" title="WhatsApp" className="social-whatsapp">
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
                <h2 className="section-title">{renderSplitTitle("About Me")}</h2>
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
                <h2 className="section-title">{renderSplitTitle("Skills & Professional Expertise")}</h2>
                
                {(data?.skills || []).map((cat: any, idx: number) => (
                  <div className="mb-5" key={idx}>
                    <h4 className="section-subtitle">{cat.category}</h4>
                    <div className="skills-grid-vcard">
                      {(cat.items || []).map((item: any, itemIdx: number) => {
                        const level = getSkillLevel(item.name);
                        
                        // Theme-aware color adjustments to ensure readability and contrast
                        let adjustedColor = item.color || "var(--primary-color)";
                        const lowerName = item.name.toLowerCase();
                        
                        if (theme === "light") {
                          if (lowerName.includes("github") || adjustedColor === "#ffffff") {
                            adjustedColor = "#1a1a1a"; // Dark fallback for GitHub in light theme
                          } else if (lowerName.includes("javascript") || adjustedColor === "#f7df1e") {
                            adjustedColor = "#d4b200"; // Darker golden-yellow for readability in light theme
                          }
                        } else {
                          // Dark Theme
                          if (lowerName.includes("next") || adjustedColor === "#000000") {
                            adjustedColor = "#ffffff"; // White fallback for Next.js in dark theme
                          }
                        }

                        return (
                          <div 
                            className="skill-card-vcard" 
                            key={itemIdx}
                            style={{ "--skill-color": adjustedColor } as React.CSSProperties}
                          >
                            <div className="skill-circle-wrap-vcard">
                              <svg className="skill-circle-svg" width="90" height="90" viewBox="0 0 90 90">
                                <circle
                                  className="skill-circle-track"
                                  cx="45"
                                  cy="45"
                                  r="36"
                                  fill="transparent"
                                />
                                <circle
                                  className="skill-circle-fill"
                                  cx="45"
                                  cy="45"
                                  r="36"
                                  fill="transparent"
                                  strokeDasharray="226.19"
                                  strokeDashoffset={(226.19 - (level / 100) * 226.19).toFixed(2)}
                                  transform="rotate(-90 45 45)"
                                />
                              </svg>
                              <div className="skill-circle-content-vcard">
                                <div className="skill-icon-vcard">
                                  {renderIcon(item.icon, item.name)}
                                </div>
                                <span className="skill-pct-vcard">{level}%</span>
                              </div>
                            </div>
                            <span className="skill-name-vcard">{item.name}</span>
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
                <h2 className="section-title">{renderSplitTitle("Live Client Projects")}</h2>
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
                <h2 className="section-title">{renderSplitTitle("Personal Portfolio Projects")}</h2>
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
                <h2 className="section-title">{renderSplitTitle("Get In Touch")}</h2>
                
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
