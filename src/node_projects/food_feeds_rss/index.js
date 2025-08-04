import Parser from "rss-parser";

import promptModule from "prompt-sync";

const prompt = promptModule({ sigint: true });
const customItems = [];
const parser = new Parser();
const urls = [
  "https://www.bonappetit.com/feed/recipes-rss-feed/rss",
  "https://www.budgetbytes.com/category/recipes/feed/",
  "https://www.reddit.com/r/recipes/.rss",
];

const main = async () => {
  const awaitableRequests = urls.map((url) => parser.parseURL(url));
  const responses = await Promise.all(awaitableRequests);
  const feedItems = responses
    .flatMap(({ items }) => items)
    .map(({ title, link }) => ({ title, link }));
  print(feedItems);
};

const print = (feedItems) => {
  const res = prompt("Add item: ");
  const [title, link] = res.split(",");
  if (![title, link].includes(undefined)) customItems.push({ title, link });
  console.clear();
  console.table(feedItems.concat(customItems));
  console.log("Last updated ", new Date().toUTCString());
};

setInterval(main, 2000);
