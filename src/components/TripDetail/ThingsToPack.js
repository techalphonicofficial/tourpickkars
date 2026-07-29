"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";

export default function ThingsToPack({ things_to_pack }) {
  const [expanded, setExpanded] = useState(false);
  const [height, setHeight] = useState("0px");
  const contentRef = useRef(null);

  useEffect(() => {
    if (contentRef.current) {
      setHeight(expanded ? `${contentRef.current.scrollHeight}px` : "400px"); // default preview height
    }
  }, [expanded]);

  return (
    <div id="ThingsToPack" className="min_box-detail Age_limit container my-4">
      <div className="title">
        <h2 className="text-start fw-bold mb-4 page-title">Things To Pack</h2>
      </div>

      <div className="tour-page-single mt-3">
        <div className="page-content">
          <div
            className="destination-checklist d-flex gap-4"
            style={{
              maxHeight: height,
              overflow: "hidden",
              transition: "max-height 0.4s ease",
            }}
            ref={contentRef}
          >
            {/* Inclusions */}
            <div className="checklist style2 style4 flex-fill">
              <div
                id="things_to_packContent"
                dangerouslySetInnerHTML={{ __html: things_to_pack }}
              />
            </div>
          </div>

          {/* View More / View Less */}
          <div className="view_more_less mt-24 d-flex justify-content-end">
            <Link
              href="#"
              role="button"
              onClick={(e) => {
                e.preventDefault();
                setExpanded(!expanded);
              }}
            >
              {expanded ? "View Less" : "View More"}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
