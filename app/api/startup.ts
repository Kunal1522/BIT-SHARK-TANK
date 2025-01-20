// pages/api/startups.ts
import { STARTUPS_QUERY } from "@/sanity/lib/queries";
import { sanityFetch } from "@/sanity/lib/live";

export default async function handler({req, res}:any) {
  const { query } = req.query;
  try {
    const { data } = await sanityFetch({
      query: STARTUPS_QUERY,
      params: { search: query || null },
    });

    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching startups:", error);
    res.status(500).json({ error: "Failed to fetch startups" });
  }
}
