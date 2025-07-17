const pool = require('./database'); // Asegúrate de que este archivo exporta tu pool de conexión

pool.connect().then(client => {
	const query = `
		ALTER TABLE travelcontroll
ALTER COLUMN total_money TYPE REAL,
ALTER COLUMN money_spent TYPE REAL,
ALTER COLUMN money_remaining TYPE REAL;
	`;

	return client.query(query).then(() => {
		console.log('Tabla travelcontroll creada o ya existe');
		client.release();
	}).catch(err => {
		console.error('Error al crear la tabla travelcontroll:', err);
		client.release();
	});
}).catch(err => {});