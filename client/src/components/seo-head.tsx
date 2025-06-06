import { Helmet } from "react-helmet-async";
import type { Blog } from "@shared/schema";

interface SeoHeadProps {
  blog?: Blog;
  title?: string;
  description?: string;
  image?: string;
  url?: string;
}

export function SeoHead({ blog, title, description, image, url }: SeoHeadProps) {
  const siteTitle = "Afds blog";
  const siteDescription = "Ai for discord blog get latest blogs about discord bots and ai";
  const siteUrl = window.location.origin;

  const pageTitle = blog?.metaTitle || blog?.title || title || siteTitle;
  const pageDescription = blog?.metaDescription || blog?.excerpt || description || siteDescription;
  const pageImage = blog?.thumbnail || image || `${siteUrl}/og-image.png`;
  const pageUrl = url || window.location.href;

  const structuredData = blog ? {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": blog.title,
    "description": blog.excerpt,
    "image": blog.thumbnail,
    "author": {
      "@type": "Person",
      "name": blog.authorName
    },
    "publisher": {
      "@type": "Organization",
      "name": siteTitle
    },
    "datePublished": blog.publishedAt,
    "dateModified": blog.updatedAt,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": pageUrl
    }
  } : null;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
      {blog?.seoKeywords?.length > 0 && (
        <meta name="keywords" content={blog.seoKeywords.join(", ")} />
      )}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={blog ? "article" : "website"} />
      <meta property="og:url" content={pageUrl} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:image" content={pageImage} />
      <meta property="og:site_name" content={siteTitle} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={pageUrl} />
      <meta property="twitter:title" content={pageTitle} />
      <meta property="twitter:description" content={pageDescription} />
      <meta property="twitter:image" content={pageImage} />

      {/* Article specific meta tags */}
      {blog && (
        <>
          <meta property="article:published_time" content={blog.publishedAt} />
          <meta property="article:modified_time" content={blog.updatedAt} />
          <meta property="article:author" content={blog.authorName} />
          <meta property="article:section" content={blog.category} />
          {blog.tags.map((tag) => (
            <meta key={tag} property="article:tag" content={tag} />
          ))}
        </>
      )}

      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}

      {/* Canonical URL */}
      <link rel="canonical" href={pageUrl} />
    </Helmet>
  );
}
