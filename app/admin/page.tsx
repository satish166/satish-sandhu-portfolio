"use client";

import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft, faSave, faPlus, faTrash, faEdit,
  faUser, faTools, faBriefcase, faProjectDiagram, faUpload, faLock, faEnvelope, faHistory, faSignOutAlt,
  faCheck, faTimes, faEye, faEyeSlash,
  faCompass, faLink, faList, faArrowUp, faArrowDown
} from "@fortawesome/free-solid-svg-icons";

function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binaryString = window.atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

function hexToRgb(hex: string): string {
  hex = hex.replace(/^#/, "");
  let r = 0, g = 0, b = 0;
  if (hex.length === 3) {
    r = parseInt(hex[0] + hex[0], 16);
    g = parseInt(hex[1] + hex[1], 16);
    b = parseInt(hex[2] + hex[2], 16);
  } else if (hex.length === 6) {
    r = parseInt(hex.substring(0, 2), 16);
    g = parseInt(hex.substring(2, 4), 16);
    b = parseInt(hex.substring(4, 6), 16);
  }
  return `${r}, ${g}, ${b}`;
}

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

  // Biometric and secure reset states
  const [hasBiometrics, setHasBiometrics] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [resetStep, setResetStep] = useState(1);
  const [resetCode, setResetCode] = useState("");
  const [newPassphrase, setNewPassphrase] = useState("");
  const [newConfirmPassphrase, setNewConfirmPassphrase] = useState("");
  const [requestingCode, setRequestingCode] = useState(false);
  const [verifyingCode, setVerifyingCode] = useState(false);
  const [hoveredBtn, setHoveredBtn] = useState<string | null>(null);

  // Multi-user & permissions states
  const [currentUser, setCurrentUser] = useState<{ username: string; permission: "Read Only" | "Full Access" }>({
    username: "admin",
    permission: "Full Access"
  });
  const [loginTab, setLoginTab] = useState<"passcode" | "team">("passcode");
  const [teamUsername, setTeamUsername] = useState("");
  const [teamPassword, setTeamPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const [subUsers, setSubUsers] = useState<any[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [newUserName, setNewUserName] = useState("");
  const [newUserPass, setNewUserPass] = useState("");
  const [newUserPerm, setNewUserPerm] = useState<"Read Only" | "Full Access">("Read Only");
  const [addingUser, setAddingUser] = useState(false);

  // Inline User Edit State
  const [editingUserUsername, setEditingUserUsername] = useState<string | null>(null);
  const [editingUserPermission, setEditingUserPermission] = useState<"Read Only" | "Full Access">("Read Only");

  // Password visibility toggle states
  const [showLoginPasscode, setShowLoginPasscode] = useState(false);
  const [showTeamLoginPass, setShowTeamLoginPass] = useState(false);
  const [showNewUserPass, setShowNewUserPass] = useState(false);
  const [visiblePasswords, setVisiblePasswords] = useState<string[]>([]);
  const [showResetNewPass, setShowResetNewPass] = useState(false);
  const [showResetConfirmPass, setShowResetConfirmPass] = useState(false);
  const [showSecNewPass, setShowSecNewPass] = useState(false);
  const [showSecConfirmPass, setShowSecConfirmPass] = useState(false);
  const [showSmtpPass, setShowSmtpPass] = useState(false);

  // Custom Confirm Dialog State
  const [confirmConfig, setConfirmConfig] = useState<{
    show: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    show: false,
    title: "Confirm Action",
    message: "",
    onConfirm: () => { }
  });

  const showConfirm = (title: string, message: string, onConfirm: () => void) => {
    setConfirmConfig({
      show: true,
      title,
      message,
      onConfirm: () => {
        onConfirm();
        setConfirmConfig(prev => ({ ...prev, show: false }));
      }
    });
  };

  const getBtnStyle = (type: "primary" | "outline-primary" | "outline-warning" | "outline-danger", name: string) => {
    const isHovered = hoveredBtn === name;

    const base = {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      fontWeight: "600",
      padding: "10px 22px",
      borderRadius: "30px",
      fontSize: "14px",
      lineHeight: "1.2",
      height: "42px",
      textTransform: "none" as const,
      gap: "8px",
      transition: "all 0.3s ease",
      textDecoration: "none",
      cursor: "pointer",
      transform: isHovered ? "translateY(-2px)" : "none"
    };

    if (type === "primary") {
      return {
        ...base,
        background: "linear-gradient(135deg, #06b6d4, #8b5cf6)",
        color: "#ffffff",
        border: "none",
        boxShadow: isHovered
          ? "0 6px 20px rgba(6, 182, 212, 0.5)"
          : "0 4px 15px rgba(6, 182, 212, 0.3)"
      };
    }
    if (type === "outline-primary") {
      return {
        ...base,
        border: "2px solid #06b6d4",
        color: isHovered ? "#070a13" : "#06b6d4",
        background: isHovered ? "#06b6d4" : "transparent",
        boxShadow: isHovered ? "0 4px 12px rgba(6, 182, 212, 0.2)" : "none"
      };
    }
    if (type === "outline-warning") {
      return {
        ...base,
        border: "2px solid #ffc107",
        color: isHovered ? "#070a13" : "#ffc107",
        background: isHovered ? "#ffc107" : "transparent",
        boxShadow: isHovered ? "0 4px 12px rgba(255, 193, 7, 0.2)" : "none"
      };
    }
    if (type === "outline-danger") {
      return {
        ...base,
        border: "2px solid #ef4444",
        color: isHovered ? "#070a13" : "#ef4444",
        background: isHovered ? "#ef4444" : "transparent",
        boxShadow: isHovered ? "0 4px 12px rgba(239, 68, 68, 0.2)" : "none"
      };
    }
    return base;
  };

  const fetchActivityLogs = async () => {
    setLoadingActivity(true);
    try {
      const res = await fetch("/api/portfolio?activity=true", { cache: "no-store" });
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
      const activePass = localStorage.getItem("portfolio_admin_pass") || passcode;
      const activeUser = localStorage.getItem("portfolio_admin_user") || "";
      const res = await fetch("/api/portfolio", {
        cache: "no-store",
        headers: {
          "x-admin-password": activePass,
          "x-admin-username": activeUser
        }
      });
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
      const activePass = localStorage.getItem("portfolio_admin_pass") || passcode;
      const activeUser = localStorage.getItem("portfolio_admin_user") || "";
      const res = await fetch("/api/contact", {
        cache: "no-store",
        headers: {
          "x-admin-password": activePass,
          "x-admin-username": activeUser
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
      const activePass = pass || localStorage.getItem("portfolio_admin_pass") || passcode;
      const activeUser = localStorage.getItem("portfolio_admin_user") || "";
      const res = await fetch("/api/auth", {
        cache: "no-store",
        headers: {
          "x-admin-password": activePass,
          "x-admin-username": activeUser
        }
      });
      if (res.ok) {
        const config = await res.json();
        setSmtpHost(config.smtpHost || "");
        setSmtpPort(config.smtpPort || "465");
        setSmtpUser(config.smtpUser || "");
        setSmtpPass(config.smtpPass || "");
        setSmtpReceiver(config.smtpReceiver || "sandhusatish166@gmail.com");
        setHasBiometrics(!!(config.biometric && config.biometric.credentialId));
      }
    } catch (err) {
      console.error("Failed to load SMTP config:", err);
    }
  };

  const handleSaveSmtp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const activePass = localStorage.getItem("portfolio_admin_pass") || passcode;
      const activeUser = localStorage.getItem("portfolio_admin_user") || "";
      const res = await fetch("/api/auth", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-admin-password": activePass,
          "x-admin-username": activeUser
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

  const deleteMessage = (id: string) => {
    showConfirm("Delete Message", "Are you sure you want to delete this message?", async () => {
      const activePass = localStorage.getItem("portfolio_admin_pass") || passcode;
      const activeUser = localStorage.getItem("portfolio_admin_user") || "";
      try {
        const res = await fetch(`/api/contact?id=${id}`, {
          method: "DELETE",
          headers: {
            "x-admin-password": activePass,
            "x-admin-username": activeUser
          }
        });
        if (res.ok) {
          setMessages(prev => prev.filter((m) => m.id !== id));
        } else {
          const data = await res.json();
          alert("Failed to delete message: " + (data.error || "Unknown error"));
        }
      } catch (err) {
        alert("Error deleting message: " + String(err));
      }
    });
  };

  const fetchSubUsers = async () => {
    setLoadingUsers(true);
    try {
      const activePass = localStorage.getItem("portfolio_admin_pass") || passcode;
      const activeUser = localStorage.getItem("portfolio_admin_user") || "";
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-password": activePass,
          "x-admin-username": activeUser
        },
        body: JSON.stringify({ action: "get-users" })
      });
      if (res.ok) {
        const list = await res.json();
        setSubUsers(list);
      }
    } catch (err) {
      console.error("Failed to load sub-users:", err);
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName || !newUserPass) return;
    setAddingUser(true);
    try {
      const activePass = localStorage.getItem("portfolio_admin_pass") || passcode;
      const activeUser = localStorage.getItem("portfolio_admin_user") || "";
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-password": activePass,
          "x-admin-username": activeUser
        },
        body: JSON.stringify({
          action: "add-user",
          user: {
            username: newUserName,
            password: newUserPass,
            permission: newUserPerm
          }
        })
      });
      if (res.ok) {
        const data = await res.json();
        setSubUsers(data.users);
        setNewUserName("");
        setNewUserPass("");
        setNewUserPerm("Read Only");
        alert("New user added successfully!");
      } else {
        const err = await res.json();
        alert("Failed to add user: " + (err.error || "Unknown error"));
      }
    } catch (err: any) {
      alert("Error adding user: " + err.message);
    } finally {
      setAddingUser(false);
    }
  };

  const handleDeleteUser = (usernameToDelete: string) => {
    showConfirm("Delete Team User", `Are you sure you want to delete user ${usernameToDelete}?`, async () => {
      try {
        const activePass = localStorage.getItem("portfolio_admin_pass") || passcode;
        const activeUser = localStorage.getItem("portfolio_admin_user") || "";
        const res = await fetch("/api/auth", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-admin-password": activePass,
            "x-admin-username": activeUser
          },
          body: JSON.stringify({
            action: "delete-user",
            usernameToDelete
          })
        });
        if (res.ok) {
          const data = await res.json();
          setSubUsers(data.users);
          alert("User deleted successfully!");
        } else {
          const err = await res.json();
          alert("Failed to delete user: " + (err.error || "Unknown error"));
        }
      } catch (err: any) {
        alert("Error deleting user: " + err.message);
      }
    });
  };

  const handleUpdateUserPermission = async (usernameToUpdate: string, permission: "Read Only" | "Full Access") => {
    try {
      const activePass = localStorage.getItem("portfolio_admin_pass") || passcode;
      const activeUser = localStorage.getItem("portfolio_admin_user") || "";
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-password": activePass,
          "x-admin-username": activeUser
        },
        body: JSON.stringify({
          action: "update-user",
          usernameToUpdate,
          permission
        })
      });
      if (res.ok) {
        const data = await res.json();
        setSubUsers(data.users);
        setEditingUserUsername(null);
        alert("User permission updated successfully!");
      } else {
        const err = await res.json();
        alert("Failed to update permission: " + (err.error || "Unknown error"));
      }
    } catch (err: any) {
      alert("Error updating user permission: " + err.message);
    }
  };

  useEffect(() => {
    if (authorized && passcode) {
      fetchMessages();
      fetchSmtpConfig();
      fetchActivityLogs();
      const userType = localStorage.getItem("portfolio_admin_user") || "admin";
      if (userType === "admin") {
        fetchSubUsers();
      }
    }
  }, [authorized]);

  useEffect(() => {
    if (authorized) {
      if (activeTab === "messages") {
        fetchMessages();
      } else if (activeTab === "activity") {
        fetchActivityLogs();
      } else if (activeTab === "users") {
        const userType = localStorage.getItem("portfolio_admin_user") || "admin";
        if (userType === "admin") {
          fetchSubUsers();
        }
      }
    }
  }, [activeTab]);

  // Reset scrollLeft of text inputs on blur to ensure text-overflow: ellipsis displays correctly
  useEffect(() => {
    const handleBlur = (e: FocusEvent) => {
      if (e.target instanceof HTMLInputElement && e.target.type === "text") {
        e.target.scrollLeft = 0;
      }
    };
    document.addEventListener("blur", handleBlur, true);
    return () => {
      document.removeEventListener("blur", handleBlur, true);
    };
  }, []);

  // Load passcode and username from localStorage and check biometric status on mount
  useEffect(() => {
    const checkBiometricSetup = async () => {
      try {
        const res = await fetch("/api/auth?checkBiometric=true", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          setHasBiometrics(data.hasBiometric);
        }
      } catch (err) {
        console.error("Failed to check biometric setup:", err);
      }
    };
    checkBiometricSetup();

    // Check localStorage first (Remember Me), then sessionStorage (session-only)
    const savedPass = localStorage.getItem("portfolio_admin_pass") || sessionStorage.getItem("portfolio_admin_pass");
    const savedUser = localStorage.getItem("portfolio_admin_user") || sessionStorage.getItem("portfolio_admin_user") || "";
    const savedPermission = (localStorage.getItem("portfolio_admin_permission") || sessionStorage.getItem("portfolio_admin_permission") || "Full Access") as "Read Only" | "Full Access";
    const wasRemembered = !!localStorage.getItem("portfolio_admin_pass");
    if (savedPass) {
      setRememberMe(wasRemembered);
      setPasscode(savedPass);
      setCurrentUser({ username: savedUser, permission: savedPermission });
      verifyAndLoad(savedPass, savedUser, wasRemembered);
    } else {
      setLoading(false);
    }
  }, []);

  const verifyAndLoad = async (pass: string, user: string = "", remember: boolean = rememberMe) => {
    setLoading(true);
    try {
      const authRes = await fetch("/api/auth", {
        method: "POST",
        cache: "no-store",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ username: user, password: pass })
      });

      if (authRes.ok) {
        const authData = await authRes.json();
        const loggedInUser = {
          username: authData.username || "admin",
          permission: authData.permission || "Full Access"
        };
        setCurrentUser(loggedInUser);

        const res = await fetch("/api/portfolio", {
          cache: "no-store",
          headers: {
            "x-admin-password": pass,
            "x-admin-username": loggedInUser.username
          }
        });
        if (res.ok) {
          const data = await res.json();
          setPortfolioData(data);
          setOriginalData(JSON.parse(JSON.stringify(data)));
          setPasscode(pass); // Update passcode state to keep in sync
          setAuthorized(true);
          fetchSmtpConfig(pass);
          // Save to localStorage (persistent) or sessionStorage (tab-only) based on Remember Me
          if (remember) {
            localStorage.setItem("portfolio_admin_pass", pass);
            localStorage.setItem("portfolio_admin_user", loggedInUser.username);
            localStorage.setItem("portfolio_admin_permission", loggedInUser.permission);
            sessionStorage.removeItem("portfolio_admin_pass");
            sessionStorage.removeItem("portfolio_admin_user");
            sessionStorage.removeItem("portfolio_admin_permission");
          } else {
            sessionStorage.setItem("portfolio_admin_pass", pass);
            sessionStorage.setItem("portfolio_admin_user", loggedInUser.username);
            sessionStorage.setItem("portfolio_admin_permission", loggedInUser.permission);
            localStorage.removeItem("portfolio_admin_pass");
            localStorage.removeItem("portfolio_admin_user");
            localStorage.removeItem("portfolio_admin_permission");
          }
          setErrorMsg("");
        } else {
          setErrorMsg("Failed to load portfolio details.");
        }
      } else {
        setErrorMsg("Incorrect passcode or username.");
        localStorage.removeItem("portfolio_admin_pass");
        localStorage.removeItem("portfolio_admin_user");
        localStorage.removeItem("portfolio_admin_permission");
      }
    } catch (err) {
      setErrorMsg("Failed to connect to API.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginTab === "team") {
      if (!teamUsername || !teamPassword) return;
      verifyAndLoad(teamPassword, teamUsername, rememberMe);
    } else {
      if (!passcode) return;
      verifyAndLoad(passcode, "", rememberMe);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("portfolio_admin_pass");
    localStorage.removeItem("portfolio_admin_user");
    localStorage.removeItem("portfolio_admin_permission");
    sessionStorage.removeItem("portfolio_admin_pass");
    sessionStorage.removeItem("portfolio_admin_user");
    sessionStorage.removeItem("portfolio_admin_permission");
    setRememberMe(false);
    setAuthorized(false);
    setPasscode("");
    setTeamUsername("");
    setTeamPassword("");
    setCurrentUser({ username: "admin", permission: "Full Access" });
  };

  const handleRegisterBiometric = async () => {
    try {
      const activePass = localStorage.getItem("portfolio_admin_pass") || passcode;
      const activeUser = localStorage.getItem("portfolio_admin_user") || "";
      const optionsRes = await fetch("/api/auth", {
        method: "POST",
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
          "x-admin-password": activePass,
          "x-admin-username": activeUser
        },
        body: JSON.stringify({ action: "webauthn-register-options" })
      });
      if (!optionsRes.ok) {
        const err = await optionsRes.json();
        throw new Error(err.error || "Failed to get biometric registration options");
      }
      const options = await optionsRes.json();

      options.challenge = base64ToArrayBuffer(options.challenge);
      options.user.id = base64ToArrayBuffer(options.user.id);

      const credential = await navigator.credentials.create({ publicKey: options }) as any;
      if (!credential) throw new Error("Fingerprint registration canceled");

      const response = credential.response;
      const publicKeyDer = response.getPublicKey();

      let binary = "";
      const bytes = new Uint8Array(publicKeyDer);
      for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      const publicKeyBase64 = window.btoa(binary);

      const verifyRes = await fetch("/api/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-password": activePass,
          "x-admin-username": activeUser
        },
        body: JSON.stringify({
          action: "webauthn-register-verify",
          credentialId: credential.id,
          publicKey: publicKeyBase64
        })
      });

      if (verifyRes.ok) {
        alert("Fingerprint registered successfully!");
        setHasBiometrics(true);
      } else {
        const err = await verifyRes.json();
        alert("Failed to verify registration: " + (err.error || "Unknown error"));
      }
    } catch (err: any) {
      alert("Registration failed: " + err.message);
    }
  };

  const handleRemoveBiometric = () => {
    showConfirm("Remove Biometric", "Are you sure you want to remove your registered fingerprint/biometric credential?", async () => {
      try {
        const activePass = localStorage.getItem("portfolio_admin_pass") || passcode;
        const activeUser = localStorage.getItem("portfolio_admin_user") || "";
        const res = await fetch("/api/auth", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "x-admin-password": activePass,
            "x-admin-username": activeUser
          },
          body: JSON.stringify({ removeBiometric: true })
        });
        if (res.ok) {
          alert("Biometric credential removed successfully!");
          setHasBiometrics(false);
        } else {
          const err = await res.json();
          alert("Failed to remove biometric: " + (err.error || "Unknown error"));
        }
      } catch (err: any) {
        alert("Error removing biometric: " + err.message);
      }
    });
  };

  const handleFingerprintLogin = async () => {
    try {
      const optionsRes = await fetch("/api/auth", {
        method: "POST",
        cache: "no-store",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ action: "webauthn-login-options" })
      });
      if (!optionsRes.ok) {
        const err = await optionsRes.json();
        throw new Error(err.error || "Failed to get biometric login options");
      }
      const options = await optionsRes.json();

      options.challenge = base64ToArrayBuffer(options.challenge);
      if (options.allowCredentials) {
        options.allowCredentials = options.allowCredentials.map((c: any) => ({
          ...c,
          id: base64ToArrayBuffer(c.id)
        }));
      }

      const assertion = await navigator.credentials.get({ publicKey: options }) as any;
      if (!assertion) throw new Error("Fingerprint verification failed");

      const response = assertion.response;
      const clientDataJSON = new TextDecoder().decode(response.clientDataJSON);
      const authenticatorDataHex = Array.prototype.map.call(new Uint8Array(response.authenticatorData), (x) => ("00" + x.toString(16)).slice(-2)).join("");

      let binary = "";
      const bytes = new Uint8Array(response.signature);
      for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      const signatureBase64 = window.btoa(binary);

      const verifyRes = await fetch("/api/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          action: "webauthn-login-verify",
          credentialId: assertion.id,
          authenticatorDataHex,
          clientDataJSON,
          signatureBase64
        })
      });

      if (verifyRes.ok) {
        const data = await verifyRes.json();
        if (data.password) {
          verifyAndLoad(data.password);
        }
      } else {
        const err = await verifyRes.json();
        alert("Fingerprint verification failed: " + (err.error || "Unknown error"));
      }
    } catch (err: any) {
      alert("Biometric login failed: " + err.message);
    }
  };

  const requestResetCode = async () => {
    setRequestingCode(true);
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        cache: "no-store",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "request-reset" })
      });
      if (res.ok) {
        alert("A 6-digit verification reset code has been sent to your registered email address.");
        setResetStep(2);
      } else {
        const err = await res.json();
        alert("Failed to send reset code: " + (err.error || "Unknown error"));
      }
    } catch (err: any) {
      alert("Error requesting reset code: " + err.message);
    } finally {
      setRequestingCode(false);
    }
  };

  const handleVerifyCodeOnly = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetCode) return;
    setVerifyingCode(true);
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "verify-code",
          code: resetCode
        })
      });
      if (res.ok) {
        alert("Verification code is correct! Redirecting to password change screen.");
        setResetStep(3);
      } else {
        const err = await res.json();
        alert("Verification failed: " + (err.error || "Incorrect code"));
      }
    } catch (err: any) {
      alert("Error verifying code: " + err.message);
    } finally {
      setVerifyingCode(false);
    }
  };

  const handlePasswordChangeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetCode || !newPassphrase) return;
    if (newPassphrase !== newConfirmPassphrase) {
      alert("Passcodes do not match.");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "verify-reset",
          code: resetCode,
          newPassword: newPassphrase
        })
      });
      if (res.ok) {
        alert("Passcode has been updated successfully! You can now login using your new passcode.");
        setResetStep(1);
        setResetting(false);
        setResetCode("");
        setNewPassphrase("");
        setNewConfirmPassphrase("");
      } else {
        const err = await res.json();
        alert("Reset failed: " + (err.error || "Unknown error"));
      }
    } catch (err: any) {
      alert("Error resetting passcode: " + err.message);
    } finally {
      setSaving(false);
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

  const handlePrimaryColorChange = (value: string) => {
    setPortfolioData({
      ...portfolioData,
      primaryColor: value
    });
  };

  // Image Upload handler
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, callback: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const activePass = localStorage.getItem("portfolio_admin_pass") || passcode;
      const activeUser = localStorage.getItem("portfolio_admin_user") || "";
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: {
          "x-admin-password": activePass,
          "x-admin-username": activeUser
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

  // Navigation handlers
  const updateNavigationItemField = (idx: number, key: string, value: string) => {
    const current = portfolioData.navigation || [];
    const updated = current.map((item: any, i: number) => {
      if (i === idx) return { ...item, [key]: value };
      return item;
    });
    setPortfolioData({ ...portfolioData, navigation: updated });
  };

  const addNavigationItem = () => {
    const current = portfolioData.navigation || [];
    const updated = [...current, { label: "New Tab", href: "#new-section", icon: "faLink" }];
    setPortfolioData({ ...portfolioData, navigation: updated });
  };

  const removeNavigationItem = (idx: number) => {
    const current = portfolioData.navigation || [];
    const updated = current.filter((_: any, i: number) => i !== idx);
    setPortfolioData({ ...portfolioData, navigation: updated });
  };

  const moveNavigationItem = (idx: number, direction: "up" | "down") => {
    const current = portfolioData.navigation || [];
    const list = [...current];
    if (direction === "up" && idx > 0) {
      const temp = list[idx];
      list[idx] = list[idx - 1];
      list[idx - 1] = temp;
    } else if (direction === "down" && idx < list.length - 1) {
      const temp = list[idx];
      list[idx] = list[idx + 1];
      list[idx + 1] = temp;
    }
    setPortfolioData({ ...portfolioData, navigation: list });
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
    showConfirm("Delete Skill Category", "Are you sure you want to delete this entire skill category?", () => {
      const updated = portfolioData.skills.filter((_: any, i: number) => i !== catIdx);
      setPortfolioData({ ...portfolioData, skills: updated });
    });
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

    // Compare Primary Color
    if (originalData.primaryColor !== portfolioData.primaryColor) {
      changes.push(`Primary Color: "${originalData.primaryColor || ""}" ➔ "${portfolioData.primaryColor || ""}"`);
    }

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

    // Compare Navigation
    const origNav = originalData.navigation || [];
    const currNav = portfolioData.navigation || [];
    const maxNavLen = Math.max(origNav.length, currNav.length);
    for (let i = 0; i < maxNavLen; i++) {
      const origItem = origNav[i];
      const currItem = currNav[i];
      if (!origItem && currItem) {
        changes.push(`Navigation: Added "${currItem.label}" (${currItem.href})`);
      } else if (origItem && !currItem) {
        changes.push(`Navigation: Removed "${origItem.label}"`);
      } else if (origItem && currItem && JSON.stringify(origItem) !== JSON.stringify(currItem)) {
        changes.push(`Navigation [${origItem.label}]: Modified`);
      }
    }

    // Compare Show Header Preference
    if (originalData.showHeader !== portfolioData.showHeader) {
      const origVal = originalData.showHeader !== false ? "Show" : "Hide";
      const currVal = portfolioData.showHeader !== false ? "Show" : "Hide";
      changes.push(`Header Visibility: "${origVal}" ➔ "${currVal}"`);
    }

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
      const activePass = localStorage.getItem("portfolio_admin_pass") || passcode;
      const activeUser = localStorage.getItem("portfolio_admin_user") || "";
      const res = await fetch("/api/portfolio", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-password": activePass,
          "x-admin-username": activeUser
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
    const biometricsSupported = typeof window !== "undefined" && !!window.PublicKeyCredential;

    return (
      <div className="admin-login-screen">
        <div className="login-box glass-card">
          <div className="lock-icon" onClick={() => setShowReset(true)} style={{ cursor: "pointer" }}>
            <FontAwesomeIcon icon={faLock} />
          </div>
          <h2 onDoubleClick={() => setResetting(!resetting)} style={{ userSelect: "none", cursor: "pointer" }}>
            Admin Access
          </h2>

          {resetting ? (
            <div>
              <p style={{ color: "#ffffff", fontSize: "16px", fontWeight: "700", marginBottom: "12px" }}>Forgot Password Flow</p>
              {resetStep === 1 && (
                <div>
                  <p className="text-muted" style={{ fontSize: "13px", color: "#e5e7eb", lineHeight: "1.5", marginBottom: "16px" }}>
                    We will send a 6-digit verification code to your registered mobile number: <strong>8278860269</strong>.
                  </p>
                  <button
                    type="button"
                    onClick={requestResetCode}
                    className="button button-primary w-full mt-2"
                    disabled={requestingCode}
                  >
                    {requestingCode ? "Sending Code..." : "Send Code via SMS"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setResetting(false)}
                    className="btn btn-link btn-sm text-white mt-3 d-block mx-auto"
                    style={{ fontSize: "12px", textDecoration: "none", border: "none", background: "transparent", color: "#ffffff" }}
                  >
                    Back to Login
                  </button>
                </div>
              )}

              {resetStep === 2 && (
                <form onSubmit={handleVerifyCodeOnly}>
                  <p className="text-muted" style={{ fontSize: "13px", color: "#e5e7eb", marginBottom: "12px" }}>
                    Enter the 6-digit code sent to <strong>8278860269</strong>:
                  </p>
                  <input
                    type="text"
                    placeholder="6-Digit Code"
                    value={resetCode}
                    onChange={(e) => setResetCode(e.target.value)}
                    required
                    maxLength={6}
                    style={{ letterSpacing: "4px", fontWeight: "700" }}
                  />
                  <button type="submit" className="button button-primary w-full mt-2" disabled={verifyingCode}>
                    {verifyingCode ? "Verifying..." : "Verify Code"}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setResetStep(1); }}
                    className="btn btn-link btn-sm text-white mt-3 d-block mx-auto"
                    style={{ fontSize: "12px", textDecoration: "none", border: "none", background: "transparent", color: "#ffffff" }}
                  >
                    Go Back
                  </button>
                </form>
              )}

              {resetStep === 3 && (
                <form onSubmit={handlePasswordChangeSubmit}>
                  <p className="text-muted" style={{ fontSize: "13px", color: "#e5e7eb", marginBottom: "12px" }}>
                    Code verified. Choose your new admin passcode:
                  </p>
                  <input
                    type="password"
                    placeholder="New Passcode"
                    value={newPassphrase}
                    onChange={(e) => setNewPassphrase(e.target.value)}
                    required
                    minLength={4}
                  />
                  <input
                    type="password"
                    placeholder="Confirm New Passcode"
                    value={newConfirmPassphrase}
                    onChange={(e) => setNewConfirmPassphrase(e.target.value)}
                    required
                    minLength={4}
                  />
                  <button type="submit" className="button button-primary w-full mt-2" disabled={saving}>
                    {saving ? "Saving..." : "Save New Passcode"}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setResetStep(1); setResetting(false); }}
                    className="btn btn-link btn-sm text-white mt-3 d-block mx-auto"
                    style={{ fontSize: "12px", textDecoration: "none", border: "none", background: "transparent", color: "#ffffff" }}
                  >
                    Cancel
                  </button>
                </form>
              )}
            </div>
          ) : (
            <div>
              <div className="login-tabs">
                <button
                  type="button"
                  className={`login-tab-btn ${loginTab === "passcode" ? "active" : ""}`}
                  onClick={() => {
                    setLoginTab("passcode");
                    setErrorMsg("");
                  }}
                >
                  Admin Passcode
                </button>
                <button
                  type="button"
                  className={`login-tab-btn ${loginTab === "team" ? "active" : ""}`}
                  onClick={() => {
                    setLoginTab("team");
                    setErrorMsg("");
                  }}
                >
                  Team Login
                </button>
              </div>

              {loginTab === "passcode" ? (
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
                    onClick={() => { setResetting(true); setResetStep(1); }}
                    className="btn btn-link mt-2 d-block mx-auto"
                    style={{ fontSize: "13px", textDecoration: "none", border: "none", background: "transparent", color: "#9ca3af" }}
                    onMouseOver={(e) => e.currentTarget.style.color = "#06b6d4"}
                    onMouseOut={(e) => e.currentTarget.style.color = "#9ca3af"}
                  >
                    Forgot Passcode?
                  </button>
                  {hasBiometrics && biometricsSupported && (
                    <button
                      type="button"
                      onClick={handleFingerprintLogin}
                      className="button button-outline-primary w-full mt-2"
                      style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "8px" }}
                    >
                      <FontAwesomeIcon icon={faLock} /> Sign in with Fingerprint
                    </button>
                  )}
                </form>
              ) : (
                <form onSubmit={handleLogin}>
                  <input
                    type="email"
                    placeholder="Gmail address"
                    value={teamUsername}
                    onChange={(e) => setTeamUsername(e.target.value)}
                    required
                    style={{ textAlign: "left" }}
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    value={teamPassword}
                    onChange={(e) => setTeamPassword(e.target.value)}
                    required
                    style={{ textAlign: "left" }}
                  />
                  {errorMsg && <p className="error-message">{errorMsg}</p>}
                  <button type="submit" className="button button-primary w-full mt-3">
                    Unlock Panel
                  </button>
                </form>
              )}
            </div>
          )}

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
          .login-tabs {
            display: flex;
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 20px;
            padding: 4px;
            margin-bottom: 20px;
          }
          .login-tab-btn {
            flex: 1;
            background: transparent;
            border: none;
            padding: 8px 16px;
            border-radius: 16px;
            color: #9ca3af;
            font-size: 13px;
            font-weight: 600;
            transition: all 0.3s ease;
            cursor: pointer;
          }
          .login-tab-btn:hover {
            color: #ffffff;
          }
          .login-tab-btn.active {
            background: linear-gradient(135deg, #06b6d4, #8b5cf6);
            color: #ffffff;
            box-shadow: 0 4px 10px rgba(6, 182, 212, 0.25);
          }
          h2 {
            font-size: 24px;
            font-weight: 700;
            margin-bottom: 8px;
            color: #ffffff !important;
          }
          p {
            color: #e5e7eb;
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
          input::placeholder {
            color: rgba(255, 255, 255, 0.6) !important;
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
      {portfolioData?.primaryColor && (
        <style dangerouslySetInnerHTML={{ __html: `
          :root {
            --primary-color: ${portfolioData.primaryColor};
            --primary-color-rgb: ${hexToRgb(portfolioData.primaryColor)};
          }
        `}} />
      )}
      {currentUser.permission === "Read Only" && (
        <div className="alert alert-info mx-0 mb-4 p-3 glass-card border-info-glow animate-fade-in text-center" style={{ borderColor: 'rgba(6, 182, 212, 0.4)', background: 'rgba(8, 20, 30, 0.9)', borderRadius: '12px' }}>
          <span className="text-info" style={{ fontWeight: '700', fontSize: '15px' }}>
            ℹ Read-Only Preview Mode
          </span>
          <span style={{ color: '#e5e7eb', fontSize: '14px', marginLeft: '8px' }}>
            You are logged in as a team member with read-only permissions. You can view the dashboard but cannot make edits or save changes.
          </span>
        </div>
      )}
      <div className="admin-header">
        <div className="header-info">
          <h1>Admin Dashboard</h1>
          <p>Modify your portfolio info dynamically.</p>
        </div>
        <div className="header-actions">
          <a
            href="/"
            className="button button-outline-primary me-3"
            style={getBtnStyle("outline-primary", "view")}
            onMouseEnter={() => setHoveredBtn("view")}
            onMouseLeave={() => setHoveredBtn(null)}
          >
            <FontAwesomeIcon icon={faArrowLeft} /> View Site
          </a>
          {pendingList.length > 0 && (
            <button
              onClick={discardChanges}
              className="button button-outline-warning me-3"
              style={getBtnStyle("outline-warning", "discard")}
              onMouseEnter={() => setHoveredBtn("discard")}
              onMouseLeave={() => setHoveredBtn(null)}
            >
              Discard Changes
            </button>
          )}
          <button
            onClick={saveAllChanges}
            className="button button-primary me-3"
            style={getBtnStyle("primary", "save")}
            onMouseEnter={() => setHoveredBtn("save")}
            onMouseLeave={() => setHoveredBtn(null)}
            disabled={saving || currentUser.permission === "Read Only"}
          >
            <FontAwesomeIcon icon={faSave} /> {saving ? "Saving..." : currentUser.permission === "Read Only" ? "Preview Mode" : "Save Changes"}
          </button>
          <button
            onClick={handleLogout}
            className="button button-outline-danger"
            style={getBtnStyle("outline-danger", "logout")}
            onMouseEnter={() => setHoveredBtn("logout")}
            onMouseLeave={() => setHoveredBtn(null)}
          >
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
              className={`tab-btn ${activeTab === "navigation" ? "active" : ""}`}
              onClick={() => setActiveTab("navigation")}
            >
              <FontAwesomeIcon icon={faCompass} /> Header Navigation
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
            {currentUser.username === "admin" && (
              <button
                className={`tab-btn ${activeTab === "security" ? "active" : ""}`}
                onClick={() => setActiveTab("security")}
              >
                <FontAwesomeIcon icon={faLock} /> Security Settings
              </button>
            )}
            {currentUser.username === "admin" && (
              <button
                className={`tab-btn ${activeTab === "users" ? "active" : ""}`}
                onClick={() => setActiveTab("users")}
              >
                <FontAwesomeIcon icon={faUser} /> Users Manager
              </button>
            )}
          </div>
        </div>

        {/* Tab Content Panel */}
        <div className="col-lg-9">
          <div className="dashboard-content glass-card">
            {/* PROFILE TAB */}
            {activeTab === "profile" && (
              <div>
                <h3 className="tab-title">Profile & Details</h3>
                <fieldset disabled={currentUser.permission === "Read Only"} style={{ border: "none", padding: 0, margin: 0 }}>
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
                        {currentUser.permission !== "Read Only" && (
                          <label className="btn btn-outline-info upload-btn">
                            <FontAwesomeIcon icon={faUpload} /> Upload File
                            <input
                              type="file"
                              hidden
                              onChange={(e) => handleImageUpload(e, (url) => handleProfileChange("avatar", url))}
                            />
                          </label>
                        )}
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

                    {/* Theme Accent Color */}
                    <h4 className="mt-4 border-top pt-3">Theme Accent Customization</h4>
                    <div className="col-12 mb-3">
                      <label className="form-label d-block">Primary Theme Accent Color</label>
                      <div className="d-flex align-items-center gap-3 flex-wrap">
                        <input
                          type="color"
                          className="form-control form-control-color"
                          value={portfolioData.primaryColor || "#ff7e40"}
                          onChange={(e) => handlePrimaryColorChange(e.target.value)}
                          style={{ width: "80px", height: "42px", padding: "6px", cursor: "pointer", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "6px", background: "transparent" }}
                          title="Choose primary theme accent color"
                        />
                        <input
                          type="text"
                          className="form-control"
                          value={portfolioData.primaryColor || "#ff7e40"}
                          onChange={(e) => handlePrimaryColorChange(e.target.value)}
                          style={{ width: "120px", height: "42px", color: "#ffffff", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "6px", padding: "8px 12px", fontSize: "14px", outline: "none" }}
                          placeholder="#ff7e40"
                          title="Type or paste primary color code"
                        />
                        <div className="d-flex gap-2 flex-wrap">
                          {[
                            { name: "Sunset Orange (Default)", hex: "#ff7e40" },
                            { name: "RyanCV Green", hex: "#78cc6d" },
                            { name: "Neon Cyan", hex: "#06b6d4" },
                            { name: "Vibrant Purple", hex: "#8b5cf6" },
                            { name: "Coral Red", hex: "#ef4444" },
                            { name: "Golden Yellow", hex: "#ffc73b" }
                          ].map((preset) => (
                            <button
                              key={preset.hex}
                              type="button"
                              className="btn btn-sm"
                              onClick={() => handlePrimaryColorChange(preset.hex)}
                              style={{
                                background: preset.hex,
                                color: "#000000",
                                fontWeight: "700",
                                border: portfolioData.primaryColor === preset.hex ? "2px solid #ffffff" : "1px solid rgba(0,0,0,0.2)",
                                borderRadius: "20px",
                                padding: "6px 12px",
                                fontSize: "11px",
                                opacity: portfolioData.primaryColor === preset.hex ? 1 : 0.85
                              }}
                            >
                              {preset.name}
                            </button>
                          ))}
                        </div>
                      </div>
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

                    {/* Preferences / Settings */}
                    <h4 className="mt-4 border-top pt-3">Preferences / Settings</h4>
                    <div className="col-md-12 mb-3">
                      <div className="form-check form-switch mt-2">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          role="switch"
                          id="showHeaderToggle"
                          checked={portfolioData.showHeader !== false}
                          onChange={(e) => setPortfolioData({
                            ...portfolioData,
                            showHeader: e.target.checked
                          })}
                          style={{
                            cursor: "pointer",
                            width: "2.5em",
                            height: "1.25em",
                            marginRight: "10px",
                            float: "left"
                          }}
                        />
                        <label className="form-check-label" htmlFor="showHeaderToggle" style={{ cursor: "pointer", fontSize: "14px", fontWeight: "600" }}>
                          Show Header / Navigation Bar
                        </label>
                      </div>
                    </div>
                  </div>
                </fieldset>
              </div>
            )}

            {/* HEADER NAVIGATION TAB */}
            {activeTab === "navigation" && (
              <div>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h3 className="tab-title">Header Navigation Tabs</h3>
                  {currentUser.permission !== "Read Only" && (
                    <button onClick={addNavigationItem} className="btn btn-outline-info rounded-pill px-3">
                      <FontAwesomeIcon icon={faPlus} /> Add Nav Tab
                    </button>
                  )}
                </div>

                <fieldset disabled={currentUser.permission === "Read Only"} style={{ border: "none", padding: 0, margin: 0 }}>
                  <div className="table-responsive">
                    <table className="table table-dark table-hover align-middle">
                      <thead>
                        <tr>
                          <th style={{ width: "25%" }}>Name / Label</th>
                          <th style={{ width: "30%" }}>Target Link / Anchor</th>
                          <th style={{ width: "25%" }}>Icon (FontAwesome)</th>
                          <th style={{ width: "20%" }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(portfolioData.navigation || []).map((item: any, idx: number) => (
                          <tr key={idx}>
                            <td>
                              <input
                                type="text"
                                className="form-control form-control-sm"
                                value={item.label}
                                onChange={(e) => updateNavigationItemField(idx, "label", e.target.value)}
                                placeholder="e.g. Home"
                                required
                              />
                            </td>
                            <td>
                              <input
                                type="text"
                                className="form-control form-control-sm"
                                value={item.href}
                                onChange={(e) => updateNavigationItemField(idx, "href", e.target.value)}
                                placeholder="e.g. #about or /blog"
                                required
                              />
                            </td>
                            <td>
                              <select
                                className="form-select form-select-sm"
                                value={item.icon || "faLink"}
                                onChange={(e) => updateNavigationItemField(idx, "icon", e.target.value)}
                              >
                                <option value="faHouse">Home (House)</option>
                                <option value="faUser">About (User)</option>
                                <option value="faFile">Skills (File)</option>
                                <option value="faLaptopCode">Projects (Laptop Code)</option>
                                <option value="faAddressBook">Contact (Address Book)</option>
                                <option value="faCompass">Compass</option>
                                <option value="faLink">Link</option>
                                <option value="faList">List</option>
                                <option value="faCode">Code</option>
                                <option value="faBriefcase">Briefcase</option>
                                <option value="faGraduationCap">Degree / Graduation Cap</option>
                                <option value="faCertificate">Certificate</option>
                                <option value="faAward">Award</option>
                                <option value="faBook">Book / Blog</option>
                                <option value="faHeart">Heart</option>
                                <option value="faPhone">Phone</option>
                                <option value="faEnvelope">Envelope</option>
                                <option value="faGlobe">Globe</option>
                              </select>
                            </td>
                            <td>
                              <div className="d-flex gap-2">
                                <button
                                  type="button"
                                  onClick={() => moveNavigationItem(idx, "up")}
                                  disabled={idx === 0}
                                  className="btn btn-sm btn-outline-info"
                                  title="Move Up"
                                >
                                  <FontAwesomeIcon icon={faArrowUp} />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => moveNavigationItem(idx, "down")}
                                  disabled={idx === (portfolioData.navigation || []).length - 1}
                                  className="btn btn-sm btn-outline-info"
                                  title="Move Down"
                                >
                                  <FontAwesomeIcon icon={faArrowDown} />
                                </button>
                                {currentUser.permission !== "Read Only" && (
                                  <button
                                    type="button"
                                    onClick={() => removeNavigationItem(idx)}
                                    className="btn btn-sm btn-outline-danger"
                                    title="Delete"
                                  >
                                    <FontAwesomeIcon icon={faTrash} />
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </fieldset>
              </div>
            )}

            {/* SKILLS TAB */}
            {activeTab === "skills" && (
              <div>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h3 className="tab-title">Skills & Expertise Categories</h3>
                  {currentUser.permission !== "Read Only" && (
                    <button onClick={addSkillCategory} className="btn btn-outline-info rounded-pill px-3">
                      <FontAwesomeIcon icon={faPlus} /> Add Category
                    </button>
                  )}
                </div>

                <fieldset disabled={currentUser.permission === "Read Only"} style={{ border: "none", padding: 0, margin: 0 }}>
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
                        {currentUser.permission !== "Read Only" && (
                          <button
                            onClick={() => removeSkillCategory(catIdx)}
                            className="btn btn-outline-danger btn-sm"
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </button>
                        )}
                      </div>

                      <div className="table-responsive">
                        <table className="table table-dark table-hover align-middle">
                          <thead>
                            <tr>
                              <th style={{ width: "35%" }}>Skill Name</th>
                              <th style={{ width: "30%" }}>Icon Key (brand map / SVG path)</th>
                              <th style={{ width: "20%" }}>Accent Color</th>
                              {currentUser.permission !== "Read Only" && <th style={{ width: "15%" }}>Action</th>}
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
                                {currentUser.permission !== "Read Only" && (
                                  <td>
                                    <button
                                      onClick={() => removeSkillItem(catIdx, itemIdx)}
                                      className="btn btn-sm btn-outline-danger"
                                    >
                                      <FontAwesomeIcon icon={faTrash} />
                                    </button>
                                  </td>
                                )}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      {currentUser.permission !== "Read Only" && (
                        <button
                          onClick={() => addSkillItem(catIdx)}
                          className="btn btn-sm btn-outline-info rounded-pill px-3 mt-2"
                        >
                          <FontAwesomeIcon icon={faPlus} /> Add Skill Item
                        </button>
                      )}
                    </div>
                  ))}
                </fieldset>
              </div>
            )}

            {/* LIVE PROJECTS */}
            {activeTab === "live" && (
              <div>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h3 className="tab-title">Live Portfolio Projects</h3>
                  {currentUser.permission !== "Read Only" && (
                    <button onClick={() => addProject("live")} className="btn btn-outline-info rounded-pill px-3">
                      <FontAwesomeIcon icon={faPlus} /> Add Project
                    </button>
                  )}
                </div>

                <fieldset disabled={currentUser.permission === "Read Only"} style={{ border: "none", padding: 0, margin: 0 }}>
                  <div className="row">
                    {portfolioData.liveProjects?.map((proj: any) => (
                      <div className="col-12 mb-4" key={proj.id}>
                        <div className="item-editor-card glass-card">
                          <div className="d-flex justify-content-between align-items-center mb-3 border-bottom pb-2">
                            <h5>Project: {proj.name}</h5>
                            {currentUser.permission !== "Read Only" && (
                              <button onClick={() => removeProject("live", proj.id)} className="btn btn-outline-danger btn-sm">
                                <FontAwesomeIcon icon={faTrash} /> Delete
                              </button>
                            )}
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
                                {currentUser.permission !== "Read Only" && (
                                  <label className="btn btn-outline-info upload-btn">
                                    <FontAwesomeIcon icon={faUpload} /> Upload File
                                    <input
                                      type="file"
                                      hidden
                                      onChange={(e) => handleImageUpload(e, (url) => updateProjectField("live", proj.id, "image", url))}
                                    />
                                  </label>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </fieldset>
              </div>
            )}

            {/* PERSONAL PROJECTS */}
            {activeTab === "personal" && (
              <div>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h3 className="tab-title">Personal Showcase Projects</h3>
                  {currentUser.permission !== "Read Only" && (
                    <button onClick={() => addProject("personal")} className="btn btn-outline-info rounded-pill px-3">
                      <FontAwesomeIcon icon={faPlus} /> Add Project
                    </button>
                  )}
                </div>

                <fieldset disabled={currentUser.permission === "Read Only"} style={{ border: "none", padding: 0, margin: 0 }}>
                  <div className="row">
                    {portfolioData.personalProjects?.map((proj: any) => (
                      <div className="col-12 mb-4" key={proj.id}>
                        <div className="item-editor-card glass-card">
                          <div className="d-flex justify-content-between align-items-center mb-3 border-bottom pb-2">
                            <h5>Project: {proj.name}</h5>
                            {currentUser.permission !== "Read Only" && (
                              <button onClick={() => removeProject("personal", proj.id)} className="btn btn-outline-danger btn-sm">
                                <FontAwesomeIcon icon={faTrash} /> Delete
                              </button>
                            )}
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
                                {currentUser.permission !== "Read Only" && (
                                  <label className="btn btn-outline-info upload-btn">
                                    <FontAwesomeIcon icon={faUpload} /> Upload File
                                    <input
                                      type="file"
                                      hidden
                                      onChange={(e) => handleImageUpload(e, (url) => updateProjectField("personal", proj.id, "image", url))}
                                    />
                                  </label>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </fieldset>
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
                            {currentUser.permission !== "Read Only" && (
                              <button onClick={() => deleteMessage(m.id)} className="btn btn-outline-danger btn-sm">
                                <FontAwesomeIcon icon={faTrash} /> Delete
                              </button>
                            )}
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
                    <div className="password-input-wrapper">
                      <input
                        type={showSecNewPass ? "text" : "password"}
                        className="form-control"
                        id="newPasscode"
                        placeholder="Enter new passcode"
                        minLength={4}
                        required
                        style={{ margin: 0, paddingRight: "44px" }}
                      />
                      <button
                        type="button"
                        className="password-toggle-btn"
                        onClick={() => setShowSecNewPass(!showSecNewPass)}
                      >
                        <FontAwesomeIcon icon={showSecNewPass ? faEyeSlash : faEye} />
                      </button>
                    </div>
                  </div>
                  <div className="col-12 mb-3">
                    <label className="form-label">Confirm Passcode</label>
                    <div className="password-input-wrapper">
                      <input
                        type={showSecConfirmPass ? "text" : "password"}
                        className="form-control"
                        id="confirmPasscode"
                        placeholder="Confirm new passcode"
                        minLength={4}
                        required
                        style={{ margin: 0, paddingRight: "44px" }}
                      />
                      <button
                        type="button"
                        className="password-toggle-btn"
                        onClick={() => setShowSecConfirmPass(!showSecConfirmPass)}
                      >
                        <FontAwesomeIcon icon={showSecConfirmPass ? faEyeSlash : faEye} />
                      </button>
                    </div>
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

                <h3 className="tab-title">Biometric Authentication (Fingerprint / Windows Hello)</h3>
                <p className="text-muted mt-2">Link your device fingerprint or face recognition to unlock this admin dashboard without entering the passcode.</p>

                <div className="mt-3 p-4 glass-card d-flex align-items-center justify-content-between" style={{ border: "1px solid rgba(255, 255, 255, 0.05)" }}>
                  <div>
                    <h5 className="mb-1" style={{ color: "#ffffff" }}>Fingerprint Status</h5>
                    <p className="mb-0 text-muted" style={{ fontSize: "13px" }}>
                      {hasBiometrics
                        ? "✔ Fingerprint login is enabled on this portfolio."
                        : "❌ Fingerprint login is disabled. You must enter your passcode to log in."
                      }
                    </p>
                  </div>
                  <div>
                    {hasBiometrics ? (
                      <button
                        onClick={handleRemoveBiometric}
                        className="btn btn-outline-danger px-4 rounded-pill"
                      >
                        Remove Fingerprint
                      </button>
                    ) : (
                      <button
                        onClick={handleRegisterBiometric}
                        className="btn btn-outline-info px-4 rounded-pill"
                      >
                        Register Fingerprint
                      </button>
                    )}
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
                    <div className="password-input-wrapper">
                      <input
                        type={showSmtpPass ? "text" : "password"}
                        className="form-control"
                        value={smtpPass}
                        onChange={(e) => setSmtpPass(e.target.value)}
                        placeholder="Enter SMTP App Password"
                        required
                        style={{ margin: 0, paddingRight: "44px" }}
                      />
                      <button
                        type="button"
                        className="password-toggle-btn"
                        onClick={() => setShowSmtpPass(!showSmtpPass)}
                      >
                        <FontAwesomeIcon icon={showSmtpPass ? faEyeSlash : faEye} />
                      </button>
                    </div>
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

            {/* USERS MANAGER TAB */}
            {activeTab === "users" && currentUser.username === "admin" && (
              <div>
                <h3 className="tab-title">Team Users Manager</h3>
                <p className="text-muted mt-2">Create and manage access for team members. Sub-users can login with their Gmail/username and password.</p>

                <div className="glass-card p-4 mt-4 mb-4" style={{ border: "1px solid rgba(255, 255, 255, 0.05)" }}>
                  <h5 className="mb-3 text-info" style={{ fontWeight: '700' }}>Add New Team User</h5>
                  <form onSubmit={handleAddUser} className="row align-items-end">
                    <div className="col-md-4 mb-3">
                      <label className="form-label">Gmail / Username</label>
                      <input
                        type="email"
                        className="form-control"
                        placeholder="user@gmail.com"
                        value={newUserName}
                        onChange={(e) => setNewUserName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="col-md-4 mb-3">
                      <label className="form-label">Password</label>
                      <div className="password-input-wrapper">
                        <input
                          type={showNewUserPass ? "text" : "password"}
                          className="form-control"
                          placeholder="Enter password"
                          value={newUserPass}
                          onChange={(e) => setNewUserPass(e.target.value)}
                          required
                          minLength={4}
                          style={{ margin: 0, paddingRight: "44px" }}
                        />
                        <button
                          type="button"
                          className="password-toggle-btn"
                          onClick={() => setShowNewUserPass(!showNewUserPass)}
                        >
                          <FontAwesomeIcon icon={showNewUserPass ? faEyeSlash : faEye} />
                        </button>
                      </div>
                    </div>
                    <div className="col-md-2 mb-3">
                      <label className="form-label">Permission</label>
                      <select
                        className="form-select"
                        value={newUserPerm}
                        onChange={(e) => setNewUserPerm(e.target.value as "Read Only" | "Full Access")}
                      >
                        <option value="Read Only">Read Only</option>
                        <option value="Full Access">Full Access</option>
                      </select>
                    </div>
                    <div className="col-md-2 mb-3">
                      <button
                        type="submit"
                        className="button button-primary w-100"
                        disabled={addingUser}
                        style={{ height: "42px", padding: "0 15px" }}
                      >
                        {addingUser ? "Adding..." : "Add User"}
                      </button>
                    </div>
                  </form>
                </div>

                <h5 className="mb-3 text-info" style={{ fontWeight: '700' }}>Existing Team Users</h5>
                {loadingUsers ? (
                  <div className="text-center py-4">
                    <div className="spinner-border text-info" role="status"></div>
                    <p className="text-muted mt-2">Loading team members...</p>
                  </div>
                ) : subUsers.length === 0 ? (
                  <div className="text-center py-5 text-muted glass-card">
                    <p style={{ fontSize: "16px", margin: 0 }}>No team users created yet.</p>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-dark table-hover align-middle">
                      <thead>
                        <tr>
                          <th style={{ width: "40%" }}>Gmail / Username</th>
                          <th style={{ width: "30%" }}>Password</th>
                          <th style={{ width: "20%" }}>Permission Role</th>
                          <th style={{ width: "10%" }}>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {subUsers.map((user: any, idx: number) => {
                          const isEditing = editingUserUsername === user.username;
                          return (
                            <tr key={idx}>
                              <td style={{ color: "#ffffff", fontWeight: 600 }}>{user.username}</td>
                              <td style={{ color: "#9ca3af", fontFamily: "monospace" }}>
                                <div className="d-flex align-items-center justify-content-between" style={{ minWidth: "140px" }}>
                                  <span>{visiblePasswords.includes(user.username) ? user.password : "••••••••"}</span>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      if (visiblePasswords.includes(user.username)) {
                                        setVisiblePasswords(visiblePasswords.filter(u => u !== user.username));
                                      } else {
                                        setVisiblePasswords([...visiblePasswords, user.username]);
                                      }
                                    }}
                                    className="btn btn-sm btn-link text-muted p-0 ms-2"
                                    style={{ border: "none", background: "transparent", cursor: "pointer" }}
                                    title={visiblePasswords.includes(user.username) ? "Hide Password" : "Show Password"}
                                  >
                                    <FontAwesomeIcon icon={visiblePasswords.includes(user.username) ? faEyeSlash : faEye} />
                                  </button>
                                </div>
                              </td>
                              <td>
                                {isEditing ? (
                                  <select
                                    className="form-select form-select-sm"
                                    value={editingUserPermission}
                                    onChange={(e) => setEditingUserPermission(e.target.value as "Read Only" | "Full Access")}
                                    style={{ maxWidth: "150px" }}
                                  >
                                    <option value="Read Only">Read Only</option>
                                    <option value="Full Access">Full Access</option>
                                  </select>
                                ) : (
                                  <div className="d-flex align-items-center">
                                    <span className={`badge ${user.permission === "Full Access" ? "bg-success" : "bg-info"}`} style={{ padding: "6px 12px", borderRadius: "12px", fontSize: "12px" }}>
                                      {user.permission}
                                    </span>
                                    <button
                                      onClick={() => {
                                        setEditingUserUsername(user.username);
                                        setEditingUserPermission(user.permission);
                                      }}
                                      className="btn btn-sm btn-link text-info ms-2 p-0"
                                      title="Edit Permission"
                                      style={{ border: "none", background: "transparent" }}
                                    >
                                      <FontAwesomeIcon icon={faEdit} />
                                    </button>
                                  </div>
                                )}
                              </td>
                              <td>
                                {isEditing ? (
                                  <div className="d-flex gap-2">
                                    <button
                                      onClick={() => handleUpdateUserPermission(user.username, editingUserPermission)}
                                      className="btn btn-sm btn-outline-success"
                                      title="Save Role"
                                    >
                                      <FontAwesomeIcon icon={faCheck} />
                                    </button>
                                    <button
                                      onClick={() => setEditingUserUsername(null)}
                                      className="btn btn-sm btn-outline-warning"
                                      title="Cancel"
                                    >
                                      <FontAwesomeIcon icon={faTimes} />
                                    </button>
                                  </div>
                                ) : (
                                  <button
                                    onClick={() => handleDeleteUser(user.username)}
                                    className="btn btn-sm btn-outline-danger"
                                    title="Delete User"
                                  >
                                    <FontAwesomeIcon icon={faTrash} />
                                  </button>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
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

      {/* Custom Confirmation Modal */}
      {confirmConfig.show && (
        <div className="confirm-modal-overlay">
          <div className="confirm-modal-box glass-card">
            <h4 className="confirm-modal-title">{confirmConfig.title}</h4>
            <p className="confirm-modal-message">{confirmConfig.message}</p>
            <div className="confirm-modal-actions">
              <button
                type="button"
                className="button button-outline-primary"
                style={getBtnStyle("outline-primary", "confirm-cancel")}
                onClick={() => setConfirmConfig(prev => ({ ...prev, show: false }))}
                onMouseEnter={() => setHoveredBtn("confirm-cancel")}
                onMouseLeave={() => setHoveredBtn(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="button button-primary"
                style={getBtnStyle("primary", "confirm-ok")}
                onClick={confirmConfig.onConfirm}
                onMouseEnter={() => setHoveredBtn("confirm-ok")}
                onMouseLeave={() => setHoveredBtn(null)}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        .password-input-wrapper {
          position: relative;
          width: 100%;
        }
        .password-input-wrapper input {
          padding-right: 44px !important;
          margin-bottom: 0 !important;
        }
        .password-toggle-btn {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          background: transparent !important;
          border: none !important;
          color: rgba(255, 255, 255, 0.5) !important;
          cursor: pointer;
          padding: 0 !important;
          margin: 0 !important;
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          font-size: 16px !important;
          width: 32px !important;
          height: 32px !important;
          min-height: unset !important;
          box-shadow: none !important;
          outline: none !important;
          transition: color 0.2s;
          z-index: 5;
        }
        .password-toggle-btn:hover {
          color: #06b6d4 !important;
        }

        .confirm-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(4, 6, 12, 0.85);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          animation: fadeIn 0.2s ease-out;
        }
        .confirm-modal-box {
          max-width: 420px;
          width: 90%;
          background: rgba(13, 18, 30, 0.95);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 16px;
          padding: 30px;
          text-align: center;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6);
        }
        .confirm-modal-title {
          font-size: 20px;
          font-weight: 700;
          color: #ffffff;
          margin-bottom: 12px;
        }
        .confirm-modal-message {
          font-size: 14px;
          color: #9ca3af;
          line-height: 1.5;
          margin-bottom: 24px;
        }
        .confirm-modal-actions {
          display: flex;
          gap: 16px;
          justify-content: center;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        /* High-End Modern Table Styling */
        .admin-dashboard .table {
          background: rgba(13, 18, 30, 0.4) !important;
          border-collapse: separate !important;
          border-spacing: 0 8px !important;
          border: none !important;
        }

        .admin-dashboard .table thead th {
          background: transparent !important;
          border: none !important;
          color: #06b6d4 !important;
          font-weight: 700 !important;
          text-transform: uppercase !important;
          font-size: 11px !important;
          letter-spacing: 0.1em !important;
          padding: 12px 16px !important;
        }

        .admin-dashboard .table tbody tr {
          background: rgba(255, 255, 255, 0.02) !important;
          border: 1px solid rgba(255, 255, 255, 0.05) !important;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15) !important;
          transition: all 0.3s ease !important;
        }

        .admin-dashboard .table tbody tr:hover {
          background: rgba(255, 255, 255, 0.04) !important;
          transform: translateY(-2px) !important;
          box-shadow: 0 6px 15px rgba(6, 182, 212, 0.08) !important;
        }

        .admin-dashboard .table tbody td {
          border: none !important;
          padding: 16px !important;
          color: #f3f4f6 !important;
        }

        .admin-dashboard .table tbody tr td:first-child {
          border-top-left-radius: 12px !important;
          border-bottom-left-radius: 12px !important;
        }

        .admin-dashboard .table tbody tr td:last-child {
          border-top-right-radius: 12px !important;
          border-bottom-right-radius: 12px !important;
        }

        .admin-dashboard .badge {
          font-weight: 600 !important;
          letter-spacing: 0.02em !important;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2) !important;
        }
        .admin-dashboard .bg-success {
          background: linear-gradient(135deg, #10b981, #059669) !important;
          color: #ffffff !important;
        }
        .admin-dashboard .bg-info {
          background: linear-gradient(135deg, #06b6d4, #0891b2) !important;
          color: #ffffff !important;
        }

        /* Fix Select Option Colors */
        .admin-dashboard select option,
        .admin-dashboard .form-select option {
          background-color: #0d121e !important;
          color: #ffffff !important;
        }

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

        /* Unified Admin Dashboard Button Styles */
        .admin-dashboard .button,
        .admin-dashboard button.button,
        .admin-dashboard a.button {
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          font-weight: 600 !important;
          padding: 10px 22px !important;
          border-radius: 30px !important;
          font-size: 14px !important;
          line-height: normal !important;
          height: auto !important;
          min-height: 42px !important;
          text-transform: none !important;
          gap: 8px !important;
          transition: all 0.3s ease !important;
          text-decoration: none !important;
          box-shadow: none !important;
          border: 2px solid transparent !important;
        }

        .admin-dashboard .button:hover,
        .admin-dashboard button.button:hover,
        .admin-dashboard a.button:hover {
          transform: translateY(-2px) !important;
        }

        .admin-dashboard .button-primary {
          background: linear-gradient(135deg, #06b6d4, #8b5cf6) !important;
          color: #ffffff !important;
          border: none !important;
          box-shadow: 0 4px 15px rgba(6, 182, 212, 0.3) !important;
        }
        .admin-dashboard .button-primary:hover {
          box-shadow: 0 6px 20px rgba(6, 182, 212, 0.5) !important;
        }

        .admin-dashboard .button-outline-primary {
          border: 2px solid #06b6d4 !important;
          color: #06b6d4 !important;
          background: transparent !important;
        }
        .admin-dashboard .button-outline-primary:hover {
          background: #06b6d4 !important;
          color: #070a13 !important;
          box-shadow: 0 4px 12px rgba(6, 182, 212, 0.2) !important;
        }

        .admin-dashboard .button-outline-warning {
          border: 2px solid #ffc107 !important;
          color: #ffc107 !important;
          background: transparent !important;
        }
        .admin-dashboard .button-outline-warning:hover {
          background: #ffc107 !important;
          color: #070a13 !important;
          box-shadow: 0 4px 12px rgba(255, 193, 7, 0.2) !important;
        }

        .admin-dashboard .button-outline-danger {
          border: 2px solid #ef4444 !important;
          color: #ef4444 !important;
          background: transparent !important;
        }
        .admin-dashboard .button-outline-danger:hover {
          background: #ef4444 !important;
          color: #070a13 !important;
          box-shadow: 0 4px 12px rgba(239, 68, 68, 0.2) !important;
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

        .admin-dashboard table {
          min-width: 650px;
        }

        .admin-dashboard table input[type="text"] {
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
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

        @media (max-width: 767px) {
          .admin-dashboard {
            padding: 12px !important;
          }
          .admin-header h1 {
            font-size: 20px !important;
          }
          .admin-header p {
            font-size: 13px !important;
          }
          .admin-header {
            gap: 12px !important;
          }
          .dashboard-content {
            padding: 16px !important;
          }
          .tab-title {
            font-size: 18px !important;
          }
          .form-control,
          .form-select,
          .admin-dashboard select option,
          .admin-dashboard .form-select option {
            font-size: 13px !important;
            padding: 8px 12px !important;
          }
          .form-label {
            font-size: 10px !important;
          }
          .admin-dashboard .button,
          .admin-dashboard button.button,
          .admin-dashboard a.button {
            font-size: 13px !important;
            padding: 8px 16px !important;
            min-height: 36px !important;
          }
          .admin-dashboard .table tbody td {
            padding: 10px 8px !important;
            font-size: 13px !important;
          }
          .admin-dashboard .table thead th {
            padding: 8px !important;
            font-size: 10px !important;
          }
          .skill-cat-editor {
            padding: 12px !important;
          }
          .item-editor-card {
            padding: 16px !important;
          }
          .login-box {
            padding: 30px 20px !important;
          }
          .login-box h2 {
            font-size: 20px !important;
          }
        }
      `}</style>
    </div>
  );
}
