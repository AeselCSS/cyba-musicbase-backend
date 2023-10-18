import express from "express";
import {
    createArtist,
    createManyArtists, deleteArtist, getAllAlbumsByArtist,
    getAllArtists,
    getSingleArtist, searchArtists,
    updateArtist
} from "../controllers/artist.controller.js";

const artistRouter = express.Router();


artistRouter.route("/artists/")
    .get(getAllArtists)
    .post(createArtist);

artistRouter.route("/artists/:id")
    .get(getSingleArtist)
    .put(updateArtist)
    .delete(deleteArtist);

artistRouter.route("/artists/many")
     .post(createManyArtists);

artistRouter.route("/artists/search/:searchValue")
    .get(searchArtists);

artistRouter.route("/artists/albums/:artist")
    .get(getAllAlbumsByArtist);


export default artistRouter