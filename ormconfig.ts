import { DataSource } from "typeorm";
import dotenv from "dotenv";

/* To access the .env file */
dotenv.config();

let database=process.env.DB;
// let sync=false;
if (process.env.JEST_WORKER_ID!=undefined){
  database='testdb';
  // sync=true;
  }
/* TypeORM's DataSource class */
const AppDataSource = new DataSource({
    type: "mssql",
    host: process.env.HOST,
    database: database,
    username: process.env.USER,
    password: process.env.PASSWORD,
    port: 1433,
    extra: {
      validateConnection: false,
      trustServerCertificate: true,
    },
    // dropSchema: true,
    // synchronize: true, //To automatically change the DB(used in dev)
    // logging: true, //Incase we want to view the SQL queries exectued by the TypeORM
    entities: ["src/entities/*{.ts,.js}"],
    migrations:["migrations/*{.ts,.js}"]
  });

export default AppDataSource;