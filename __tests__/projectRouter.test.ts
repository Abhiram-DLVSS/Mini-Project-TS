import request from "supertest";
import AppDataSource from "../ormconfig";

import app from "../src/app";

beforeAll(async () => {
  await AppDataSource.initialize()
    .then(() => console.log("Database Connected"))
    .catch((err: any) => console.log("database connection failed", err));
  app.set("appDataSource", AppDataSource);
  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();

  await queryRunner.query(`
            CREATE TABLE "employee" (
                "id" int NOT NULL IDENTITY(1, 1),
                "name" nvarchar(255) NOT NULL,
                CONSTRAINT "UQ_e97a7f3c48c04b54ffc24e5fc71" UNIQUE ("name"),
                CONSTRAINT "PK_3c2bc72f03fd5abbbc5ac169498" PRIMARY KEY ("id")
            )
        `);
  await queryRunner.query(`
            CREATE TABLE "employee_details" (
                "id" int NOT NULL IDENTITY(1, 1),
                "experience" int NOT NULL CONSTRAINT "DF_4edc6b10e37ed1cbc6135587c1c" DEFAULT 0,
                "salary" decimal(12, 2) NOT NULL CONSTRAINT "DF_43ab4dcae85f52ea3e53fa862e3" DEFAULT 0,
                "phno" nvarchar(10) NOT NULL,
                "created_at" datetime2 NOT NULL CONSTRAINT "DF_619ab9aac93a1af8cf95636a77f" DEFAULT getdate(),
                "last_updated" datetime2 NOT NULL CONSTRAINT "DF_b92f9f1d9b5b4e34d0d24b1161e" DEFAULT getdate(),
                "employeeId" int,
                "locationId" int,
                CONSTRAINT "PK_a0a0a4a5e5b63b1bf07b5f89c1d" PRIMARY KEY ("id")
            )
        `);
  await queryRunner.query(`
            CREATE UNIQUE INDEX "REL_b47c758283e1d7fa80e88ccc9c" ON "employee_details" ("employeeId")
            WHERE "employeeId" IS NOT NULL
        `);
  await queryRunner.query(`
            CREATE TABLE "location" (
                "id" int NOT NULL IDENTITY(1, 1),
                "name" nvarchar(255) NOT NULL,
                "country" nvarchar(255) NOT NULL,
                CONSTRAINT "PK_876d7bdba03c72251ec4c2dc827" PRIMARY KEY ("id")
            )
        `);
  await queryRunner.query(`
            CREATE TABLE "project" (
                "id" int NOT NULL IDENTITY(1, 1),
                "name" nvarchar(255) NOT NULL,
                CONSTRAINT "UQ_dedfea394088ed136ddadeee89c" UNIQUE ("name"),
                CONSTRAINT "PK_4d68b1358bb5b766d3e78f32f57" PRIMARY KEY ("id")
            )
        `);
  await queryRunner.query(`
            CREATE TABLE "project_employee_employee" (
                "projectId" int NOT NULL,
                "employeeId" int NOT NULL,
                CONSTRAINT "PK_b9307d521478e16a274eddd3a57" PRIMARY KEY ("projectId", "employeeId")
            )
        `);
  await queryRunner.query(`
            CREATE INDEX "IDX_fdde92f7fa1ec8acda131e6adb" ON "project_employee_employee" ("projectId")
        `);
  await queryRunner.query(`
            CREATE INDEX "IDX_b3eb5f01100bb0a70d67a8d96b" ON "project_employee_employee" ("employeeId")
        `);
  await queryRunner.query(`
            ALTER TABLE "employee_details"
            ADD CONSTRAINT "FK_b47c758283e1d7fa80e88ccc9c5" FOREIGN KEY ("employeeId") REFERENCES "employee"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
  await queryRunner.query(`
            ALTER TABLE "employee_details"
            ADD CONSTRAINT "FK_86957ae9098ab51862106145705" FOREIGN KEY ("locationId") REFERENCES "location"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
  await queryRunner.query(`
            ALTER TABLE "project_employee_employee"
            ADD CONSTRAINT "FK_fdde92f7fa1ec8acda131e6adb5" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
  await queryRunner.query(`
            ALTER TABLE "project_employee_employee"
            ADD CONSTRAINT "FK_b3eb5f01100bb0a70d67a8d96b4" FOREIGN KEY ("employeeId") REFERENCES "employee"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
});

afterAll(async () => {
  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.query(`
            ALTER TABLE "project_employee_employee" DROP CONSTRAINT "FK_b3eb5f01100bb0a70d67a8d96b4"
        `);
  await queryRunner.query(`
            ALTER TABLE "project_employee_employee" DROP CONSTRAINT "FK_fdde92f7fa1ec8acda131e6adb5"
        `);
  await queryRunner.query(`
            ALTER TABLE "employee_details" DROP CONSTRAINT "FK_86957ae9098ab51862106145705"
        `);
  await queryRunner.query(`
            ALTER TABLE "employee_details" DROP CONSTRAINT "FK_b47c758283e1d7fa80e88ccc9c5"
        `);
  await queryRunner.query(`
            DROP INDEX "IDX_b3eb5f01100bb0a70d67a8d96b" ON "project_employee_employee"
        `);
  await queryRunner.query(`
            DROP INDEX "IDX_fdde92f7fa1ec8acda131e6adb" ON "project_employee_employee"
        `);
  await queryRunner.query(`
            DROP TABLE "project_employee_employee"
        `);
  await queryRunner.query(`
            DROP TABLE "project"
        `);
  await queryRunner.query(`
            DROP TABLE "location"
        `);
  await queryRunner.query(`
            DROP INDEX "REL_b47c758283e1d7fa80e88ccc9c" ON "employee_details"
        `);
  await queryRunner.query(`
            DROP TABLE "employee_details"
        `);
  await queryRunner.query(`
            DROP TABLE "employee"
        `);
  await AppDataSource.destroy()
    .then(() => console.log("Database connection closed"))
    .catch((err: any) =>
      console.log("Closing database connection failed", err)
    );
});

describe("Testing locationRouter.ts", () => {
  test("Post - Add a project ", async () => {
    let res = await request(app).post("/project/?project_name=JSTutorials");
    expect(JSON.parse(res.text)).toEqual(
      JSON.parse('{"id": 1, "name": "JSTutorials"}')
    );

    res = await request(app).post("/project/?project_name=JSTutorials");
    expect(JSON.parse(res.text)).toEqual(
      JSON.parse(
        '"A project with the same name already exists. Try something else."'
      )
    );
  });

  test("Get - List all projects", async () => {
    let res = await request(app).get("/project");
    expect(JSON.parse(res.text)).toEqual(
      JSON.parse('[{"id":1,"name":"JSTutorials","employee":[]}]')
    );
  });

  test("Get - Get the details of given project using ID", async () => {
    let res = await request(app).get("/project/id/1");
    expect(JSON.parse(res.text)).toEqual(
      JSON.parse('[{"id":1,"name":"JSTutorials","employee":[]}]')
    );

    res = await request(app).get("/project/id/11");
    expect(JSON.parse(res.text)).toEqual(JSON.parse('"Project not found"'));
  });

  test("Get - Get the details of given project using Name", async () => {
    let res = await request(app).get("/project/name/JSTutorials");
    expect(JSON.parse(res.text)).toEqual(
      JSON.parse('[{"id":1,"name":"JSTutorials","employee":[]}]')
    );

    res = await request(app).get("/project/name/JSTutorial");
    expect(JSON.parse(res.text)).toEqual(JSON.parse('"Project not found"'));
  });

  test("Get - List the locations of the employees working on a project (when empty)", async () => {
    let res = await request(app).get("/project/locations?pid=1");
    expect(JSON.parse(res.text)).toEqual(JSON.parse("[]"));

    res = await request(app).get("/project/locations?pname=JSTutorials");
    expect(JSON.parse(res.text)).toEqual(JSON.parse("[]"));

    res = await request(app).get("/project/locations");
    expect(JSON.parse(res.text)).toEqual(JSON.parse('"Incomplete Data."'));
  });

  test("Put - Add an Employee to a project using id", async () => {
    await request(app).post(
      "/employee/?name=Abhiram&experience=10&city=Hyderabad&country=India&salary=1000&phno=1234567890"
    ); //Checked using another testcase
    let res = await request(app).put("/project/addemp?pid=1&eid=1");
    expect(JSON.parse(res.text)).toEqual(
      JSON.parse(
        '{"id":1,"name":"JSTutorials","employee":[{"id":1,"name":"Abhiram"}]}'
      )
    );

    res = await request(app).put("/project/addemp?pid=2&eid=1");
    expect(JSON.parse(res.text)).toEqual(JSON.parse('"Project not found"'));

    res = await request(app).put("/project/addemp?pid=1&eid=2");
    expect(JSON.parse(res.text)).toEqual(JSON.parse('"Employee not found"'));

    res = await request(app).put("/project/addemp?pid=1");
    expect(JSON.parse(res.text)).toEqual(JSON.parse('"Incomplete Data."'));

    res = await request(app).put("/project/addemp?eid=2");
    expect(JSON.parse(res.text)).toEqual(JSON.parse('"Incomplete Data."'));
  });

  test("Get - List the locations of the employees working on a project (when not empty)", async () => {
    let res = await request(app).get("/project/locations?pid=1");
    expect(JSON.parse(res.text)).toEqual(JSON.parse('["Hyderabad"]'));

    res = await request(app).get("/project/locations?pname=JSTutorials");
    expect(JSON.parse(res.text)).toEqual(JSON.parse('["Hyderabad"]'));
  });

  test("Put - Remove an Employee from a project using id", async () => {
    let res = await request(app).put("/project/delemp?pid=1&eid=1");
    expect(JSON.parse(res.text)).toEqual(
      JSON.parse('{"id":1,"name":"JSTutorials","employee":[]}')
    );

    res = await request(app).put("/project/delemp?pid=2&eid=1");
    expect(JSON.parse(res.text)).toEqual(JSON.parse('"Project not found"'));

    res = await request(app).put("/project/delemp?pid=1&eid=2");
    expect(JSON.parse(res.text)).toEqual(JSON.parse('"Employee not found"'));

    res = await request(app).put("/project/delemp?pid=1&eid=1");
    expect(JSON.parse(res.text)).toEqual(
      JSON.parse('"The employee is not present in the mentioned project"')
    );

    res = await request(app).put("/project/delemp?pid=1");
    expect(JSON.parse(res.text)).toEqual(JSON.parse('"Incomplete Data."'));

    res = await request(app).put("/project/delemp?eid=2");
    expect(JSON.parse(res.text)).toEqual(JSON.parse('"Incomplete Data."'));
  });

  test("Put - Add an Employee to a project using name", async () => {
    let res = await request(app).put(
      "/project/addemp?ename=Abhiram&pname=JSTutorials"
    );
    expect(JSON.parse(res.text)).toEqual(
      JSON.parse(
        '{"id":1,"name":"JSTutorials","employee":[{"id":1,"name":"Abhiram"}]}'
      )
    );

    res = await request(app).put(
      "/project/addemp?ename=Abhiram&pname=JSTutorial"
    );
    expect(JSON.parse(res.text)).toEqual(JSON.parse('"Project not found"'));

    res = await request(app).put(
      "/project/addemp?ename=Abhiram2&pname=JSTutorials"
    );
    expect(JSON.parse(res.text)).toEqual(JSON.parse('"Employee not found"'));

    res = await request(app).put("/project/addemp?ename=Abhiram2");
    expect(JSON.parse(res.text)).toEqual(JSON.parse('"Incomplete Data."'));

    res = await request(app).put("/project/addemp?pname=JSTutorials");
    expect(JSON.parse(res.text)).toEqual(JSON.parse('"Incomplete Data."'));
  });
  test("Put - Remove an Employee from a project using name", async () => {
    let res = await request(app).put(
      "/project/delemp?ename=Abhiram&pname=JSTutorials"
    );
    expect(JSON.parse(res.text)).toEqual(
      JSON.parse('{"id":1,"name":"JSTutorials","employee":[]}')
    );

    res = await request(app).put(
      "/project/delemp?ename=Abhiram&pname=JSTutorial"
    );
    expect(JSON.parse(res.text)).toEqual(JSON.parse('"Project not found"'));

    res = await request(app).put(
      "/project/delemp?ename=Abhiram2&pname=JSTutorials"
    );
    expect(JSON.parse(res.text)).toEqual(JSON.parse('"Employee not found"'));

    res = await request(app).put(
      "/project/delemp?ename=Abhiram&pname=JSTutorials"
    );
    expect(JSON.parse(res.text)).toEqual(
      JSON.parse('"The employee is not present in the mentioned project"')
    );

    res = await request(app).put("/project/delemp?ename=Abhiram2");
    expect(JSON.parse(res.text)).toEqual(JSON.parse('"Incomplete Data."'));

    res = await request(app).put("/project/delemp?pname=JSTutorials");
    expect(JSON.parse(res.text)).toEqual(JSON.parse('"Incomplete Data."'));
  });

  test("delete", async () => {
    let res = await request(app).delete("/project/?pid=1&pname=JSTutorials");
    expect(JSON.parse(res.text)).toEqual(JSON.parse('"Record Deleted"'));
  });
});
