const mongoose = require("mongoose");
const express = require("express");

const { roomModel, joinRoomModel } = require("../model/room-model.js");
const { userModel } = require("../model/user-model.js");

const roomRouter = express.Router();

roomRouter.post("/getrooms", async (req, res, next) => {
  const { search, user_id } = req.body;
  const user = await userModel.findOne({ _id: user_id });

  const query_obj = { user_email: user.email };

  if (!!search) {
    query_obj.room_name = { $regex: search };
  }

  try {
    const room = await joinRoomModel.find(query_obj, { room_id: 1, room_name: 1, _id: 0, preview: 1, date: 1 });
    res.send(room);
  } catch (err) {
    next(err);
  }
});

roomRouter.post("/createroom", async (req, res, next) => {
  const { room_name, user_id } = req.body;

  const user = await userModel.findOne({ _id: user_id });
  const user_email = user.email;

  try {
    const new_room = new roomModel({ room_name, creator_email: user_email });
    await new_room.save();

    const join_obj = { room_id: new_room._id, user_email, room_name: new_room.room_name, preview: "preview" };
    const new_join = new joinRoomModel(join_obj);
    new_join.save();

    res.send({ room_id: new_room.id, room_name: room_name });
  } catch (err) {
    next(err);
  }
});

roomRouter.post("/joinroom", async (req, res, next) => {
  const { room_id, user_id } = req.body;

  const user = await userModel.findOne({ _id: user_id });
  const user_email = user.email;

  try {
    const room = await roomModel.findOne({ _id: new mongoose.Types.ObjectId(room_id) });
    if (!!room) {
      const is_user_joined = await joinRoomModel.findOne({ user_email, room_id });

      if (!is_user_joined) {
        const join_obj = { room_id, user_email, room_name: room.room_name, preview: "preview" };
        const new_join = new joinRoomModel(join_obj);
        new_join.save();
        res.send({ ok: true, room_id, room_name: room.room_name });
      } else {
        res.send({ ok: false, message: "Already joined" });
      }
    } else {
      res.send({ ok: false, message: "Invalid group id" });
    }
  } catch (err) {
    next(err);
  }
});

module.exports = { roomRouter };
