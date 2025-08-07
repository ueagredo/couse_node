-- DropForeignKey
ALTER TABLE "public"."Appointment" DROP CONSTRAINT "Appointment_timeBlockId_fkey";

-- AlterTable
ALTER TABLE "public"."Appointment" ALTER COLUMN "timeBlockId" DROP NOT NULL,
ALTER COLUMN "timeBlockId" DROP DEFAULT;

-- AddForeignKey
ALTER TABLE "public"."Appointment" ADD CONSTRAINT "Appointment_timeBlockId_fkey" FOREIGN KEY ("timeBlockId") REFERENCES "public"."TimeBlock"("id") ON DELETE SET NULL ON UPDATE CASCADE;
