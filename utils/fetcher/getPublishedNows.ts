import fetcher from ".";
import { NowRefined } from "../../types/now.types";

export const getPublishedNows = async () => {
  const publishedNows: NowRefined[] = await fetcher(`/api/nows/published`);
  return publishedNows
}