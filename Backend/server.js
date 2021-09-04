const express = require("express");

import db from "./db";
import utils from "./utils";

const PORT = process.env.PORT || 3001;

const app = express();

/**
 * create db instance
 */
db.create_db();
db.create_table_users();

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