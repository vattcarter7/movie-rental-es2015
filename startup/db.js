const mongoose = require('mongoose');

module.exports = function () {
  const MONGO_URI = process.env.MONGO_URI;
  mongoose
    .connect(MONGO_URI, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false
    })
    .then(() => console.log(`connected to database ${MONGO_URI}`));
};
