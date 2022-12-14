import api from "@marcius-capital/binance-api";
import express from "express";

const app = express(),
  port = 3080;
let binances = [];

app.use(express.static(process.cwd() + "/dist/binance-test/"));

app.get("/getBinance/:time", async (req, res) => {
  const { time } = req.params;

  await api.rest
    .klines({
      symbol: "btcusdt".toUpperCase(),
      interval: time.toLowerCase(),
      limit: 500,
    })
    .then((cb) => {
      binances = cb;
    });

  if (binances.length < 1) {
    return res.status(404).send("Binance not found");
  }

  res.json(binances);
});

app.get("/", (req, res) => {
  res.sendFile(process.cwd() + "/dist/binance-test/index.html");
});

app.listen(process.env.PORT || port, () => {
  console.log(`Server listening on the port...`);
});
