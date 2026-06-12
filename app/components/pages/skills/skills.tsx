
import "./skills.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faHtml5, faCss3Alt, faSass, faJs, faReact, faWordpress, 
  faFigma, faGithub, faLess, faAngular, faSalesforce 
} from "@fortawesome/free-brands-svg-icons";

// Map string keys to brand icons
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

// Map custom SVG files
const customSvgMap: Record<string, string> = {
  tailwind: "/uploads/tailwind-icon.svg",
  nextjs: "/uploads/nextJs-icon.svg",
  photoshop: "/uploads/photoshop-icon.svg",
  illustrator: "/uploads/illustrator-icon.svg",
  xd: "/uploads/xd-icon.svg",
  canva: "/uploads/canva-icon.svg"
};

interface SkillItem {
  name: string;
  icon: string;
  color?: string;
}

interface SkillCategory {
  category: string;
  items: SkillItem[];
}

interface SkillsProps {
  skills: SkillCategory[];
}

export default function Skills({ skills }: SkillsProps) {
  const list = skills || [];

  const renderIcon = (icon: string, name: string) => {
    // Inline Custom SVGs to support theme-aware colors and bypass caching
    if (icon === "nextjs") {
      return (
        <svg viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="nextjs-icon" style={{ width: '100%', height: '100%' }}>
          <path fillRule="evenodd" clipRule="evenodd" d="M0 7.5C0 3.35786 3.35786 0 7.5 0C11.6421 0 15 3.35786 15 7.5C15 10.087 13.6902 12.3681 11.6975 13.7163L4.90687 4.20942C4.78053 4.03255 4.5544 3.95756 4.34741 4.02389C4.14042 4.09022 4 4.28268 4 4.50004V12H5V6.06027L10.8299 14.2221C9.82661 14.7201 8.696 15 7.5 15C3.35786 15 0 11.6421 0 7.5ZM10 10V4H11V10H10Z" fill="currentColor"/>
        </svg>
      );
    }
    
    if (icon === "tailwind") {
      return (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
          <path d="M12.0001 7.75C11.1793 7.75 10.4736 7.97153 9.91973 8.4463C9.36982 8.91765 9.01007 9.60383 8.81051 10.4591C8.76695 10.6458 8.86194 10.8371 9.03695 10.9152C9.21197 10.9934 9.41782 10.9364 9.52774 10.7794C9.78104 10.4175 10.034 10.2 10.277 10.0884C10.5123 9.98033 10.766 9.95844 11.0566 10.0363C11.3498 10.1148 11.5768 10.3449 11.9332 10.7324L11.9447 10.745C12.2133 11.0372 12.541 11.3936 12.9892 11.6701C13.4543 11.9571 14.033 12.15 14.8001 12.15C15.6209 12.15 16.3266 11.9285 16.8805 11.4537C17.4304 10.9823 17.7901 10.2962 17.9897 9.44089C18.0332 9.25418 17.9382 9.06291 17.7632 8.98476C17.5882 8.90661 17.3823 8.96358 17.2724 9.12061C17.0191 9.48247 16.7662 9.7 16.5232 9.81163C16.2878 9.9197 16.0341 9.94159 15.7436 9.86373C15.4504 9.78518 15.2234 9.55515 14.867 9.16757L14.8555 9.15505C14.5869 8.86287 14.2592 8.50645 13.811 8.22998C13.3459 7.94297 12.7672 7.75 12.0001 7.75Z" fill="#38BDF8"/>
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

    // If it's in FontAwesome map
    if (fontAwesomeMap[icon]) {
      return <FontAwesomeIcon icon={fontAwesomeMap[icon]} className="skill-icon-fa" />;
    }
    
    // Otherwise check custom SVGs or render directly if it is a url
    // Append cache-busting query parameter to force browser to reload newly updated colorful SVGs
    const srcPath = customSvgMap[icon] ? `${customSvgMap[icon]}?v=4` : `${icon}?v=4`;
    return <img src={srcPath} alt={name} className="skill-icon-img" />;
  };

  return (
    <>
      <section className="skill-section" id="skills" data-aos="fade-up">
        <div className="skills-content container">
          <h2 className="heading">Skill & Expertise</h2>
          <div className="row mt-4">
            {list.map((cat, idx) => (
              <div className="col-xl-4 col-md-6 mb-4" key={idx}>
                <div className="skill-box glass-card">
                  <h3>{cat.category}</h3>
                  <ul className="skill-list">
                    {cat.items.map((item, itemIdx) => (
                      <li key={itemIdx} style={{ 
                        "--hover-color": item.color || "#06b6d4",
                        "--icon-color": item.color || "#06b6d4"
                      } as React.CSSProperties}>
                        <div className="icon-container">
                          {renderIcon(item.icon, item.name)}
                        </div>
                        <h5>{item.name}</h5>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}