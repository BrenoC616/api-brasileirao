const express = require("express");
const app = express();
const routes = require("./routes.js");
const PORT = 3333;

app.use(routes);

app.listen(process.env.PORT || 3000, function () {
  console.log(
    "Express server listening on port %d in %s mode",
    this.address().port,
    app.settings.env
  );
});