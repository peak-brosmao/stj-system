import type { Metadata } from "next";
import { getAllBlogAndLessonItems } from "@/lib/blogStore";
import { extractPlainTextSnippet, getDefaultCourseThumbnail } from "@/lib/richContent";
import { BlogDetailClient } from "./BlogDetailClient";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolved = await params;
  const id = decodeURIComponent(resolved?.id || "");
  const allItems = await getAllBlogAndLessonItems();
  const found = allItems.find((item) => item.id === id);

  if (!found) {
    return {
      title: "អត្ថបទ & មេរៀន STJ | Institute of Technology of Cambodia",
      description:
        "បណ្ណាល័យអត្ថបទ និងមេរៀនចែករំលែកដោយនិស្សិតរៀមច្បង STJ សម្រាប់សិស្សប្អូននៅវិទ្យាស្ថានបច្ចេកវិទ្យាកម្ពុជា (ITC)។",
    };
  }

  const description =
    found.summary ||
    extractPlainTextSnippet(found.richContent, found.summary, 160) ||
    "មេរៀន និងអត្ថបទចែករំលែកដោយរៀមច្បង STJ (Senior Teaching Junior - ITC)";
  const image = found.thumbnailUrl || getDefaultCourseThumbnail(found.courseCode);

  return {
    title: `${found.title} | STJ Blog & Lessons (${found.courseCode})`,
    description,
    openGraph: {
      title: `${found.title} — [${found.courseCode}] STJ ITC`,
      description,
      type: "article",
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: found.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${found.title} — [${found.courseCode}] STJ ITC`,
      description,
      images: [image],
    },
  };
}

export default async function BlogDetailPage({ params }: PageProps) {
  const resolved = await params;
  const id = decodeURIComponent(resolved?.id || "");
  return <BlogDetailClient id={id} />;
}
