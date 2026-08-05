import Link from "next/link";
import Image from "next/image";
import React from "react";
import { createSlug } from "@/functions/createSlug";

export const CategoriesCard = ({ image, title, slug }) => {
  // console.log("CategoriesCard" , image)
  return (
    <div className="category-card single">
      <div className="category-card-inner">
        <div className="category-image-wrapper">
          <Link href={`/trips/${slug || ''}`}>
            <Image
              src={image}
              alt={title}
              fill
              className="category-img"
            />
          </Link>
          <div className="category-overlay"></div>
        </div>
        <div className="category-content">
          <div className="category-title h3">
            <Link href={`/trips/${slug || ''}`}>{title}</Link>
          </div>
          <Link href={`/trips/${slug || ''}`} className="category-btn">
            <span>Explore Now</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
          </Link>
        </div>
      </div>
    </div>
  );
};
