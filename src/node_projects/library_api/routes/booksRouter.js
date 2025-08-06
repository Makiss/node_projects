import Book from "../models/book.js";

async function booksRouter(fastify, _opts) {
  fastify.get("/", async (req, res) => {
    try {
      const books = await Book.findAll();
      res.send(books);
    } catch (e) {
      console.error("Error occurred:", e.message);
      res.send(e);
    }
  });

  fastify.get("/:id", async (req, res) => {
    const { id } = req.params;

    try {
      const book = await Book.findByPk(id);
      res.send(book);
    } catch (e) {
      console.error("Error occurred:", e.message);
      res.send(e);
    }
  });

  fastify.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { title, author } = req.body;

    try {
      const book = await Book.update(
        { title, author },
        {
          where: { id },
        }
      );
      res.send(book);
    } catch (e) {
      console.error("Error occurred:", e.message);
      res.send(e);
    }
  });

  fastify.delete("/:id", async (req, res) => {
    const { id } = req.params;

    try {
      const book = await Book.destroy({ where: { id } });
      res.send(book);
    } catch (e) {
      console.error("Error occurred:", e.message);
      res.send(e);
    }
  });

  fastify.post("/", async (req, res) => {
    const { title, author } = req.body;

    try {
      const existingBook = await Book.findOne({
        where: { title },
      });
      if (!existingBook) {
        const book = await Book.create({ title, author, count: 1 });
        res.send(book);
      } else {
        existingBook.count += 1;
        await existingBook.save();
        res.send(existingBook);
      }
    } catch (e) {
      console.error("Error occurred:", e.message);
      res.send(e);
    }
  });
}

export default booksRouter;
