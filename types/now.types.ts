import { CheckboxPropertyValue, DatePropertyValue, TitlePropertyValue } from "@notionhq/client/build/src/api-types";

export interface NowRaw {
  date: DatePropertyValue;
  isPublished: CheckboxPropertyValue;
  slug: TitlePropertyValue;
}

export interface NowRefined {
  notionPageId: string;
  date: string;
  isPublished: boolean;
  slug: string;
}