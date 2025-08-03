import Fastify from "fastify";
import ejs from "ejs";
import { createRequire } from "module";
import fastifyStatic from "@fastify/static";
import { join } from "path";

import operatingHours from "./data/operatingHours.js";
import menuItems from "./data/menuItems.js";

const require = createRequire(import.meta.url);
const fastifyView = require("@fastify/view");

const publicPath = join(process.cwd(), "public");
const app = Fastify();
const PORT = process.env.PORT || 3000;

app.register(fastifyView, {
  engine: {
    ejs,
  },
});
app.register(fastifyStatic, {
  root: publicPath,
  prefix: "/public/",
});

app.get("/", async (req, res) => {
  return res.view("views/index.ejs", { name: "What's Fare is Fair!" });
});

app.get("/menu", async (req, res) => {
  return res.view("views/menu.ejs", { menuItems });
});

app.get("/hours", async (req, res) => {
  const days = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];

  return res.view("views/hours.ejs", { operatingHours, days });
});

await app.listen({ port: PORT }, (err, address) => {
  if (err) throw err;
  console.log(`Server running at ${address}`);
});
