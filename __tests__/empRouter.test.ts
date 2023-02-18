import { json } from "stream/consumers";
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
  test("Post - Correct", async () => {
    let res = await request(app).post(
      "/employee/?name=Abhiram&experience=10&city=Hyderabad&country=India&salary=1000&phno=1234567890"
    );
    let result = JSON.parse(res.text);
    expect(result["created_at"]).toEqual(result["last_updated"]);
    delete result["created_at"];
    delete result["last_updated"];
    expect(result).toEqual(
      JSON.parse(
        '{"experience":10,"salary":1000,"phno":"1234567890","location":{"country":"India","name":"Hyderabad","id":1},"employee":{"name":"Abhiram","id":1},"id":1}'
      )
    );
  });

  test("Post - Missing values", async () => {
    let res;
    res = await request(app).post(
      "/employee/?experience=10&city=Hyderabad&country=India&salary=1000&phno=1234567890"
    );
    expect(JSON.parse(res.text)).toEqual(
      JSON.parse('"Employee Details are incomplete."')
    );

    res = await request(app).post(
      "/employee/?name=Abhiram&city=Hyderabad&country=India&salary=1000&phno=1234567890"
    );
    expect(JSON.parse(res.text)).toEqual(
      JSON.parse('"Employee Details are incomplete."')
    );

    res = await request(app).post(
      "/employee/?name=Abhiram&experience=10&country=India&salary=1000&phno=1234567890"
    );
    expect(JSON.parse(res.text)).toEqual(
      JSON.parse('"Employee Details are incomplete."')
    );

    res = await request(app).post(
      "/employee/?name=Abhiram&experience=10&city=Hyderabad&salary=1000&phno=1234567890"
    );
    expect(JSON.parse(res.text)).toEqual(
      JSON.parse('"Employee Details are incomplete."')
    );

    res = await request(app).post(
      "/employee/?name=Abhiram&experience=10&city=Hyderabad&country=India&phno=1234567890"
    );
    expect(JSON.parse(res.text)).toEqual(
      JSON.parse('"Employee Details are incomplete."')
    );

    res = await request(app).post(
      "/employee/?name=Abhiram&experience=10&city=Hyderabad&country=India&salary=1000"
    );
    expect(JSON.parse(res.text)).toEqual(
      JSON.parse('"Employee Details are incomplete."')
    );
  });

  test("Post - Phone Number validation", async () => {
    let res;
    res = await request(app).post(
      "/employee/?name=Abhiram&experience=10&city=Hyderabad&country=India&salary=1000&phno=123456789"
    );
    expect(JSON.parse(res.text)).toEqual(JSON.parse('"Invalid Phone Number"'));

    res = await request(app).post(
      "/employee/?name=Abhiram&experience=10&city=Hyderabad&country=India&salary=1000&phno=12345678901"
    );
    expect(JSON.parse(res.text)).toEqual(JSON.parse('"Invalid Phone Number"'));

    res = await request(app).post(
      "/employee/?name=Abhiram&experience=10&city=Hyderabad&country=India&salary=1000&phno=123456789z"
    );
    expect(JSON.parse(res.text)).toEqual(JSON.parse('"Invalid Phone Number"'));

    res = await request(app).post(
      "/employee/?name=Abhiram&experience=10&city=Hyderabad&country=India&salary=1000&phno=0234567890"
    );
    expect(JSON.parse(res.text)).toEqual(JSON.parse('"Invalid Phone Number"'));
  });

  test("Post - Duplicate Name", async () => {
    //Depends upon the first post test case
    let res;
    res = res = await request(app).post(
      "/employee/?name=Abhiram&experience=10&city=Hyderabad&country=India&salary=1000&phno=1234567890"
    );
    expect(JSON.parse(res.text)).toEqual(
      JSON.parse(
        '"Employee Name should be unique. Please add your surname or Try adding a number at the end."'
      )
    );
  });

  test("Get - All employees", async () => {
    const res = await request(app).get("/employee");
    let result = JSON.parse(res.text);
    delete result[0]["created_at"];
    delete result[0]["last_updated"];

    expect(result).toEqual(
      JSON.parse(
        '[{"employee": {"id": 1, "name": "Abhiram"}, "experience": 10, "id": 1, "location": {"country": "India", "id": 1, "name": "Hyderabad"}, "phno": "1234567890", "salary": 1000}]'
      )
    );
  });

  test("Get - get Employee with id", async () => {
    let res = await request(app).get("/employee/id/1");
    let result = JSON.parse(res.text);
    delete result["created_at"];
    delete result["last_updated"];

    expect(result).toEqual(
      JSON.parse(
        '{"employee": {"id": 1, "name": "Abhiram"}, "experience": 10, "id": 1, "location": {"country": "India", "id": 1, "name": "Hyderabad"}, "phno": "1234567890", "salary": 1000}'
      )
    );

    res = await request(app).get("/employee/id/2");
    expect(JSON.parse(res.text)).toEqual(JSON.parse('"Employee not found"'));
  });

  test("Get - get Employee with name", async () => {
    let res = await request(app).get("/employee/name/Abhiram");
    let result = JSON.parse(res.text);
    delete result["created_at"];
    delete result["last_updated"];
    expect(result).toEqual(
      JSON.parse(
        '{"employee": {"id": 1, "name": "Abhiram"}, "experience": 10, "id": 1, "location": {"country": "India", "id": 1, "name": "Hyderabad"}, "phno": "1234567890", "salary": 1000}'
      )
    );

    res = await request(app).get("/employee/name/Abhiram1");
    expect(JSON.parse(res.text)).toEqual(JSON.parse('"Employee not found"'));
  });

  test("Get - Salary", async () => {
    //notempty
    let res = await request(app).get(
      "/employee/salary?upper_bound=2000&lower_bound=0"
    );
    let result = JSON.parse(res.text);
    delete result["created_at"];
    delete result["last_updated"];

    expect(result).toEqual(
      JSON.parse('[{"id": 1, "name": "Abhiram", "salary": 1000}]')
    );
    //empty
    res = await request(app).get(
      "/employee/salary?upper_bound=2000&lower_bound=2001"
    );
    expect(JSON.parse(res.text)).toEqual(JSON.parse("[]"));
  });

  test("Put - eid and ename undefined", async () => {
    const res = await request(app).put(
      "/employee/?change_experience=10&change_city=Hyderabad&change_country=India&change_salary=1004&change_phno=1234567891"
    );
    expect(JSON.parse(res.text)).toEqual(
      JSON.parse('"Employee ID or Name is required."')
    );
  });

  test("Put - Employee not found", async () => {
    let res = await request(app).put(
      "/employee/?eid=6&ename=Abhiram&change_experience=10&change_city=Hyderabad&change_country=India&change_salary=1004&change_phno=1234567891"
    );
    expect(JSON.parse(res.text)).toEqual(JSON.parse('"Employee not found"'));

    res = await request(app).put(
      "/employee/?ename=Abhiram2&change_experience=10&change_city=Hyderabad&change_country=India&change_salary=1004&change_phno=1234567891"
    );
    expect(JSON.parse(res.text)).toEqual(JSON.parse('"Employee not found"'));
  });

  test("Put - Invalid PhoneNumber", async () => {
    let res = await request(app).put(
      "/employee/?eid=1&ename=Abhiram&change_experience=10&change_city=Hyderabad&change_country=India&change_salary=1004&change_phno=123456789"
    );
    expect(JSON.parse(res.text)).toEqual(JSON.parse('"Invalid Phone Number"'));

    res = await request(app).put(
      "/employee/?eid=1&ename=Abhiram&change_experience=10&change_city=Hyderabad&change_country=India&change_salary=1004&change_phno=12345678911"
    );
    expect(JSON.parse(res.text)).toEqual(JSON.parse('"Invalid Phone Number"'));

    res = await request(app).put(
      "/employee/?eid=1&ename=Abhiram&change_experience=10&change_city=Hyderabad&change_country=India&change_salary=1004&change_phno=123456789z"
    );
    expect(JSON.parse(res.text)).toEqual(JSON.parse('"Invalid Phone Number"'));

    res = await request(app).put(
      "/employee/?eid=1&ename=Abhiram&change_experience=10&change_city=Hyderabad&change_country=India&change_salary=1004&change_phno=0234567891"
    );
    expect(JSON.parse(res.text)).toEqual(JSON.parse('"Invalid Phone Number"'));
  });

  test("Put - Valid Request", async () => {
    let res = await request(app).put(
      "/employee/?eid=1&ename=Abhiram&change_experience=10&change_city=Hyderabad&change_country=India&change_salary=1004&change_phno=1234567891"
    );
    let result = JSON.parse(res.text);
    delete result["last_updated"];
    expect(result).toEqual(
      JSON.parse(
        '{"employee": {"id": 1, "name": "Abhiram"}, "experience": 10, "id": 1, "location": {"country": "India", "id": 1, "name": "Hyderabad"}, "phno": "1234567891", "salary": 1004}'
      )
    );
  });

  test("Delete - Delete an Employee ", async () => {
    const res = await request(app).delete("/employee/?ename=Abhiram&eid=1");
    expect(JSON.parse(res.text)).toEqual(JSON.parse('"Record Deleted"'));
  });
});
