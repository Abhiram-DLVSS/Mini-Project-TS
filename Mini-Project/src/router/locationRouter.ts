import "reflect-metadata";
import express from "express";
import { Location } from "../entities/Location";

const locationRouter: express.Router = express.Router();
locationRouter.use(express.json());
locationRouter.use(express.urlencoded({ extended: true }));

/* Create a Location(City & Country) */
locationRouter.post( "/", async (req: express.Request, res: express.Response) => {
    /* Get the Query Params from Request */
    const { city, country } = req.query;

    /* Location Table */
    const locationRepo = req.app.get("appDataSource").getRepository(Location);

    /* Create a Location Object */
    let location: Location = new Location();
    // location.id is not required as it is primary key and it gets incremented automatically
    location.name = city as string;
    location.country = country as string;

    /* Add the object to the DB */
    const dataInserted = await locationRepo.save(location);

    /* Send the inserted record as Response */
    res.status(200).json(dataInserted);
  }
);

locationRouter.get("/", async (req: express.Request, res: express.Response) => {
  /* Location Table */
  const locationRepo = req.app.get("appDataSource").getRepository(Location);

  /* Get all the records in the Location Table */
  const dataFetched = await locationRepo.find();

  /* Send the records as Response */
  res.status(200).json(dataFetched);
});

locationRouter.delete("/", async (req: express.Request, res: express.Response) => {
    /* Get the Query Params from Request */
    const { city, country } = req.query;
    
    /* Location Table */
    const locationRepo = req.app.get("appDataSource").getRepository(Location);

    /* Find all the records in the Location Table with given city and country. */
    const allRecords = await locationRepo.find({
      where: { name: city as string, country: country as string },
    });

    /* Delete all the records in the Location Table with given city and country. */
    for (let i = 0; i < allRecords.length; i++) {
      await locationRepo.delete(allRecords[i]?.id || "");
    }

    /* Send the confirmation as response */
    res.status(200).json("Record Deleted");
  }
);

export default locationRouter;