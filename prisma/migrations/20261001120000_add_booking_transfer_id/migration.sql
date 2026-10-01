ALTER TABLE "Booking" ADD COLUMN "stripeTransferId" TEXT;
CREATE UNIQUE INDEX "Booking_stripeTransferId_key" ON "Booking"("stripeTransferId");
