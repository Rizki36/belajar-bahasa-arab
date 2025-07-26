-- AlterTable
ALTER TABLE "Lesson" ADD COLUMN     "contentType" TEXT NOT NULL DEFAULT 'quiz',
ADD COLUMN     "description" TEXT,
ADD COLUMN     "pdfUrl" TEXT,
ADD COLUMN     "title" TEXT,
ADD COLUMN     "videoUrl" TEXT;
