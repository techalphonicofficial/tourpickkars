import {
  faFacebookF,
  faLinkedinIn,
  faTwitter,
} from "@fortawesome/free-brands-svg-icons";
import { faCalendarDays, faUser } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { getSingleBlog } from "@/services/blogApi";
import { notFound } from "next/navigation";
import { createSlug } from "@/functions/createSlug";
import { sanitizeCmsHtml } from "@/functions/sanitizeCmsHtml";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";
export const dynamicParams = true;

const getblog = async (slug) => {
  return await getSingleBlog(slug);
};

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const blog = await getblog(slug);

  return {
    title: blog.blog.meta_title,
    description: blog.blog.meta_description,
    keywords: blog.blog.meta_description,
    alternates: {
      canonical: `/blog/${slug}`,
    },
    openGraph: {
      type: "article",
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/blog/${slug}`,
      title: blog.blog.meta_title,
      description: blog.blog.meta_description,
      keywords: blog.blog.meta_description,
      images: [{ url: blog.blog.image }],
    },
    twitter: {
      card: "summary_large_image",
      title: blog.blog.meta_title,
      description: blog.blog.meta_description,
      images: [blog.blog.image],
    },
  };
}
export default async function PageDetail({ params }) {
  const { slug } = await params;
  const pathname = `${process.env.NEXT_PUBLIC_SITE_URL}/blog/${slug}`;
  const blog = await getblog(slug);

  // console.log("blog data", blog);

  if (!blog) {
    return notFound();
  }

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: blog.blog.meta_title,
    description: blog.blog.meta_description,
    image: blog.blog.image,
    author: {
      "@type": "Organization",
      name: "tourpickkars",
    },
    publisher: {
      "@type": "Organization",
      name: "tourpickkars",
      logo: {
        "@type": "ImageObject",
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/assets/images/logo.png`,
      },
    },
    datePublished: blog.blog.created_at,
    dateModified: blog.blog.updated_at || blog.blog.created_at,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${process.env.NEXT_PUBLIC_SITE_URL}/blog/${slug}`,
    },
  };
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />
      {/* Breadcrumb */}
      <div
        className="breadcumb-wrapper"
        style={{
          backgroundImage: "url('/img/bg/breadcumb-bg.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="container">
          <div className="breadcumb-content">
            <h1 className="breadcumb-title">{blog.blog.heading}</h1>
            <ul className="breadcumb-menu">
              <li>
                <Link href="/">Home</Link>
              </li>
              <li>{blog.blog.heading}</li>
            </ul>
          </div>
        </div>
      </div>

      <section className="th-blog-wrapper blog-details space-top space-extra-bottom">
        <div className="container">
          <div className="row">
            <div className="col-xxl-8 col-lg-7">
              <div className="th-blog blog-single">
                {/* <div className="blog-img">
                  <img src={blog.blog.image} alt="Blog Image" />
                </div> */}
                <div className="blog-content">
                  <div className="blog-meta">
                    <Link className="author" href="blog">
                      <i>
                        <FontAwesomeIcon icon={faUser} />
                      </i>
                      by Tour Pickkars
                    </Link>
                    <Link href="blog">
                      <i>
                        <FontAwesomeIcon icon={faCalendarDays} />{" "}
                      </i>
                      {blog.blog.created_at}
                    </Link>
                  </div>
                  {/* <div
                    id="blogContent"
                    dangerouslySetInnerHTML={{ __html: blog.blog.content }}
                  /> */}

                  {blog.blog.content && (
                    <div
                      id="blogMainContent"
                      dangerouslySetInnerHTML={{ __html: sanitizeCmsHtml(blog.blog.content) }}
                    />
                  )}

                  {blog.blog.details && blog.blog.details.length > 0 && (
                    <>
                      <div id="blogDetailsContent">
                        {blog.blog.details.map((detail, index) => (
                          <div key={index} >
                            {detail.image && (
                              <img src={detail.image} alt="blog" className="mb-4" />
                            )}
                            <div
                              dangerouslySetInnerHTML={{
                                __html: sanitizeCmsHtml(detail.content)
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    </>

                  )}



                  <div className="share-links clearfix">
                    <div className="row justify-content-between">
                      <div className="col-md-auto text-xl-end">
                        <div className="share-links_wrapp">
                          <span className="share-links-title">Share:</span>
                          <div className="social-links">
                            <Link
                              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                                pathname
                              )}`}
                            >
                              <i className="fab fa-facebook-f">
                                <FontAwesomeIcon icon={faFacebookF} />
                              </i>
                            </Link>
                            <Link
                              href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
                                pathname
                              )}&text=${encodeURIComponent(blog.blog.heading)}`}
                            >
                              <i>
                                <FontAwesomeIcon icon={faTwitter} />{" "}
                              </i>
                            </Link>
                            <Link
                              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                                pathname
                              )}`}
                            >
                              <i>
                                <FontAwesomeIcon icon={faLinkedinIn} />
                              </i>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xxl-4 col-lg-5">
              <aside className="sidebar-area">

                <div className="widget">
                  <h3 className="widget_title">Recent Posts</h3>
                  <div className="recent-post-wrap">
                    {blog.recentBlog.map((post) => (
                      <div className="recent-post" key={post.id}>
                        <div className="media-img">
                          <Link href={`/blog/${createSlug(post.slug)}`}>
                            <img src={post.image} alt="Blog Image" />
                          </Link>
                        </div>
                        <div className="media-body">
                          <h4 className="post-title">
                            <Link
                              className="text-inherit"
                              href={`/blog/${createSlug(post.slug)}`}
                            >
                              {post.heading}
                            </Link>
                          </h4>
                          <div className="recent-post-meta">
                            <Link href={`/blog/${createSlug(post.slug)}`}>
                              <i>
                                <FontAwesomeIcon icon={faCalendarDays} />
                              </i>
                              {post.created_at}
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                {/* <div
                  className="widget widget_offer"
                  style={{
                    backgroundImage: "url('/img/bg/widget_bg_1.jpg')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  <div className="offer-banner">
                    <div className="offer">
                      <h6 className="box-title">
                        Need Help? We Are Here To Help You
                      </h6>
                      <div className="banner-logo">
                        <img src="/img/logo2.svg" alt="Tourm" />
                      </div>
                      <div className="offer">
                        <h6 className="offer-title">You Get Online support</h6>
                        <Link className="offter-num" href="%2b256214203215">
                          +256 214 203 215
                        </Link>
                      </div>
                      <Link href="contact" className="th-btn style2 th-icon">
                        Read More
                      </Link>
                    </div>
                  </div>
                </div> */}
              </aside>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
