import express from "express";
import {createManyTracks, createTrack, getAllTracks, getSingleTrack} from "../controllers/track.controller.js";

const trackRouter = express.Router();

trackRouter.route("/tracks")
    .get(getAllTracks)
    .post(createTrack);

trackRouter.route("/tracks/many")
    .post(createManyTracks);

trackRouter.route("/tracks/:id")
    .get(getSingleTrack)
    // .put(updateTrack)
    // .delete(deleteTrack);

trackRouter.route("/tracks/search/:searchValue")
    // .get(searchTracks);

trackRouter.route("/artists/albums/tracks/:searchValue")
    // .get(searchAll);

trackRouter.route("/artists/albums/tracks")
    // .post(createAllAtOnce);

export default trackRouter;