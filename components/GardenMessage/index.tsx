import Link from "next/link";
import GardenLink from "../GardenLink";

function GardenMessage() {
  return (
    <>
      <p>
        🧑‍🌾{" "}
        <i>
          You're in my digital garden - a <GardenLink href='/garden-graph'>tangled web</GardenLink> of incomplete and rough thoughts.
        </i>
      </p>
    </>
  )
}

export default GardenMessage