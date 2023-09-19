import express from "express";
import { createArtist, deleteArtist, getAllAlbumsByArtistName, getAllArtists, getSingleArtist, updateArtist, searchArtists } from "./artists.controller.js";

const artistRouter = express.Router();

artistRouter.get("/artists/", getAllArtists);
artistRouter.get("/artists/:id", getSingleArtist);
artistRouter.get("/artists/search/:searchValue", searchArtists)
artistRouter.post("/artists/", createArtist);
artistRouter.put("/artists/:id", updateArtist);
artistRouter.delete("/artists/:id", deleteArtist);

//#7 branch - få alle albums fra en bestemt artist ud fra et navn
artistRouter.get("/artists/albums/:searchValue", getAllAlbumsByArtistName); //TODO - kig lige på sql query'et - det ser vildt ud :)


export default artistRouter