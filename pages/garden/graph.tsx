import dynamic from "next/dynamic";
import Page from "../../components/Page";

const ForceGraph2D = dynamic(() => import("react-force-graph-2d"), {
  ssr: false,
});
// const ForceGraph3D = dynamic(() => import("react-force-graph-3d"), {
//   ssr: false,
// });

function GardenGraphPage() {
  return (
    <Page title="Garden Graph">
      <ForceGraph2D
        graphData={{
          nodes: [
            {
              id: "id1",
              // @ts-ignore
              name: "name1",
              val: 1,
            },
            {
              id: "id2",
              // @ts-ignore
              name: "name2",
              val: 10,
            },
          ],
          links: [
            {
              source: "id1",
              target: "id2",
            },
          ],
        }}
      />
    </Page>
  );
}

export default GardenGraphPage;
