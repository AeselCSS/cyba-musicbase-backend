import connection from "../database/dbconfig.js";

async function getAllArtists(request, response) {
    const query = "SELECT * FROM artists";
    connection.query(query, (error, results, fields) => {
        if (error) {
            console.log(error);
        } else {
            response.json(results);
        }
    });
}

async function getSingleArtist(request, response) {
    const id = request.params.id;
    const query = "SELECT * FROM artists WHERE id = ?";
    const values = [id];

    connection.query(query, values, (error, results, fields) => {
        if (error) {
            console.log(error);
        } else {
            response.json(results[0])
        }
    })
}

async function createArtist(request, response) {
    const newArtist = request.body;
    const query = "INSERT INTO artists(name,image) VALUES (?,?)";
    //!Default value virker ikke i sql databasen, når image er null. Fix det.
    const values = newArtist.image ? [newArtist.name, newArtist.image] : [newArtist.name];

    connection.query(query, values, (error, results, fields) => {
        if (error) {
            console.log(error);
        } else {
            response.json(results);
        }
    });
}

async function updateArtist(request, response) {
    const id = request.params.id;
    const updatedArtist = request.body;
    const query = "UPDATE artists SET name = ?, image = ? WHERE id = ?";
    const values = [updatedArtist.name, updatedArtist.image, id];

    connection.query(query, values, (error, results, fields) => {
        if (error) {
            console.log(error);
        } else {
            response.json(results);
        }
    });
}

async function deleteArtist(request, response) {
    const id = request.params.id;
    const query = "DELETE FROM artists WHERE id = ?";
    const values = [id];

    connection.query(query, values, (error, results, fields) => {
        if (error) {
            console.log(error);
        } else {
            response.status(204).json();
        }
    })
}



export {getSingleArtist, getAllArtists, createArtist, updateArtist, deleteArtist}