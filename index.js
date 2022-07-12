const express = require("express");
const app = express();
const routes = require("./routes.js");
const PORT = 3333;

app.use(routes);

app.listen(process.env.PORT || 3000, function (error) {
  if (error) throw error;
  console.log(
    `Express server listening on http://localhost:${this.address().port} in ${
      app.settings.env
    } mode`
  );
});
