"use client";

import { useState, useEffect } from "react";
import SearchForm from "@/components/SearchForm";
import StartupCard, { StartupTypeCard } from "@/components/StartupCard";

export default function HomeClient({
  initialPosts,
  initialQuery,
  session,
}: {
  initialPosts: StartupTypeCard[];
  initialQuery: string | null;
  session: any;
}) {
  const [posts, setPosts] = useState<StartupTypeCard[]>(initialPosts);
  const [query, setQuery] = useState<string | undefined>(initialQuery ?? undefined); // Defaulting null to undefined

  // Function to fetch posts based on the query
  const fetchPosts = async (searchQuery: string | undefined) => {
    try {
      const response = await fetch(`/api/startups?query=${searchQuery || ""}`);
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  // Update posts when the query changes
  useEffect(() => {
    if (query !== initialQuery) {
      fetchPosts(query);
    }
  }, [query]);

  return (
    <>
      <section className="pink_container">
        <h1 className="heading">
          Pitch Your Startup, <br />
          Connect With Entrepreneurs
        </h1>
        <p className="sub-heading !max-w-3xl">
          Submit Ideas, Vote on Pitches, and Get Noticed in Virtual Competitions.
        </p>
        <SearchForm query={query} />
      </section>

      <section className="section_container">
        <p className="text-30-semibold">
          {query ? `Search results for "${query}"` : "All Startups"}
        </p>
        <ul className="mt-7 card_grid">
          {posts.length > 0 ? (
            posts.map((post) => (
              <StartupCard key={post._id} post={post} />
            ))
          ) : (
            <p className="no-results">No startups found</p>
          )}
        </ul>
      </section>

      {/* Optional: Refresh Button */}
      <button onClick={() => fetchPosts(query)} className="refresh-btn">
        Refresh Data
      </button>
    </>
  );
}
