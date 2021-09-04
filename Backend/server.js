const express = require("express");
const db = require("./db")
const utils = require("./utils");

const PORT = process.env.PORT || 3001;

const app = express();

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

app.get("/ping", (req, res) => {
    res.json({ message: "pong" });
});
  
app.get("/generate_user", (req, res) => {
  try{
    const user = utils.generate_user();

    res.json({ 
      user_id: user.id, 
      duration: user.duration, 
      time_period: user.time_period, 
      message: "User has been created"
    });
  }
  catch(err){
    console.error(err);
    res.json({ error: "Failed to create user" + err });
  }
})

app.post("/get_notification", (req, res) => {
  try{
    const blocked_notifications = db.get_blocked_notifications(req.body.user_id);
    const notification = utils.generate_notification(blocked_notifications);

    res.json({ 
      notification_id: notification.id,
      type: notification.type,
      text: notification.text, 
      message: "notification has been sent"
    });
  }
  catch(err){
    console.error(err);
    res.json({ error: "Failed to create notification" + err });
  }
})