'use client';

import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faCalendarAlt, faPhone, faEnvelope, faGraduationCap, faMapMarkerAlt, faUserClock 
} from "@fortawesome/free-solid-svg-icons";
import "./about.scss";

interface AboutProps {
  profile: any;
}

export default function About({ profile }: AboutProps) {
  const p = profile || {};
  const avatarSrc = p.avatar || "/uploads/my-profile-img.jpg";

  return (
    <>
      <section className="about-section overflow-hidden" id="about">
        <div className="container">
          <div className="about-content">
            <h2 className="heading">About Me</h2>
            <h6 className="about-bio">
              {p.about || "I am a Frontend Developer with experience in building high-performance, user-centric web applications."}
            </h6>
          </div>
          <div className="personal-info">
            <div className="row align-items-center">
              {/* Profile Image Wrapper Column */}
              <div className="col-lg-4">
                <div className="about-image-wrapper">
                  <div className="image-border-glow"></div>
                  <div className="about-image">
                    <img src={avatarSrc} alt={p.name || "Profile Picture"} className="w-full h-auto" />
                  </div>
                </div>
              </div>
              
              {/* Personal Details Dashboard Tiles Column */}
              <div className="col-lg-8">
                <h3 className="about-subtitle">{p.subtitle || "UI/UX Designer & Web Developer"}</h3>
                
                <div className="personal-details-grid mt-4">
                  {p.birthday && (
                    <div className="detail-card glass-card">
                      <div className="detail-icon">
                        <FontAwesomeIcon icon={faCalendarAlt} />
                      </div>
                      <div className="detail-info">
                        <span className="detail-title">Birthday</span>
                        <span className="detail-text">{p.birthday}</span>
                      </div>
                    </div>
                  )}
                  {p.phone && (
                    <div className="detail-card glass-card">
                      <div className="detail-icon">
                        <FontAwesomeIcon icon={faPhone} />
                      </div>
                      <div className="detail-info">
                        <span className="detail-title">Phone</span>
                        <span className="detail-text">
                          <a href={`tel:${p.phone}`}>{p.phone}</a>
                        </span>
                      </div>
                    </div>
                  )}
                  {p.age && (
                    <div className="detail-card glass-card">
                      <div className="detail-icon">
                        <FontAwesomeIcon icon={faUserClock} />
                      </div>
                      <div className="detail-info">
                        <span className="detail-title">Age</span>
                        <span className="detail-text">{p.age}</span>
                      </div>
                    </div>
                  )}
                  {p.email && (
                    <div className="detail-card glass-card">
                      <div className="detail-icon">
                        <FontAwesomeIcon icon={faEnvelope} />
                      </div>
                      <div className="detail-info">
                        <span className="detail-title">Email</span>
                        <span className="detail-text">
                          <a href={`mailto:${p.email}`}>{p.email}</a>
                        </span>
                      </div>
                    </div>
                  )}
                  {p.degree && (
                    <div className="detail-card glass-card">
                      <div className="detail-icon">
                        <FontAwesomeIcon icon={faGraduationCap} />
                      </div>
                      <div className="detail-info">
                        <span className="detail-title">Degree</span>
                        <span className="detail-text">{p.degree}</span>
                      </div>
                    </div>
                  )}
                  {p.address && (
                    <div className="detail-card glass-card">
                      <div className="detail-icon">
                        <FontAwesomeIcon icon={faMapMarkerAlt} />
                      </div>
                      <div className="detail-info">
                        <span className="detail-title">Location</span>
                        <span className="detail-text">{p.address}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}