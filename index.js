require('dotenv').config({
  path: './dev.env'
});
const cors = require('cors');
const morgan = require('morgan');
const express = require('express');

const app = express();
const PORT = process.env.PORT;



app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(cors());
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms")
);
async function setupAPIS(appModule) {
  appModule.use('/', require('./Routes/Auth/User.Sign/Auth.Register'));
  appModule.use("*", (req, res) => {
    return res.status(404).json({
      success: false,
      message: "API does not exist, you are currently accessing.",
    });
  });
  appModule.get('/', (req, res) => {
    res.send('Welcome to Ecommerce Backend API');
  })
  appModule.listen(PORT, () => {
    console.log('Server is up at ' + PORT);
  })
}

setupAPIS(app);