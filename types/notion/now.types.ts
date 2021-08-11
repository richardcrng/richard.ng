import { CheckboxProperty, DateProperty, TitleProperty } from "@notionhq/client/build/src/api-types";

export interface NowRaw {
  date: DateProperty;
  isPublished: CheckboxProperty;
  slug: TitleProperty;
}