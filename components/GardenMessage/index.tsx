import GardenLink from "../GardenLink";

function GardenMessage() {
  return (
    <>
      <p>
        🧑‍🌾{" "}
        <i>
          You're in <GardenLink href="/garden">my digital garden</GardenLink> -
          a <GardenLink href="/graph">tangled web</GardenLink> of incomplete and
          rough thoughts.
        </i>
      </p>
    </>
  );
}

export default GardenMessage;
