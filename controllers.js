const fs = require("fs");
const { createController } = require("sm-express-server");
const pool = require("./database.js");

const controllers = {
    getData: createController(async (req, res) => {
      const client = await pool.connect();
      try {
        const result = await client.query('SELECT * FROM travelcontroll ORDER BY id DESC');
        
        if (result.rows.length === 0) {
          // No hay datos, insertar uno por defecto
          const defaultData = {
            total_money: 0,
            money_spent: 0,
            money_remaining: 0,
            expenses: []
          };
    
          const insertQuery = `
            INSERT INTO travelcontroll (total_money, money_spent, money_remaining, expenses)
            VALUES ($1, $2, $3, $4)
            RETURNING *;
          `;
          const insertValues = [
            defaultData.total_money,
            defaultData.money_spent,
            defaultData.money_remaining,
            JSON.stringify(defaultData.expenses)
          ];
    
          const insertResult = await client.query(insertQuery, insertValues);
          return res.json({ success: true, data: insertResult.rows[0] });
        }
        res.json({ success: true, data: result.rows[0] });
      } catch (err) {
        console.error('Error en GET /travel:', err);
        res.status(500).json({ success: false, error: 'Error al obtener los datos' });
      } finally {
        client.release();
      }
    }),
    setData: createController(async (req, res) => {
        const { totalMoney, moneySpent, moneyRemaining, expenses } = req.body.data;
        

  try {
    const client = await pool.connect();
    const insertQuery = `
      INSERT INTO travelcontroll (total_money, money_spent, money_remaining, expenses)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const values = [totalMoney, moneySpent, moneyRemaining, JSON.stringify(expenses)];
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
