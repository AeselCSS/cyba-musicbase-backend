import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error']
});

export const getAllArtists = async (_req: Request, res: Response): Promise<void> => {
    try {
        const artists = await prisma.artists.findMany();
        res.json(artists);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

export const getSingleArtist = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const artist = await prisma.artists.findUnique({
            where: { id: Number(id) },
        });
        res.json(artist);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

export const createArtist = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, image } = req.body;

        const artist = await prisma.artists.create({
            data: { name, image },
        });
        res.json(artist);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

export const createManyArtists = async (req: Request, res: Response): Promise<void> => {
    try {
        const artists = req.body;
        const artist = await prisma.artists.createMany({
            data: artists,
        });
        res.json(artist);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

export const updateArtist = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { name, image } = req.body;

        const artist = await prisma.artists.update({
            where: { id: Number(id) },
            data: { name, image },
        });
        res.json(artist);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

export const deleteArtist = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        await prisma.artists.delete({
            where: { id: Number(id) },
        });
        res.status(200).json({ message: `Artist ${id} deleted` });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

export const searchArtists = async (req: Request, res: Response): Promise<void> => {
    try {
        const { searchValue } = req.params;
        const artists = await prisma.artists.findMany({
            where: {
                OR: [
                    { name: { contains: searchValue } },
                ],
            },
        });
        res.json(artists);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

export const getAllAlbumsByArtist = async (req: Request, res: Response): Promise<void> => {
    try {
        const { artist } = req.params;
        const albums = await prisma.artists.findUnique({
            where: { name: artist },
            include: {
                artistAlbums: {
                    include: {
                        album: true,
                    }
                }
            }
        });
        if (!albums) {
            throw new Error('Artist not found');
        }
        // Extract and transform the album data
        const albumsByArtist = albums.artistAlbums.map(t => t.album);
        res.json(albumsByArtist);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}