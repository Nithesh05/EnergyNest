const express = require('express');
const router = express.Router();
const mockDataService = require('../services/mockDataService');
const aiController = require('../controllers/aiController');

// Network endpoints
router.get('/dashboard', (req, res) => {
    res.json(mockDataService.getDashboardData());
});

router.get('/network', (req, res) => {
    res.json(mockDataService.getNetworkData());
});

router.get('/forecast', (req, res) => {
    res.json(mockDataService.getForecastData());
});

router.post('/trade', (req, res) => {
    const { buyerId, sellerId, amountKwh } = req.body;
    const result = mockDataService.executeTrade(buyerId, sellerId, amountKwh);
    res.json(result);
});

// AI Chat endpoint
router.post('/chat', aiController.handleChat);

module.exports = router;
