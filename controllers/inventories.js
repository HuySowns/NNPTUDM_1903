let inventoryModel = require('../schemas/inventories')
let productModel = require('../schemas/products')

module.exports = {
    CreateInventory: async function (productId) {
        try {
            let newInventory = new inventoryModel({
                product: productId,
                stock: 0,
                reserved: 0,
                soldCount: 0
            });
            await newInventory.save();
            return newInventory;
        } catch (error) {
            throw error
        }
    },

    GetAllInventories: async function () {
        try {
            return await inventoryModel.find().populate({
                path: 'product',
                select: 'title price description category images'
            });
        } catch (error) {
            throw error
        }
    },

    GetInventoryById: async function (id) {
        try {
            let result = await inventoryModel.findById(id).populate({
                path: 'product',
                select: 'title price description category images'
            });
            if (result) {
                return result;
            } else {
                throw new Error("Inventory ID NOT FOUND")
            }
        } catch (error) {
            throw error
        }
    },

    GetInventoryByProductId: async function (productId) {
        try {
            let result = await inventoryModel.findOne({
                product: productId
            }).populate({
                path: 'product',
                select: 'title price description category images'
            });
            if (result) {
                return result;
            } else {
                throw new Error("Inventory NOT FOUND for this product")
            }
        } catch (error) {
            throw error
        }
    },

    AddStock: async function (productId, quantity) {
        try {
            if (quantity <= 0) {
                throw new Error("Quantity must be greater than 0")
            }
            let inventory = await inventoryModel.findOne({
                product: productId
            });
            if (!inventory) {
                throw new Error("Inventory NOT FOUND")
            }
            inventory.stock += quantity;
            inventory.updatedAt = Date.now();
            await inventory.save();
            return await this.GetInventoryByProductId(productId);
        } catch (error) {
            throw error
        }
    },

    RemoveStock: async function (productId, quantity) {
        try {
            if (quantity <= 0) {
                throw new Error("Quantity must be greater than 0")
            }
            let inventory = await inventoryModel.findOne({
                product: productId
            });
            if (!inventory) {
                throw new Error("Inventory NOT FOUND")
            }
            if (inventory.stock < quantity) {
                throw new Error("Insufficient stock. Current stock: " + inventory.stock)
            }
            inventory.stock -= quantity;
            inventory.updatedAt = Date.now();
            await inventory.save();
            return await this.GetInventoryByProductId(productId);
        } catch (error) {
            throw error
        }
    },

    Reservation: async function (productId, quantity) {
        try {
            if (quantity <= 0) {
                throw new Error("Quantity must be greater than 0")
            }
            let inventory = await inventoryModel.findOne({
                product: productId
            });
            if (!inventory) {
                throw new Error("Inventory NOT FOUND")
            }
            if (inventory.stock < quantity) {
                throw new Error("Insufficient stock for reservation. Current stock: " + inventory.stock)
            }
            inventory.stock -= quantity;
            inventory.reserved += quantity;
            inventory.updatedAt = Date.now();
            await inventory.save();
            return await this.GetInventoryByProductId(productId);
        } catch (error) {
            throw error
        }
    },

    Sold: async function (productId, quantity) {
        try {
            if (quantity <= 0) {
                throw new Error("Quantity must be greater than 0")
            }
            let inventory = await inventoryModel.findOne({
                product: productId
            });
            if (!inventory) {
                throw new Error("Inventory NOT FOUND")
            }
            if (inventory.reserved < quantity) {
                throw new Error("Insufficient reserved quantity. Current reserved: " + inventory.reserved)
            }
            inventory.reserved -= quantity;
            inventory.soldCount += quantity;
            inventory.updatedAt = Date.now();
            await inventory.save();
            return await this.GetInventoryByProductId(productId);
        } catch (error) {
            throw error
        }
    }
}
