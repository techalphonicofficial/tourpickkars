"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";

export default function OverviewCont({ hasGallery = false }) {
  const [activeSection, setActiveSection] = useState("Overview");

  const sections = [
    { id: "Overview", label: "Overview" },
    { id: "Itinerary", label: "Itinerary" },
    ...(hasGallery ? [{ id: "Gallery", label: "Gallery" }] : []),
    { id: "Inclusions", label: "Inclusions" },
    { id: "Exclusions", label: "Exclusions" },
    { id: "Costing", label: "Costing" },
    { id: "ThingsToPack", label: "Things To Pack" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      let current = "";
      sections.forEach((section) => {
        const element = document.getElementById(section.id);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 300 && rect.bottom >= 300) {
            current = section.id;
          }
        }
      });
      if (current) {
        setActiveSection(current);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleClick = (e, id) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 260; // adjust if your sticky header height changes
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <div
      className="enlive-package-tabs min_box-detail dvsdvsdvsdv Age_limit container my-4"
      style={{
        position: "sticky",
        top: "90px",
        zIndex: 1,
        background: "#ffffff",
        padding: "6px 0",
      }}
    >
      <div className="tour-page-single mt-3">
        <div className="page-content">
          <ul className="over_vontent d-flex flex-wrap gap-3 list-unstyled align-items-center justify-content-around py-3">
            {sections.map((section) => (
              <li key={section.id}>
                <Link
                  href={`#${section.id}`}
                  className={activeSection === section.id ? "active fw-bold" : ""}
                  onClick={(e) => handleClick(e, section.id)}
                >
                  {section.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
