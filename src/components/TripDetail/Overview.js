"use client";
import Link from "next/link";
import React, { useState, useRef, useEffect } from "react";
import { sanitizeCmsHtml } from "@/functions/sanitizeCmsHtml";

export default function Overview({description}) {
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
        <h3>Overview</h3>
      </div>

      <div className="tour-page-single mt-20">
        <div
          className="page-content"
          style={{
            maxHeight: height,
            overflow: "hidden",
            transition: "max-height 0.6s ease",
          }}
          ref={contentRef}
        >
          <div id="OverviewContent" dangerouslySetInnerHTML={{ __html: sanitizeCmsHtml(description) }}/>
        </div>
      </div>

      <div className="view_more_less d-flex justify-content-end">
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
  );
}
