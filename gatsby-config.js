module.exports = {
  pathPrefix: "/jojo-cover",
  siteMetadata: {
    title: `What's your Jojo manga cover?`,
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    `gatsby-plugin-typescript`,
    "gatsby-transformer-typescript-css-modules"
  ],
}
