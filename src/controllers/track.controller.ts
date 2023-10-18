import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error']
});

export const getAllTracks = async (_req: Request, res: Response): Promise<void> => {
    try {
        const tracks = await prisma.tracks.findMany();
        res.json(tracks);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

export const getSingleTrack = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const track = await prisma.tracks.findUnique({
            where: { id: Number(id) },
            include: {
                trackArtistAlbums: {
                    include: {
                        artist: true,
                        album: true,
                    }
                }
            }
        });
        if (!track) {
            throw new Error('Track not found');
        }
        // Extract and transform the artists and album data
        const artists = track.trackArtistAlbums.map(t => t.artist);
        const album = track.trackArtistAlbums[0]?.album;
        // Create a new response structure
        const response = {
            id: track.id,
            title: track.title,
            duration: track.duration,
            createdAt: track.createdAt,
            updatedAt: track.updatedAt,
            artists: artists,    // Array of artists
            album: album,        // Single album detail
        };
        res.json(response);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};


export const createTrack = async (req: Request, res: Response): Promise<void> => {
    try {
        const { title, duration, albumId, artistId } = req.body;
        if (!title || !duration || !albumId || !artistId) {
            throw new Error("Missing required fields: title, duration, albumId, artistId");
        }

        const track = await prisma.tracks.create({
            data: { title, duration },
        });

        // Link the track to the artist and album via TrackArtistAlbum junction table
        await prisma.trackArtistAlbum.create({
            data: {
                trackId: track.id,
                artistId: artistId,
                albumId: albumId,
            },
        });

        res.json(track);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};


export const createManyTracks = async (req: Request, res: Response): Promise<void> => {
    try {
        const tracks = req.body;
        const createdTracks: any[] = [];

        for (const { title, duration, albumId, artistId } of tracks) {
            // Create a track
            const createdTrack = await prisma.tracks.create({
                data: { title, duration },
            });

            // Link the track to the artist and album via TrackArtistAlbum junction table
            await prisma.trackArtistAlbum.create({
                data: {
                    trackId: createdTrack.id,
                    artistId: artistId,
                    albumId: albumId,
                },
            });

            createdTracks.push(createdTrack);
        }

        res.json(createdTracks);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

