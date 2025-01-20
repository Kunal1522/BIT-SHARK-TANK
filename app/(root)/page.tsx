// app/page.tsx
import HomeClient from "@/components/HomeClient";
import { auth } from "@/auth"; // Server-side auth
import { STARTUPS_QUERY } from "@/sanity/lib/queries";
import { sanityFetch } from "@/sanity/lib/live";

export default async function Home({
  searchParams,
}: {
  searchParams: { query?: string };
}) {
  const session = await auth(); // Perform server-side authentication
  const query = searchParams.query || null;

  // Fetch initial data server-side
  const { data: initialPosts } = await sanityFetch({
    query: STARTUPS_QUERY,
    params: { search: query },
  });

  return (
    <HomeClient
      initialPosts={initialPosts}
      initialQuery={query}
      session={session}
    />
  );
}
