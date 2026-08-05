"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { createSlug } from "@/functions/createSlug";

export default function HeaderMob({ mainpage, menuOpen, setMenuOpen, tripsWithcount }) {
  const [activeMenu, setActiveMenu] = useState(null);

  // Toggle function
  const handleMenuClick = (index) => {
    setActiveMenu(activeMenu === index ? null : index); // toggle open/close
  };

  // Close menu when clicking a link
  const handleLinkClick = () => {
    setMenuOpen(false);
  };

  return (
    <div
      className={`th-menu-wrapper onepage-nav ${menuOpen ? "th-body-visible" : ""
        }`}
    >
      <div className="th-menu-area">
        {/* Close Button */}
        <button className="th-menu-toggle" onClick={() => setMenuOpen(false)}>
          <FontAwesomeIcon icon={faTimes} />
        </button>

        {/* Mobile Logo */}
        <div className="mobile-logo text-left">
          <Link href="/" className="inline-block" onClick={handleLinkClick}>
            <Image
              src={
                process.env.NEXT_PUBLIC_MEDIA_PATH +
                mainpage.sections[1].section[0].data.image
              }
              alt="Logo"
              width={120}
              height={60}
            />
          </Link>
        </div>

        {/* Mobile Menu */}
        <div className="th-mobile-menu">
          <ul>
            {mainpage.sections[1].section[1].data.trip_items.map(
              (item, index) => (
                <li key={index}>
                  <Link href={`/trips/${item.slug}`} onClick={handleLinkClick}>
                    {item.heading}
                  </Link>
                </li>
              )
            )}
            <li>
              <Link href="/upcoming-trips" onClick={handleLinkClick}>
                Upcoming Trips
              </Link>
            </li>

            {/* Dropdown */}
            <li
              className={`menu-item-has-children th-item-has-children ${activeMenu === 0 ? "th-active" : ""
                }`}
              onClick={() => handleMenuClick("domestic")}
            >
              <a>Domestic Trips</a>
              <ul
                className="sub-menu th-submenu ms-3"
                style={{ display: activeMenu === "domestic" ? "block" : "none" }}
              >
                {tripsWithcount
                  .filter((item) => item.international === 0)
                  .map((item) => (
                    <li key={item.id}>
                      <Link href={`/trips/${item.slug}`} onClick={handleLinkClick}>
                        {item.heading}
                      </Link>
                    </li>
                  ))}
              </ul>
            </li>
            <li
              className={`menu-item-has-children th-item-has-children ${activeMenu === 0 ? "th-active" : ""
                }`}
              onClick={() => handleMenuClick("international")}
            >
              <a>International Trips</a>
              <ul
                className="sub-menu th-submenu ms-3"
                style={{ display: activeMenu === "international" ? "block" : "none" }}
              >
                {tripsWithcount
                  .filter((item) => item.international === 1)
                  .map((item) => (
                    <li key={item.id}>
                      <Link href={`/trips/${item.slug}`} onClick={handleLinkClick}>
                        {item.heading}
                      </Link>
                    </li>
                  ))}
              </ul>
            </li>


            <li>
              <Link href="/blog" onClick={handleLinkClick}>
                Blog
              </Link>
            </li>
            <li>
              <Link href="/contact" onClick={handleLinkClick}>
                Contact Us
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
