"use client"
import React, { useEffect, useState } from "react";

const Notes = ({note}) => {
  return (

    <div className="min_box-detail Age_limit container my-5 mt-24">
      <div className="title">
        <h2 className="text-start fw-bold mb-4 page-title">
          Notes
        </h2>
      </div>
      <div
        className="notes-data p-3"
        dangerouslySetInnerHTML={{ __html: note }}
      />
    </div>
  );  
};

export default Notes;
