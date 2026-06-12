"use client";

import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faArrowLeft, faSave, faPlus, faTrash, faEdit, 
  faUser, faTools, faBriefcase, faProjectDiagram, faUpload, faLock, faEnvelope, faHistory, faSignOutAlt
} from "@fortawesome/free-solid-svg-icons";

export default function AdminPanel() {
  const [authorized, setAuthorized] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [portfolioData, setPortfolioData] = useState<any>(null);
  const [originalData, setOriginalData] = useState<any>(null);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string>("");
  const [smtpHost, setSmtpHost] = useState("");
  const [smtpPort, setSmtpPort] = useState("465");
  const [smtpUser, setSmtpUser] = useState("");
  const [smtpPass, setSmtpPass] = useState("");
  const [smtpReceiver, setSmtpReceiver] = useState("sandhusatish166@gmail.com");
  const [activeTab, setActiveTab] = useState("profile");
  const [messages, setMessages] = useState<any[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [activityLogs, setActivityLogs] = useState<any[]>([]);
  const [loadingActivity, setLoadingActivity] = useState(false);

  const fetchActivityLogs = async () => {
    setLoadingActivity(true);
    try {
      const res = await fetch("/api/portfolio?activity=true");
      if (res.ok) {
        const logs = await res.json();
        setActivityLogs(logs);
      }
    } catch (err) {
      console.error("Failed to load activity logs:", err);
    } finally {
      setLoadingActivity(false);
    }
  };

  const discardChanges = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/portfolio");
      if (res.ok) {
        const data = await res.json();
        setPortfolioData(data);
        setOriginalData(JSON.parse(JSON.stringify(data)));
        setSaveSuccessMsg("");
        await fetchSmtpConfig();
        alert("All changes discarded. Reverted to last saved state.");
      } else {
        alert("Failed to reload data from server.");
      }
    } catch (err) {
      alert("Error reloading data: " + String(err));
    } finally {
      setSaving(false);
    }
  };

  const fetchMessages = async () => {
    setLoadingMessages(true);
    try {
      const res = await fetch("/api/contact", {
        headers: {
          "x-admin-password": passcode
        }
      });
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      }
    } catch (err) {
      console.error("Failed to load messages", err);
    } finally {
      setLoadingMessages(false);
    }
  };

  const fetchSmtpConfig = async (pass?: string) => {
    try {
      const res = await fetch("/api/auth", {
        headers: {
          "x-admin-password": pass || passcode
        }
      });
      if (res.ok) {
        const config = await res.json();
        setSmtpHost(config.smtpHost || "");
        setSmtpPort(config.smtpPort || "465");
        setSmtpUser(config.smtpUser || "");
        setSmtpPass(config.smtpPass || "");
        setSmtpReceiver(config.smtpReceiver || "sandhusatish166@gmail.com");
      }
    } catch (err) {
      console.error("Failed to load SMTP config:", err);
    }
  };

  const handleSaveSmtp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/auth", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-admin-password": passcode
        },
        body: JSON.stringify({
          smtpHost,
          smtpPort,
          smtpUser,
          smtpPass,
          smtpReceiver
        })
      });
      if (res.ok) {
        alert("SMTP Settings updated successfully!");
      } else {
        alert("Failed to update SMTP Settings.");
      }
    } catch (err) {
      alert("Error saving SMTP Settings.");
    }
  };

  const deleteMessage = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this message?")) return;
    const activePass = localStorage.getItem("portfolio_admin_pass") || passcode;
    try {
      const res = await fetch(`/api/contact?id=${id}`, {
        method: "DELETE",
        headers: {
          "x-admin-password": activePass
        }
      });
      if (res.ok) {
        setMessages(messages.filter((m) => m.id !== id));
      } else {
        const data = await res.json();
        alert("Failed to delete message: " + (data.error || "Unknown error"));
      }
    } catch (err) {
      alert("Error deleting message: " + String(err));
    }
  };

  useEffect(() => {
    if (authorized && passcode) {
      fetchMessages();
      fetchSmtpConfig();
      fetchActivityLogs();
    }
  }, [authorized]);

  useEffect(() => {
    if (authorized) {
      if (activeTab === "messages") {
        fetchMessages();
      } else if (activeTab === "activity") {
        fetchActivityLogs();
      }
    }
  }, [activeTab]);

  // Load passcode from localStorage on mount
  useEffect(() => {
    const savedPass = localStorage.getItem("portfolio_admin_pass");
    if (savedPass) {
      setPasscode(savedPass);
      verifyAndLoad(savedPass);
    } else {
      setLoading(false);
    }
  }, []);

  const verifyAndLoad = async (pass: string) => {
    setLoading(true);
    try {
      const authRes = await fetch("/api/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ password: pass })
      });

      if (authRes.ok) {
        const res = await fetch("/api/portfolio");
        if (res.ok) {
          const data = await res.json();
          setPortfolioData(data);
          setOriginalData(JSON.parse(JSON.stringify(data)));
          setPasscode(pass); // Update passcode state to keep in sync
          setAuthorized(true);
          fetchSmtpConfig(pass);
          localStorage.setItem("portfolio_admin_pass", pass);
          setErrorMsg("");
        } else {
          setErrorMsg("Failed to load portfolio details.");
        }
      } else {
        setErrorMsg("Incorrect passcode.");
        localStorage.removeItem("portfolio_admin_pass");
      }
    } catch (err) {
      setErrorMsg("Failed to connect to API.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passcode) return;
    verifyAndLoad(passcode);
  };

  const handleLogout = () => {
    localStorage.removeItem("portfolio_admin_pass");
    setAuthorized(false);
    setPasscode("");
  };

  const handleResetPassword = async () => {
    if (!window.confirm("Are you sure you want to reset the passcode to the default 'Sandhu@123'?")) return;
    try {
      const res = await fetch("/api/auth", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ reset: true })
      });
      if (res.ok) {
        alert("Passcode has been reset to default: Sandhu@123. You can now login using the default passcode.");
        setPasscode("Sandhu@123");
        setErrorMsg("");
      } else {
        alert("Failed to reset passcode.");
      }
    } catch (err) {
      alert("Error resetting passcode.");
    }
  };

  const handleProfileChange = (key: string, value: string) => {
    setPortfolioData({
      ...portfolioData,
      profile: {
        ...portfolioData.profile,
        [key]: value
      }
    });
  };

  const handleSocialsChange = (key: string, value: string) => {
    setPortfolioData({
      ...portfolioData,
      socials: {
        ...portfolioData.socials,
        [key]: value
      }
    });
  };

  // Image Upload handler
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, callback: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: {
          "x-admin-password": passcode
        },
        body: formData
      });
      if (res.ok) {
        const result = await res.json();
        callback(result.url);
        alert("Image uploaded successfully!");
      } else {
        const err = await res.json();
        alert("Upload failed: " + err.error);
      }
    } catch (err) {
      alert("Error uploading file.");
    }
  };

  // Add Project
  const addProject = (type: "live" | "personal") => {
    const newId = String(Date.now());
    if (type === "live") {
      const current = portfolioData.liveProjects || [];
      const updated = [...current, {
        id: newId,
        name: "New Live Project",
        description: "Project Description",
        image: "/uploads/star-furniture.png",
        link: "https://example.com"
      }];
      setPortfolioData({ ...portfolioData, liveProjects: updated });
    } else {
      const current = portfolioData.personalProjects || [];
      const updated = [...current, {
        id: newId,
        name: "New Personal Project",
        description: "Project Description",
        image: "/uploads/gym-project-banner.png",
        link: "https://example.com",
        btnText: "Visit Site"
      }];
      setPortfolioData({ ...portfolioData, personalProjects: updated });
    }
  };

  // Remove Project
  const removeProject = (type: "live" | "personal", id: string) => {
    if (type === "live") {
      const current = portfolioData?.liveProjects || [];
      const updated = current.filter((p: any) => String(p.id) !== String(id));
      setPortfolioData({ ...portfolioData, liveProjects: updated });
    } else {
      const current = portfolioData?.personalProjects || [];
      const updated = current.filter((p: any) => String(p.id) !== String(id));
      setPortfolioData({ ...portfolioData, personalProjects: updated });
    }
  };

  // Update Project field
  const updateProjectField = (type: "live" | "personal", id: string, key: string, value: string) => {
    if (type === "live") {
      const updated = portfolioData.liveProjects.map((p: any) => {
        if (p.id === id) return { ...p, [key]: value };
        return p;
      });
      setPortfolioData({ ...portfolioData, liveProjects: updated });
    } else {
      const updated = portfolioData.personalProjects.map((p: any) => {
        if (p.id === id) return { ...p, [key]: value };
        return p;
      });
      setPortfolioData({ ...portfolioData, personalProjects: updated });
    }
  };

  // Skills handlers
  const updateSkillCategoryName = (catIdx: number, name: string) => {
    const updated = [...portfolioData.skills];
    updated[catIdx].category = name;
    setPortfolioData({ ...portfolioData, skills: updated });
  };

  const addSkillCategory = () => {
    const updated = [...(portfolioData.skills || []), { category: "New Category", items: [] }];
    setPortfolioData({ ...portfolioData, skills: updated });
  };

  const removeSkillCategory = (catIdx: number) => {
    if (!window.confirm("Delete this entire skill category?")) return;
    const updated = portfolioData.skills.filter((_: any, i: number) => i !== catIdx);
    setPortfolioData({ ...portfolioData, skills: updated });
  };

  const addSkillItem = (catIdx: number) => {
    const updated = [...portfolioData.skills];
    updated[catIdx].items.push({ name: "New Skill", icon: "faReact", color: "#61dafb" });
    setPortfolioData({ ...portfolioData, skills: updated });
  };

  const removeSkillItem = (catIdx: number, itemIdx: number) => {
    const updated = [...portfolioData.skills];
    updated[catIdx].items = updated[catIdx].items.filter((_: any, i: number) => i !== itemIdx);
    setPortfolioData({ ...portfolioData, skills: updated });
  };

  const updateSkillItemField = (catIdx: number, itemIdx: number, key: string, value: string) => {
    const updated = [...portfolioData.skills];
    updated[catIdx].items[itemIdx][key] = value;
    setPortfolioData({ ...portfolioData, skills: updated });
  };

  const getPendingChanges = () => {
    if (!originalData || !portfolioData) return [];
    const changes: string[] = [];

    // Compare Profile
    const origProfile = originalData.profile || {};
    const currProfile = portfolioData.profile || {};
    const profileKeys = Array.from(new Set([...Object.keys(origProfile), ...Object.keys(currProfile)]));
    profileKeys.forEach((key) => {
      if (typeof origProfile[key] !== "object" && origProfile[key] !== currProfile[key]) {
        changes.push(`Profile [${key}]: "${origProfile[key] || ""}" ➔ "${currProfile[key] || ""}"`);
      }
    });

    // Compare Socials
    const origSocials = originalData.socials || {};
    const currSocials = portfolioData.socials || {};
    const socialsKeys = Array.from(new Set([...Object.keys(origSocials), ...Object.keys(currSocials)]));
    socialsKeys.forEach((key) => {
      if (origSocials[key] !== currSocials[key]) {
        changes.push(`Socials [${key}]: "${origSocials[key] || ""}" ➔ "${currSocials[key] || ""}"`);
      }
    });

    // Compare Skills
    const origSkills = originalData.skills || [];
    const currSkills = portfolioData.skills || [];
    const maxSkillsLen = Math.max(origSkills.length, currSkills.length);
    for (let i = 0; i < maxSkillsLen; i++) {
      const origCat = origSkills[i];
      const currCat = currSkills[i];
      if (!origCat && currCat) {
        changes.push(`Skills Category: Added "${currCat.category}"`);
      } else if (origCat && !currCat) {
        changes.push(`Skills Category: Removed "${origCat.category}"`);
      } else if (origCat && currCat) {
        if (origCat.category !== currCat.category) {
          changes.push(`Skills Category: Renamed "${origCat.category}" ➔ "${currCat.category}"`);
        }
        // Compare items
        const origItems = origCat.items || [];
        const currItems = currCat.items || [];
        const maxItemsLen = Math.max(origItems.length, currItems.length);
        for (let j = 0; j < maxItemsLen; j++) {
          const origItem = origItems[j];
          const currItem = currItems[j];
          if (!origItem && currItem) {
            changes.push(`Skill [${currCat.category}]: Added "${currItem.name}"`);
          } else if (origItem && !currItem) {
            changes.push(`Skill [${currCat.category}]: Removed "${origItem.name}"`);
          } else if (origItem && currItem && JSON.stringify(origItem) !== JSON.stringify(currItem)) {
            changes.push(`Skill [${currCat.category}]: Modified "${origItem.name || currItem.name}"`);
          }
        }
      }
    }

    // Compare Live Projects
    const origLive = originalData.liveProjects || [];
    const currLive = portfolioData.liveProjects || [];
    const origLiveMap = new Map<string, any>(origLive.map((p: any) => [String(p.id), p]));
    const currLiveMap = new Map<string, any>(currLive.map((p: any) => [String(p.id), p]));

    // Check for removed or modified live projects
    origLiveMap.forEach((p1, id) => {
      const p2 = currLiveMap.get(id);
      if (!p2) {
        changes.push(`Live Project: Removed "${p1.name || "Untitled"}"`);
      } else if (JSON.stringify(p1) !== JSON.stringify(p2)) {
        const fields: string[] = [];
        if (p1.name !== p2.name) fields.push(`Name changed to "${p2.name}"`);
        if (p1.description !== p2.description) fields.push("Description modified");
        if (p1.link !== p2.link) fields.push("Link modified");
        if (p1.image !== p2.image) fields.push("Image modified");
        const details = fields.length > 0 ? `: ${fields.join(", ")}` : " details modified";
        changes.push(`Live Project [${p1.name || "Untitled"}]${details}`);
      }
    });

    // Check for added live projects
    currLiveMap.forEach((p2, id) => {
      if (!origLiveMap.has(id)) {
        changes.push(`Live Project: Added "${p2.name || "Untitled"}"`);
      }
    });

    // Compare Personal Projects
    const origPersonal = originalData.personalProjects || [];
    const currPersonal = portfolioData.personalProjects || [];
    const origPersonalMap = new Map<string, any>(origPersonal.map((p: any) => [String(p.id), p]));
    const currPersonalMap = new Map<string, any>(currPersonal.map((p: any) => [String(p.id), p]));

    // Check for removed or modified personal projects
    origPersonalMap.forEach((p1, id) => {
      const p2 = currPersonalMap.get(id);
      if (!p2) {
        changes.push(`Personal Project: Removed "${p1.name || "Untitled"}"`);
      } else if (JSON.stringify(p1) !== JSON.stringify(p2)) {
        const fields: string[] = [];
        if (p1.name !== p2.name) fields.push(`Name changed to "${p2.name}"`);
        if (p1.description !== p2.description) fields.push("Description modified");
        if (p1.link !== p2.link) fields.push("Link modified");
        if (p1.image !== p2.image) fields.push("Image modified");
        if (p1.btnText !== p2.btnText) fields.push("Button Text modified");
        const details = fields.length > 0 ? `: ${fields.join(", ")}` : " details modified";
        changes.push(`Personal Project [${p1.name || "Untitled"}]${details}`);
      }
    });

    // Check for added personal projects
    currPersonalMap.forEach((p2, id) => {
      if (!origPersonalMap.has(id)) {
        changes.push(`Personal Project: Added "${p2.name || "Untitled"}"`);
      }
    });

    return changes;
  };

  // Save changes to local disk via API
  const saveAllChanges = async () => {
    const changes = getPendingChanges();
    if (changes.length === 0) {
      alert("No changes detected to save.");
      return;
    }

    setSaving(true);
    setSaveSuccessMsg("");
    try {
      const res = await fetch("/api/portfolio", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-password": passcode
        },
        body: JSON.stringify(portfolioData)
      });
      if (res.ok) {
        setOriginalData(JSON.parse(JSON.stringify(portfolioData)));
        setSaveSuccessMsg(changes.join("\n"));
        fetchActivityLogs();
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        const err = await res.json();
        alert("Failed to save: " + err.error);
      }
    } catch (err) {
      alert("Error saving portfolio details.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-loading-screen">
        <div className="spinner"></div>
        <p>Verifying credentials...</p>
        <style jsx>{`
          .admin-loading-screen {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            background: #070a13;
            color: #06b6d4;
            font-family: sans-serif;
          }
          .spinner {
            border: 4px solid rgba(6, 182, 212, 0.1);
            width: 50px;
            height: 50px;
            border-radius: 50%;
            border-left-color: #06b6d4;
            animation: spin 1s linear infinite;
            margin-bottom: 20px;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (!authorized) {
    return (
      <div className="admin-login-screen">
        <div className="login-box glass-card">
          <div className="lock-icon">
            <FontAwesomeIcon icon={faLock} />
          </div>
          <h2>Admin Access</h2>
          <p>Please enter the portfolio passcode to edit your details.</p>
          <form onSubmit={handleLogin}>
            <input 
              type="password" 
              placeholder="Passcode" 
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              required
            />
            {errorMsg && <p className="error-message">{errorMsg}</p>}
            <button type="submit" className="button button-primary w-full mt-3">
              Unlock Panel
            </button>
            <button 
              type="button" 
              className="btn btn-link btn-sm text-muted mt-3 d-block mx-auto"
              style={{ fontSize: "12px", color: "#9ca3af", textDecoration: "none", border: "none", background: "transparent" }}
              onClick={handleResetPassword}
            >
              Forgot Passcode? Reset to Default
            </button>
          </form>
          <div className="mt-4 text-center">
            <a href="/" className="back-link">
              <FontAwesomeIcon icon={faArrowLeft} /> Back to Portfolio
            </a>
          </div>
        </div>
        <style jsx>{`
          .admin-login-screen {
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            background: #070a13;
            font-family: 'Inter', sans-serif;
            color: #f3f4f6;
            padding: 20px;
          }
          .login-box {
            max-width: 400px;
            width: 100%;
            text-align: center;
            background: rgba(13, 18, 30, 0.75);
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 16px;
            padding: 40px 30px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.5);
            backdrop-filter: blur(12px);
          }
          .lock-icon {
            font-size: 48px;
            color: #06b6d4;
            margin-bottom: 20px;
          }
          h2 {
            font-size: 24px;
            font-weight: 700;
            margin-bottom: 8px;
          }
          p {
            color: #9ca3af;
            font-size: 14px;
            margin-bottom: 24px;
          }
          input {
            width: 100%;
            padding: 12px 16px;
            background: rgba(255,255,255,0.03);
            border: 1px solid rgba(255,255,255,0.08);
            border-radius: 10px;
            color: white;
            text-align: center;
            margin-bottom: 12px;
            outline: none;
            transition: all 0.3s;
          }
          input:focus {
            border-color: #06b6d4;
            box-shadow: 0 0 10px rgba(6,182,212,0.2);
          }
          .error-message {
            color: #ef4444;
            margin-bottom: 12px;
            font-size: 13px;
          }
          .back-link {
            color: #06b6d4;
            text-decoration: none;
            font-size: 14px;
            font-weight: 500;
            display: inline-flex;
            align-items: center;
            gap: 8px;
          }
          .back-link:hover {
            color: #8b5cf6;
          }
        `}</style>
      </div>
    );
  }

  const pendingList = getPendingChanges();

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <div className="header-info">
          <h1>Admin Dashboard</h1>
          <p>Modify your portfolio info dynamically.</p>
        </div>
        <div className="header-actions">
          <a href="/" className="button button-outline-primary me-3">
            <FontAwesomeIcon icon={faArrowLeft} /> View Site
          </a>
          {pendingList.length > 0 && (
            <button 
              onClick={discardChanges} 
              className="button button-outline-warning me-3"
            >
              Discard Changes
            </button>
          )}
          <button 
            onClick={saveAllChanges} 
            className="button button-primary me-3"
            disabled={saving}
          >
            <FontAwesomeIcon icon={faSave} /> {saving ? "Saving..." : "Save Changes"}
          </button>
          <button onClick={handleLogout} className="button button-outline-danger">
            <FontAwesomeIcon icon={faSignOutAlt} /> Logout
          </button>
        </div>
      </div>

      {saveSuccessMsg && (
        <div className="alert alert-success mx-0 my-3 p-4 glass-card border-success-glow shadow-success-glow animate-fade-in" style={{ borderColor: 'rgba(40, 167, 69, 0.4)', background: 'rgba(20, 30, 24, 0.85)', borderRadius: '12px' }}>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="mb-0 text-success" style={{ fontWeight: '700' }}>✔ Portfolio Saved Successfully!</h5>
            <button className="btn-close btn-close-white" onClick={() => setSaveSuccessMsg("")} style={{ filter: 'invert(1)', opacity: 0.8 }}></button>
          </div>
          <p className="mb-2 text-muted" style={{ fontSize: '13px' }}>The following changes have been permanently saved:</p>
          <ul className="mb-0 ps-3" style={{ color: '#e5e7eb', fontSize: '14px', lineHeight: '1.6' }}>
            {saveSuccessMsg.split("\n").map((ch, idx) => (
              <li key={idx} style={{ marginBottom: '4px' }}>{ch}</li>
            ))}
          </ul>
        </div>
      )}

      {pendingList.length > 0 && (
        <div className="alert alert-warning mx-0 my-3 p-4 glass-card border-warning-glow animate-fade-in" style={{ borderColor: 'rgba(255, 193, 7, 0.3)', background: 'rgba(30, 26, 20, 0.85)', borderRadius: '12px' }}>
          <h5 className="mb-2 text-warning" style={{ fontWeight: '700' }}>⚠ Unsaved Changes Detected</h5>
          <p className="mb-2 text-muted" style={{ fontSize: '13px' }}>You have modified the following details. Click "Save Changes" at the top to apply them to your live website.</p>
          <ul className="mb-0 ps-3" style={{ color: '#f3f4f6', fontSize: '13px', lineHeight: '1.5' }}>
            {pendingList.map((ch, idx) => (
              <li key={idx} style={{ marginBottom: '2px' }}>{ch}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="row mt-4">
        {/* Navigation Tabs */}
        <div className="col-lg-3 mb-4">
          <div className="dashboard-tabs glass-card">
            <button 
              className={`tab-btn ${activeTab === "profile" ? "active" : ""}`}
              onClick={() => setActiveTab("profile")}
            >
              <FontAwesomeIcon icon={faUser} /> Profile Info
            </button>
            <button 
              className={`tab-btn ${activeTab === "skills" ? "active" : ""}`}
              onClick={() => setActiveTab("skills")}
            >
              <FontAwesomeIcon icon={faTools} /> Skills Manager
            </button>
            <button 
              className={`tab-btn ${activeTab === "live" ? "active" : ""}`}
              onClick={() => setActiveTab("live")}
            >
              <FontAwesomeIcon icon={faBriefcase} /> Live Projects
            </button>
            <button 
              className={`tab-btn ${activeTab === "personal" ? "active" : ""}`}
              onClick={() => setActiveTab("personal")}
            >
              <FontAwesomeIcon icon={faProjectDiagram} /> Personal Projects
            </button>
            <button 
              className={`tab-btn ${activeTab === "messages" ? "active" : ""}`}
              onClick={() => setActiveTab("messages")}
            >
              <FontAwesomeIcon icon={faEnvelope} /> Inbox Messages
            </button>
            <button 
              className={`tab-btn ${activeTab === "activity" ? "active" : ""}`}
              onClick={() => setActiveTab("activity")}
            >
              <FontAwesomeIcon icon={faHistory} /> Activity Audit Log
            </button>
            <button 
              className={`tab-btn ${activeTab === "security" ? "active" : ""}`}
              onClick={() => setActiveTab("security")}
            >
              <FontAwesomeIcon icon={faLock} /> Security Settings
            </button>
          </div>
        </div>

        {/* Tab Content Panel */}
        <div className="col-lg-9">
          <div className="dashboard-content glass-card">
            {/* PROFILE TAB */}
            {activeTab === "profile" && (
              <div>
                <h3 className="tab-title">Profile & Details</h3>
                <div className="row mt-4">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Full Name</label>
                    <input 
                      type="text" 
                      className="form-control"
                      value={portfolioData.profile?.name || ""}
                      onChange={(e) => handleProfileChange("name", e.target.value)}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Title</label>
                    <input 
                      type="text" 
                      className="form-control"
                      value={portfolioData.profile?.title || ""}
                      onChange={(e) => handleProfileChange("title", e.target.value)}
                    />
                  </div>
                  <div className="col-12 mb-3">
                    <label className="form-label">Biographical Info (About)</label>
                    <textarea 
                      className="form-control"
                      rows={4}
                      value={portfolioData.profile?.about || ""}
                      onChange={(e) => handleProfileChange("about", e.target.value)}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">About Section Subtitle</label>
                    <input 
                      type="text" 
                      className="form-control"
                      value={portfolioData.profile?.subtitle || ""}
                      onChange={(e) => handleProfileChange("subtitle", e.target.value)}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Avatar URL / Image</label>
                    <div className="input-group">
                      <input 
                        type="text" 
                        className="form-control"
                        value={portfolioData.profile?.avatar || ""}
                        onChange={(e) => handleProfileChange("avatar", e.target.value)}
                      />
                      <label className="btn btn-outline-info upload-btn">
                        <FontAwesomeIcon icon={faUpload} /> Upload File
                        <input 
                          type="file" 
                          hidden 
                          onChange={(e) => handleImageUpload(e, (url) => handleProfileChange("avatar", url))}
                        />
                      </label>
                    </div>
                  </div>
                  
                  {/* Personal list metadata */}
                  <div className="col-md-4 mb-3">
                    <label className="form-label">Birthday</label>
                    <input 
                      type="text" 
                      className="form-control"
                      value={portfolioData.profile?.birthday || ""}
                      onChange={(e) => handleProfileChange("birthday", e.target.value)}
                    />
                  </div>
                  <div className="col-md-4 mb-3">
                    <label className="form-label">Age</label>
                    <input 
                      type="text" 
                      className="form-control"
                      value={portfolioData.profile?.age || ""}
                      onChange={(e) => handleProfileChange("age", e.target.value)}
                    />
                  </div>
                  <div className="col-md-4 mb-3">
                    <label className="form-label">Degree</label>
                    <input 
                      type="text" 
                      className="form-control"
                      value={portfolioData.profile?.degree || ""}
                      onChange={(e) => handleProfileChange("degree", e.target.value)}
                    />
                  </div>
                  <div className="col-md-4 mb-3">
                    <label className="form-label">Phone</label>
                    <input 
                      type="text" 
                      className="form-control"
                      value={portfolioData.profile?.phone || ""}
                      onChange={(e) => handleProfileChange("phone", e.target.value)}
                    />
                  </div>
                  <div className="col-md-4 mb-3">
                    <label className="form-label">Email</label>
                    <input 
                      type="email" 
                      className="form-control"
                      value={portfolioData.profile?.email || ""}
                      onChange={(e) => handleProfileChange("email", e.target.value)}
                    />
                  </div>
                  <div className="col-md-4 mb-3">
                    <label className="form-label">Address</label>
                    <input 
                      type="text" 
                      className="form-control"
                      value={portfolioData.profile?.address || ""}
                      onChange={(e) => handleProfileChange("address", e.target.value)}
                    />
                  </div>

                  {/* Social links */}
                  <h4 className="mt-4 border-top pt-3">Social Links</h4>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">LinkedIn Profile Link</label>
                    <input 
                      type="text" 
                      className="form-control"
                      value={portfolioData.socials?.linkedin || ""}
                      onChange={(e) => handleSocialsChange("linkedin", e.target.value)}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">WhatsApp Link (eg: https://wa.me/number)</label>
                    <input 
                      type="text" 
                      className="form-control"
                      value={portfolioData.socials?.whatsapp || ""}
                      onChange={(e) => handleSocialsChange("whatsapp", e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* SKILLS TAB */}
            {activeTab === "skills" && (
              <div>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h3 className="tab-title">Skills & Expertise Categories</h3>
                  <button onClick={addSkillCategory} className="btn btn-outline-info rounded-pill px-3">
                    <FontAwesomeIcon icon={faPlus} /> Add Category
                  </button>
                </div>

                {portfolioData.skills?.map((cat: any, catIdx: number) => (
                  <div className="skill-cat-editor glass-card mb-4" key={catIdx}>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <input 
                        type="text" 
                        className="form-control category-name-input me-3"
                        value={cat.category}
                        onChange={(e) => updateSkillCategoryName(catIdx, e.target.value)}
                        placeholder="Category Name"
                      />
                      <button 
                        onClick={() => removeSkillCategory(catIdx)}
                        className="btn btn-outline-danger btn-sm"
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>

                    <div className="table-responsive">
                      <table className="table table-dark table-hover align-middle">
                        <thead>
                          <tr>
                            <th style={{ width: "35%" }}>Skill Name</th>
                            <th style={{ width: "30%" }}>Icon Key (brand map / SVG path)</th>
                            <th style={{ width: "20%" }}>Accent Color</th>
                            <th style={{ width: "15%" }}>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {cat.items.map((item: any, itemIdx: number) => (
                            <tr key={itemIdx}>
                              <td>
                                <input 
                                  type="text" 
                                  className="form-control form-control-sm"
                                  value={item.name}
                                  onChange={(e) => updateSkillItemField(catIdx, itemIdx, "name", e.target.value)}
                                />
                              </td>
                              <td>
                                <input 
                                  type="text" 
                                  className="form-control form-control-sm"
                                  value={item.icon}
                                  onChange={(e) => updateSkillItemField(catIdx, itemIdx, "icon", e.target.value)}
                                />
                              </td>
                              <td>
                                <div className="d-flex align-items-center">
                                  <input 
                                    type="color" 
                                    className="form-control-color me-2"
                                    value={item.color || "#06b6d4"}
                                    onChange={(e) => updateSkillItemField(catIdx, itemIdx, "color", e.target.value)}
                                  />
                                  <input 
                                    type="text" 
                                    className="form-control form-control-sm"
                                    style={{ width: "80px" }}
                                    value={item.color || ""}
                                    onChange={(e) => updateSkillItemField(catIdx, itemIdx, "color", e.target.value)}
                                  />
                                </div>
                              </td>
                              <td>
                                <button 
                                  onClick={() => removeSkillItem(catIdx, itemIdx)}
                                  className="btn btn-sm btn-outline-danger"
                                >
                                  <FontAwesomeIcon icon={faTrash} />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <button 
                      onClick={() => addSkillItem(catIdx)}
                      className="btn btn-sm btn-outline-info rounded-pill px-3 mt-2"
                    >
                      <FontAwesomeIcon icon={faPlus} /> Add Skill Item
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* LIVE PROJECTS */}
            {activeTab === "live" && (
              <div>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h3 className="tab-title">Live Portfolio Projects</h3>
                  <button onClick={() => addProject("live")} className="btn btn-outline-info rounded-pill px-3">
                    <FontAwesomeIcon icon={faPlus} /> Add Project
                  </button>
                </div>

                <div className="row">
                  {portfolioData.liveProjects?.map((proj: any) => (
                    <div className="col-12 mb-4" key={proj.id}>
                      <div className="item-editor-card glass-card">
                        <div className="d-flex justify-content-between align-items-center mb-3 border-bottom pb-2">
                          <h5>Project: {proj.name}</h5>
                          <button onClick={() => removeProject("live", proj.id)} className="btn btn-outline-danger btn-sm">
                            <FontAwesomeIcon icon={faTrash} /> Delete
                          </button>
                        </div>
                        <div className="row">
                          <div className="col-md-6 mb-3">
                            <label className="form-label">Project Name</label>
                            <input 
                              type="text" 
                              className="form-control"
                              value={proj.name}
                              onChange={(e) => updateProjectField("live", proj.id, "name", e.target.value)}
                            />
                          </div>
                          <div className="col-md-6 mb-3">
                            <label className="form-label">Live Link URL</label>
                            <input 
                              type="text" 
                              className="form-control"
                              value={proj.link}
                              onChange={(e) => updateProjectField("live", proj.id, "link", e.target.value)}
                            />
                          </div>
                          <div className="col-12 mb-3">
                            <label className="form-label">Description</label>
                            <textarea 
                              className="form-control"
                              rows={3}
                              value={proj.description}
                              onChange={(e) => updateProjectField("live", proj.id, "description", e.target.value)}
                            />
                          </div>
                          <div className="col-12 mb-3">
                            <label className="form-label">Project Cover Image Path / URL</label>
                            <div className="input-group">
                              <input 
                                type="text" 
                                className="form-control"
                                value={proj.image}
                                onChange={(e) => updateProjectField("live", proj.id, "image", e.target.value)}
                              />
                              <label className="btn btn-outline-info upload-btn">
                                <FontAwesomeIcon icon={faUpload} /> Upload File
                                <input 
                                  type="file" 
                                  hidden 
                                  onChange={(e) => handleImageUpload(e, (url) => updateProjectField("live", proj.id, "image", url))}
                                />
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* PERSONAL PROJECTS */}
            {activeTab === "personal" && (
              <div>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h3 className="tab-title">Personal Showcase Projects</h3>
                  <button onClick={() => addProject("personal")} className="btn btn-outline-info rounded-pill px-3">
                    <FontAwesomeIcon icon={faPlus} /> Add Project
                  </button>
                </div>

                <div className="row">
                  {portfolioData.personalProjects?.map((proj: any) => (
                    <div className="col-12 mb-4" key={proj.id}>
                      <div className="item-editor-card glass-card">
                        <div className="d-flex justify-content-between align-items-center mb-3 border-bottom pb-2">
                          <h5>Project: {proj.name}</h5>
                          <button onClick={() => removeProject("personal", proj.id)} className="btn btn-outline-danger btn-sm">
                            <FontAwesomeIcon icon={faTrash} /> Delete
                          </button>
                        </div>
                        <div className="row">
                          <div className="col-md-6 mb-3">
                            <label className="form-label">Project Name</label>
                            <input 
                              type="text" 
                              className="form-control"
                              value={proj.name}
                              onChange={(e) => updateProjectField("personal", proj.id, "name", e.target.value)}
                            />
                          </div>
                          <div className="col-md-6 mb-3">
                            <label className="form-label">Live Link URL</label>
                            <input 
                              type="text" 
                              className="form-control"
                              value={proj.link}
                              onChange={(e) => updateProjectField("personal", proj.id, "link", e.target.value)}
                            />
                          </div>
                          <div className="col-md-6 mb-3">
                            <label className="form-label">Button Text</label>
                            <input 
                              type="text" 
                              className="form-control"
                              value={proj.btnText}
                              onChange={(e) => updateProjectField("personal", proj.id, "btnText", e.target.value)}
                            />
                          </div>
                          <div className="col-12 mb-3">
                            <label className="form-label">Description</label>
                            <textarea 
                              className="form-control"
                              rows={3}
                              value={proj.description}
                              onChange={(e) => updateProjectField("personal", proj.id, "description", e.target.value)}
                            />
                          </div>
                          <div className="col-12 mb-3">
                            <label className="form-label">Project Cover Image Path / URL</label>
                            <div className="input-group">
                              <input 
                                type="text" 
                                className="form-control"
                                value={proj.image}
                                onChange={(e) => updateProjectField("personal", proj.id, "image", e.target.value)}
                              />
                              <label className="btn btn-outline-info upload-btn">
                                <FontAwesomeIcon icon={faUpload} /> Upload File
                                <input 
                                  type="file" 
                                  hidden 
                                  onChange={(e) => handleImageUpload(e, (url) => updateProjectField("personal", proj.id, "image", url))}
                                />
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* INBOX MESSAGES TAB */}
            {activeTab === "messages" && (
              <div>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h3 className="tab-title">Inbox Messages</h3>
                  <button onClick={fetchMessages} className="btn btn-outline-info rounded-pill px-3" disabled={loadingMessages}>
                    {loadingMessages ? "Refreshing..." : "Refresh Inbox"}
                  </button>
                </div>
                
                {messages.length === 0 ? (
                  <div className="text-center py-5 text-muted">
                    <p style={{ fontSize: "16px" }}>No messages received yet.</p>
                  </div>
                ) : (
                  <div className="row">
                    {messages.map((m: any) => (
                      <div className="col-12 mb-3" key={m.id}>
                        <div className="item-editor-card glass-card p-4" style={{ border: "1px solid rgba(255, 255, 255, 0.05)" }}>
                          <div className="d-flex justify-content-between align-items-start border-bottom pb-2 mb-2">
                            <div>
                              <h5 className="mb-0 text-info">{m.name}</h5>
                              <small className="text-muted">{m.email} • {new Date(m.createdAt).toLocaleString()}</small>
                            </div>
                            <button onClick={() => deleteMessage(m.id)} className="btn btn-outline-danger btn-sm">
                              <FontAwesomeIcon icon={faTrash} /> Delete
                            </button>
                          </div>
                          <p className="mb-0 inbox-message-text" style={{ whiteSpace: "pre-wrap", lineHeight: "1.6" }}>{m.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* SECURITY SETTINGS TAB */}
            {activeTab === "security" && (
              <div>
                <h3 className="tab-title">Security Settings</h3>
                <p className="text-muted mt-2">Update the passcode required to access this admin panel and save changes.</p>
                <div className="row mt-4" style={{ maxWidth: "500px" }}>
                  <div className="col-12 mb-3">
                    <label className="form-label">New Admin Passcode</label>
                    <input 
                      type="password" 
                      className="form-control"
                      id="newPasscode"
                      placeholder="Enter new passcode"
                      minLength={4}
                      required
                    />
                  </div>
                  <div className="col-12 mb-3">
                    <label className="form-label">Confirm Passcode</label>
                    <input 
                      type="password" 
                      className="form-control"
                      id="confirmPasscode"
                      placeholder="Confirm new passcode"
                      minLength={4}
                      required
                    />
                  </div>
                  <div className="col-12 mt-3">
                    <button 
                      onClick={async () => {
                        const newPass = (document.getElementById("newPasscode") as HTMLInputElement)?.value;
                        const confirmPass = (document.getElementById("confirmPasscode") as HTMLInputElement)?.value;
                        if (!newPass || !confirmPass) {
                          alert("Please fill both passcode fields.");
                          return;
                        }
                        if (newPass !== confirmPass) {
                          alert("Passcodes do not match.");
                          return;
                        }
                        try {
                          const res = await fetch("/api/auth", {
                            method: "PUT",
                            headers: {
                              "Content-Type": "application/json",
                              "x-admin-password": passcode
                            },
                            body: JSON.stringify({ newPassword: newPass })
                          });
                          if (res.ok) {
                            alert("Passcode updated successfully! Please log in again.");
                            handleLogout();
                          } else {
                            const data = await res.json();
                            alert("Failed to update passcode: " + data.error);
                          }
                        } catch (err) {
                          alert("Error updating passcode.");
                        }
                      }} 
                      className="button button-primary"
                    >
                      Update Passcode
                    </button>
                  </div>
                </div>

                <hr className="my-5" style={{ opacity: 0.15 }} />

                <h3 className="tab-title">SMTP Email Forwarder Settings</h3>
                <p className="text-muted mt-2">Configure SMTP details to forward contact form submissions directly to your email address (without opening client pop-ups).</p>
                
                <form onSubmit={handleSaveSmtp} className="row mt-4" style={{ maxWidth: "600px" }}>
                  <div className="col-md-8 mb-3">
                    <label className="form-label">SMTP Host</label>
                    <input 
                      type="text" 
                      className="form-control"
                      value={smtpHost}
                      onChange={(e) => setSmtpHost(e.target.value)}
                      placeholder="e.g. smtp.gmail.com"
                      required
                    />
                  </div>
                  <div className="col-md-4 mb-3">
                    <label className="form-label">SMTP Port</label>
                    <input 
                      type="text" 
                      className="form-control"
                      value={smtpPort}
                      onChange={(e) => setSmtpPort(e.target.value)}
                      placeholder="e.g. 465"
                      required
                    />
                  </div>
                  <div className="col-12 mb-3">
                    <label className="form-label">SMTP Username (Email)</label>
                    <input 
                      type="email" 
                      className="form-control"
                      value={smtpUser}
                      onChange={(e) => setSmtpUser(e.target.value)}
                      placeholder="e.g. yourname@gmail.com"
                      required
                    />
                  </div>
                  <div className="col-12 mb-3">
                    <label className="form-label">SMTP App Password</label>
                    <input 
                      type="password" 
                      className="form-control"
                      value={smtpPass}
                      onChange={(e) => setSmtpPass(e.target.value)}
                      placeholder="Enter SMTP App Password"
                      required
                    />
                  </div>
                  <div className="col-12 mb-3">
                    <label className="form-label">Receiver Email Address</label>
                    <input 
                      type="email" 
                      className="form-control"
                      value={smtpReceiver}
                      onChange={(e) => setSmtpReceiver(e.target.value)}
                      placeholder="e.g. sandhusatish166@gmail.com"
                      required
                    />
                  </div>
                  <div className="col-12 mt-3">
                    <button type="submit" className="button button-primary">
                      Save SMTP Settings
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* ACTIVITY AUDIT LOG TAB */}
            {activeTab === "activity" && (
              <div>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h3 className="tab-title">Activity Audit Log</h3>
                  <button onClick={fetchActivityLogs} className="btn btn-outline-info rounded-pill px-3" disabled={loadingActivity}>
                    {loadingActivity ? "Refreshing..." : "Refresh Logs"}
                  </button>
                </div>
                <p className="text-muted">Track history of modifications saved to the database.</p>

                {activityLogs.length === 0 ? (
                  <div className="text-center py-5 text-muted">
                    <p style={{ fontSize: "16px" }}>No save activities recorded yet.</p>
                  </div>
                ) : (
                  <div className="row mt-4">
                    {activityLogs.map((log: any) => (
                      <div className="col-12 mb-3" key={log.id}>
                        <div className="item-editor-card glass-card p-4" style={{ border: "1px solid rgba(255, 255, 255, 0.05)" }}>
                          <div className="border-bottom pb-2 mb-2">
                            <span className="text-info" style={{ fontWeight: '700', fontSize: '13px' }}>
                              ✔ SAVE ACTION DETECTED
                            </span>
                            <span className="text-muted float-end" style={{ fontSize: '12px' }}>
                              {new Date(log.timestamp).toLocaleString()}
                            </span>
                          </div>
                          <ul className="mb-0 ps-3 activity-log-list" style={{ fontSize: '14px', lineHeight: '1.6' }}>
                            {log.changes.map((change: string, idx: number) => (
                              <li key={idx}>{change}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx global>{`
        .admin-dashboard {
          background-color: #070a13;
          min-height: 100vh;
          color: #f3f4f6;
          font-family: 'Inter', sans-serif;
          padding: 40px;
        }

        .admin-dashboard .text-muted {
          color: #9ca3af !important;
        }

        .button-outline-warning {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          padding: 10px 22px;
          border-radius: 30px;
          transition: all 0.3s ease;
          text-decoration: none;
          font-size: 14px;
          gap: 8px;
          border: 2px solid #ffc107;
          color: #ffc107 !important;
          background: transparent;
        }
        .button-outline-warning:hover {
          background: #ffc107;
          color: #070a13 !important;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(255, 193, 7, 0.2);
        }

        .button-outline-danger {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          padding: 7px 16px;
          border-radius: 30px;
          transition: all 0.3s ease;
          text-decoration: none;
          font-size: 13px;
          gap: 6px;
          border: 1.5px solid #ef4444;
          color: #ef4444 !important;
          background: transparent;
        }
        .button-outline-danger:hover {
          background: #ef4444;
          color: #070a13 !important;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(239, 68, 68, 0.2);
        }

        .admin-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          padding-bottom: 20px;
        }

        .admin-header h1 {
          font-size: 28px;
          font-weight: 800;
          color: #fff;
          margin-bottom: 4px;
        }

        .admin-header p {
          color: #9ca3af;
          margin: 0;
        }

        .dashboard-tabs {
          display: flex;
          flex-direction: column;
          gap: 8px;
          padding: 16px;
        }

        @media (min-width: 992px) {
          .dashboard-tabs {
            position: sticky;
            top: 24px;
            z-index: 10;
          }
        }

        .tab-btn {
          width: 100%;
          text-align: left;
          padding: 12px 16px;
          background: transparent;
          border: none;
          border-radius: 10px;
          color: #9ca3af;
          font-weight: 600;
          font-size: 14px;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .tab-btn:hover {
          color: #fff;
          background: rgba(255, 255, 255, 0.03);
        }

        .tab-btn.active {
          color: #06b6d4;
          background: rgba(6, 182, 212, 0.08);
        }

        .dashboard-content {
          padding: 30px;
          min-height: 500px;
        }

        .tab-title {
          font-size: 22px;
          font-weight: 700;
          color: #fff;
          margin: 0;
        }

        .form-label {
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #06b6d4;
          margin-bottom: 6px;
        }

        .form-control,
        .form-select {
          background-color: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.08);
          color: #fff;
          border-radius: 8px;
          padding: 10px 14px;
          font-size: 14px;
          transition: all 0.3s;
        }

        .form-control:focus,
        .form-select:focus {
          background-color: rgba(255, 255, 255, 0.04);
          border-color: #06b6d4;
          box-shadow: 0 0 10px rgba(6, 182, 212, 0.15);
          color: #fff;
        }

        .form-control-color {
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 6px;
          width: 38px;
          height: 38px;
          padding: 0;
          background: transparent;
        }

        .upload-btn {
          cursor: pointer;
          font-size: 13px;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }

        .skill-cat-editor {
          padding: 20px;
          border: 1px solid rgba(255, 255, 255, 0.05);
        }

        .category-name-input {
          font-size: 18px;
          font-weight: 700;
          background: transparent;
          border: none;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 0;
          padding: 4px 0;
        }
        .category-name-input:focus {
          border-color: #06b6d4;
          box-shadow: none;
          background: transparent;
        }

        .item-editor-card {
          border: 1px solid rgba(255, 255, 255, 0.05);
        }

        .activity-log-list {
          color: #e5e7eb;
        }

        .inbox-message-text {
          color: #e5e7eb;
        }

        /* Prevent light theme overrides from corrupting dark admin styling */
        body.light-theme .admin-dashboard .glass-card {
          background: rgba(18, 18, 24, 0.65) !important;
          border-color: rgba(255, 255, 255, 0.06) !important;
          color: #f3f4f6 !important;
          box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.25) !important;
        }

        body.light-theme .admin-dashboard .form-control,
        body.light-theme .admin-dashboard .form-select {
          color: #fff !important;
          background-color: rgba(255, 255, 255, 0.02) !important;
          border-color: rgba(255, 255, 255, 0.08) !important;
        }

        body.light-theme .admin-dashboard .form-control:focus,
        body.light-theme .admin-dashboard .form-select:focus {
          background-color: rgba(255, 255, 255, 0.04) !important;
          border-color: #06b6d4 !important;
          box-shadow: 0 0 10px rgba(6, 182, 212, 0.15) !important;
        }

        body.light-theme .admin-dashboard h1,
        body.light-theme .admin-dashboard h2,
        body.light-theme .admin-dashboard h3,
        body.light-theme .admin-dashboard h4,
        body.light-theme .admin-dashboard h5,
        body.light-theme .admin-dashboard h6 {
          color: #fff !important;
        }

        body.light-theme .admin-dashboard p {
          color: #9ca3af !important;
        }

        body.light-theme .admin-dashboard .text-muted {
          color: #9ca3af !important;
        }

        body.light-theme .admin-dashboard .form-label {
          color: #06b6d4 !important;
        }

        body.light-theme .admin-dashboard .tab-btn {
          color: #9ca3af !important;
        }

        body.light-theme .admin-dashboard .tab-btn.active {
          color: #06b6d4 !important;
          background: rgba(6, 182, 212, 0.08) !important;
        }

        body.light-theme .admin-dashboard .tab-btn:hover {
          color: #fff !important;
          background: rgba(255, 255, 255, 0.03) !important;
        }

        body.light-theme .admin-dashboard .activity-log-list {
          color: #e5e7eb !important;
        }

        body.light-theme .admin-dashboard .inbox-message-text {
          color: #e5e7eb !important;
        }

        @media (max-width: 991px) {
          .admin-dashboard {
            padding: 20px;
          }
          .admin-header {
            flex-direction: column;
            gap: 16px;
            align-items: flex-start;
          }
        }
      `}</style>
    </div>
  );
}
