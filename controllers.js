const fs = require("fs");
const { createController } = require("sm-express-server");
const pool = require("./database.js");

const controllers = {
    getData: createController(async (req, res) => {
        try {
          const client = await pool.connect();
          const result = await client.query('SELECT * FROM travelcontroll ORDER BY id DESC');
          client.release();
          res.json({ success: true, data: result.rows });
        } catch (err) {
          console.error('Error al obtener datos:', err);
          res.status(500).json({ success: false, error: 'Error al obtener los datos' });
        }
    }),
    setData: createController((req, res) => {
        const { totalMoney, moneySpent, moneyRemaining, expenses } = req.body.data;

  try {
    const client = await pool.connect();
    const insertQuery = `
      INSERT INTO travelcontroll (total_money, money_spent, money_remaining, expenses)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const values = [totalMoney, moneySpent, moneyRemaining, expenses];
    const result = await client.query(insertQuery, values);
    client.release();
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error('Error al insertar datos:', err);
    res.status(500).json({ success: false, error: 'Error al guardar los datos' });
  }
    }),
};

module.exports = controllers;
