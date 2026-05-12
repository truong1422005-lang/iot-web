const express = require("express");
const path = require("path");
const app = express();

const PORT = process.env.PORT || 3000;

// lưu dữ liệu tạm (không cần database)
let logs = [];

app.get("/update", (req, res) => {
    const data = {
        device: req.query.device || "ESP32",
        temp: req.query.temp || 0,
        humi: req.query.humi || 0,
        light: req.query.light || 0,
        time: new Date()
    };

    logs.unshift(data);
    if (logs.length > 50) logs.pop();

    res.send("OK");
});

app.get("/data", (req, res) => {
    res.json(logs[0] || {});
});

app.get("/logs", (req, res) => {
    res.json(logs);
});

// serve web
app.use(express.static(__dirname));

// chạy server
app.listen(PORT, "0.0.0.0", () => {
    console.log("Server running...");
});