import "reflect-metadata";
import express from "express";
import { Employee } from "../entities/Employee";
import { Project } from "../entities/Project";
import { EmployeeDetails } from "../entities/EmployeeDetails";

const projectRouter: express.Router = express.Router();
projectRouter.use(express.json());
projectRouter.use(express.urlencoded({ extended: true }));

/* Add a project */
projectRouter.post("/", async (req: express.Request, res: express.Response) => {
  const { project_name } = req.query;
  const projectRepo = req.app.get("appDataSource").getRepository(Project);
  let project: Project = new Project();
  project.name = project_name as string;
  const dataInserted = await projectRepo.save(project);
  res.status(200).json(dataInserted);
});

/* List all  projects */
projectRouter.get("/", async (req: express.Request, res: express.Response) => {
  const projectRepo = req.app.get("appDataSource").getRepository(Project);
  const fetchedData = await projectRepo.find(); 
  res.status(200).json(fetchedData);
});

/* List the locations of the employees working on a project */
projectRouter.get( "/locations", async (req: express.Request, res: express.Response) => {
    const { pid } = req.query;
    if (pid != undefined) {
      const projectRepo = req.app.get("appDataSource").getRepository(Project);
      const fetchedData = await projectRepo.findOne({
        where: {
          id: pid,
        },
      });
      let locations: string[] = [];
      for (let i = 0; i < fetchedData.employee.length; i++) {
        const empdetRepo = req.app.get("appDataSource").getRepository(EmployeeDetails);
        const dataFetched = await empdetRepo.findOne({
          where: {
            id: fetchedData.employee[i].id,
          },
        });

        /* If a location is already added, do not add it again */
        if (locations.findIndex((o) => o == dataFetched.location.name) == -1)
          locations.push(dataFetched.location.name);
      }
      res.status(200).json(locations);
    }
  }
);

/* Add an Employee to a project */
projectRouter.put( "/addemp", async (req: express.Request, res: express.Response) => {
    const { eid, pid } = req.query;
    /* Check if employee exists */
    const empRepo = req.app.get("appDataSource").getRepository(Employee);
    const empData = await empRepo.find({
      where: {
        id: eid || -1,
      },
    });
    if (empData.length == 0) {
      res.status(200).json("Employee not found.");
    } else {
      /* Check if project exists */
      const projectRepo = req.app.get("appDataSource").getRepository(Project);

      const projectData = await projectRepo.find({
        where: {
          id: pid || -1,
        },
      });

      if (projectData.length == 0) {
        res.status(200).json("Project not found.");
      } else {
        /* Update */
        let employee: Employee = new Employee();
        employee.id = empData[0].id;
        employee.name = empData[0].name;

        let updatedEmployeelist: Employee[] = [];
        if (projectData[0].employee.length != 0)
          updatedEmployeelist = projectData[0].employee;
        updatedEmployeelist.push(employee);

        let project: Project = new Project();
        project.id = projectData[0].id;
        project.name = projectData[0].name;
        project.employee = updatedEmployeelist;
        
        const dataUpdated = await projectRepo.save(project);
        res.status(200).json(dataUpdated);
      }
    }
  }
);

/* Remove an Employee from a project */
projectRouter.put("/delemp", async (req: express.Request, res: express.Response) => {
    const { eid, pid } = req.query;
    /* Check if employee exists */
    const empRepo = req.app.get("appDataSource").getRepository(Employee);
    const empData = await empRepo.find({
      where: {
        id: eid || -1,
      },
    });
    if (empData.length == 0) {
      res.status(200).json("Employee not found.");
    } else {
       /* Check if project exists */
      const projectRepo = req.app.get("appDataSource").getRepository(Project);
      const projectData = await projectRepo.find({
        where: {
          id: pid || -1,
        },
      });
      if (projectData.length == 0) {
        res.status(200).json("Project not found.");
      } else {
        /* Update */
        let employee: Employee = new Employee();
        employee.id = empData[0].id;
        employee.name = empData[0].name;

        let updatedEmployeelist: Employee[] = [];
        if (projectData[0].employee.length != 0)
          updatedEmployeelist = projectData[0].employee;
          const removeIndex = updatedEmployeelist.findIndex((o) => o.id === employee.id);
        if (removeIndex == -1) {
          res.status(404) .json("The employee is not present in the mentioned project");
        } else {
          /* Remove the Employee from the project */
          updatedEmployeelist.splice(removeIndex, 1);

          let project: Project = new Project();
          project.id = projectData[0].id;
          project.name = projectData[0].name;
          project.employee = updatedEmployeelist;
          
          const dataUpdated = await projectRepo.save(project);
          res.status(200).json(dataUpdated);
        }
      }
    }
  }
);

/* Delete a project */
projectRouter.delete("/", async (req: express.Request, res: express.Response) => {
    const { pid } = req.query;
    const projectRepo = req.app.get("appDataSource").getRepository(Project);
    await projectRepo.delete(pid);
    res.status(200).json("Record Deleted");
  } 
);

export default projectRouter;