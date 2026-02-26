'use client';

import React, { useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";

import "./personal-project.scss";

import starfurniture from "../../../assets/images/star-furniture.png";
import kimball from "../../../assets/images/kimball.png";
import poppin from "../../../assets/images/poppin.png";
import LearningImage from "../../../assets/images/e-learning-image.png";
import gymBanner from "../../../assets/images/gym-project-banner.png";
import WeddingInvitation from "../../../assets/images/wedding-pic.png";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Slider = dynamic(() => import("react-slick"), { ssr: false });

export default function PersonalProject() {
  const sliderRef = useRef<any>(null);
  const [active, setActive] = useState(0);

  const items = useMemo(
    () => [
      {
        id: 1,
        projectName: "Gym Fitness",
        image: gymBanner,
        btnText: "Visit Gym Fitness",
        btnAction: "https://gym-project-six-theta.vercel.app/",
        paragraph:
          "Gym fitness is a modern lifestyle movement focused on empowering individuals to build stronger, healthier, and more confident versions of themselves. Whether it’s lifting weights, running on a treadmill, or practicing functional workouts, gym fitness aims to transform routines into energizing experiences that help people push limits, improve well‑being, and feel their best both inside and outside the gym. ",
      },
      {
        id: 2,
        projectName: "E-Learning Platform",
        image: LearningImage,
        btnText: "Visit E-Learning Platform",
        btnAction: "https://e-learning-sk.vercel.app/",
        paragraph:
          "An e-learning platform designed to provide accessible and engaging educational content for learners of all levels. The platform features interactive courses, progress tracking, and a user-friendly interface that makes learning enjoyable and effective. The platform features interactive courses, progress tracking, and a user-friendly interface that makes learning enjoyable and effective.",
      },
      {
        id: 3,
        projectName: "Wedding Invitation",
        image: WeddingInvitation,
        btnText: "Visit Wedding Invitation",
        btnAction: "https://wedding-invitation-flax-omega.vercel.app/",
        paragraph:
          "A joyful occasion designed to honor love, unity, and the beginning of a beautiful journey together. The celebration includes heartfelt rituals, shared laughter, and an inviting ambience that makes every moment memorable, uplifting, and filled with blessings for all who join us on this special day.",
      }
     
    ],
    []
  );

  // Keep center mode nice with an odd number, but clamp to item count
  const slidesToShow = Math.min(3, items.length);

  const settings = {
    dots: false,                 // you’re rendering custom dots below
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    centerMode: true,
    centerPadding: "0px",
    beforeChange: (_: number, next: number) => setActive(next % items.length),
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: Math.min(3, items.length), centerPadding: "16px" } },
      { breakpoint: 768, settings: { slidesToShow: 1, centerPadding: "48px" } },
    ],
  };

  const goTo = (index: number) => {
    sliderRef.current?.slickGoTo(index);
  };

  return (
    <>
      <section className="personal-section" id="personalprojects" data-aos="fade-up">
        <div className="work-content container">
          <h2 className="heading">Personal Project</h2>
          <h6 className="">A showcase of projects that blend creativity with functionality.</h6>
          <div className="row">
            <div className="col-12">
              <div className="">
                <div className="slider-container">
                  <Slider ref={sliderRef} {...(settings as any)}>
                    {items.map((item, idx) => {
                      const isActive = idx === active;
                      return (
                        <div key={item.id}>
                          <article className={`slide-card ${isActive ? "is-active" : ""}`}>
                            <div className="work-box">
                              <a className="visit-site" href={item.btnAction} target="_blank">
                                <Image src={item.image} alt={item.projectName} className="h-auto" />
                                <div className="visit-text">
                                  <p>{item.btnText}</p>
                                </div>
                              </a>
                              <div className="about-project" >
                                <h4>{item.projectName}</h4>
                                <p>{item.paragraph}</p>
                                <a href={item.btnAction} target="_blank" className="button button-outline-primary my-2">{item.btnText}</a>
                              </div>

                            </div>
                          </article>
                        </div>
                      );
                    })}
                  </Slider>

                  {/* Custom dots: exactly one per item */}
                  <div className="dots">
                    {items.map((_, i) => (
                      <button
                        key={i}
                        className={`dot ${i === active ? "active" : ""}`}
                        onClick={() => goTo(i)}
                        aria-label={`Go to slide ${i + 1}`}
                      />
                    ))}
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