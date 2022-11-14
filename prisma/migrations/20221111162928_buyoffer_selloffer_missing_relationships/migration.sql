-- AddForeignKey
ALTER TABLE "BuyOffer" ADD CONSTRAINT "BuyOffer" FOREIGN KEY ("stockId") REFERENCES "Stock"("stockId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SellOffer" ADD CONSTRAINT "UserStock" FOREIGN KEY ("userStockId") REFERENCES "UserStock"("userStockId") ON DELETE CASCADE ON UPDATE CASCADE;