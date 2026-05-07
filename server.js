const express = require("express");
const bodyParser = require("body-parser");

const app = express();

// middleware
app.use(bodyParser.json());

// lưu dữ liệu cảm biến
let sensorData = [];

// test server
app.get("/", (req, res) => {
    res.send("IoT Server Running");
});

// ESP32 gửi dữ liệu lên đây
app.post("/data", (req, res) => {
    const data = {
        temperature: req.body.temperature,
        humidity: req.body.humidity,
        light: req.body.light,
        time: new Date().toISOString()
    };

    sensorData.push(data);

    console.log("Received:", data);

    res.json({
        success: true,
        message: "Data received"
    });
});

// lấy toàn bộ dữ liệu
app.get("/api/data", (req, res) => {
    res.json(sensorData);
});

// lấy data mới nhất
app.get("/data/latest", (req, res) => {
    res.json(sensorData[sensorData.length - 1] || {});
});

// PORT Railway bắt buộc dùng process.env.PORT
const PORT = process.env.PORT || 3000;

// chạy server
app.listen(PORT, "0.0.0.0", () => {
    console.log("Server running on port " + PORT);
});