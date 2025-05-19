/*
  Warnings:

  - The values [cancelled] on the enum `LeaveStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "LeaveStatus_new" AS ENUM ('pending', 'canceled', 'revoked', 'approved', 'rejected');
ALTER TABLE "LeaveRequest" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "LeaveRequest" ALTER COLUMN "status" TYPE "LeaveStatus_new" USING ("status"::text::"LeaveStatus_new");
ALTER TYPE "LeaveStatus" RENAME TO "LeaveStatus_old";
ALTER TYPE "LeaveStatus_new" RENAME TO "LeaveStatus";
DROP TYPE "LeaveStatus_old";
ALTER TABLE "LeaveRequest" ALTER COLUMN "status" SET DEFAULT 'pending';
COMMIT;
