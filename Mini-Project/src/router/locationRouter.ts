import "reflect-metadata";
import express from "express";
// import { Employee } from "../entities/Employee";
// import { Project } from "../entities/Project";
// import { EmployeeDetails } from "../entities/EmployeeDetails";
import { Location } from "../entities/Location";
import dotenv from "dotenv";
dotenv.config();

const locationRouter: express.Router = express.Router();
locationRouter.use(express.json());
locationRouter.use(express.urlencoded({ extended: true }));

locationRouter.post(
  "/",
  async (req: express.Request, res: express.Response) => {
    const { city, country } = req.query;
    const locationRepo = req.app.get("appDataSource").getRepository(Location);
    let location: Location = new Location();
    location.name = city as string;
    location.country = country as string;

    const dataInserted = await locationRepo.save(location);
    res.status(200).json(dataInserted);
  }
);

locationRouter.get("/", async (req: express.Request, res: express.Response) => {
  const locationRepo = req.app.get("appDataSource").getRepository(Location);
  const dataFetched = await locationRepo.find();
  res.status(200).json(dataFetched);
});

locationRouter.delete(
  "/",
  async (req: express.Request, res: express.Response) => {
    const { city, country } = req.query;
    const locationRepo = req.app.get("appDataSource").getRepository(Location);

    const allRecords = await locationRepo.find({
      where: { name: city as string, country: country as string },
    });
    for (let i = 0; i < allRecords.length; i++) {
      await locationRepo.delete(allRecords[i]?.id || "");
    }
    res.status(200).json("Record Deleted");
  }
);

export default locationRouter;
