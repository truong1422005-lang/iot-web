const express = require("express");
const mongoose = require("mongoose");

const app = express();

app.use(express.json());

// ===== CONNECT MONGO =====
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("MongoDB Connected");
}).catch(err => {
    console.log("Mongo Error:", err);
});

// ===== SCHEMA =====
const SensorSchema = new mongoose.Schema({
    temperature: Number,
    humidity: Number,
    light: Number,
    time: String
});

const Sensor = mongoose.model("Sensor", SensorSchema);

// ===== ROUTES =====
app.get("/", (req, res) => {
    res.send("IoT Server + MongoDB Running");
});

// ESP32 gửi data
app.post("/data", async (req, res) => {
    const data = new Sensor({
        temperature: req.body.temperature,
        humidity: req.body.humidity,
        light: req.body.light,
        time: new Date().toISOString()
    });

    await data.save();

    res.json({ success: true });
});

// lấy tất cả data
app.get("/api/data", async (req, res) => {
    const data = await Sensor.find();
    res.json(data);
});

// lấy mới nhất
app.get("/data/latest", async (req, res) => {
    const data = await Sensor.findOne().sort({ _id: -1 });
    res.json(data || {});
});

// ===== PORT RAILWAY =====
const PORT = process.env.PORT;

app.listen(PORT, "0.0.0.0", () => {
    console.log("Running on " + PORT);
});