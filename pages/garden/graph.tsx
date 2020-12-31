import { GetStaticPropsResult } from "next";
import dynamic from "next/dynamic";
import { GraphData } from "react-force-graph-2d";
import Page from "../../components/Page";

const ForceGraph2D = dynamic(() => import("react-force-graph-2d"), {
  ssr: false,
});

export async function getStaticProps(): Promise<
  GetStaticPropsResult<{ graphData: GraphData }>
> {
  return {
    props: {
      graphData: {
        nodes: [
          {
            id: "id1",
            // @ts-ignore
            name: "name1",
          },
          {
            id: "id2",
            // @ts-ignore
            name: "name2",
          },
        ],
        links: [
          {
            source: "id1",
            target: "id2",
          },
        ],
      },
    },
  };
}

function GardenGraphPage({ graphData }: { graphData: GraphData }) {
  return (
    <Page title="Garden Graph">
      <ForceGraph2D graphData={graphData} />
    </Page>
  );
}

export default GardenGraphPage;
