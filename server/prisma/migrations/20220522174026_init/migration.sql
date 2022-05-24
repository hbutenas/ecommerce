-- CreateEnum
CREATE TYPE "Role" AS ENUM ('CLIENT', 'ADMIN', 'PRODUCT', 'SUPPORT', 'OWNER');

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT E'CLIENT',
    "firstName" TEXT,
    "lastName" TEXT,
    "age" INTEGER,
    "suspended" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "products" (
    "id" SERIAL NOT NULL,
    "productProvider" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "quantity" INTEGER NOT NULL,
    "productName" TEXT NOT NULL,
    "deliveryTime" INTEGER NOT NULL,
    "category" TEXT NOT NULL,
    "displayProduct" BOOLEAN NOT NULL DEFAULT false,
    "productDescription" TEXT,
    "isRecommended" BOOLEAN,
    "confirmedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "providers" (
    "id" SERIAL NOT NULL,
    "providerName" TEXT NOT NULL,
    "providerKey" TEXT NOT NULL,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "providers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "products_productName_key" ON "products"("productName");

-- CreateIndex
CREATE UNIQUE INDEX "providers_providerName_key" ON "providers"("providerName");

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_productProvider_fkey" FOREIGN KEY ("productProvider") REFERENCES "providers"("providerName") ON DELETE CASCADE ON UPDATE CASCADE;
