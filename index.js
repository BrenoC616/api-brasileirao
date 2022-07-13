const express = require("express");
const app = express();
const routes = require("./routes.js");

const setCache = (req, res, next) => {
  const period = 60 * 60;
  if (req.method == "GET") {
    res.set("Cache-Control", `s-maxage=${period}, stale-while-revalidate`);
  } else {
    res.set("Cache-Control", `no-store`);
  }

  next();
};

app.use(setCache);
app.use(routes);

app.listen(process.env.PORT || 3000, function (error) {
  if (error) throw error;
  console.log(
    `Express server listening on http://localhost:${this.address().port} in ${
      app.settings.env
    } mode`
  );
});
