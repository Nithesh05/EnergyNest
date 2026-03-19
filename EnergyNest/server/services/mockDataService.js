// Simulates the neighborhood grid state

let networkData = {
    totalHouses: 12,
    activeTraders: 8,
    co2SavedKg: 39.6,
    cleanEnergySharedKwh: 54.2,
    communitySavingsInr: 1842,
    houses: [
        { id: 'H1', name: 'House 1', role: 'seller', generation: 5.2, consumption: 2.1, surplus: 3.1 },
        { id: 'H2', name: 'House 2', role: 'buyer', generation: 0, consumption: 4.5, surplus: -4.5 },
        { id: 'H3', name: 'House 3', role: 'seller', generation: 6.0, consumption: 3.0, surplus: 3.0 },
        { id: 'H4', name: 'House 4', role: 'neutral', generation: 2.5, consumption: 2.5, surplus: 0 },
        { id: 'H5', name: 'House 5', role: 'buyer', generation: 1.0, consumption: 3.5, surplus: -2.5 }
    ],
    trades: []
};

exports.getDashboardData = () => {
    // Return data for the main user (let's say House 1)
    return {
        userId: 'H1',
        generationToday: 24.5, // kWh
        consumptionToday: 12.3, // kWh
        surplusShared: 12.2, // kWh
        earningsInr: 103.7, // ₹8.50 per unit avg
        gridRate: 3.0 // What the grid would have paid
    };
};

exports.getNetworkData = () => {
    // Update dynamic stats slightly to simulate real-time
    networkData.co2SavedKg += 0.01;
    networkData.cleanEnergySharedKwh += 0.05;
    networkData.communitySavingsInr += 0.3;
    
    // Randomize some generations slightly
    networkData.houses.forEach(h => {
        if(h.generation > 0) {
            h.generation += (Math.random() * 0.4 - 0.2);
            h.surplus = h.generation - h.consumption;
            h.role = h.surplus > 0.5 ? 'seller' : (h.surplus < -0.5 ? 'buyer' : 'neutral');
        }
    });

    return networkData;
};

exports.getForecastData = () => {
    return {
        labels: ['10 AM', '12 PM', '2 PM', '4 PM', '6 PM'],
        expectedGeneration: [4.5, 6.2, 6.0, 3.5, 0.5],
        cloudCoverPercent: [10, 5, 20, 45, 80]
    };
};

exports.executeTrade = (buyerId, sellerId, amountKwh) => {
    const trade = {
        id: 'TRD' + Math.floor(Math.random() * 10000),
        buyerId,
        sellerId,
        amountKwh,
        priceInr: amountKwh * 7.5, // P2P rate 7.5 (between 3 grid sell and 8 grid buy)
        timestamp: new Date().toISOString()
    };
    networkData.trades.push(trade);
    return { success: true, trade };
};
