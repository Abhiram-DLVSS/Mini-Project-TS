import "reflect-metadata";
import express from "express";
import { DataSource } from "typeorm";
import { User } from "../entities/User";
import dotenv from "dotenv";
dotenv.config();
const router: express.Router = express.Router();
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

const AppDataSource = new DataSource({
  type: "mssql",
  host: process.env.HOST,
  database: process.env.DB,
  username: process.env.USER,
  password: process.env.PASSWORD,
  port: 1433,
  extra: {
    validateConnection: false,
    trustServerCertificate: true,
  },
  synchronize: true,
  // logging: true,
  entities: ["src/entities/*{.ts,.js}"],
});

AppDataSource.initialize()
  .then(() => console.log("Database Connected"))
  .catch((err) => console.log("database connection failed", err));

router.get("/", async (req: express.Request, res: express.Response) => {
  const userRepo = AppDataSource.getRepository(User);
  const {name} =req.query;
  // const allRecords = await userRepo.find({
  //   where:{
  //     name: name as string
  //   }
  // });
  const allRecords = await userRepo.find();

  res.status(200).json(allRecords);
});

router.post("/", async (req: express.Request, res: express.Response) => {
  const { name } = req.query;

  const userRepo = AppDataSource.getRepository(User);

  let user: User = new User();
  user.name = name as string;

  const allRecords = await userRepo.save(user);

  res.status(200).json({ Message: "Recorded Added" });
});

router.put("/", async (req: express.Request, res: express.Response) => {
  const { name, to } = req.query;

  const userRepo = AppDataSource.getRepository(User);

  let user: User = new User();
  user.name = name as string;

  const allRecords = await userRepo.update(
    { name: name as string },
    { name: to as string }
  );

  res.status(200).json({ Message: "Recorded Updated" });
});

router.delete("/", async (req: express.Request, res: express.Response) => {
  const { name, deleteid } = req.query;
  const userRepo = AppDataSource.getRepository(User);

  /*Delete One*/
  // await userRepo.delete((deleteid as string) || "");

  /*Delete all*/
  const allRecords =await userRepo.find({
    where:
    {name:name as string}
  })
  for(let i=0;i<allRecords.length;i++){
    await userRepo.delete(allRecords[i]?.id||"")
  }

  res.status(200).json({ Message: "Recorded Deleted" });
});

export default router;
