const express = require("express");
const axios = require("axios");
const path = require("path");
const app = express();
const cors = require("cors");

app.use(cors());
//const API_KEY = "c81p2kaad3i8p98ip8c0";
const API_KEY = "c88tqqqad3ia349rk800";
const URL = "https://finnhub.io/api/v1/";
app.use(express.static(path.join(__dirname, "apiserver")));
function unixToDatetime(value) {
  // Unixtimestamp
  var unixtimestamp = value;
  // Months array
  var months_arr = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  // Convert timestamp to milliseconds
  var date = new Date(unixtimestamp * 1000);
  // Year
  var year = date.getFullYear();
  // Month
  var month = months_arr[date.getMonth()];
  // Day
  var day = date.getDate();
  var convdataTime = month + " " + day + ", " + year;
  return convdataTime;
}

var today = new Date();
var dd = String(today.getDate()).padStart(2, "0");
var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
var yyyy = today.getFullYear();
var ddd = dd - 7;
var to = yyyy + "-" + mm + "-" + dd;
var from = yyyy + "-" + mm + "-" + ddd;
var twoyearsago = new Date(
  new Date().setFullYear(new Date().getFullYear() - 2)
);
var dd2 = String(twoyearsago.getDate()).padStart(2, "0");
var mm2 = String(twoyearsago.getMonth() + 1).padStart(2, "0"); //January is 0!
var yyyy2 = twoyearsago.getFullYear();
var from2 = yyyy2 + "-" + mm2 + "-" + dd2;
var unixto = Math.floor(
  new Date(`${yyyy + "." + mm + "." + dd}`).getTime() / 1000
);
var unixfrom = Math.floor(
  new Date(`${yyyy2 + "." + mm2 + "." + dd2}`).getTime() / 1000
);

// API call for autocomplete
app.get("/autocomplete", async (req, res) => {
  var result = [];
  var autoQuery = req.query.searchQuery;
  await axios
    .get(`${URL}search?q=${autoQuery}&token=${API_KEY}`)
    //.get(`${URL}search?q=TSLA&token=${API_KEY}`)
    .then((response) => {
      result1 = response.data.result;
      for (i = 0; i < result1.length; i++) {
        if (
          result1[i].type == "Common Stock" &&
          !result1[i].symbol.includes(".")
        ) {
          result.push(result1[i]);
        }
      }
    });
  res.send(result);
});

// API call for the company's description
app.get("/companydescription", async (req, res) => {
  var compQuery = req.query.searchQuery;
  await axios
    .get(`${URL}stock/profile2?symbol=${compQuery}&token=${API_KEY}`)
    .then((response) => {
      result = response.data;
    });
  res.send(result);
});

// API call for the company's latest price of stock
app.get("/latestpricestock", async (req, res) => {
  var latestQuery = req.query.searchQuery;
  await axios
    .get(`${URL}quote?symbol=${latestQuery}&token=${API_KEY}`)
    .then((response) => {
      result = response.data;
    });
  res.send(result);
});

// API call for the company's latest news
app.get("/news", async (req, res) => {
  var result = [],
    result2 = [];
  var newsQuery = req.query.searchQuery;
  await axios
    .get(
      `${URL}company-news?symbol=${newsQuery}&from=${from}&to=${to}&token=${API_KEY}`
    )
    .then((response) => {
      result2 = response.data;
      for (i = 0; i < result2.length; i++) {
        if (
          result2[i].category &&
          result2[i].datetime &&
          result2[i].headline &&
          result2[i].id &&
          result2[i].image &&
          result2[i].related &&
          result2[i].source &&
          result2[i].summary &&
          result2[i].url &&
          i < 20
        ) {
          result2[i].datetime = unixToDatetime(result2[i].datetime);
          result.push(result2[i]);
        }
      }
    });
  res.send(result);
});

// API call for the company's historical data
app.get("/history", async (req, res) => {
  var histQuery = req.query.searchQuery;
  var o = [],
    h = [],
    l = [],
    c = [],
    t = [],
    v = [],
    t1 = [],
    combined = [],
    ohlc = [],
    volume = [],
    i;
  await axios
    .get(
      `${URL}stock/candle?symbol=${histQuery}&resolution=D&from=${unixfrom}&to=${unixto}&token=${API_KEY}`
    )
    .then((response) => {
      result = response.data;
      o = result.o;
      h = result.h;
      l = result.l;
      c = result.c;
      v = result.v;
      t = result.t;
      for (i = 0; i < t.length; i++) {
        t1.push(t[i] * 1000);
      }
      for (i = 0; i < t.length; i++) {
        combined.push([
          t1[i],
          parseFloat(o[i].toFixed(2)),
          parseFloat(h[i].toFixed(2)),
          parseFloat(l[i].toFixed(2)),
          parseFloat(c[i].toFixed(2)),
          v[i],
        ]);
        ohlc.push([
          t1[i],
          parseFloat(o[i].toFixed(2)),
          parseFloat(h[i].toFixed(2)),
          parseFloat(l[i].toFixed(2)),
          parseFloat(c[i].toFixed(2)),
        ]);
        volume.push([t1[i], v[i]]);
      }
    });
  res.send(combined);
});

// API call for the company's recommendatio trends
app.get("/social", async (req, res) => {
  var socialQuery = req.query.searchQuery;
  var result;
  var trends = {};
  var totalReddit = 0;
  var positiveReddit = 0;
  var negativeReddit = 0;
  var totalTwitter = 0;
  var positiveTwitter = 0;
  var negativeTwitter = 0;
  await axios
    .get(
      `${URL}stock/social-sentiment?symbol=${socialQuery}&from=2022-01-01&token=${API_KEY}`
    )
    .then((response) => {
      result = response.data;
      for (var i = 0; i < result.reddit.length; i++) {
        totalReddit = result.reddit[i].mention + totalReddit;
        positiveReddit = result.reddit[i].positiveMention + positiveReddit;
        negativeReddit = result.reddit[i].negativeMention + negativeReddit;
      }
      for (var j = 0; j < result.twitter.length; j++) {
        totalTwitter = result.twitter[j].mention + totalTwitter;
        positiveTwitter = result.twitter[j].positiveMention + positiveTwitter;
        negativeTwitter = result.twitter[j].negativeMention + negativeTwitter;
      }
    });
  trends = {
    positivereddit: positiveReddit,
    negativereddit: negativeReddit,
    totalreddit: totalReddit,
    positivetwitter: positiveTwitter,
    negativetwitter: negativeTwitter,
    totaltwitter: totalTwitter,
  };
  res.send(trends);
});

// API call for the company's trends
app.get("/trends", async (req, res) => {
  var trendsQuery = req.query.searchQuery;
  var result;
  await axios
    .get(`${URL}stock/recommendation?symbol=${trendsQuery}&token=${API_KEY}`)
    .then((response) => {
      result = response.data;
    });
  res.send(result);
});

// API call for the company's trends
app.get("/earnings", async (req, res) => {
  var earningsQuery = req.query.searchQuery;
  var result;
  await axios
    .get(`${URL}stock/earnings?symbol=${earningsQuery}&token=${API_KEY}`)
    .then((response) => {
      result = response.data;
      for (var i = 0; i < result.length; i++) {
        if (result[i].actual == null) result[i].actual = 0;
        if (result[i].estimate == null) result[i].estimate = 0;
        if (result[i].period == null) result[i].period = 0;
        if (result[i].surprise == null) result[i].surprise = 0;
        if (result[i].surpricePercent == null) result[i].surprisePercent = 0;
        if (result[i].symbol == null) result[i].symbol = 0;
      }
    });
  res.send(result);
});

// API call for the company's peers
app.get("/peers", async (req, res) => {
  var peersQuery = req.query.searchQuery;
  var result = [],
    result2 = [];
  await axios
    .get(`${URL}stock/peers?symbol=${peersQuery}&token=${API_KEY}`)
    .then((response) => {
      result = response.data;
      for (var i = 0; i < result.length; i++) {
        if (result[i] == "") {
          continue;
        } else result2.push(result[i]);
      }
    });
  res.send(result2);
});

// API call for the company's stock close
app.get("/summary", async (req, res) => {
  var summary = [];
  var summQuery = req.query.searchQuery.split(",");
  var symbolTicker = summQuery[0];
  var UnixTo = summQuery[1];
  var date = new Date(UnixTo * 1000);
  date.setHours(date.getHours() - 7);
  var UnixFrom = Math.floor(new Date(date).getTime() / 1000);
  //console.log(symbolTicker + " " + UnixFrom + " " + UnixTo);
  var result;
  await axios
    .get(
      `${URL}stock/candle?symbol=${symbolTicker}&resolution=5&from=${UnixFrom}&to=${UnixTo}&token=${API_KEY}`
    )
    .then((response) => {
      result = response.data;
      for (var i = 0; i < result.t.length; i++) {
        summary.push([result.t[i] * 1000, result.c[i]]);
      }
    });
  res.send(summary);
});

//API call for the watchlist tab
app.get("/watchlist", async (req, res) => {
  var watchQuery = req.query.searchQuery;
  var result1,
    result2,
    result = {};
  await axios
    .get(`${URL}stock/profile2?symbol=${watchQuery}&token=${API_KEY}`)
    .then((response) => {
      result1 = response.data;
    });
  await axios
    .get(`${URL}quote?symbol=${watchQuery}&token=${API_KEY}`)
    .then((response) => {
      result2 = response.data;
    });
  result = {
    ticker: result1.ticker,
    company: result1.name,
    current: result2.c.toFixed(2),
    change: result2.d,
    percent: result2.dp.toFixed(2),
  };
  res.send(result);
});

// app.use((req, res) => {
//   res.send("Hello from express2");
// });
app.use(express.static(__dirname + "/apiserver/index.html"));
app.get("/*", (req, res) => res.sendFile(path.join(__dirname)));
var server = app.listen(8080, () => {
  console.log("Backend Application listening at http://localhost:8080");
});

module.exports = app;
