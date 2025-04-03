module.exports = (app) => {
  const users = require("../controllers/user.controller.js");
  const auth = require("../middlewares/auth.js");

  const permissions = require("../middlewares/permission.js");

  var router = require("express").Router();

  router.post("/", users.signUp);

  router.get(
    "/",
    auth.isAuthenticated,
    permissions.authorize(["ADMIN"]),
    users.getAll
  );

  router.get(
    "/:id",
    auth.isAuthenticated,
    permissions.authorize(["ADMIN"]),
    users.findOneById
  );

  router.get(
    "/username/:username",
    permissions.authorize(["ADMIN"]),
    auth.isAuthenticated,
    users.getByUsername
  );

  router.put(
    "/:id",
    auth.isAuthenticated,
    permissions.authorize(["ADMIN"]),
    users.update
  );

  router.delete(
    "/:id",
    auth.isAuthenticated,
    permissions.authorize(["ADMIN"]),
    users.delete
  );

  router.post("/signin", auth.signin);

  router.put(
    "/password/:id",
    auth.isAuthenticated,
    permissions.authorize(["ADMIN", "USER"]),
    users.updatePassword
  );

  router.put(
    "/own-password/:id",
    auth.isAuthenticated,
    permissions.authorize(["USER"]),
    users.updateOwnPassword
  );

  router.put(
    "/giveadmin/:id",
    auth.isAuthenticated,
    // permissions.authorize(["ADMIN"]),
    users.promoteToAdmin
  );

  app.use("/api/users", router);
};
