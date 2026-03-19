// Map and Trading Logic
document.addEventListener('DOMContentLoaded', () => {
    const netCo2 = document.getElementById('net-co2');
    const netKwh = document.getElementById('net-kwh');
    const netSavings = document.getElementById('net-savings');
    const svgContainer = document.getElementById('svg-map-container');
    const neighborList = document.getElementById('neighbor-list');
    const transactionList = document.getElementById('transaction-list');

    // Draw SVG map based on houses
    const drawSvgMap = (houses) => {
        // Simple circular layout for nodes
        const width = svgContainer.clientWidth || 800;
        const height = svgContainer.clientHeight || 400; // Force valid height
        
        // Prevent drawing on hide
        if(width === 0 || height === 0) return;

        const centerX = width / 2;
        const centerY = height / 2;
        const radius = Math.min(width, height) / 2.5;
        
        // Remove existing SVG
        svgContainer.innerHTML = '';
        
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("width", "100%");
        svg.setAttribute("height", "100%");
        svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
        
        // Create an array to store node positions
        const nodes = [];

        houses.forEach((house, index) => {
            const angle = (index / houses.length) * 2 * Math.PI;
            const x = centerX + radius * Math.cos(angle);
            const y = centerY + radius * Math.sin(angle);
            nodes.push({ ...house, x, y });
        });

        // Draw connections (buyers to sellers)
        const sellers = nodes.filter(n => n.role === 'seller');
        const buyers = nodes.filter(n => n.role === 'buyer');

        // Draw some random transferring energy lines showing flow
        sellers.forEach(seller => {
            buyers.forEach(buyer => {
                // Determine if there is flow (just mock visually for now)
                if (Math.random() > 0.6) {
                    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
                    line.setAttribute("x1", seller.x);
                    line.setAttribute("y1", seller.y);
                    line.setAttribute("x2", buyer.x);
                    line.setAttribute("y2", buyer.y);
                    line.setAttribute("stroke", "rgba(16, 185, 129, 0.4)"); // Green flow
                    line.setAttribute("stroke-width", "2");
                    line.setAttribute("stroke-dasharray", "5,5"); // Dashed
                    
                    // Simple animation for energy flow
                    const animate = document.createElementNS("http://www.w3.org/2000/svg", "animate");
                    animate.setAttribute("attributeName", "stroke-dashoffset");
                    animate.setAttribute("from", "20");
                    animate.setAttribute("to", "0");
                    animate.setAttribute("dur", "1s");
                    animate.setAttribute("repeatCount", "indefinite");
                    line.appendChild(animate);

                    svg.appendChild(line);
                }
            });
        });

        // Draw Nodes
        nodes.forEach(node => {
            const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
            group.setAttribute("transform", `translate(${node.x}, ${node.y})`);

            const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            circle.setAttribute("r", "25");
            
            // Color based on role
            let color = "#3b82f6"; // neutral (blue)
            if (node.role === 'seller') color = "#10b981"; // green
            if (node.role === 'buyer') color = "#f59e0b"; // yellow
            
            circle.setAttribute("fill", "rgba(15, 23, 42, 0.9)");
            circle.setAttribute("stroke", color);
            circle.setAttribute("stroke-width", "3");

            // Glow effect
            if (node.role === 'seller') {
                 circle.classList.add("pulse");
            }

            const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
            text.setAttribute("text-anchor", "middle");
            text.setAttribute("dy", "5");
            text.setAttribute("fill", "#fff");
            text.setAttribute("font-size", "12");
            text.setAttribute("font-family", "Outfit");
            text.setAttribute("font-weight", "600");
            text.textContent = node.id;

            // Details toolip mock (text below)
            const detailText = document.createElementNS("http://www.w3.org/2000/svg", "text");
            detailText.setAttribute("text-anchor", "middle");
            detailText.setAttribute("dy", "40");
            detailText.setAttribute("fill", "#94a3b8");
            detailText.setAttribute("font-size", "11");
            detailText.textContent = `${node.surplus > 0 ? '+' : ''}${node.surplus.toFixed(1)} kW`;

            group.appendChild(circle);
            group.appendChild(text);
            group.appendChild(detailText);
            svg.appendChild(group);
        });

        svgContainer.appendChild(svg);
    };

    const updateTradingLists = (houses, trades) => {
        // Update neighbors
        neighborList.innerHTML = '';
        houses.filter(h => h.id !== 'H1').forEach(house => {
            const li = document.createElement('li');
            li.className = 'neighbor-card';
            li.innerHTML = `
                <div>
                   <div class="neighbor-name">${house.name}</div>
                   <div class="neighbor-role" style="color: ${house.role === 'seller' ? '#10b981' : (house.role === 'buyer' ? '#f59e0b' : '#94a3b8')}">${house.role}</div>
                </div>
                <div class="neighbor-surplus">${house.surplus > 0 ? '+' : ''}${house.surplus.toFixed(1)} kW</div>
            `;
            neighborList.appendChild(li);
        });

        // Update trades
        if (trades.length > 0) {
            transactionList.innerHTML = '';
            // Show last 5
            trades.slice(-5).reverse().forEach(trade => {
                const date = new Date(trade.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                const div = document.createElement('div');
                div.className = 'transaction-card';
                div.innerHTML = `
                    <div class="transaction-info">
                        <div class="route">${trade.sellerId} <i data-lucide="arrow-right" style="width:14px;height:14px;display:inline-block;"></i> ${trade.buyerId}</div>
                        <div class="time">${date}</div>
                    </div>
                    <div class="transaction-amount">
                        <div class="kwh">+${trade.amountKwh} kWh</div>
                        <div class="price">₹${trade.priceInr.toFixed(2)}</div>
                    </div>
                `;
                transactionList.appendChild(div);
            });
            // Re-init lazily loaded lucide icons locally
            if(window.lucide) window.lucide.createIcons();
        }
    };

    const fetchNetworkData = async () => {
        try {
            const res = await fetch('/api/network');
            const data = await res.json();
            
            // Format stats neatly
            netCo2.textContent = data.co2SavedKg.toFixed(1);
            netKwh.textContent = data.cleanEnergySharedKwh.toFixed(1);
            netSavings.textContent = Math.floor(data.communitySavingsInr).toLocaleString('en-IN');

            // Draw MAP only if that tab is active
            if(document.getElementById('map').classList.contains('active')) {
                drawSvgMap(data.houses);
            }

            // Update trading side immediately for visibility
            updateTradingLists(data.houses, data.trades);

            // Trigger some trades randomly for mock simulation
            if (Math.random() > 0.7) {
                 fetch('/api/trade', {
                     method: 'POST',
                     headers: { 'Content-Type': 'application/json'},
                     body: JSON.stringify({ 
                         buyerId: 'H' + (Math.floor(Math.random() * 5) + 6), // H6-H10
                         sellerId: 'H' + (Math.floor(Math.random() * 5) + 1), // H1-H5
                         amountKwh: (Math.random() * 2 + 1).toFixed(1)
                     })
                 });
            }

        } catch (error) {
            console.error('Error fetching network data:', error);
        }
    };

    // Expose drawing globally so it can be triggered on tab switch
    window.renderMapNetwork = fetchNetworkData;

    // Initial fetch
    fetchNetworkData();
    setInterval(fetchNetworkData, 3000); // 3 seconds real-time tick
});
