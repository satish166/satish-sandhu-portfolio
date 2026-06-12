import "./banner.scss";
import DownloadResumeButton from "../../DownloadResumeButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLinkedin, faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { faBriefcase, faProjectDiagram, faAward } from "@fortawesome/free-solid-svg-icons";

interface MainBannerProps {
  profile: any;
  socials?: any;
}

export default function MainBanner({ profile, socials }: MainBannerProps) {
  const name = profile?.name || "Satish Kumar";
  const title = profile?.title || "Frontend Developer";
  const avatarSrc = profile?.avatar || "/uploads/my-profile-img.jpg";
  const s = socials || {};

  return (
    <>
      <section className="main-banner" id="home" data-target="home">
        {/* Animated fluid mesh background overlay */}
        <div className="banner-bg-grid"></div>
        <div className="banner-glow-circle primary-glow"></div>
        <div className="banner-glow-circle secondary-glow"></div>
        
        {/* Decorative floating micro-particles */}
        <div className="floating-bubble bubble-1"></div>
        <div className="floating-bubble bubble-2"></div>
        <div className="floating-tag tag-1">&lt;Code /&gt;</div>
        <div className="floating-tag tag-2">React</div>
        <div className="floating-tag tag-3">Salesforce</div>
        <div className="floating-tag tag-4">TypeScript</div>
        
        <div className="container banner-content">
          <div className="row align-items-center">
            {/* Left Content Column */}
            <div className="col-lg-7 text-center text-lg-start" data-aos="fade-right" data-aos-delay="200">
              <div className="welcome-pill">
                <span className="welcome-pulse"></span>
                <span className="welcome-text">Senior Frontend Architect</span>
              </div>
              
              <h1 className="hero-name-main">
                {name}
              </h1>
              
              <h3 className="hero-title-sub">
                {title}
              </h3>
              
              <p className="hero-tagline">
                Specializing in building high-performance, scalable web platforms with React, Angular, Salesforce Commerce Cloud, and cutting-edge styling patterns.
              </p>

              {/* Developer stats bar */}
              <div className="developer-stats-bar mt-4 mb-4 d-flex justify-content-center justify-content-lg-start gap-3 flex-wrap">
                <div className="stat-tile glass-card">
                  <FontAwesomeIcon icon={faBriefcase} className="stat-icon orange-icon" />
                  <div className="stat-info">
                    <span className="stat-number">5+ Yrs</span>
                    <span className="stat-label">Experience</span>
                  </div>
                </div>
                <div className="stat-tile glass-card">
                  <FontAwesomeIcon icon={faProjectDiagram} className="stat-icon gold-icon" />
                  <div className="stat-info">
                    <span className="stat-number">15+</span>
                    <span className="stat-label">Projects</span>
                  </div>
                </div>
                <div className="stat-tile glass-card">
                  <FontAwesomeIcon icon={faAward} className="stat-icon green-icon" />
                  <div className="stat-info">
                    <span className="stat-number">Certified</span>
                    <span className="stat-label">Salesforce</span>
                  </div>
                </div>
              </div>
              
              {/* CTA & Social Actions Row */}
              <div className="cta-actions-row d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start gap-3">
                <DownloadResumeButton />
                
                <div className="hero-socials-group">
                  {s.linkedin && (
                    <a href={s.linkedin} target="_blank" rel="noopener noreferrer" className="social-pill-btn linkedin" title="LinkedIn">
                      <FontAwesomeIcon icon={faLinkedin} />
                      <span>LinkedIn</span>
                    </a>
                  )}
                  {s.whatsapp && (
                    <a href={s.whatsapp} target="_blank" rel="noopener noreferrer" className="social-pill-btn whatsapp" title="WhatsApp">
                      <FontAwesomeIcon icon={faWhatsapp} />
                      <span>WhatsApp</span>
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Right Avatar Column */}
            <div className="col-lg-5 d-flex justify-content-center mt-5 mt-lg-0" data-aos="fade-left" data-aos-delay="400">
              <div className="avatar-isometric-wrapper">
                <div className="isometric-glow-ring"></div>
                <div className="avatar-glass-shield"></div>
                <div className="avatar-frame-border">
                  <div className="avatar-image-inner">
                    <img src={avatarSrc} alt={name} className="hero-avatar-portrait" />
                  </div>
                </div>
                {/* Available for Hire Floating Indicator */}
                <div className="floating-status-pill">
                  <span className="pulse-dot"></span>
                  <span className="status-label">Available for Hire</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}