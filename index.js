const path = require("path");
const { Server, createRouter } = require("sm-express-server");
const routes = require("./routes.js");
const bodyParser = require("body-parser");
const express = require("express");
const pool = require("./database.js");

const port = process.env.PORT || 4005;
const server = new Server(
    port,
    path.join(__dirname, "public"),
    [bodyParser.json(), express.static(path.join(__dirname, "./"))],
    [routes]
);

async function createTravelControlTable() {
  const client = await pool.connect();
  try {
    const query = `
      CREATE TABLE IF NOT EXISTS travelcontroll (
        id SERIAL PRIMARY KEY,
        total_money REAL,
        money_spent REAL,
        money_remaining REAL,
        expenses JSONB,
        walet JSONB
      );
    `;
    await client.query(query);
    console.log('Tabla "travelcontroll" lista.');
  } catch (err) {
    console.error('Error al crear/verificar tabla:', err);
  } finally {
    client.release();
  }
}

server.start(async () => {
	console.log(`Server is running on port ${port}`);
	await createTravelControlTable();
});
