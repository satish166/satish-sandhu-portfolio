"use client";

import { useState } from "react";
import "./contact.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkerAlt, faPhoneAlt, faEnvelope, faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { faLinkedin, faWhatsapp } from "@fortawesome/free-brands-svg-icons";

interface ContactProps {
  profile: any;
  socials: any;
}

export default function Contact({ profile, socials }: ContactProps) {
  const p = profile || {};
  const s = socials || {};

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error" | null; message: string }>({
    type: null,
    message: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setStatus({ type: null, message: "" });

    const submissionName = formData.name;
    const submissionEmail = formData.email;
    const submissionMessage = formData.message;

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: submissionName,
          email: submissionEmail,
          message: submissionMessage
        })
      });

      const data = await res.json();

      if (res.ok) {
        setStatus({
          type: "success",
          message: data.message || "Message sent successfully!"
        });
        
        // WhatsApp Web/App redirect - wrap in try-catch to prevent popup blocker errors from failing the form submission
        try {
          const waText = encodeURIComponent(`Hi Satish,\n\nI just sent you a message through your portfolio contact form.\n\nName: ${submissionName}\nEmail: ${submissionEmail}\nMessage: ${submissionMessage}`);
          window.open(`https://wa.me/918278860269?text=${waText}`, "_blank");
        } catch (waErr) {
          console.warn("WhatsApp redirect popup was blocked or failed:", waErr);
        }

        setFormData({ name: "", email: "", message: "" });
      } else {
        setStatus({
          type: "error",
          message: data.error || "Failed to send message."
        });
      }
    } catch (err) {
      setStatus({
        type: "error",
        message: "An unexpected error occurred. Please try again."
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <section className="contact-section overflow-hidden" id="contactus">
        <div className="container contact-wrapper">
          {/* Centered Heading Layout */}
          <div className="contact-header text-center mb-5">
            <h2 className="heading">Let's Connect</h2>
            <h6 className="section-subheading mx-auto" style={{ maxWidth: '600px' }}>
              Have a project in mind, want to discuss Salesforce integrations, or just want to say hi? Reach out today!
            </h6>
          </div>

          <div className="row mt-4">
            {/* Left Contact Info Column */}
            <div className="left-section col-lg-5 mb-5 mb-lg-0">
              <div className="contact-us-details">
                <ul className="contact-info-list">
                  {p.address && (
                    <li className="list-item glass-card">
                      <div className="icon-box">
                        <FontAwesomeIcon icon={faMapMarkerAlt} />
                      </div>
                      <div className="info-text">
                        <h6>Location</h6>
                        <p>{p.address}</p>
                      </div>
                    </li>
                  )}
                  {p.phone && (
                    <li className="list-item glass-card">
                      <div className="icon-box">
                        <FontAwesomeIcon icon={faPhoneAlt} />
                      </div>
                      <div className="info-text">
                        <h6>Call Directly</h6>
                        <p><a target="_blank" href={`tel:${p.phone}`} rel="noopener noreferrer">{p.phone}</a></p>
                      </div>
                    </li>
                  )}
                  {p.email && (
                    <li className="list-item glass-card">
                      <div className="icon-box">
                        <FontAwesomeIcon icon={faEnvelope} />
                      </div>
                      <div className="info-text">
                        <h6>Email Address</h6>
                        <p><a target="_blank" href={`mailto:${p.email}`} rel="noopener noreferrer">{p.email}</a></p>
                      </div>
                    </li>
                  )}
                </ul>

                <div className="social-links-container mt-4 pt-2">
                  <h6 className="socials-label">Follow Me</h6>
                  <ul className="social-links d-flex gap-3 mt-3">
                    {s.linkedin && (
                      <li>
                        <a target="_blank" href={s.linkedin} rel="noopener noreferrer" className="linkedin" title="LinkedIn">
                          <FontAwesomeIcon icon={faLinkedin} />
                        </a>
                      </li>
                    )}
                    {s.whatsapp && (
                      <li>
                        <a target="_blank" href={s.whatsapp} rel="noopener noreferrer" className="whatsapp" title="WhatsApp">
                          <FontAwesomeIcon icon={faWhatsapp} />
                        </a>
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
            
            {/* Right Contact Form Column */}
            <div className="right-section col-lg-7">
              <div className="get-in-touch glass-card">
                <h4 className="form-card-title mb-4">Send a Message</h4>
                
                {status.type && (
                  <div className={`status-alert ${status.type}`}>
                    {status.message}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="contact-form">
                  <div className="field">
                    <label htmlFor="name">Name</label>
                    <input 
                      type="text" 
                      id="name" 
                      placeholder="Enter Your Name" 
                      value={formData.name}
                      onChange={handleChange}
                      required 
                    />
                  </div>
                  
                  <div className="field">
                    <label htmlFor="email">Email</label>
                    <input 
                      type="email" 
                      id="email" 
                      placeholder="Enter Your Email" 
                      value={formData.email}
                      onChange={handleChange}
                      required 
                    />
                  </div>
                  
                  <div className="field">
                    <label htmlFor="message">Message</label>
                    <textarea 
                      id="message" 
                      placeholder="Enter Message" 
                      rows={4} 
                      value={formData.message}
                      onChange={handleChange}
                      required
                    ></textarea>
                  </div>
                  
                  <div className="field mt-4">
                    <button 
                      type="submit" 
                      className="send-message-btn button-primary"
                      disabled={sending}
                    >
                      {sending ? "Sending..." : (
                        <>
                          <span>Send Message</span>
                          <FontAwesomeIcon icon={faPaperPlane} className="btn-icon" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}