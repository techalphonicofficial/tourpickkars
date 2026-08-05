import Image from "next/image";
import Link from "next/link";
import React from "react";
import { createSlug } from "@/functions/createSlug";

export default function PopularCard({ image, title, subtitle, slug }) {
  return (
    <div className="destination-box gsap-cursor">
      <div className="destination-img" >
        <Image
          src={image}
          alt={title}
          fill
          className="object-fit-cover w-100 h-100 rounded"
        />
        <div className="destination-content">
          <div className="media-left">
            <div className="box-title h4">{title}</div>
            <span className="destination-subtitle">{subtitle} Packages</span>
          </div>
          <div className="btn-wrap">
            <Link
              href={`/destination/${slug}`}
              className="th-btn"
            >
              Explore
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
