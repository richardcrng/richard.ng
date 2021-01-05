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
            <h2 className="notion-h2">Let's start a conversation.</h2>
            <p className="notion-text">
              👋 <b>Hi! I'm Richard.</b> I work at the intersections of tech,
              education, startups and D&amp;I (diversity and inclusion).
            </p>
            <p className="notion-text">
              I'm always looking to talk to like-minded individuals.
            </p>
            <p className="notion-text">
              If you think I could help you, <b>book into my calendar:</b>
            </p>
            <div className="notion-callout notion-blue_background_co">
              <div>
                <span
                  className="notion-emoji notion-page-icon"
                  role="img"
                  aria-label="📆"
                >
                  📆
                </span>
              </div>
              <div className="notion-callout-text">
                <b>Book now: </b>a free{" "}
                <a
                  className="notion-link"
                  href="https://calendly.com/richard-ng/serendipity-slots"
                >
                  Serendipity Slot
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
