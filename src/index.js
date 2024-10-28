const express = require('express');
const cors = require('cors');
require('dotenv').config();
const routes = require('./routes');
const { sequelize } = require('./models');

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Use all routes
app.use('/api', routes);

sequelize.sync().then(() => {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
});
