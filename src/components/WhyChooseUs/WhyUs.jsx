"use client";

import React, { useEffect, useState } from "react";
import "./whyUs.css";
import { motion } from "framer-motion";
import "react-loading-skeleton/dist/skeleton.css";
import { getPagewithSection } from "@/services/pageSection";

const data = await getPagewithSection(1, "why_choose_us");

const WhyUs = () => {
  const [grouped, setGrouped] = useState([]);

  useEffect(() => {
    const groupedArr = [];
    let temp = [];

    for (let i = 2; i <= 13; i++) {
      const obj = data.section[i];
      if (!obj) continue;

      if (obj.type === "image") {
        if (temp.length) groupedArr.push(temp);
        temp = [{ image: obj.data }];
      } else if (obj.type === "Text") {
        temp.push({ Text: obj.data });
      } else if (obj.type === "content") {
        temp.push({ content: obj.data });
      }
    }

    if (temp.length) groupedArr.push(temp);

    setGrouped(groupedArr);
  }, []);
  
  const FadeUp = (delay) => {
    return {
      initial: { opacity: 0, y: 40 },
      animate: {
        opacity: 1,
        y: 0,
        transition: {
          type: "spring",
          stiffness: 100,
          damping: 20,
          duration: 0.6,
          delay: delay,
          ease: "easeOut",
        },
      },
    };
  };

  const formattedTitle = data.section[1].data.Text.replace(/tourpickkars/g, "Tour Pickkars").replace(/Enlive/g, "Tour Pickkars");
  const titleWords = formattedTitle.split(" ");
  
  return (
    <div className="whyus-container space" id="whyus-sec">
      <div className="container">
        <div className="whyus-header">
          <div className="whyus-eyebrow">
            {data.section[0].data.Text}
          </div>
          <h2 className="whyus-title">
            {titleWords.slice(0, -2).join(" ")}{" "}
            <span>{titleWords.slice(-2).join(" ")}</span>
          </h2>
        </div>

        <div className="whyus-grid">
          {grouped.map((item, index) => (
            <motion.div
              variants={FadeUp(index * 0.1)}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, amount: 0.2 }}
              key={index}
              className="whyus-card-wrapper"
            >
              <article className="whyus-card">
                <div className="whyus-icon-wrapper">
                  <img 
                    src={`${process.env.NEXT_PUBLIC_MEDIA_PATH}${item[0].image.image}`} 
                    alt={item[1].Text.Text} 
                    className="whyus-icon" 
                  />
                </div>
                <div className="whyus-card-content">
                  <h3 className="whyus-card-title">{item[1].Text.Text}</h3>
                  <p className="whyus-card-description">
                    {item[2].content.content}
                  </p>
                </div>
              </article>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WhyUs;
