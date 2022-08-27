# [`richard.ng`](https://richard.ng)

This is the repository for my personal site, [richard.ng](https://richard.ng).

Most of the site content is written in Notion, for a pleasant writing experience (but no version control, alas, and therefore not captured in this repo).

The contents of `_garden` are [my digital garden](https://richard.ng/garden) notes, which are built into static HTML + JSON with Next.js.

`.env.example` has placeholders for:
- `NEXT_PUBLIC_NOTION_ACCESS_TOKEN` - used at build-time to read data from the Notion API for most of the site pages
- `GITHUB_ACCESS_TOKEN` - used at build-time to generate commit history for the digital garden