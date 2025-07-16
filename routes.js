const { createRouter } = require("sm-express-server");
const controllers = require("./controllers.js");

const routes = createRouter("/", (router) => {
	router.get("/", (req, res) => {
		res.send("Hello, World!");
	});
	router.get("/data", controllers.getData);
	router.post("/data", controllers.setData);
});

module.exports = routes;