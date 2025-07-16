const { Server, createRouter } = require("sm-express-server");

const port = process.env.PORT || 4005;

const server = new Server(
    port,
    "./",
    [],
    [
        createRouter("/", (router) => {
            router.get("/", (req, res) => {
                res.send("Hello, World!");
            });
        }),
    ]
);

server.start(() => {
	console.log(`Server is running on port ${port}`);
});
