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
  const { name, experience, city, country, salary, phno } = req.query;

  /* If any of the params is not defined, Return the corresponding message */
  if (
    name == undefined ||
    experience == undefined ||
    city == undefined ||
    country == undefined ||
    salary == undefined ||
    phno == undefined
  )
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
    const empdetRepo = req.app
      .get("appDataSource")
      .getRepository(EmployeeDetails);

    /* Employee Object */
    let employee: Employee = new Employee();
    employee.name = name as string;

    /* Phone Number Validation */
    const phnoregex = new RegExp("^[1-9][0-9]{9,9}$");
    if (!phnoregex.test(phno as string)) {
      res.status(404).json("Invalid Phone Number");
      return;
    }

    /* Employee Details Object */
    let employeeDetails: EmployeeDetails = new EmployeeDetails();
    employeeDetails.experience = Number(experience);
    employeeDetails.salary = Number(salary);
    employeeDetails.phno = phno as string;
    employeeDetails.location = location;
    employeeDetails.employee = employee;
    try {
      /* Add the object to the DB */
      const dataInserted = await empdetRepo.save(employeeDetails);

      /* Send the inserted record as Response */
      res.status(200).json(dataInserted);
    } catch (error: any) {
      res
        .status(400)
        .json(
          "Employee Name should be unique. Please add your surname or Try adding a number at the end."
        );
    }
  }
});

/* Update an Employee(Name, Experience, City, Country and Salary) */
empRouter.put("/", async (req: express.Request, res: express.Response) => {
  /* Get the Query Params from Request */
  const {
    eid,
    ename,
    change_experience,
    change_city,
    change_country,
    change_salary,
    change_phno,
  } = req.query;

  if (eid == undefined && ename == undefined)
    res.status(404).json("Employee ID or Name is required.");
  else {
    /* Search for the employee */
    const empdetRepo = req.app
      .get("appDataSource")
      .getRepository(EmployeeDetails);

    let findEmployee = await empdetRepo.find({
      where: {
        id: eid,
      },
    });

    if (eid == undefined && ename != undefined) {
      const empRepo = req.app.get("appDataSource").getRepository(Employee);
      const empFetched = await empRepo.findOne({
        where: {
          name: ename,
        },
      });
      if (empFetched == null) res.status(404).json("Employee not found");
      else {
        let id = empFetched.id;
        const empdetRepo = req.app
          .get("appDataSource")
          .getRepository(EmployeeDetails);
        findEmployee = await empdetRepo.find({
          where: {
            id: id,
          },
        });
      }
    }

    /* If employee with eid exists */
    if (findEmployee.length != 0) {
      /* Update the relevant information */

      /* Check if the location to which we are updating exists, if not create it*/
      let location: Location = new Location();
      if (change_city != undefined || change_country != undefined) {
        location.country = change_country as string;
        location.name = change_city as string;

        const locationRepo = req.app
          .get("appDataSource")
          .getRepository(Location);
        const dataFetched = await locationRepo.find({
          where: {
            name: change_city as string,
            country: change_country as string,
          },
        });
        if (dataFetched.length != 0) {
          location.id = dataFetched[0].id;
        } else {
          const locationRepo = req.app
            .get("appDataSource")
            .getRepository(Location);
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

      if (change_phno != undefined) {
        /* Phone Number Validation */
        const phnoregex = new RegExp("[1-9][0-9]{9}");
        if (phnoregex.test(change_phno as string))
          employeeDetails.phno = change_phno as string;
        else {
          res.status(404).json("Invalid Phone Number");
          return;
        }
      } else {
        employeeDetails.phno = findEmployee[0].phno;
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
  }
});

/* Get all added employees */
empRouter.get("/", async (req: express.Request, res: express.Response) => {
  const empdetRepo = req.app
    .get("appDataSource")
    .getRepository(EmployeeDetails);
  const dataFetched = await empdetRepo.find();
  res.status(200).json(dataFetched);
});

/* Get the details of given employee */
/* ID */
empRouter.get(
  "/id/:emp",
  async (req: express.Request, res: express.Response) => {
    let id = req.params.emp;
    const empdetRepo = req.app
      .get("appDataSource")
      .getRepository(EmployeeDetails);
    try {
      const dataFetched = await empdetRepo.find({
        where: {
          id: id,
        },
      });
      res.status(200).json(dataFetched);
    } catch (error: any) {
      res.status(400).json(error.originalError.message);
    }
  }
);
/* Name */
empRouter.get(
  "/name/:emp",
  async (req: express.Request, res: express.Response) => {
    let name = req.params.emp;
    const empRepo = req.app.get("appDataSource").getRepository(Employee);
    try {
      const empFetched = await empRepo.findOne({
        where: {
          name: name,
        },
      });
      if (empFetched == null) res.status(404).json("Employee not found");
      else {
        let id = empFetched.id;
        const empdetRepo = req.app
          .get("appDataSource")
          .getRepository(EmployeeDetails);
        try {
          const dataFetched = await empdetRepo.findOne({
            where: {
              id: id,
            },
          });
          res.status(200).json(dataFetched);
        } catch (error: any) {
          res.status(400).json(error);
        }
      }
    } catch (error) {
      res.status(400).json(error);
    }
  }
);

/* Get all added employees whose salary is in between the specified range*/
empRouter.get(
  "/salary",
  async (req: express.Request, res: express.Response) => {
    const { lower_bound, upper_bound } = req.query;
    const empdetRepo = req.app
      .get("appDataSource")
      .getRepository(EmployeeDetails);
    const dataFetched = await empdetRepo.find({
      where: {
        salary: Between(lower_bound, upper_bound),
      }
    });
    let resarray: any[]=[]
    for(let i=0;i<dataFetched.length;i++){
      resarray.push({"id":dataFetched[i].id,"name":dataFetched[i].employee.name,"salary":dataFetched[i].salary})
    }
    res.status(200).json(resarray);
  }
);

/* Delete an Employee */
empRouter.delete("/", async (req: express.Request, res: express.Response) => {
  const { eid, ename } = req.query;
  const empRepo = req.app.get("appDataSource").getRepository(Employee);
  if (eid != undefined) 
  await empRepo.delete(eid);
  else if (ename != undefined)
    await empRepo.delete({ name: ename });
  res.status(200).json("Record Deleted");
});

export default empRouter;
