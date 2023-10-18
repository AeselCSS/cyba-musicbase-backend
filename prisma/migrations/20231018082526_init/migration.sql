/*
  Warnings:

  - You are about to drop the column `year_of_release` on the `Albums` table. All the data in the column will be lost.
  - Added the required column `artistId` to the `Albums` table without a default value. This is not possible if the table is not empty.
  - Added the required column `yearOfRelease` to the `Albums` table without a default value. This is not possible if the table is not empty.
  - Added the required column `albumId` to the `Tracks` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Albums` DROP COLUMN `year_of_release`,
    ADD COLUMN `artistId` INTEGER NOT NULL,
    ADD COLUMN `yearOfRelease` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `Tracks` ADD COLUMN `albumId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Albums` ADD CONSTRAINT `Albums_artistId_fkey` FOREIGN KEY (`artistId`) REFERENCES `Artists`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Tracks` ADD CONSTRAINT `Tracks_albumId_fkey` FOREIGN KEY (`albumId`) REFERENCES `Albums`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
