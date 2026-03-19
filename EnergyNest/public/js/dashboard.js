document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const statGen = document.getElementById('stat-gen');
    const statCon = document.getElementById('stat-con');
    const statShare = document.getElementById('stat-share');
    const statEarn = document.getElementById('stat-earn');
    
    let forecastChartInstance = null;

    // Fetch dashboard data
    const fetchDashboardData = async () => {
        try {
            const res = await fetch('/api/dashboard');
            const data = await res.json();
            
            statGen.textContent = `${data.generationToday.toFixed(1)} kWh`;
            statCon.textContent = `${data.consumptionToday.toFixed(1)} kWh`;
            statShare.textContent = `${data.surplusShared.toFixed(1)} kWh`;
            statEarn.textContent = `₹${data.earningsInr.toFixed(2)}`;
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        }
    };

    // Render Chart
    const renderForecastChart = async () => {
        try {
            const res = await fetch('/api/forecast');
            const data = await res.json();
            
            const ctx = document.getElementById('forecastChart').getContext('2d');
            
            if (forecastChartInstance) {
                forecastChartInstance.destroy();
            }

            // Create gradient
            let gradient = ctx.createLinearGradient(0, 0, 0, 400);
            gradient.addColorStop(0, 'rgba(59, 130, 246, 0.5)'); // blue
            gradient.addColorStop(1, 'rgba(59, 130, 246, 0.0)');

            // Setup chart defaults
            Chart.defaults.font.family = "'Inter', sans-serif";
            Chart.defaults.color = "#94a3b8";

            forecastChartInstance = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: data.labels,
                    datasets: [{
                        label: 'Expected Generation (kWh)',
                        data: data.expectedGeneration,
                        borderColor: '#3b82f6',
                        backgroundColor: gradient,
                        borderWidth: 3,
                        pointBackgroundColor: '#fff',
                        pointBorderColor: '#3b82f6',
                        pointBorderWidth: 2,
                        pointRadius: 4,
                        fill: true,
                        tension: 0.4 // smooth curves
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false },
                        tooltip: {
                            backgroundColor: 'rgba(15, 23, 42, 0.9)',
                            titleColor: '#fff',
                            bodyColor: '#cbd5e1',
                            borderColor: 'rgba(255,255,255,0.1)',
                            borderWidth: 1,
                            padding: 10
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            grid: { color: 'rgba(255, 255, 255, 0.05)' },
                            ticks: { color: '#94a3b8' }
                        },
                        x: {
                            grid: { display: false },
                            ticks: { color: '#94a3b8' }
                        }
                    }
                }
            });
        } catch (error) {
            console.error('Error fetching forecast data:', error);
        }
    };

    // Initialize
    fetchDashboardData();
    renderForecastChart();
    
    // Refresh data periodically
    setInterval(fetchDashboardData, 5000);
});
