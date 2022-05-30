const withMDX = require("@next/mdx")({
  extension: /\.mdx?$/,
});


const HUEL_REFERRAL_LINK =
  "https://huel.mention-me.com/me/referee/registerko/102292554/405567774/er/5200876596e9c491820ab14652014a3d55617cc2/ol/cw?epr=1";

const SERENDIPITY_SLOTS_BOOKING_LINK =
  "https://calendly.com/richard-ng/serendipity-slots";

module.exports = withMDX({
  pageExtensions: ["js", "jsx", "ts", "tsx", "md", "mdx"],
  async redirects() {
    return [
      ...["/huel/code", "/huel/referral", "/huel/refer"].map(source => ({
        source,
        destination: HUEL_REFERRAL_LINK,
        permanent: false
      })),
      ...["/serendipity", "/slots", "/serendipity-slots"].map(source => ({
        source,
        destination: SERENDIPITY_SLOTS_BOOKING_LINK,
        permanent: false
      }))
    ]
  }
});
