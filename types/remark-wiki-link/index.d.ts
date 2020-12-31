declare module "remark-wiki-link" {
  interface WikiLinkPluginOpts {
    /**
     * An array of permalinks that should be considered existing pages. If a wiki link is parsed and its permalink matches one of these permalinks, node.data.exists will be true.
     */
    permalinks?: string[];

    /**
     * A function that maps a page name to an array of possible permalinks. These possible permalinks are cross-referenced with options.permalinks to determine whether a page exists. If a page doesn't exist, the first element of the array is considered the permalink.
     *
     * The default pageResolver is:
     *
     * ```
     * (name) => [name.replace(/ /g, '_').toLowerCase()]
     * ```
     */
    pageResolver?(pageName: string): string[];

    /**
     * A function that maps a permalink to some path. This path is used as the `href` for the rendered `a`.
     *
     * The default `hrefTemplate` is:
     *
     * ```
     * (permalink) => `#/page/${permalink}`
     * ```
     */
    hrefTemplate?(permalink: string): string;

    /**
     * a class name that is attached to any rendered wiki links. Defaults to `"internal"`.
     */
    wikiLinkClassName?: string;

    /**
     * a class name that is attached to any rendered wiki links that do not exist. Defaults to `"new"`.
     */
    newClassName?: string;

    /**
     * a string for `aliased pages`.
     */
    aliasDivider?: string;
  }

  export interface WikiLinkNode {
    /** WikiLink value */
    value: string;
    data: {
      /** WikiLink aliased text */
      alias: string;
      permalink: string;
      exists: boolean;
      hName: "a";
      hProperties: {
        className: string;
        href: string;
      };
      hChildren: [
        {
          type: string;
          value: string;
        }
      ];
    };
  }

  function wikiLinkPlugin(opts?: WikiLinkPluginOpts): void;
}
