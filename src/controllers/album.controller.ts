import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error']
});

export const getAllAlbums = async (_req: Request, res: Response): Promise<void> => {
    try {
        const albums = await prisma.albums.findMany();
        res.json(albums);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

export const getSingleAlbum = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const album = await prisma.albums.findUnique({
            where: { id: Number(id) },
            include: {
                artistAlbums: {
                    include: {
                        artist: true,
                    }
                }
            }
        });
        res.json(album);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}


export const createAlbum = async (req: Request, res: Response): Promise<void> => {
    try {
        const { title, yearOfRelease, image, artistIds } = req.body;
        if (!title || !yearOfRelease || !image || !artistIds) {
            throw new Error("Missing required fields: title, yearOfRelease, image, artistIds");
        }
        // Create album
        const album = await prisma.albums.create({
            data: { title, yearOfRelease, image },
        });
        // Link the album to the artist via ArtistAlbum junction table
        for (const artistId of artistIds) {
            await prisma.artistAlbum.create({
                data: {
                    artistId: artistId,
                    albumId: album.id,
                },
            });
        }
        res.json(album);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

export const createManyAlbums = async (req: Request, res: Response): Promise<void> => {
    try {
        const albums = req.body;
        const createdAlbums: any[] = [];

        for (const { title, yearOfRelease, image, artistIds } of albums) {
            const createdAlbum = await prisma.albums.create({
                data: { title, yearOfRelease, image },
            });

            for (const artistId of artistIds) {
                await prisma.artistAlbum.create({
                    data: {
                        artistId: artistId,
                        albumId: createdAlbum.id,
                    },
                });
            }
            createdAlbums.push(createdAlbum);
        }

        res.json(createdAlbums);

    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};



