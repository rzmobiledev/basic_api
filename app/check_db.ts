const { Sequelize } = require('sequelize');
require("dotenv").config();

const sequelize = new Sequelize(
    String(process.env.DB_NAME),
    String(process.env.DB_USER),
    String(process.env.DB_PASSWORD), {
        host: process.env.DB_HOST,
        dialect: "postgres"
    }
);

function db_connection(ms: number){
    return new Promise((resolve, reject) => {
        const interval = setInterval(() => {
            const db_status = sequelize.authenticate();
            if(db_status){
                resolve(clearInterval(interval))
            } else {
                reject("connecting database. Waiting 2 seconds...")
            }
        }, ms)
    });
}

export async function check_db_connection(){
    await db_connection(2000)
    .then(() => console.log("Connected to database."))
    .catch((err) => console.log(err))
}

check_db_connection();
