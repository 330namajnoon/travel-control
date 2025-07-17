const pool = require('./database'); // Asegúrate de que este archivo exporta tu pool de conexión

pool.connect().then(client => {
	const query = `
		SELECT * FROM travelcontroll ORDER BY id DESC
	`;

	return client.query(query).then((res) => {
		console.log(res.rows[0]);
		client.release();
	}).catch(err => {
		console.error('Error al crear la tabla travelcontroll:', err);
		client.release();
	});
}).catch(err => {});