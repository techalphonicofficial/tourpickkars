"use client";
import React, { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShareNodes,
  faLink,
  faCopy,
  faCheck,
  faEnvelope,
  faCommentDots
} from "@fortawesome/free-solid-svg-icons";

const ShareButton = ({ packageLink, packageName = "Package" }) => {
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const menuRef = useRef(null);

  // To handle the fully resolved URL in the client properly
  const [currentUrl, setCurrentUrl] = useState('');
  useEffect(() => {
    if (typeof window !== "undefined") {
      const shareUrl = packageLink
        ? new URL(packageLink, window.location.origin).href
        : window.location.href;
      setCurrentUrl(shareUrl);
    }
  }, [packageLink]);

  // Close drop down on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowShareOptions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const shareOptions = [
    {
      name: copySuccess ? "Link Copied!" : "Copy Link",
      icon: copySuccess ? faCheck : faCopy,
      action: () => copyToClipboard(currentUrl),
      color: copySuccess ? "#10b981" : "#64748b",
    },
    {
      name: "WhatsApp",
      icon: faCommentDots,
      action: () => shareOnWhatsApp(currentUrl, packageName),
      color: "#25D366",
    },
    {
      name: "Twitter (X)",
      icon: faCommentDots,
      action: () => shareOnTwitter(currentUrl, packageName),
      color: "#1DA1F2",
    },
    {
      name: "LinkedIn",
      icon: faLink,
      action: () => shareOnLinkedIn(currentUrl, packageName),
      color: "#0A66C2",
    },
    {
      name: "Email",
      icon: faEnvelope,
      action: () => shareViaEmail(currentUrl, packageName),
      color: "#ea4335",
    },
  ];

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2500);
    } catch (err) {
      console.error("Failed to copy: ", err);
      // Fallback
      const textArea = document.createElement("textarea");
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2500);
    }
  };

  const shareOnWhatsApp = (link, name) => {
    const phone = "919679945077"; // country code + number
    const tripUrl = link ? new URL(link, window.location.origin).href : window.location.href;
    const message = `Hi Tour Pickkars, I'm interested in booking a trip: ${name}\n${tripUrl}`;
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

    window.open(url, "_blank", "noopener,noreferrer");
  };

  const shareOnTwitter = (link, name) => {
    const text = `Check out this amazing package: ${name}`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      text
    )}&url=${encodeURIComponent(link)}`;
    window.open(url, "_blank", "width=550,height=420");
  };

  const shareOnLinkedIn = (link, name) => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
      link
    )}`;
    window.open(url, "_blank", "width=550,height=420");
  };

  const shareViaEmail = (link, name) => {
    const subject = `Check out this package: ${name}`;
    const body = `I found this package that might interest you:\n\n${name}\n${link}`;
    window.location.href = `mailto:?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
  };

  // Using Web Share API if available natively
  const handleNativeShare = async (e) => {
    e.preventDefault();
    if (navigator.share) {
      try {
        await navigator.share({
          title: packageName,
          text: `Check out this package: ${packageName}`,
          url: currentUrl,
        });
      } catch (error) {
        console.log("Native share failed:", error);
      }
    } else {
      setShowShareOptions(!showShareOptions);
    }
  };

  return (
    <div className="position-relative d-inline-block" ref={menuRef}>
      <button
        className="th-btn style4 d-flex align-items-center gap-2"
        style={{ padding: "10px 20px" }}
        onClick={handleNativeShare}
      >
        <FontAwesomeIcon icon={faShareNodes} />
        Share
      </button>

      {/* Share Options Dropdown Menu */}
      {showShareOptions && (
        <div
          className="shadow-lg bg-white rounded-3 position-absolute"
          style={{
            top: "115%",
            left: "0",
            minWidth: "220px",
            zIndex: 1050,
            border: "1px solid #edf2f7",
            overflow: "hidden"
          }}
        >
          {/* Header Link Display */}
          <div className="p-3 border-bottom" style={{ backgroundColor: "#f8fafc" }}>
            <div className="d-flex align-items-center gap-2 text-muted" style={{ fontSize: "13px" }}>
              <FontAwesomeIcon icon={faLink} />
              <span className="text-truncate" style={{ maxWidth: "150px" }}>{currentUrl}</span>
            </div>
          </div>

          {/* Action List */}
          <div className="py-2">
            {shareOptions.map((option, index) => (
              <button
                key={index}
                className="w-100 text-start px-3 py-2 border-0 bg-transparent d-flex align-items-center gap-3"
                style={{
                  transition: "background 0.2s",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "500",
                  color: "#334155"
                }}
                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#f1f5f9")}
                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                onClick={() => {
                  option.action();
                  if (option.name !== "Copy Link") {
                    setShowShareOptions(false);
                  }
                }}
              >
                <div
                  className="d-flex justify-content-center align-items-center rounded-circle"
                  style={{ width: "26px", height: "26px", backgroundColor: `${option.color}15`, color: option.color }}
                >
                  <FontAwesomeIcon icon={option.icon} />
                </div>
                <span>{option.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ShareButton;
