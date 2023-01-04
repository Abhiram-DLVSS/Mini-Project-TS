import dotenv from 'dotenv';
dotenv.config();

const DB_CONN_STRING = process.env.DB_CONN_STRING || "";
const SERVER_PORT = process.env.PORT||9000;


export const config = {
    mongo:{
        url:DB_CONN_STRING.substring(1,DB_CONN_STRING.length-2)
    },
    server:{
        port: SERVER_PORT
    }
}
