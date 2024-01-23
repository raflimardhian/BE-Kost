/*
  Warnings:

  - You are about to drop the column `user_id` on the `rooms` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[user_email]` on the table `rooms` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "rooms" DROP CONSTRAINT "rooms_user_id_fkey";

-- DropIndex
DROP INDEX "rooms_user_id_key";

-- AlterTable
ALTER TABLE "rooms" DROP COLUMN "user_id",
ADD COLUMN     "user_email" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "rooms_user_email_key" ON "rooms"("user_email");

-- AddForeignKey
ALTER TABLE "rooms" ADD CONSTRAINT "rooms_user_email_fkey" FOREIGN KEY ("user_email") REFERENCES "users"("email") ON DELETE SET NULL ON UPDATE CASCADE;
