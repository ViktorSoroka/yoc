// const uuid = require("uuid");
// const _ = require("lodash");

let data = [...require('./publishers-data')];

module.exports = {
  async get(ctx) {
    ctx.body = { records: data };
    ctx.status = 200;
  },
};
