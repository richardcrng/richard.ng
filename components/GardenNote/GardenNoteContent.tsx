import ReactMarkdown from 'react-markdown';
import gfm from 'remark-gfm';
import { WikiLinkNode } from 'remark-wiki-link';
import GardenNoteFrontMatter, { GardenNoteFrontMatterProps } from './GardenNoteFrontMatter';
import { wikiLinkPluginDetails } from './utils';

export interface GardenNoteContentProps {
  note: GardenNoteFrontMatterProps['note'];
  renderers: {
    wikiLink(node: WikiLinkNode): JSX.Element,
  }
}

function GardenNoteContent({ note, renderers }: GardenNoteContentProps) {
  return (
    <>
      <GardenNoteFrontMatter note={note} />
      <ReactMarkdown plugins={[gfm, wikiLinkPluginDetails]} renderers={renderers}>
        {note.markdownContent}
      </ReactMarkdown>
    </>
  )
}

export default GardenNoteContent;