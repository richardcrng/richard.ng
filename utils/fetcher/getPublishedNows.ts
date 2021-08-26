import fetcher from ".";
import { NowRefined } from "../../types/notion/now.types";

export const getPublishedNows = async () => {
  const publishedNows: NowRefined[] = await fetcher(`/api/nows/published`);
  return publishedNows
}