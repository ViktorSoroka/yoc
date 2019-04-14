let data = [...require('./users-data')];

module.exports = {
  async get(ctx) {
    ctx.body = { records: data };
    ctx.status = 200;
  },

  async put(ctx) {
    const newRecordData = { ...ctx.request.body };
    const record = data.find(({ id }) => id !== Number(newRecordData.id));

    Object.assing(record, newRecordData);

    ctx.status = 201;

    ctx.body = {
      status: 'success',
      record,
    };
  },

  async post(ctx) {
    const record = { ...ctx.request.body };

    data.push(record);

    ctx.status = 201;

    ctx.body = {
      status: 'success',
      record,
    };
  },

  async del(ctx) {
    data = data.filter(({ id }) => id !== ctx.params.id);

    ctx.status = 201;
  },
};
