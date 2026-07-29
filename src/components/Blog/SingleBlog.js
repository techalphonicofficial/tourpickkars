import Link from "next/link";
import "../BlogSection/BlogSection.css"; // Import the shared premium blog CSS
import { createSlug } from "@/functions/createSlug";

function CalendarIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

export default function SingleBlog({post}) {
  return (
    <div className="blog-card" style={{ marginBottom: "30px", height: "calc(100% - 30px)" }}>
      {/* Image */}
      <div className="blog-card-img">
        <Link href={`/blog/${createSlug(post.slug)}`} style={{ display: "block", width: "100%", height: "100%" }}>
          <img
            src={post.image}
            alt={post.heading}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </Link>
        {/* Category badge */}
        <span className="blog-cat-badge">Travel</span>
        {/* Date badge */}
        <span className="blog-date-badge">
          <CalendarIcon />
          {post.created_at}
        </span>
      </div>

      {/* Body */}
      <div className="blog-card-body">
        <h3 className="blog-card-title">
          <Link href={`/blog/${createSlug(post.slug)}`}>{post.heading}</Link>
        </h3>

        {post.excerpt && (
          <p className="blog-card-excerpt">{post.excerpt}</p>
        )}

        <div className="blog-card-footer">
          <div className="blog-author-chip">
            <div className="blog-author-avatar">TP</div>
            Tour Pickkars
          </div>
          <Link href={`/blog/${createSlug(post.slug)}`} className="blog-read-link">
            Read More <ArrowIcon />
          </Link>
        </div>
      </div>
    </div>
  );
}
