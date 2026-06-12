'use client';

import React, { useRef } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./work.scss";

interface ProjectItem {
  id: string;
  name: string;
  description: string;
  image: string;
  link: string;
}

interface WorkProps {
  projects: ProjectItem[];
}

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

export default function Work({ projects }: WorkProps) {
  const list = projects || [];
  const sliderRef = useRef<Slider>(null);

  if (list.length === 0) return null;

  const settings = {
    dots: true,
    infinite: list.length > 2,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    arrows: false,
    draggable: true,
    swipe: true,
    swipeToSlide: true,
    responsive: [
      {
        breakpoint: 991,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        }
      }
    ]
  };

  return (
    <>
      <section className="work-section overflow-hidden" id="liveprojects" data-aos="fade-up">
        <div className="work-content container">
          <div className="d-flex align-items-center justify-content-between flex-wrap mb-4">
            <div>
              <h2 className="heading">Live Projects</h2>
              <h6 className="section-subheading mb-0">A showcase of production-ready web platforms that blend creativity with functionality.</h6>
            </div>
            
            {/* Carousel Controls */}
            {list.length > 2 && (
              <div className="carousel-controls-wrapper d-flex gap-2 mt-3 mt-md-0">
                <button 
                  className="ctrl-btn prev" 
                  type="button" 
                  onClick={() => sliderRef.current?.slickPrev()} 
                  aria-label="Previous slide"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ width: '16px', height: '16px' }}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>
                </button>
                <button 
                  className="ctrl-btn next" 
                  type="button" 
                  onClick={() => sliderRef.current?.slickNext()} 
                  aria-label="Next slide"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ width: '16px', height: '16px' }}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>
                </button>
              </div>
            )}
          </div>

          <div className="live-slider-container mt-4">
            <Slider ref={sliderRef} {...settings}>
              {list.map((proj) => (
                <div className="px-2 pb-3" key={proj.id}>
                  <div className="project-card-wrapper">
                    <div className="browser-mockup glass-card">
                      {/* Browser Header / Title Bar */}
                      <div className="browser-header">
                        <div className="browser-dots">
                          <span className="dot red"></span>
                          <span className="dot yellow"></span>
                          <span className="dot green"></span>
                        </div>
                        <div className="browser-address-bar">
                          {proj.link.replace("https://", "").replace("www.", "").replace(/\/$/, "")}
                        </div>
                      </div>
                      
                      {/* Browser Window Body */}
                      <div className="browser-body">
                        <div className="image-overlay-container">
                          <img src={proj.image || "/uploads/poppin.png"} alt={proj.name} className="browser-image" />
                          <div className="browser-hover-overlay">
                            <a href={proj.link} target="_blank" rel="noopener noreferrer" className="explore-btn">
                              Visit Live Site
                            </a>
                          </div>
                        </div>
                      </div>

                      {/* Project Info Section */}
                      <div className="project-details">
                        <div className="tags-container">
                          {getProjectTechTags(proj.name).map((tag, i) => (
                            <span className="tech-badge" key={i}>{tag}</span>
                          ))}
                        </div>
                        <h3 className="project-title">{proj.name}</h3>
                        <p className="project-description">{proj.description}</p>
                        <div className="action-row">
                          <a href={proj.link} target="_blank" rel="noopener noreferrer" className="live-link">
                            <span>Launch Live Site</span>
                            <svg className="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </Slider>
          </div>
        </div>
      </section>
    </>
  );
}