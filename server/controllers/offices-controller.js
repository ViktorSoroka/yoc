// const uuid = require("uuid");
// const _ = require("lodash");

let data = [...require('./offices-data')];

module.exports = {
  async get(ctx) {
    ctx.body = { records: data };
    ctx.status = 200;
  },
};
