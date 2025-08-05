import Fastify from "fastify";

import formBody from "@fastify/formbody";

const app = Fastify();
await app.register(formBody);
const PORT = process.env.PORT || 3000;

app.get("/", (_req, res) => {
  res.send({ message: "ok" });
});

app.setNotFoundHandler((req, res) => {
  const { message, statusCode } = req.error || {};
  res.status(statusCode || 500).send({ message });
});

try {
  await app.listen({ port: PORT });
  console.log(`Listening at http://localhost:${PORT}`);
} catch (e) {
  console.error(e);
  process.exit(1);
}
