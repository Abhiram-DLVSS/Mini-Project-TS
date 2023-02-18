import express, { Request, Response } from "express";
import mongoose from "mongoose";
import Author from "../models/Author";

const router: express.Router = express.Router();
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.put("/", (req: express.Request, res: express.Response) => {
  const { name,to } = req.body;

  return Author.findOneAndUpdate({"name":name},{"name":to})
    .then((author) => {
      
        author
        ? res.status(200).json({ message: "Updated" })
        : res.status(404).json({ message: "Not found" });
    })
    .catch((error) => res.status(500).json({ error }));
});
router.get("/", async (req: express.Request, res: express.Response) => {
  return Author.find()
    .then((authors) =>
      authors
        ? res.status(200).json({ authors })
        : res.status(404).json({ message: "Not found" })
    )
    .catch((error) => res.status(500).json({ error }));
});
router.post("/", async (req: express.Request, res: express.Response) => {
  const { name } = req.body;

  const author = new Author({
    _id: new mongoose.Types.ObjectId(),
    name,
  });
  return author
    .save()
    .then((author) => res.status(200).json({ author }))
    .catch((error) => res.status(500).json({ error }));
});
router.delete("/", (req: express.Request, res: express.Response) => {
  const { name } = req.body;

  return Author.findOneAndDelete({"name":name})
    .then((author) => {
      author
        ? res.status(200).json({ message: "Deleted" })
        : res.status(404).json({ message: "Not found" });
    })
    .catch((error) => res.status(500).json({ error }));
});

export default router;
