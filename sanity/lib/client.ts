import { createClient } from 'next-sanity'

import { apiVersion, dataset, projectId } from '../env'

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false, // Set to false if statically generating pages, using ISR or tag-based revalidation
})
import { STARTUPS_QUERY,STARTUP_BY_ID_QUERY,STARTUP_VIEWS_QUERY,AUTHOR_BY_GITHUB_ID_QUERY,AUTHOR_BY_ID_QUERY,STARTUPS_BY_AUTHOR_QUERY,PLAYLIST_BY_SLUG_QUERY} from "./queries";

export const fetchStartups = async () => {
  const startups = await client.fetch(STARTUPS_QUERY);
  return startups;
};
export const fetchStartupsbyId = async () => {
  const startups = await client.fetch(STARTUP_BY_ID_QUERY);
  return startups;
};

export const fetchUser=async ()=>{
  const userData=await client.fetch(AUTHOR_BY_GITHUB_ID_QUERY);
  return userData;
}
export const fetchUserbyId=async ()=>{
  const userData=await client.fetch(AUTHOR_BY_ID_QUERY);
  return userData;
}
export const fetchUserStartups=async ()=>{
  const userStartups=await client.fetch(AUTHOR_BY_ID_QUERY);
  return userStartups;
}
export const fetchSlug=async ()=>{
  const  userData=await client.fetch(PLAYLIST_BY_SLUG_QUERY);
  return userData;
};