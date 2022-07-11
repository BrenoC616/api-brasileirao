const express = require("express");
const app = express();
const routes = require("./routes.js");
const PORT = 3333;

app.use(routes);

app.listen(PORT, () => {
  console.log(`Listen on http://localhost:${PORT}`);
});
