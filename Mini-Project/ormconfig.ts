import { DataSource } from "typeorm";
import dotenv from "dotenv";

/* To access the .env file */
dotenv.config();

/* TypeORM's DataSource class */
const AppDataSource = new DataSource({
    type: "mssql",
    host: process.env.HOST,
    database: process.env.DB,
    username: process.env.USER,
    password: process.env.PASSWORD,
    port: 1433,
    extra: {
      validateConnection: false,
      trustServerCertificate: true,
    },
    // synchronize: true, //To automatically change the DB(used in dev)
    // logging: true, //Incase we want to view the SQL queries exectued by the TypeORM
    entities: ["src/entities/*{.ts,.js}"],
    migrations:["migrations/*{.ts,.js}"]
  }); 
  
  
  const connect=async (AppDataSource:DataSource) => {
    await AppDataSource.initialize()
    .then(() => console.log("Database Connected"))
    .catch((err) => console.log("database connection failed", err));
  }
  connect(AppDataSource);


export default AppDataSource;