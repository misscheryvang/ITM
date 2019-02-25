const express = require("express");

const app = express();

app.use(express.static("./public"));

app.get("*", (request, response) => {
    response.sendFile(__dirname + "/public/index.html");
});

const port = 3000;
app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`);
});
