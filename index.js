const https = require("https");
const express = require("express");
const app = express();

app.get("/api/indices", (req, res) => {
  const options = {
    hostname: "www.nseindia.com",
    path: "/api/allIndices",
    headers: {
      "User-Agent": "Mozilla/5.0",
      "Accept": "*/*",
      "Accept-Language": "en-US,en;q=0.9",
    },
  };

  https.get(options, (r) => {
    let data = "";
    r.on("data", (chunk) => (data += chunk));
    r.on("end", () => {
      try {
        res.json(JSON.parse(data));
      } catch (e) {
        res.status(500).json({ error: "Parsing error" });
      }
    });
  }).on("error", (e) => {
    res.status(500).json({ error: "Fetch error" });
  });
});

app.get("/api/stocks", (req, res) => {
  const sector = req.query.sector;
  if (!sector) return res.status(400).json({ error: "Sector required" });

  const sectorMap = {
    "NIFTY BANK": "bank-nifty",
    "NIFTY IT": "nifty-it",
    "NIFTY AUTO": "nifty-auto",
    "NIFTY FMCG": "nifty-fmcg",
    "NIFTY PHARMA": "nifty-pharma",
    "NIFTY FINANCIAL SERVICES": "nifty-fin-service",
    "NIFTY REALTY": "nifty-realty",
    "NIFTY ENERGY": "nifty-energy",
    "NIFTY METAL": "nifty-metal",
    "NIFTY MEDIA": "nifty-media",
    "NIFTY PSU BANK": "nifty-psu-bank",
  };

  const slug = sectorMap[sector];
  if (!slug) return res.status(400).json({ error: "Unknown sector" });

  const options = {
    hostname: "www.nseindia.com",
    path: `/api/equity-stockIndices?index=${encodeURIComponent("NIFTY " + slug.replace("nifty-", "").toUpperCase())}`,
    headers: {
      "User-Agent": "Mozilla/5.0",
      "Accept": "*/*",
      "Accept-Language": "en-US,en;q=0.9",
    },
  };

  https.get(options, (r) => {
    let data = "";
    r.on("data", (chunk) => (data += chunk));
    r.on("end", () => {
      try {
        const json = JSON.parse(data);
        const stocks = json.data.map(stock => ({
          symbol: stock.symbol,
          volume: stock.totalTradedVolume,
          avgVolume: stock.perChange365d,
        }));
        res.json(stocks);
      } catch (e) {
        res.status(500).json({ error: "Parsing error" });
      }
    });
  }).on("error", (e) => {
    res.status(500).json({ error: "Fetch error" });
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});