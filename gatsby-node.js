require("dotenv").config({path: `.env.${process.env.NODE_ENV}`})
const crypto = require("crypto");
const axios = require("axios");
const cheerio = require("cheerio");
const { createRemoteFileNode } = require("gatsby-source-filesystem");

exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions;
  createTypes(`
    type JojoVolume implements Node @infer {
      volume: String!
      english_title: String
      japanese_title: String
      release_date: Date @dateformat
      cover: File @link(from: "cover___NODE")
    }
  `);
};

exports.sourceNodes = async ({ actions }) => {
  const { createNode } = actions;
  const pages = [
    "https://jojowiki.com/List_of_JoJo%27s_Bizarre_Adventure_chapters",
    "https://jojowiki.com/List_of_JoJo%27s_Bizarre_Adventure_chapters/Volume_51_to_100",
    "https://jojowiki.com/List_of_JoJo%27s_Bizarre_Adventure_chapters/Volume_101_to_Current",
  ];
  let volumes = [];

  for (page of pages) {
    const res = await axios.get(page);
    const $ = cheerio.load(res.data);

    let tables = $("table")
      .map((i, elem) => {
        const li = $(elem)
          .find(
            'tbody tr td[style="border: none; vertical-align: center; font-size: 90%;"] ul li'
          )
          .text();
        const title = $(elem).find("tbody tr td").toArray();

        //everything until the first bracket
        const release_date_match = /([^\[]*)/g.exec(li);
        //get anything before : (volume information), and everything after (english title/translation)
        const english_match = /\s*(.*):\s*(.*)/g.exec(
          $(title[0]).find("b").text()
        );
        //get everything from parenthesis (is japanese)
        const japanese_match = /\((.*)\)$/g.exec(
          $(title[1]).find("b").first().text()
        );

        return {
          volume: english_match ? english_match[1] : null,
          english_title: english_match ? english_match[2] : null,
          japanese_title: japanese_match ? japanese_match[1] : null,
          release_date: release_date_match
            ? new Date(release_date_match[1])
            : null,
          cover: $(elem).find("tbody tr th a img").attr("src"),
        };
      })
      .get();

    for (let i = 1; i < tables.length; i++) {
      if (tables[i].release_date !== null && !isNaN(tables[i].release_date.getTime())) {
        //console.log(tables[i])
        //remove thumbnail property from url
        const cover_match = /(.*)\/thumb(.*[\.jpg|\.png])\//g.exec(
          tables[i].cover
        );

        tables[i - 1].release_date = tables[i].release_date;
        tables[i - 1].cover = cover_match[1] + cover_match[2];
      }
    }

    tables = tables.filter((table) => table.english_title !== null);

    volumes = volumes.concat(tables);
  }

  // map into these results and create nodes
  volumes.map(async (elem, i) => {
    // Create your node object

    const jojoNode = {
      // Required fields
      id: `${i}`,
      parent: `__SOURCE__`,
      internal: {
        type: `JojoVolume`, // name of the graphQL query
        // contentDigest will be added just after
        // but it is required
      },
      children: [],

      // Other fields that you want to query with graphQl
      volume: elem.volume,
      english_title: elem.english_title,
      japanese_title: elem.japanese_title,
      release_date: elem.release_date,
      cover: elem.cover,
    };

    // Get content digest of node. (Required field)
    const contentDigest = crypto
      .createHash(`md5`)
      .update(JSON.stringify(jojoNode))
      .digest(`hex`);
    // add it to userNode
    jojoNode.internal.contentDigest = contentDigest;

    // Create node with the gatsby createNode() API
    createNode(jojoNode);
  });

  return;
};

exports.onCreateNode = async ({
  node,
  actions: { createNode },
  store,
  cache,
  createNodeId,
}) => {
  let fileNode;
  if (node.internal.type === "JojoVolume") {
    //console.log(node);

    try {
      fileNode = await createRemoteFileNode({
        url: node.cover, // string that points to the URL of the image
        parentNodeId: node.id, // id of the parent node of the fileNode you are going to create
        createNode, // helper function in gatsby-node to generate the node
        createNodeId, // helper function in gatsby-node to generate the node id
        cache, // Gatsby's cache
        store, // Gatsby's redux store
        httpHeaders: {
          "Connection": "keep-alive",
          "Content-Type": "image/jpeg",
          "user-agent": "Jojo cover bot (https://github.com/sinayra/jojo-cover)",
        },
      });
      node.cover___NODE = fileNode.id;
    } catch (error) {
      console.error("error creating node: ", error);
    }
  }
};
