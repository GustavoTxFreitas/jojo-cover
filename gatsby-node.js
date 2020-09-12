const crypto = require("crypto");
const axios = require("axios");
const cheerio = require("cheerio");

exports.sourceNodes = async ({ actions }) => {
  const { createNode } = actions;
  const pages = [
    "https://jojo.fandom.com/wiki/List_of_JoJo%27s_Bizarre_Adventure_chapters",
    "https://jojo.fandom.com/wiki/List_of_JoJo%27s_Bizarre_Adventure_chapters/Volume_51_to_100",
    "https://jojo.fandom.com/wiki/List_of_JoJo%27s_Bizarre_Adventure_chapters/Volume_101_to_Current",
  ];
  let volumes = [];

  for(page of pages)
  {
  const res = await axios.get(page);
  const $ = cheerio.load(res.data);

  let tables = $("table")
    .map((i, elem) => {
      const li = $(elem)
        .find(
          'tbody tr td[style="border: none; vertical-align: center; font-size: 90%;"] ul li'
        )
        .text();
      const title = $(elem)
        .find('tbody tr td[style="text-align: center; font-size:100%;"]')
        .toArray();
      const release_date_match = /<img .*>(.*)\[/g.exec(li);
      const english_match = /\s*(.*):\s*(.*)/g.exec($(title[0]).find("b").text());
      const japanese_match = /\((.*)\)$/g.exec($(title[1]).find("b").first().text());

      return {
        volume: english_match ? english_match[1] : null,
        english_title: english_match ? english_match[2] : null,
        japanese_title: japanese_match ? japanese_match[1] : null,
        release_date: release_date_match ? new Date(release_date_match[1]) : null,
        cover: $(elem).find("tbody tr th a").attr("href"),
      };
    })
    .get();

  for (let i = 1; i < tables.length; i++) {
    if (tables[i].release_date !== null) {
      tables[i - 1].release_date = tables[i].release_date;
      tables[i - 1].cover = tables[i].cover;
    }
  }

  tables = tables.filter(
    (table) => table.english_title !== null
  );
  
  volumes = volumes.concat(tables);
  }

  // map into these results and create nodes
  volumes.map((elem, i) => {
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
    }

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
