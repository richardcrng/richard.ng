import Link from "next/link";

function GardenMessage() {
  return (
    <>
      <p>
        🧑‍🌾{" "}
        <i>
          Thanks for visiting my <Link href="/garden">digital garden</Link> of
          working thoughts!
        </i>
      </p>
      <p>
        🚧 <i>Please expect content to be incomplete, rough and unstable...</i>
      </p>
      <p><i>To see how it all connects: <Link href='/garden-graph'>view the graph network</Link></i></p>
    </>
  )
}

export default GardenMessage