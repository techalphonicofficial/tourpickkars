"use client";
import "./Header.css";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faPhone,
} from "@fortawesome/free-solid-svg-icons";
import {
  faEnvelope,
} from "@fortawesome/free-regular-svg-icons";
import HeaderMob from "./HeaderMob";
import Popup from "../HelpingCompnents/Popup";
import { createSlug } from "@/functions/createSlug";

const replaceOldPhone = (value = "") =>
  String(value).replace(/9876543210/g, "9679945077");

export default function Header({ mainpage, tripsWithcount }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header className={`th-header ${scrolled ? "scrolled" : ""}`}>
        {/* 🔹 Header Top */}
        <div className="header-top d-none d-lg-block">
          <div className="container th-container">
            <div className="header-top-inner d-flex justify-content-between align-items-center">
              {/* Left Side: Contact Info */}
              <div className="header-contact">
                <ul>
                  <li>
                    <FontAwesomeIcon icon={faPhone} className="dropdown-icon" />
                    <span>{replaceOldPhone(mainpage.sections[0].section[0].data.Text)}</span>
                  </li>
                  <li>
                    <FontAwesomeIcon icon={faEnvelope} className="dropdown-icon" />
                    <span>{mainpage.sections[0].section[1].data.Text}</span>
                  </li>
                </ul>
              </div>

              {/* Right Side: Quick Links */}
              <div className="header-quick-links">
                <ul>
                  {mainpage.sections[0].section[2].data.trip_items.map(
                    (item, index) => (
                      <li key={index}>
                        <Link href={`/trips/${item.slug}`}>
                          {item.heading}
                        </Link>
                      </li>
                    )
                  )}
                  <li>
                    <Link href="/contact">Contact</Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* 🔹 Main Navigation */}
        <div className="sticky-wrapper">
          <div className="container th-container">
            <div className="menu-area d-flex align-items-center justify-content-between">
              {/* Logo */}
              <div className="header-logo">
                <Link href="/">
                  <Image
                    src={
                      process.env.NEXT_PUBLIC_MEDIA_PATH +
                      mainpage.sections[1].section[0].data.image
                    }
                    alt="Tour Pickkars"
                    width={120}
                    height={60}
                    style={{ objectFit: "contain" }}
                  />
                </Link>
              </div>

              {/* Desktop Menu */}
              <nav className="main-menu d-none d-xl-block">
                <ul>
                  <li>
                    <Link href="/custom-trips">Custom Trips</Link>
                  </li>
                  {mainpage.sections[1].section[1].data.trip_items.map(
                    (item, index) => (
                      <li key={index}>
                        <Link href={`/trips/${item.slug}`}>
                          {item.heading}
                        </Link>
                      </li>
                    )
                  )}
                  <li>
                    <Link href="/upcoming-trips">Upcoming Trips</Link>
                  </li>
                  <li className="menu-item-has-children">
                    <span className="asdfasd">Domestic Trips</span>
                    <ul className="sub-menu">
                      {tripsWithcount
                        .filter((item) => item.international === 0)
                        .map((item) => (
                          <li key={item.id}>
                            <Link href={`/trips/${item.slug}`}>
                              {item.heading}
                            </Link>
                          </li>
                        ))}
                    </ul>
                  </li>
                  <li className="menu-item-has-children">
                    <span className="asdfasd">International Trips</span>
                    <ul className="sub-menu">
                      {tripsWithcount
                        .filter((item) => item.international === 1)
                        .map((item) => (
                          <li key={item.id}>
                            <Link href={`/trips/${item.slug}`}>
                              {item.heading}
                            </Link>
                          </li>
                        ))}
                    </ul>
                  </li>
                  <li>
                    <Link href="/blog">Blogs</Link>
                  </li>
                </ul>
              </nav>

              {/* Mobile menu toggle */}
              <button
                type="button"
                className="th-menu-toggle d-block d-xl-none"
                onClick={() => setMenuOpen(true)}
              >
                <FontAwesomeIcon icon={faBars} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ✅ Mobile Menu */}
      <HeaderMob
        mainpage={mainpage}
        menuOpen={menuOpen}
        tripsWithcount={tripsWithcount}
        setMenuOpen={setMenuOpen}
      />
      <Popup />
    </>
  );
}
