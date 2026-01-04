const {Sequelize} = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database_sqlite',
  logging: false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

const connectDB = async () => {
  // Synchronize
  sequelize.sync();

  await sequelize.authenticate();
  console.log('Connected to DB');
};

module.exports = {sequelize, connectDB};
