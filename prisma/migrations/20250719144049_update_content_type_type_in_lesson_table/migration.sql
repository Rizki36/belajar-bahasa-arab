/*
  Warnings:

  - The `contentType` column on the `Lesson` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "ContentType" AS ENUM ('quiz', 'video', 'pdf', 'mixed');

-- AlterTable
ALTER TABLE "Lesson" DROP COLUMN "contentType",
ADD COLUMN     "contentType" "ContentType" NOT NULL DEFAULT 'quiz';
