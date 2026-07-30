"use client";
import "./Footer.css";
import { api } from "@/services/config";
import {
  faFacebookF,
  faInstagram,
  faWhatsapp,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { sanitizeCmsHtml } from "@/functions/sanitizeCmsHtml";

const replaceOldPhone = (value = "") =>
  String(value).replace(/9876543210/g, "9679945077");

const WHATSAPP_PHONE = "919679945077";
const WHATSAPP_MESSAGE = "Hi Tour Pickkars, I'm interested in booking a trip";

const stripLinks = (html = "") =>
  String(html).replace(/<a\b[^>]*>(.*?)<\/a>/gi, "$1");

export default function Footer({ footer }) {
  const whatsappMessage = encodeURIComponent(WHATSAPP_MESSAGE);
  const socialLinks = {
    facebook: "https://www.facebook.com/share/1CsHDHFwwG/",
    youtube: "https://youtube.com/@tourpickkars",
    instagram: "https://www.instagram.com/tourpickkars?igsh=b2RwY2E5MWt1MXJo",
    whatsapp: `https://api.whatsapp.com/send?phone=${WHATSAPP_PHONE}&text=${whatsappMessage}`,
  };

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await api.post("/booking/send-newsletter", { email });

      if (res.data.status) {
        setMessage(res.data.message || "Subscribed successfully!");
        setEmail(""); // clear input
      }
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Something went wrong, try again!"
      );
    } finally {
      setLoading(false);
    }
  };

  const [richText, setRichText] = useState("");
  const primaryPhone = replaceOldPhone(footer.section[2].data.button_label);
  const primaryPhoneLink = replaceOldPhone(footer.section[2].data.button_link);
  const secondaryPhone = replaceOldPhone(footer.section[3].data.button_label);
  const secondaryPhoneLink = replaceOldPhone(footer.section[3].data.button_link);
  const floatingWhatsappLink = socialLinks.whatsapp;

  useEffect(() => {
    setRichText(stripLinks(footer.section[8].data.rich_text));
  }, [footer]);

  return (
    <footer className="custom-footer">
      <div className="container">

        {/* Newsletter Section */}
        <div className="footer-newsletter">
          <div className="newsletter-content">
            <h3>Stay Informed Every Week</h3>
            <p>Sign up for our newsletter and never miss new travel deals and expert tips.</p>
          </div>
          <div className="newsletter-form-wrapper">
            <form className="newsletter-form" onSubmit={handleSubmit}>
              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button
                type="submit"
                className="newsletter-btn"
                disabled={loading}
              >
                {loading ? "Subscribing..." : "Subscribe"}
                <FontAwesomeIcon icon={faPaperPlane} />
              </button>
            </form>
            {message && (
              <div style={{ color: '#00ba9d', marginTop: '12px', fontSize: '0.9rem', paddingLeft: '20px' }}>
                {message}
              </div>
            )}
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="footer-main">

          {/* About Column */}
          <div className="footer-about">
            <Link href="/" className="about-logo">
              <Image
                src={process.env.NEXT_PUBLIC_MEDIA_PATH + footer.section[0].data.image}
                alt="Tour Pickkars"
                width={160}
                height={55}
                style={{ objectFit: 'contain' }}
              />
            </Link>
            <p className="text-white text-justify">{footer.section[1].data.content}</p>
            <div className="footer-socials">
              <Link href={socialLinks.facebook} className="social-facebook" target="_blank" rel="noreferrer" aria-label="Facebook">
                <FontAwesomeIcon icon={faFacebookF} />
              </Link>
              <Link href={socialLinks.youtube} className="social-youtube" target="_blank" rel="noreferrer" aria-label="YouTube">
                <FontAwesomeIcon icon={faYoutube} />
              </Link>
              <Link href={socialLinks.whatsapp} className="social-whatsapp" target="_blank" rel="noreferrer" aria-label="WhatsApp">
                <FontAwesomeIcon icon={faWhatsapp} />
              </Link>
              <Link href={socialLinks.instagram} className="social-instagram" target="_blank" rel="noreferrer" aria-label="Instagram">
                <FontAwesomeIcon icon={faInstagram} />
              </Link>
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="footer-links">
            <h3 className="footer-col-title">Quick Links</h3>
            <ul>
              <li>
                <Link href="/">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/blog">
                  Travel Blogs
                </Link>
              </li>
              <li>
                <Link href="/terms-and-conditions">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details Column */}
          <div className="footer-contact">
            <h3 className="footer-col-title">Contact Information</h3>

            <div className="contact-item">
              <div className="contact-item-icon">
                <Image src="/img/icon/phone.svg" alt="phone" width={20} height={20} />
              </div>
              <div className="contact-item-details">
                <p>
                  <Link href={primaryPhoneLink}>
                    +91 {primaryPhone}
                  </Link>
                </p>
                <p>
                  <Link href={secondaryPhoneLink}>
                    +91 {secondaryPhone}
                  </Link>
                </p>
              </div>
            </div>

            <div className="contact-item">
              <div className="contact-item-icon">
                <Image src="/img/icon/envelope.svg" alt="email" width={20} height={20} />
              </div>
              <div className="contact-item-details">
                <p>
                  <Link href={footer.section[4].data.button_link}>
                    {footer.section[4].data.button_label}
                  </Link>
                </p>
                <p>
                  <Link href={footer.section[5].data.button_link}>
                    {footer.section[5].data.button_label}
                  </Link>
                </p>
              </div>
            </div>

            <div className="contact-item">
              <div className="contact-item-icon">
                <Image src="/img/icon/location-dot.svg" alt="location" width={20} height={20} />
              </div>
              <div className="contact-item-details">
                <p>
                  <Link href={footer.section[6].data.button_link}>
                    {footer.section[6].data.button_label}
                  </Link>
                </p>
              </div>
            </div>

          </div>

          {/* Gallery Column */}
          <div className="footer-gallery-col">
            <h3 className="footer-col-title">Instagram Feed</h3>
            <div className="footer-gallery">
              {footer.section[7].data.gallery.slice(0, 6).map((gallery, index) => (
                <Link href={socialLinks.instagram} className="gallery-thumb" key={index} target="_blank" rel="noreferrer">
                  <Image
                    src={process.env.NEXT_PUBLIC_MEDIA_PATH + gallery}
                    alt="Gallery"
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </Link>
              ))}
            </div>
          </div>

        </div>

        {/* Footer Bottom / Copyright */}
        <div className="footer-bottom">
          <div
            className="copyright-text"
            dangerouslySetInnerHTML={{ __html: sanitizeCmsHtml(richText) }}
          />
          <div className="footer-payments">
            <span>Secure Payments</span>
            <Image
              src="/img/shape/cards.png"
              alt="cards"
              width={150}
              height={30}
              style={{ objectFit: 'contain' }}
            />
          </div>
        </div>


        <a href={`tel:${primaryPhone}`}>
          <button className="btn-floating phone">
            <img src="https://i.imgur.com/FZuns9L.png" alt="Phone" />
            <span>+91 {primaryPhone}</span>
          </button>
        </a>

        <a
          href={floatingWhatsappLink}
          target="_blank"
          rel="noreferrer"
        >
          <button className="btn-floating whatsapp">
            <img src="https://i.ibb.co/QFKtRNgb/whatsapp-new.webp" alt="WhatsApp" />
            <span> +91 {primaryPhone}</span>
          </button>
        </a>
      </div>
    </footer>
  );
}
