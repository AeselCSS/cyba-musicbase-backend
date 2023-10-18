/*
  Warnings:

  - Added the required column `artistId` to the `Tracks` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Tracks` ADD COLUMN `artistId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Tracks` ADD CONSTRAINT `Tracks_artistId_fkey` FOREIGN KEY (`artistId`) REFERENCES `Artists`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
