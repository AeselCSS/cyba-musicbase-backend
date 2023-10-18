/*
  Warnings:

  - You are about to drop the column `artistId` on the `Albums` table. All the data in the column will be lost.
  - You are about to drop the column `albumId` on the `Tracks` table. All the data in the column will be lost.
  - You are about to drop the column `artistId` on the `Tracks` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `Artists` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `Albums` DROP FOREIGN KEY `Albums_artistId_fkey`;

-- DropForeignKey
ALTER TABLE `Tracks` DROP FOREIGN KEY `Tracks_albumId_fkey`;

-- DropForeignKey
ALTER TABLE `Tracks` DROP FOREIGN KEY `Tracks_artistId_fkey`;

-- AlterTable
ALTER TABLE `Albums` DROP COLUMN `artistId`;

-- AlterTable
ALTER TABLE `Tracks` DROP COLUMN `albumId`,
    DROP COLUMN `artistId`;

-- CreateTable
CREATE TABLE `ArtistAlbum` (
    `artistId` INTEGER NOT NULL,
    `albumId` INTEGER NOT NULL,

    PRIMARY KEY (`artistId`, `albumId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TrackArtistAlbum` (
    `trackId` INTEGER NOT NULL,
    `artistId` INTEGER NOT NULL,
    `albumId` INTEGER NOT NULL,

    PRIMARY KEY (`trackId`, `artistId`, `albumId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Artists_name_key` ON `Artists`(`name`);

-- AddForeignKey
ALTER TABLE `ArtistAlbum` ADD CONSTRAINT `ArtistAlbum_artistId_fkey` FOREIGN KEY (`artistId`) REFERENCES `Artists`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ArtistAlbum` ADD CONSTRAINT `ArtistAlbum_albumId_fkey` FOREIGN KEY (`albumId`) REFERENCES `Albums`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TrackArtistAlbum` ADD CONSTRAINT `TrackArtistAlbum_trackId_fkey` FOREIGN KEY (`trackId`) REFERENCES `Tracks`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TrackArtistAlbum` ADD CONSTRAINT `TrackArtistAlbum_artistId_fkey` FOREIGN KEY (`artistId`) REFERENCES `Artists`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TrackArtistAlbum` ADD CONSTRAINT `TrackArtistAlbum_albumId_fkey` FOREIGN KEY (`albumId`) REFERENCES `Albums`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
