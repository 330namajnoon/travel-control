const fs = require("fs");
const { createController } = require("sm-express-server");

const controllers = {
    getData: createController((req, res) => {
        fs.readFile("data.json", "utf8", (err, data) => {
            if (err) {
                res.status(500).send("Error reading data");
                return;
            }
            try {
                const jsonData = JSON.parse(data);
                res.json(jsonData);
            } catch (parseError) {
                res.status(500).send("Error parsing data");
            }
        });
    }),
    setData: createController((req, res) => {
        const newData = req.body.data;
        fs.writeFile("data.json", JSON.stringify(newData), "utf8", (err) => {
            if (err) {
                res.status(500).send("Error writing data");
                return;
            }
            console.log("Data updated successfully:", newData);
            res.status(200).send({ sucess: true, message: "Data updated successfully" });
        });
    }),
};

module.exports = controllers;
