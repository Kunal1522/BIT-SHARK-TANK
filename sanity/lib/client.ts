import { createClient } from 'next-sanity'

import { apiVersion, dataset, projectId } from '../env'

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false, // Set to false if statically generating pages, using ISR or tag-based revalidation
})
import { STARTUPS_QUERY,STARTUP_BY_ID_QUERY,STARTUP_VIEWS_QUERY,AUTHOR_BY_GITHUB_ID_QUERY} from "./queries";

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
