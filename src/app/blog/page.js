// import { useEffect, useState } from "react";
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";
import SingleBlog from "@/components/Blog/SingleBlog";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { getBlogs } from "@/services/blogApi";
import { headers } from "next/headers";
import { getPagewithSection } from "@/services/pageSection";
import { sanitizeCmsHtml } from "@/functions/sanitizeCmsHtml";


// const mainpage = await getPagewithSection(2);
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const mainpage = await getPagewithSection(2);
  return {
    title: mainpage.meta_title,
    description: mainpage.meta_description,
    keywords: mainpage.meta_description,
    alternates: {
      canonical: `/blog`,
    },
    openGraph: {
      type: "article",
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/blog/${slug}`,
      title: mainpage.meta_title,
      description: mainpage.meta_description,
      keywords: mainpage.meta_description,
      // images: [{ url: page.image }],
    },
    twitter: {
      card: "summary_large_image",
      title: mainpage.meta_title,
      description: mainpage.meta_description,
      // images: [blog.blog.image],
    },
  };
}
export default async function Blog({ searchParams }) {
  const { page } = await searchParams;
  const blogPosts = await getBlogs(page || 1, 10);
  const mainpage = await getPagewithSection(2);
  return (
    <>
      {mainpage.addon_schemas.map((schema) => (
        <script
          key={schema.id}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: sanitizeCmsHtml(schema.schema) }}
        />
      ))}
      {/* Breadcrumb */}
      <div
        className="breadcumb-wrapper"
        style={{
          backgroundImage: `url('${process.env.NEXT_PUBLIC_MEDIA_PATH +
            mainpage.sections[0].section[1].data.image
            }')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="container">
          <div className="breadcumb-content">
            <h1 className="breadcumb-title">
              {mainpage.sections[0].section[0].data.Text}
            </h1>
            <ul className="breadcumb-menu">
              <li>
                <Link href="/">Home</Link>
              </li>
              <li>{mainpage.sections[0].section[0].data.Text}</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Blog Section */}
      <section className="th-blog-wrapper space-top space-extra-bottom">
        <div className="container">
          <div className="row">
            {/* Blog List */}
            <div className="col-xxl-12 col-lg-12">
              <div className="row">
                {blogPosts.data.map((post) => (
                  <div className="col-xxl-4 col-lg-4 col-md-6" key={post.id}>
                    <SingleBlog post={post} />
                  </div>
                ))}
              </div>

              {/* ✅ Pagination */}
              {blogPosts.next_page_url != null ? (
                <div className="th-pagination">
                  <ul>
                    {blogPosts.links.map((page, index) => {
                      // page number extract karna
                      const pageNumber = page.url
                        ? new URL(page.url).searchParams.get("page")
                        : null;
                      const href = pageNumber
                        ? `/blog?page=${pageNumber}`
                        : "#";

                      return index === 0 ? (
                        <Link
                          className="next-page"
                          role="button"
                          href={href}
                          key={index}
                        >
                          <img
                            src="/img/icon/arrow-right4.svg"
                            alt=""
                            aria-hidden="true"
                            style={{ transform: "scaleX(-1)" }}
                          />{" "}
                          Previous{" "}
                        </Link>
                      ) : blogPosts.links.length === index + 1 ? (
                        <li key={index}>
                          <Link className="next-page" role="button" href={href}>
                            Next <img src="/img/icon/arrow-right4.svg" alt="" aria-hidden="true" />
                          </Link>
                        </li>
                      ) : (
                        <li key={index}>
                          <Link
                            href={href}
                            className={page.active ? "active" : ""}
                          >
                            {page.label
                              .replace("&laquo;", "«")
                              .replace("&raquo;", "»")}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ) : (
                ""
              )}
            </div>

            {/* Sidebar */}
            {/* <div className="col-xxl-4 col-lg-5">
              <aside className="sidebar-area">
                
                <div className="widget widget_search">
                  <form className="search-form">
                    <input type="text" placeholder="Search" />
                    <button type="submit">
                      <i><FontAwesomeIcon icon={faSearch} /></i>
                    </button>
                  </form>
                </div>
                <div className="widget widget_categories">
                  <h3 className="widget_title">Categories</h3>
                  <ul>
                    <li><Link href="#">City Tour</Link><span>(8)</span></li>
                    <li><Link href="#">Beach Tours</Link><span>(6)</span></li>
                    <li><Link href="#">Wildlife Tours</Link><span>(2)</span></li>
                    <li><Link href="#">News & Tips</Link><span>(7)</span></li>
                    <li><Link href="#">Adventure Tours</Link><span>(9)</span></li>
                    <li><Link href="#">Mountain Tours</Link><span>(10)</span></li>
                  </ul>
                </div>
              </aside>
            </div> */}
          </div>
        </div>
      </section>
    </>
  );
}
