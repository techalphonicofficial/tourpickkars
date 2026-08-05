"use client"
import React, { useEffect, useState } from "react";
import { sanitizeCmsHtml } from "@/functions/sanitizeCmsHtml";

const Notes = ({note}) => {
  return (

    <div className="min_box-detail Age_limit container my-5 mt-24">
      <div className="title">
        <div className="h3">
          Notes
        </div>
      </div>
      <div
        className="notes-data p-3"
        dangerouslySetInnerHTML={{ __html: sanitizeCmsHtml(note) }}
      />
    </div>
  );  
};

export default Notes;
