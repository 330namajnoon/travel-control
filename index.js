const path = require("path");
const { Server, createRouter } = require("sm-express-server");
const routes = require("./routes.js");
const bodyParser = require("body-parser");

const port = process.env.PORT || 4005;
const server = new Server(
    port,
    path.join(__dirname, "public"),
    [bodyParser.json()],
    [routes]
);

server.start(() => {
	console.log(`Server is running on port ${port}`);
});
