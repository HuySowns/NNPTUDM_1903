var express = require('express');
var router = express.Router();
let inventoryController = require('../controllers/inventories')

// GET all inventories
router.get('/', async function (req, res, next) {
    try {
        let data = await inventoryController.GetAllInventories();
        res.status(200).json({
            success: true,
            data: data,
            message: "Get all inventories successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// GET inventory by ID (with join to product)
router.get('/:id', async function (req, res, next) {
    try {
        let id = req.params.id;
        let result = await inventoryController.GetInventoryById(id);
        res.status(200).json({
            success: true,
            data: result,
            message: "Get inventory successfully"
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: error.message
        });
    }
});

// GET inventory by Product ID
router.get('/product/:productId', async function (req, res, next) {
    try {
        let productId = req.params.productId;
        let result = await inventoryController.GetInventoryByProductId(productId);
        res.status(200).json({
            success: true,
            data: result,
            message: "Get inventory by product ID successfully"
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: error.message
        });
    }
});

// POST add stock
router.post('/add-stock', async function (req, res, next) {
    try {
        let productId = req.body.product;
        let quantity = req.body.quantity;

        if (!productId || !quantity) {
            return res.status(400).json({
                success: false,
                message: "Missing product or quantity"
            });
        }

        let result = await inventoryController.AddStock(productId, quantity);
        res.status(200).json({
            success: true,
            data: result,
            message: "Add stock successfully"
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

// POST remove stock
router.post('/remove-stock', async function (req, res, next) {
    try {
        let productId = req.body.product;
        let quantity = req.body.quantity;

        if (!productId || !quantity) {
            return res.status(400).json({
                success: false,
                message: "Missing product or quantity"
            });
        }

        let result = await inventoryController.RemoveStock(productId, quantity);
        res.status(200).json({
            success: true,
            data: result,
            message: "Remove stock successfully"
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

// POST reservation
router.post('/reservation', async function (req, res, next) {
    try {
        let productId = req.body.product;
        let quantity = req.body.quantity;

        if (!productId || !quantity) {
            return res.status(400).json({
                success: false,
                message: "Missing product or quantity"
            });
        }

        let result = await inventoryController.Reservation(productId, quantity);
        res.status(200).json({
            success: true,
            data: result,
            message: "Reservation successfully"
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

// POST sold
router.post('/sold', async function (req, res, next) {
    try {
        let productId = req.body.product;
        let quantity = req.body.quantity;

        if (!productId || !quantity) {
            return res.status(400).json({
                success: false,
                message: "Missing product or quantity"
            });
        }

        let result = await inventoryController.Sold(productId, quantity);
        res.status(200).json({
            success: true,
            data: result,
            message: "Sold successfully"
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

module.exports = router;
