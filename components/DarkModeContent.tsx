function DarkModeContent() {
  return (
    <div className="content" style={{ color: "white" }}>
      <main className="notion">
        <div className="notion-row">
          <div
            className="notion-column"
            style={{ width: "calc((100% - 92px) * 0.375)" }}
          >
            <figure className="notion-asset-wrapper" style={{ width: "240px" }}>
              <div style={{ paddingBottom: "99.8047%", position: "relative" }}>
                <img
                  className="notion-image-inset"
                  alt="notion image"
                  src="/zombie-richard.jpg"
                />
              </div>
            </figure>
          </div>
          <div className="notion-spacer" style={{ width: "46px" }}></div>
          <div
            className="notion-column"
            style={{ width: "calc((100% - 46px) * 0.625)", color: "white" }}
          >
            <h2 className="notion-h2">Let's feast on brains.</h2>
            <p className="notion-text">
              🧟 <b>Raaaurraaagh.</b> I've become a low-in-sentience but
              deep-in-menace cliché of horror films.
            </p>
            <p className="notion-text">
              I'm always looking to, um, feast on brains?
            </p>
            <p className="notion-text">
              If your brain is tasty, <b>book into my calendar:</b>
            </p>
            <div className="notion-callout notion-blue_background_co">
              <div>
                <span
                  className="notion-emoji notion-page-icon"
                  role="img"
                  aria-label="🍽️"
                >
                  🍽️
                </span>
              </div>
              <div className="notion-callout-text">
                <b>Let's eat: </b>schedule{" "}
                <a
                  className="notion-link"
                  href="https://calendly.com/richard-ng/serendipity-slots"
                >
                  a dinner
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default DarkModeContent;
