import Link from "next/link";

function GardenMessage() {
  return (
    <>
      <p>
        🧑‍🌾{" "}
        <i>
          You're in <Link href="/garden">my digital garden</Link> - a{" "}
          <Link href="/graph">tangled web</Link> of incomplete and rough
          thoughts.
        </i>
      </p>
    </>
  );
}

export default GardenMessage;
