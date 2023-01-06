import "reflect-metadata";
import express from "express";
import { DataSource } from "typeorm";
import { Employee } from "../entities/Employee";
import { Project } from "../entities/Project";
import { EmployeeDetails } from "../entities/EmployeeDetails";
import { Location } from "../entities/Location";
import dotenv from "dotenv";
import e from "express";
dotenv.config();

const empRouter: express.Router = express.Router();
empRouter.use(express.json());
empRouter.use(express.urlencoded({ extended: true }));

empRouter.post("/", async (req: express.Request, res: express.Response) => {
  const { name, experience, location_city, location_country } = req.query;

  let loc: Location = new Location();
  loc.country = location_country as string;
  loc.name = location_city as string;

  const locationRepo = req.app.get("appDataSource").getRepository(Location);
  const dataFetched = await locationRepo.find({
    where: {
      name: location_city as string,
      country: location_country as string,
    },
  });
  // console.log(dataFetched);
  if (dataFetched.length != 0) {
    loc.id = dataFetched[0].id;
  } else {
    const locationRepo = req.app.get("appDataSource").getRepository(Location);
    const dataInserted = await locationRepo.save(loc);
    loc.id = dataInserted.id;
  }

  const empdetRepo = req.app
    .get("appDataSource")
    .getRepository(EmployeeDetails);
  let employee: Employee = new Employee();
  employee.name = name as string;

  let employeeDetails: EmployeeDetails = new EmployeeDetails();
  employeeDetails.experience = experience as string;
  employeeDetails.location = loc;
  employeeDetails.employee = employee;

  const dataInserted = await empdetRepo.save(employeeDetails);
  res.status(200).json(dataInserted);
});

empRouter.get("/", async (req: express.Request, res: express.Response) => {
  const empdetRepo = req.app
    .get("appDataSource")
    .getRepository(EmployeeDetails);
  const dataFetched = await empdetRepo.find();
  res.status(200).json(dataFetched);
});

empRouter.put("/", async (req: express.Request, res: express.Response) => {
  const {
    name,
    experience,
    location_city,
    location_country,
    to_name,
    to_experience,
    to_location_city,
    to_location_country,
  } = req.query;

  //Find the employee first
  const empdetRepo = req.app
    .get("appDataSource")
    .getRepository(EmployeeDetails);

  let employee: Employee = new Employee();
  employee.name = name as string;

  let loc: Location = new Location();
  loc.country = location_country as string;
  loc.name = location_city as string;

  let employeeDetails: EmployeeDetails = new EmployeeDetails();
  employeeDetails.experience = experience as string;
  employeeDetails.location = loc;
  employeeDetails.employee = employee;

  const FoundRecord = await empdetRepo.findOne({
    where: {
      experience: experience as string,
      employee: employee,
      location: loc,
    },
  });

  if (FoundRecord) {
    // console.log(FoundRecord);
    //Check if the location it is getting updated to exists or not, if not add
    const locationRepo = req.app.get("appDataSource").getRepository(Location);
    const locFetched = await locationRepo.find({
      where: {
        name: location_city as string,
        country: location_country as string,
      },
    });
    // console.log(locFetched);
    if (locFetched.length != 0) {
      loc.id = locFetched[0].id;
    } else {
      const locationRepo = req.app.get("appDataSource").getRepository(Location);
      const locInserted = await locationRepo.save(loc);
      loc.id = locInserted.id;
    }
    //Update
    if (to_name) employee.name = to_name as string;

    employee.id = FoundRecord.employee.id;

    if (to_location_country) loc.country = to_location_country as string;
    if (to_location_city) loc.name = to_location_city as string;

    if (to_experience) employeeDetails.experience = to_experience as string;
    employeeDetails.location = loc;
    employeeDetails.employee = employee;
    employeeDetails.id = FoundRecord.id;
    //Save
    const dataUpdated = await empdetRepo.save(employeeDetails);
    res.status(200).json(dataUpdated);
  } else {
    res.status(200).json("The record requested to update is not found.");
  }
});

empRouter.delete("/", async (req: express.Request, res: express.Response) => {
  const { name, experience, location_city, location_country } = req.query;
  const empdetRepo = req.app
    .get("appDataSource")
    .getRepository(EmployeeDetails);
  const empRepo = req.app.get("appDataSource").getRepository(Employee);

  let employee: Employee = new Employee();
  employee.name = name as string;

  let loc: Location = new Location();
  loc.country = location_country as string;
  loc.name = location_city as string;

  const allRecords = await empdetRepo.find({
    where: {
      experience: experience as string,
      employee: employee,
      location: loc,
    },
  });

  for (let i = 0; i < allRecords.length; i++) {
    await empRepo.delete(allRecords[i]?.employee.id || "");
  }
  res.status(200).json("Record Deleted");
});
export default empRouter;
