import "reflect-metadata";
import express from "express";
import { DataSource } from "typeorm";
import { Employee } from "../entities/Employee";
import { Project } from "../entities/Project";
import dotenv from "dotenv";
dotenv.config();

const projectRouter: express.Router = express.Router();
projectRouter.use(express.json());
projectRouter.use(express.urlencoded({ extended: true }));

projectRouter.post("/", async (req: express.Request, res: express.Response) => {
  const { project_name } = req.query;

  //Add project
  const projectRepo = req.app.get("appDataSource").getRepository(Project);
  let project: Project = new Project();
  project.name = project_name as string;
  const dataInserted = await projectRepo.save(project);
  res.status(200).json(dataInserted);
});

projectRouter.get("/", async (req: express.Request, res: express.Response) => {
  const projectRepo = req.app.get("appDataSource").getRepository(Project);

  const fetchedData = await projectRepo.find();
  res.status(200).json(fetchedData);
});

projectRouter.put("/", async (req: express.Request, res: express.Response) => {
  const projectRepo = req.app.get("appDataSource").getRepository(Project);
  const { eid, project_id } = req.query;
  //Check if employee exists
  const empRepo = req.app.get("appDataSource").getRepository(Employee);

  const empData = await empRepo.find({
    where: {
      id: eid || -1,
    },
  });
  if (empData.length == 0) {
    res.status(200).json("Employee not found.");
  } else {
    //Check if project exists
    const projectRepo = req.app.get("appDataSource").getRepository(Project);

    const projectData = await projectRepo.find({
      where: {
        id: project_id || -1,
      },
    });
    if (projectData.length == 0) {
      res.status(200).json("Project not found.");
    } else {
      //Update

      let employee: Employee = new Employee();
      employee.id = empData[0].id;
      employee.name = empData[0].name;
      let updatedEmployeelist: Employee[] = [];
      if (projectData[0].employee.length != 0)
        updatedEmployeelist.push(projectData[0].employee);
      updatedEmployeelist.push(employee);

      // console.log(updatedEmployeelist);
      let project: Project = new Project();
      project.id = projectData[0].id;
      project.name = projectData[0].name;
      project.employee = updatedEmployeelist;
      //Save
      const dataUpdated = await projectRepo.save(project);
      res.status(200).json(dataUpdated);
    }
  }
});

projectRouter.delete(
  "/",
  async (req: express.Request, res: express.Response) => {
    const { project_name } = req.query;
    const projectRepo = req.app.get("appDataSource").getRepository(Project);

    const allRecords = await projectRepo.find({
      where: {
        name: project_name as string,
      },
    });

    for (let i = 0; i < allRecords.length; i++) {
      await projectRepo.delete(allRecords[i]?.id || "");
    }
    res.status(200).json("Record Deleted");
  }
);

export default projectRouter;
