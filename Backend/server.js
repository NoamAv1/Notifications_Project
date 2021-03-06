const express = require("express");
const bodyParser = require('body-parser')
const db = require("./db")
const utils = require("./utils");

const PORT = process.env.PORT || 3001;

const app = express();
app.use(bodyParser.json());

/**
 * create db instance
 */
const setup_db = async () => {
  await db.create_db();
  await db.create_table_users();
};
setup_db();

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

/**
 * To check if the server online.
 */
app.get("/ping", (req, res) => {
  res.json({ message: "pong" });
});

/**
 * Generating user route
 */
app.get("/generate_user", (req, res) => {
  try {
    const user = utils.generate_user();

    res.json({
      user_id: user.id,
      duration: user.duration,
      time_period: user.time_period,
      message: "User has been created"
    });
  }
  catch (err) {
    console.error(err);
    res.json({ error: "Failed to create user " + err });
  }
});


/**
 * Getting a new notificaiton route
 */
app.post("/get_notification", async (req, res) => {

  try {
    let blocked_notifications = await db.get_blocked_notifications(req.body.user_id)
    const notification = utils.generate_notification(blocked_notifications);

    if (notification) {
      res.json({
        notification_id: notification?.id,
        type: notification.type,
        text: notification.text,
        message: "notification has been sent"
      });
    }
  }
  catch (err) {
    console.error(err);
    res.json({ error: "Failed to create notification " + err });
  }
});

/**
 * Updating the black list route.
 */
app.post("/update_blocked_notifications", (req, res) => {
  try {
    const notification = utils.add_to_blocked_notifications(req.body.user_id, req.body.notification_id);

    if (notification) {
      res.json({
        message: "notification has been blocked"
      });
    }
  }
  catch (err) {
    console.error(err);
    res.json({ error: "Failed to block notification " + err });
  }
});