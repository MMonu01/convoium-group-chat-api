const express = require("express");

const { messageModel } = require("../model/message-model.js");

const messageRouter = express.Router();

messageRouter.post("/getmessages", async (req, res, next) => {
  try {
    const { room_id } = req.body;
    const message_list = await messageModel.find({ room_id }, { date: 1, message: 1, user_email: 1, user_avatar: 1, username: 1 });

    let new_message_list = [];

    for (let i = 0; i < message_list.length; i++) {
      if (i == 0) {
        const { date, user_email, user_avatar, username } = message_list[i];

        const message_obj = { date, user_email, user_avatar, username, messages: [{ message: message_list[i].message, date }] };
        new_message_list.push(message_obj);
      } else {
        const x = new_message_list.length - 1;

        if (message_list[i].user_email === new_message_list[x].user_email) {
          const { messages } = new_message_list[x];
          if (Object.hasOwn(new_message_list[x], "messages")) {
            new_message_list[x].messages = [...messages, { message: message_list[i].message, date: message_list[i].date }];
          } else {
            new_message_list[x].messages = [{ message: message_list[i].message, date: message_list[i].date }];
          }
        } else {
          const { date, user_email, user_avatar, username } = message_list[i];
          const message_obj = { date, user_email, user_avatar, username, messages: [{ message: message_list[i].message, date }] };
          new_message_list.push(message_obj);
        }
      }
    }

    res.send(new_message_list);
  } catch (err) {
    next(err);
  }
});

module.exports = { messageRouter };
