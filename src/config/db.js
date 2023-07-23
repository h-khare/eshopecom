// // const Sequelize = require("sequelize");
// // const sequelize = new Sequelize("ecommerce_qrev","harshkhare989","7G9Ev5cI5YYgfxEerMd0os0IuYQqk2fL",{
// //     host: 'postgres://192.168.219.237/ecommerce_qrev' ,
// //     dialect:"postgres",
// //     port:5432
// // });

// // try {
// //     sequelize.authenticate();
// //     console.log("Connected")
// // } catch (error) {
// //     console.log(error);
// // }

// // module.exports = sequelize

// // const { Pool } = require('pg');
// // const itemsPool = new Pool({
// //     connectionString: 'postgres://harshkhare989:7G9Ev5cI5YYgfxEerMd0os0IuYQqk2fL@dpg-ciun7qdiuiedpv0uhd80-a.oregon-postgres.render.com/ecommerce_qrev',
// //     ssl: {
// //         rejectUnauthorized: false
// //     }
// // });
// // module.exports = itemsPool;

// // itemsPool.query("create table toss(id int)",function(error,info){
// //     console.log(error)
// //     console.log(info)
// // })
// const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('ecommerce_qrev', 'harshkhare989', '7G9Ev5cI5YYgfxEerMd0os0IuYQqk2fL', {
  host: 'dpg-ciun7qdiuiedpv0uhd80-a.oregon-postgres.render.com', // Replace with your PostgreSQL server host
  dialect: 'postgres', // Use 'postgres' for PostgreSQL
  logging: false, // Set to false to disable logging SQL queries (optional),
  dialectOptions: {
    ssl: {
      rejectUnauthorized: false,
    },
  },
});

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

// Call the function to test the connection
testConnection();
