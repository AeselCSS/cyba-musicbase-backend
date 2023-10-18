import express from "express";
import {createAlbum, createManyAlbums, getAllAlbums, getSingleAlbum} from "../controllers/album.controller.js";

const albumRouter = express.Router();

albumRouter.route("/albums/")
    .get(getAllAlbums)
    .post(createAlbum)

albumRouter.route("/albums/many")
    .post(createManyAlbums);

albumRouter.route("/albums/:id")
    .get(getSingleAlbum)
    // .put(updateAlbum)
    // .delete(deleteAlbum);

albumRouter.route("/albums/search/:searchValue")
    // .get(searchAlbums);

albumRouter.route("/albums/:id/tracks")
    // .get(getAllAlbumDataByAlbumID);

export default albumRouter;