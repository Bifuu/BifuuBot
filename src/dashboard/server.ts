import express from 'express';

const app: express.Application = express();
const port: number = 3030;

app.get(`/`, (req, res) => {
  res.send(`hello`);
});

app.listen(port, () => {
  console.log(`Dashboard listening at port ${port}`);
});
