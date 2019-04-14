module.exports = app => app.use(async (ctx, next) => {
  try {
    await next();
  } catch (error) {
    if (error.status) {
      // could use template methods to render error page
      ctx.body = error.toString();
      ctx.status = error.status;
    } else {
      ctx.body = error.toString();
      ctx.status = 500;
      console.error(error.message, error.stack);
    }
  }
});
