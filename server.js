const app = require("./src/app");
const port = 8080;

app.listen(process.env.PORT || port, () => {
  console.log(`app está rodando na porta on port  ${port}`, );
});