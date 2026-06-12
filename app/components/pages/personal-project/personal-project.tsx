'use client';

import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./personal-project.scss";

interface PersonalProjectItem {
  id: string;
  name: string;
  description: string;
  image: string;
  link: string;
  btnText: string;
}

interface PersonalProjectProps {
  projects: PersonalProjectItem[];
}

export default function PersonalProject({ projects }: PersonalProjectProps) {
  const items = projects || [];
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (items.length === 0) return null;

  const settings = {
    dots: true,
    infinite: items.length > 2,
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

  // SSR / Hydration Fallback to prevent layout shifts & resolve Slick Slider responsiveness issues on actual devices
  if (!mounted) {
    return (
      <section className="personal-section" id="personalprojects" data-target="personalprojects">
        <div className="work-content container">
          <h2 className="heading">Personal Projects</h2>
          <h6 className="section-subheading">A showcase of passion projects that combine aesthetic design with interactive features.</h6>
          
          <div className="row g-4 mt-4">
            {items.map((item) => (
              <div className="col-12 col-lg-6 px-2 pb-3" key={item.id}>
                <article className="personal-card glass-card d-flex flex-column w-100">
                  <a className="visit-site-link" href={item.link} target="_blank" rel="noopener noreferrer">
                    <div className="image-wrapper">
                      <img src={item.image} alt={item.name} className="project-image" />
                      <div className="hover-action">
                        <span className="btn-visit">{item.btnText || "Visit Site"}</span>
                      </div>
                    </div>
                  </a>
                  <div className="about-project d-flex flex-column flex-grow-1">
                    <h4 className="project-title-text">{item.name}</h4>
                    <p className="project-desc">{item.description}</p>
                    <div className="action-row mt-auto pt-3">
                      <a href={item.link} target="_blank" rel="noopener noreferrer" className="live-link">
                        <span>{item.btnText || "Visit Project"}</span>
                        <svg className="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{ width: '16px', height: '16px', transition: 'transform 0.3s ease' }}>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </article>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="personal-section" id="personalprojects" data-target="personalprojects">
        <div className="work-content container">
          <h2 className="heading">Personal Projects</h2>
          <h6 className="section-subheading">A showcase of passion projects that combine aesthetic design with interactive features.</h6>
          
          <div className="personal-slider-container mt-4">
            <Slider {...settings}>
              {items.map((item) => (
                <div className="px-2 pb-3" key={item.id}>
                  <article className="personal-card glass-card d-flex flex-column w-100">
                    <a className="visit-site-link" href={item.link} target="_blank" rel="noopener noreferrer">
                      <div className="image-wrapper">
                        <img src={item.image} alt={item.name} className="project-image" />
                        <div className="hover-action">
                          <span className="btn-visit">{item.btnText || "Visit Site"}</span>
                        </div>
                      </div>
                    </a>
                    <div className="about-project d-flex flex-column flex-grow-1">
                      <h4 className="project-title-text">{item.name}</h4>
                      <p className="project-desc">{item.description}</p>
                      <div className="action-row mt-auto pt-3">
                        <a href={item.link} target="_blank" rel="noopener noreferrer" className="live-link">
                          <span>{item.btnText || "Visit Project"}</span>
                          <svg className="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{ width: '16px', height: '16px', transition: 'transform 0.3s ease' }}>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </a>
                      </div>
                    </div>
                  </article>
                </div>
              ))}
            </Slider>
          </div>
        </div>
      </section>
    </>
  );
}