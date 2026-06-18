/*
  Warnings:

  - Added the required column `phonenumber` to the `student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `year` to the `student` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "student" ADD COLUMN     "phonenumber" BIGINT NOT NULL,
ADD COLUMN     "year" INTEGER NOT NULL;
