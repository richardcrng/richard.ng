import { ReactNode } from 'react'
import { NotionRenderer } from "react-notion-x";
import Head from 'next/head'
import { ExtendedRecordMap } from 'notion-types';

interface Props {
  blocks?: ExtendedRecordMap;
  title?: string;
  head?: ReactNode;
  children?: ReactNode | ((notionContent?: ReactNode) => ReactNode)
}

const defaultRender: Props['children'] = (notionContent) => notionContent

const Page: React.FC<Props> = ({
  blocks,
  children: render = defaultRender,
  head,
  title
}) => {

  const notionContent: ReactNode = blocks
    ? <NotionRenderer fullPage={false} recordMap={blocks} />
    : null

  return (
    <>
      {title && (
        <Head>
          <title>Richard Ng | {title}</title>
        </Head>
      )}
      {head && (
        <Head>
          {head}
        </Head>
      )}
      <div className="content">
        {
          typeof render === 'function'
            ? render(notionContent)
            : render
        }
      </div>
    </>
  );
};


export default Page;


