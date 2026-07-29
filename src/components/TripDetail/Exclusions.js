"use client";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";

export default function Exclusions({ exclusion }) {
  const [expanded, setExpanded] = useState(false);
  const [height, setHeight] = useState("0px");
  const contentRef = useRef(null);

  useEffect(() => {
    if (contentRef.current) {
      setHeight(expanded ? `${contentRef.current.scrollHeight}px` : "400px"); // default preview height
    }
  }, [expanded]);
  return (
    <div className="min_box-detail Age_limit container my-4">
      <div className="title">
        <h2 className="text-start fw-bold mb-4 page-title">
          Exclusions
        </h2>
      </div>

      <div className="tour-page-single mt-3">
        <div className="page-content">
          <div className="destination-checklist d-flex gap-4" style={{
            maxHeight: height,
            overflow: "hidden",
            transition: "max-height 0.4s ease",
          }}
            ref={contentRef}>


            {/* Exclusions */}
            <div className="checklist style5 flex-fill">
              <div
                id="exclusionContent"
                dangerouslySetInnerHTML={{ __html: exclusion }}
              />
            </div>
          </div>
          <div className=" view_more_less mt-24 d-flex justify-content-end">
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
