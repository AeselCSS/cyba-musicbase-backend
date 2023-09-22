import connection from "../database/dbconfig.js";
import {createArtistAsync} from "../utils/createEverything.js";
import {deleteFromAlbumsTracksTable, deleteFromTable, deleteOrphanedRecords, getAssociatedIds} from "../utils/utils.js";

async function getAllArtists(request, response) {
    try {
        const query = "SELECT * FROM artists";
        const [results, fields] = await connection.execute(query);
        response.status(200).json(results);
    }
    catch (error) {
        response.status(500).json({ message: "Internal server error" });
    }
}

async function getSingleArtist(request, response) {
    try {
        const id = request.params.id;
        const query = "SELECT * FROM artists WHERE id = ?";
        const values = [id];
        const [results, fields] = await connection.execute(query, values);
        if (results.length === 0) {
            response.status(404).json({ message: `Could not find artist by specified ID: ${id}` });
        } else {
            response.status(200).json(results[0]);
        }

    }
    catch (error) {
        response.status(500).json({ message: "Internal server error" });
    }
}

// async function createArtist(request, response) {
//     try {
//         const {name, image} = request.body;
//         const query = "INSERT INTO artists(name, image) VALUES (?,?)";
//         const values = [name, image];
//         const [results, fields] = await connection.execute(query, values);
//         if (results.length === 0 || !results) {
//             response.status(404).json({ message: `Could not create artist` });
//         } else {
//             response.status(201).json(results[0].insertId);
//         }
//     } catch (error) {
//         response.status(500).json({ message: "Internal server error" });
//     }
// }

async function createArtistEndpoint(request, response) {
    try {
        const artist = request.body;
        const artistId = await createArtistAsync(artist);

        if (artistId) {
            response.status(201).json(artistId);
        } else {
            response.status(404).json({ message: "Could not create artist" });
        }
    } catch (error) {
        response.status(500).json({ message: "Internal server error" });
    }
}


async function updateArtist(request, response) {
    try {
        const {name, image} = request.body;
        const id = request.params.id;
        const query = "UPDATE artists SET name = ?, image = ? WHERE id = ?";
        const values = [name, image, id];
        const [results, fields] = await connection.execute(query, values);
        if (results.length === 0 || !results) {
            response.status(404).json({ message: `Could not find artist by specified ID: ${id}` });
        } else {
            response.status(200).json(results);
        }
    } catch (error) {
        response.status(500).json({ message: "Internal server error" });
    }
}

async function deleteArtist(request, response) {
    const artistId = request.params.id;
    try {
        // Get album IDs and track IDs associated with the artist
        const albumIds = await getAssociatedIds("artists_albums", "album_id", "artist_id", artistId);
        const trackIds = await getAssociatedIds("artists_tracks", "track_id", "artist_id", artistId);
        console.log(albumIds);
        console.log(trackIds);
        // Delete associations with tracks and albums
        await deleteFromTable("artists_albums", "artist_id", [artistId]);
        await deleteFromTable("artists_tracks", "track_id", trackIds);
        await deleteFromAlbumsTracksTable(albumIds, trackIds);

        // Delete orphaned albums and tracks
        await deleteOrphanedRecords("albums", "album_id", albumIds);
        await deleteOrphanedRecords("tracks", "track_id", trackIds);

        // Delete the artist
        const query = "DELETE FROM artists WHERE id = ?";
        const values = [artistId];
        const [results, fields] = await connection.execute(query, values);
        if (results.affectedRows === 0) {
            response.status(404).json({
                message: `Could not find artist by specified ID: ${artistId}`,
            });
        } else {
            console.log("deleted artist")
            response.status(204).json();
        }
    } catch (error) {
        response.status(500).json({ message: "Internal server error" });
    }
}

async function getAllAlbumsByArtistName(request, response) {
    try {
        const searchValue = request.params.searchValue;
        const query = /*sql*/`
        WITH previous_result AS (
        SELECT id AS id 
        FROM artists 
        WHERE name LIKE ?)
        SELECT albums.title AS 'title', albums.year_of_release AS 'yearOfRelease', albums.image AS 'image', artists.name AS artist
        FROM albums
        INNER JOIN artists_albums ON albums.id = artists_albums.album_id
        INNER JOIN artists ON artists_albums.artist_id = artists.id
        INNER JOIN previous_result ON artists.id = previous_result.id;\
        `;
        const values = [`%${searchValue}%`];
        const [results, fields] = await connection.execute(query, values);
        if (results.length === 0 || !results) {
            response.status(404).json({ message: `Could not find albums with specified artist with ID: ${id}` });
        } else {
            response.status(200).json(results);
        }
    } catch (error) {
        response.status(500).json({ message: "Internal server error" });
    }
}

async function searchArtists(request, response) {
    try {
        const searchValue = request.params.searchValue;
        const query = `
        SELECT
        Artists.name,
        Artists.image,
        GROUP_CONCAT(DISTINCT Albums.title ORDER BY Albums.title ASC SEPARATOR ', ') AS Albums,
        GROUP_CONCAT(DISTINCT Tracks.title ORDER BY Tracks.title ASC SEPARATOR ', ') AS Tracks
        FROM Artists
        LEFT JOIN Artists_Albums ON Artists.id = Artists_Albums.artist_id
        LEFT JOIN Albums ON Artists_Albums.album_id = Albums.id
        LEFT JOIN Artists_Tracks ON Artists.id = Artists_Tracks.artist_id
        LEFT JOIN Tracks ON Artists_Tracks.track_id = Tracks.id
        WHERE name LIKE ?
        GROUP BY Artists.name, Artists.image; 
        `
        const values = [`%${searchValue}%`]

        const [results, fields] = await connection.execute(query, values);
        if (results.length === 0 || !results) {
            response.status(404).json({ message: `Could not find artists with specified search value: ${searchValue}` });
        } else {
            response.status(200).json(results);
        }
    } catch (error) {
        response.status(500).json({ message: "Internal server error" });
    }
}

export {getSingleArtist, getAllArtists, createArtistEndpoint, updateArtist, deleteArtist, getAllAlbumsByArtistName, searchArtists }

