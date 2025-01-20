import { useState, useEffect } from "react"; // React hooks for state and effects
import SearchForm from "@/components/SearchForm"; // Your search form component
import StartupCard, { StartupTypeCard } from "@/components/StartupCard"; // Startup card and its type
import { STARTUPS_QUERY } from "@/sanity/lib/queries"; // Sanity query for startups
import { sanityFetch } from "@/sanity/lib/live"; // Fetch function from your Sanity setup
import { auth } from "@/auth"; // Authentication helper

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ query?: string }>;
}) {
  const query = (await searchParams).query;
  const params = { search: query || null };

  // Get session data for authentication (if needed)
  const session = await auth();

  const [posts, setPosts] = useState<StartupTypeCard[]>([]); // State to store fetched posts

  // Function to fetch the latest posts
  const fetchData = async () => {
    const { data } = await sanityFetch({ query: STARTUPS_QUERY, params });
    setPosts(data);
  };

  // Initial fetch when the component loads or when the search query changes
  useEffect(() => {
    fetchData();
  }, [query]);

  return (
    <>
      <section className="pink_container">
        <h1 className="heading">
          Pitch Your Startup, <br />
          Connect With Entrepreneurs
        </h1>

        <p className="sub-heading !max-w-3xl">
          Submit Ideas, Vote on Pitches, and Get Noticed in Virtual
          Competitions.
        </p>

        <SearchForm query={query} />
      </section>

      <section className="section_container">
        <p className="text-30-semibold">
          {query ? `Search results for "${query}"` : "All Startups"}
        </p>

        <ul className="mt-7 card_grid">
          {posts?.length > 0 ? (
            posts.map((post: StartupTypeCard) => (
              <StartupCard key={post?._id} post={post} />
            ))
          ) : (
            <p className="no-results">No startups found</p>
          )}
        </ul>
      </section>

      {/* Optional: Button to manually refresh data */}
      <button onClick={fetchData} className="refresh-btn">
        Refresh Data
      </button>
    </>
  );
}
