const express = require("express");

const app = express();

app.use(express.json());

let data = [];

// test web
app.get("/", (req, res) => {
    res.send("SERVER OK RUNNING");
});

// nhận data từ ESP32
app.post("/data", (req, res) => {
    const d = {
        temperature: req.body.temperature,
        humidity: req.body.humidity,
        light: req.body.light,
        time: new Date()
    };

    data.push(d);

    console.log("Received:", d);

    res.json({ success: true });
});

// lấy tất cả data
app.get("/api/data", (req, res) => {
    res.json(data);
});

// lấy data mới nhất
app.get("/data/latest", (req, res) => {
    res.json(data[data.length - 1] || {});
});

// PORT Railway
const PORT = process.env.PORT || 8080;

app.listen(PORT, "0.0.0.0", () => {
    console.log("Running on " + PORT);
});