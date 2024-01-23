/*
  Warnings:

  - You are about to drop the column `user_email` on the `rooms` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[user_id]` on the table `rooms` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "rooms" DROP CONSTRAINT "rooms_user_email_fkey";

-- DropIndex
DROP INDEX "rooms_user_email_key";

-- AlterTable
ALTER TABLE "rooms" DROP COLUMN "user_email",
ADD COLUMN     "user_id" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "rooms_user_id_key" ON "rooms"("user_id");

-- AddForeignKey
ALTER TABLE "rooms" ADD CONSTRAINT "rooms_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
