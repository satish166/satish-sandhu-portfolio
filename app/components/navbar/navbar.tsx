"use client";

import { useState, useEffect } from "react";
import "./navbar.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faHouse, faUser, faFile, faLaptopCode, faAddressBook, faGear, faBars, faXmark, faSun, faMoon 
} from "@fortawesome/free-solid-svg-icons";

interface NavBarProps {
  data: any;
}

export default function NavBar({ data }: NavBarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [theme, setTheme] = useState("dark");
  const profile = data?.profile || {};

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Theme Sync on Mount
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

  const menuItems = [
    { label: "Home", href: "#home", icon: faHouse },
    { label: "About", href: "#about", icon: faUser },
    { label: "Skills", href: "#skills", icon: faFile },
    { label: "Live Projects", href: "#liveprojects", icon: faLaptopCode },
    { label: "Personal Projects", href: "#personalprojects", icon: faLaptopCode },
    { label: "Contact", href: "#contactus", icon: faAddressBook }
  ];

  return (
    <>
      <nav className={`navbar-container ${scrolled ? "scrolled" : ""}`}>
        <div className="navbar-wrapper container">
          {/* Logo */}
          <a href="#home" className="nav-logo">
            <span className="gradient-text">{profile.name || "Satish Kumar"}</span>
          </a>

          {/* Desktop Menu */}
          <div className="nav-menu-desktop">
            <ul>
              {menuItems.map((item, idx) => (
                <li key={idx}>
                  <a href={item.href}>
                    <FontAwesomeIcon icon={item.icon} className="nav-icon" />
                    <span>{item.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Actions (Theme toggle & Admin link) */}
          <div className="nav-actions">
            <div 
              onClick={toggleTheme} 
              className={`theme-switch-pill ${theme}`}
              title={theme === "dark" ? "Switch to Light Theme" : "Switch to Dark Theme"}
              role="button"
              aria-label="Toggle theme mode"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') toggleTheme(); }}
            >
              <div className="switch-knob">
                <FontAwesomeIcon icon={theme === "dark" ? faMoon : faSun} />
              </div>
              <FontAwesomeIcon icon={faSun} className="switch-icon sun" />
              <FontAwesomeIcon icon={faMoon} className="switch-icon moon" />
            </div>

            <a href="/admin" className="admin-btn" title="Admin Control Panel">
              <FontAwesomeIcon icon={faGear} />
            </a>
            
            {/* Mobile Toggle Hamburger */}
            <button 
              className="mobile-toggle-btn"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle navigation menu"
            >
              <FontAwesomeIcon icon={mobileOpen ? faXmark : faBars} />
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        <div className={`nav-menu-mobile ${mobileOpen ? "open" : ""}`}>
          <ul>
            {menuItems.map((item, idx) => (
              <li key={idx}>
                <a href={item.href} onClick={() => setMobileOpen(false)}>
                  <FontAwesomeIcon icon={item.icon} className="nav-icon" />
                  <span>{item.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </>
  );
}
