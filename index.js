require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function (req, res) {
  res.json({ greeting: 'hello API' });
});

let shortUrls = []

app.use('/api/shorturl', bodyParser.urlencoded({ extended: true })); // 解析 urlencoded 格式的请求体
app.use('/api/shorturl', bodyParser.json()); // 解析 JSON 格式的请求体
app.post('/api/shorturl', (req, res) => {
  console.log("Post body: ", req.body);
  const postUrl = req.body.url;
  let resJson = {}
  if (/^https?:.*$/.test(postUrl)) {
    resJson = {
      original_url: postUrl,
      short_url: shortUrls.length,
    }
    shortUrls.push(postUrl);
  } else {
    resJson = {
      error: "invalid url",
    }
  }
  res.json(resJson);
});

app.get('/api/shorturl/:short?', (req, res) => {
  res.redirect(shortUrls[req.params.short]);
})

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
