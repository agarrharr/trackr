const express = require('express');
const fs = require('fs');
const { DateTime } = require('luxon');
const isAbsoluteUrl = require('is-absolute-url');
const requestIp = require('request-ip');

const port = process.env.PORT || 8000;

const app = express();

app.use(requestIp.mw())

app.get(`/`, (request, result) => {
  result.send(`Trackr`);
});

app.get(`/redirect/:url*`, (request, result) => {
  const url = `${request.params.url}${request.param(0)}`;
  const isUrl = isAbsoluteUrl(url);
  const datetime = DateTime.local();
  const ip = request.clientIp;

  fs.appendFile(`log.csv`, `"${url}", "${isUrl}", "${datetime}", "${ip}"\n`);

  if (isUrl) {
    result.redirect(url);
  } else {
    result.send(`${url} is not a valid url`);
  }
});

const server = app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
