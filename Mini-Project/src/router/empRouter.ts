import "reflect-metadata";
import express from "express";
import { Employee } from "../entities/Employee";
import { EmployeeDetails } from "../entities/EmployeeDetails";
import { Location } from "../entities/Location";
import { Between } from "typeorm";

const empRouter: express.Router = express.Router();
empRouter.use(express.json());
empRouter.use(express.urlencoded({ extended: true }));

/* Create an Employee(Name, Experience, City, Country and Salary) */
empRouter.post("/", async (req: express.Request, res: express.Response) => {
  /* Get the Query Params from Request */
  const { name, experience, city, country, salary } = req.query;

  /* If any of the params is not defined, Return the corresponding message */
  if ( name == undefined || experience == undefined || city == undefined || country == undefined || salary == undefined)
    res.status(400).json("Employee Details are incomplete.");
  else {
    /* Create a Location Object with given data */
    let location: Location = new Location();
    location.country = country as string;
    location.name = city as string;

    /* Location Table */
    const locationRepo = req.app.get("appDataSource").getRepository(Location);

    /* Find all the records in the Location Table with given city and country. */
    const dataFetched = await locationRepo.find({
      where: {
        name: city as string,
        country: country as string,
      },
    });
    
    /* If location already exists, assign the location id to prevent TypeORM from creating another location record */
    if (dataFetched.length != 0) {
      location.id = dataFetched[0].id;
    } else {
      /* Add the object to the DB */
      const dataInserted = await locationRepo.save(location);
      /* Assign the added location id to the location.id */
      location.id = dataInserted.id;
    }

    /* Employee Details Table */
    const empdetRepo = req.app .get("appDataSource") .getRepository(EmployeeDetails);

    /* Employee Object */
    let employee: Employee = new Employee();
    employee.name = name as string;

    /* Employee Details Object */
    let employeeDetails: EmployeeDetails = new EmployeeDetails();
    employeeDetails.experience = Number(experience);
    employeeDetails.salary = Number(salary);
    employeeDetails.location = location;
    employeeDetails.employee = employee;

    /* Add the object to the DB */
    const dataInserted = await empdetRepo.save(employeeDetails);

    /* Send the inserted record as Response */
    res.status(200).json(dataInserted);
  }
});

/* Update an Employee(Name, Experience, City, Country and Salary) */
empRouter.put("/", async (req: express.Request, res: express.Response) => {
  /* Get the Query Params from Request */
  const { eid, change_experience, change_city, change_country, change_salary } = req.query;
  /* Note: Except eid, every other parameter is optional */

  /* Search for the employee */
  const empdetRepo = req.app.get("appDataSource").getRepository(EmployeeDetails);
  const findEmployee = await empdetRepo.find({
    where: {
      id: eid,
    },
  });

  /* If employee with eid exists */
  if (findEmployee.length != 0) {
    /* Update the relevant information */

    /* Check if the location to which we are updating exists, if not create it*/
    let location: Location = new Location();
    if (change_city != undefined || change_country != undefined) {
      location.country = change_country as string;
      location.name = change_city as string;

      const locationRepo = req.app.get("appDataSource").getRepository(Location);
      const dataFetched = await locationRepo.find({
        where: {
          name: change_city as string,
          country: change_country as string,
        },
      });
      if (dataFetched.length != 0) {
        location.id = dataFetched[0].id;
      } else {
        const locationRepo = req.app.get("appDataSource").getRepository(Location);
        const dataInserted = await locationRepo.save(location);
        location.id = dataInserted.id;
      }
    } else {
      location.id = findEmployee[0].location.id;
      location.name = findEmployee[0].location.name;
      location.country = findEmployee[0].location.country;
    }

    /* Create Employee object */
    let employee: Employee = new Employee();
    employee.name = findEmployee[0].employee.name;
    employee.id = findEmployee[0].employee.id;

    /* Create Employee Details object */
    let employeeDetails: EmployeeDetails = new EmployeeDetails();
    employeeDetails.id = findEmployee[0].id;
    if (change_experience != undefined) {
      employeeDetails.experience = Number(change_experience);
    } else {
      employeeDetails.experience = findEmployee[0].experience;
    }
    if (change_salary != undefined) {
      employeeDetails.salary = Number(change_salary);
    } else {
      employeeDetails.salary = findEmployee[0].salary;
    }
    employeeDetails.location = location;
    employeeDetails.employee = employee;

    /* Add the object to the DB */
    const dataInserted = await empdetRepo.save(employeeDetails);

    /* Send the updated record as Response */
    res.status(200).json(dataInserted);
  } else {
    res.status(404).json("Employee with the given ID not found");
  }
});

/* Get all added employees */
empRouter.get("/", async (req: express.Request, res: express.Response) => {
  const empdetRepo = req.app .get("appDataSource").getRepository(EmployeeDetails);
  const dataFetched = await empdetRepo.find();
  res.status(200).json(dataFetched);
});

/* Get all added employees whose salary is in between the specified range*/
empRouter.get("/salary", async (req: express.Request, res: express.Response) => {
    const { lower_bound, upper_bound } = req.query;
    const empdetRepo = req.app.get("appDataSource").getRepository(EmployeeDetails);
    const dataFetched = await empdetRepo.find({
      where: {
        salary: Between(lower_bound, upper_bound),
      },
    });
    res.status(200).json(dataFetched);
  }
);

/* Delete an Employee */
empRouter.delete("/", async (req: express.Request, res: express.Response) => {
  const { eid } = req.query;
  const empRepo = req.app.get("appDataSource").getRepository(Employee);
  await empRepo.delete(eid);
  res.status(200).json("Record Deleted");
});

export default empRouter;