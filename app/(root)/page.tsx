import SearchForm from "../../components/SearchForm";
import StartupCard,{StartupTypeCard} from "../../components/StartupCard";
import { STARTUPS_QUERY } from "@/sanity/lib/queries";
import { sanityFetch, SanityLive } from "@/sanity/lib/live";
import {auth} from "@/auth"
export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ query?: string }>;
}) {
  const query = (await searchParams).query;
  const params={search:query||null};//yeh hmlog params ka use krke query jmaarte  
  //                            //
  const session=await auth();
console.log(session?.id);
 const {data:posts}=await sanityFetch({query:STARTUPS_QUERY,params});//daatavse se laane ke lie query likhte fir uss query ka use krke sanityfetch ke help se usko posts jo ki objects ka array h usme me le aate 


  return (
    <>
      <section className="pink_container">
        <h1 className="heading">
          Pitch Your Startup Ideas <br />
          Connect With Entrepreneurs
        </h1>
        <p className="sub-heading !max-w-3xl">
          Submit Ideas,Vote on Pitches,and Get Notified about Startup
          Competitions
        </p>
        <SearchForm query={query} />
      </section>
      <section className="section-container">
        <p className="text-30-semibold">
          {query ? `Search results for ${query}` : "All Startup"}
        </p>
        <ul className="mt-7 card-grid flex gap-6">
          {posts?.length > 0 ? (
            posts.map((post: StartupTypeCard, index: number) => (
              <StartupCard key={post?._id} post={post}/>
            ))
          ) : (
            <p className="no-results">No Startup Found</p>
          )}
        </ul>
      </section>
      <SanityLive/>
    </>
  );
}
