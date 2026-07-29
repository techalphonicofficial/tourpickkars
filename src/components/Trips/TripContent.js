"use client";
import { useState, useRef, useEffect } from "react";

export default function TripContent({ content }) {
  const [showMore, setShowMore] = useState(false);
  const [maxHeight, setMaxHeight] = useState("240px");
  const contentRef = useRef(null);

  useEffect(() => {
    if (showMore && contentRef.current) {
      setMaxHeight(`${contentRef.current.scrollHeight + 30}px`);
    } else {
      setMaxHeight("240px");
    }
  }, [showMore]);

  return (
    <section className="py-5 my-3 bg-light">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-12">
            <div className="trip-content-wrap bg-white rounded-4 shadow-sm p-4 p-md-5 position-relative">
              <h2 className="mb-4 fw-bold">Overview</h2>

              <div
                className="trip-content-inner text-muted pb-3"
                ref={contentRef}
                style={{
                  maxHeight,
                  overflow: "hidden",
                  transition: "max-height 0.6s cubic-bezier(0.25, 1, 0.5, 1)",
                  position: "relative",
                  lineHeight: "1.8",
                  fontSize: "16px"
                }}
              >
                <div dangerouslySetInnerHTML={{ 
                  __html: content ? (() => {
                    let h1OpenCount = 0;
                    let h1CloseCount = 0;
                    return content
                      .replace(/<h1/gi, () => {
                        h1OpenCount++;
                        return h1OpenCount === 1 ? '<h1' : '<h2';
                      })
                      .replace(/<\/h1>/gi, () => {
                        h1CloseCount++;
                        return h1CloseCount === 1 ? '</h1>' : '</h2>';
                      });
                  })() : '' 
                }} />

                {/* Fade out effect when collapsed */}
                {!showMore && (
                  <div
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      width: '100%',
                      height: '80px',
                      background: 'linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,1))',
                      pointerEvents: 'none'
                    }}
                  />
                )}
              </div>

              <div className="mt-4 text-center">
                <button
                  onClick={() => setShowMore(!showMore)}
                  className="th-btn style3 fw-bold px-5 rounded-pill"
                >
                  {showMore ? "Read Less" : "Read More"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
