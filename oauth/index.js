const http = require('http');
const port = process.env.PORT || 3000;
const axios = require('axios');
const cheerio = require('cheerio');
const url = require('url');
const express = require('express');
const app = express();
const router = express.Router();

// parameter for authentication
const APP_ID = '7KGNJY45YD9V2';
// const CLIENT_REDIRECT_URL = '730dbcbc-c4b1-6a9b-1b4e-ffba0fad26f0';
const MERCHANT_ID = 'GCMHPZQAE3A81';
const AUTHORIZATION_CODE = '';
const APP_SECRET = '730dbcbc-c4b1-6a9b-1b4e-ffba0fad26f0';
const REDIRECT_URI = 'http://localhost:3000/redirect-url';

const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const { pathname, query } = parsedUrl;
  // console.log('pathname')
  if (pathname === '/redirect-url') {
    const authorizationCode = query.code;
    console.log('Authorization Code:', authorizationCode);

    axios
      .get(
        `https://sandbox.dev.clover.com/oauth/token?client_id=${APP_ID}&client_secret=${APP_SECRET}&code=${authorizationCode}`,
      )
      .then((res) => {
        console.log(res.data);
      });

    res.writeHead(302, { Location: '/success' });
    res.end();
  } else {
    // Handle other routes or requests
    res.writeHead(404);
    res.end();
  }
});

async function getAuthorizationCode() {
  axios
    .get(
      `https://sandbox.dev.clover.com/oauth/authorize?client_id=${APP_ID}&redirect_uri=${REDIRECT_URI}`,
    )
    .then((response) => {
      const htmlUrl = response.request.res.responseUrl;

      console.log('HTML URL:', htmlUrl);
    });
}

server.listen(port, () => {
  getAuthorizationCode();

  console.log(`Server running on http://localhost:${port}/`);
});
