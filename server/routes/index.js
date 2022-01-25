const router = require('express').Router();

const topicsRouter = require("./topicsRouter");
const articlesRouter = require("./articlesRouter");
const usersRouter = require("./usersRouter");
const commentsRouter = require("./commentsRouter");
const apis = require('../utils/endpoints.json'); //?

router.use("/topics", topicsRouter);
router.use("/articles", articlesRouter);
router.use("/users", usersRouter);
router.use("/", commentsRouter);

router.use("/",(err,req,res)=>{ // not working
  if(err) throw err;
  console.log('browser');
  res.status(200).send(apis);
});

module.exports = router;