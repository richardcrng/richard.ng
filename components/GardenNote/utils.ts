import { wikiLinkPlugin } from "remark-wiki-link";

export const wikiLinkPluginDetails = [
  wikiLinkPlugin,
  {
    aliasDivider: "|",
    pageResolver: (pageName) => [encodeURIComponent(pageName)],
    hrefTemplate: (permalink) => `/garden/${permalink}`,
  },
] as [typeof wikiLinkPlugin, Parameters<typeof wikiLinkPlugin>[0]];