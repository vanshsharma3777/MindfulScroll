// Theme handling
const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;

// Load saved theme
const savedTheme = localStorage.getItem('theme') || 'light';
html.setAttribute('data-bs-theme', savedTheme);
updateThemeIcon(savedTheme);

// Theme toggle handler
themeToggle.addEventListener('click', () => {
    const currentTheme = html.getAttribute('data-bs-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    html.setAttribute('data-bs-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
});

function updateThemeIcon(theme) {
    const icon = themeToggle.querySelector('i');
    icon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
}

// Chart initialization
let usageChart;
function initChart() {
    const ctx = document.getElementById('usageChart').getContext('2d');
    usageChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Daily Usage (minutes)',
                data: [],
                borderColor: '#4CAF50',
                tension: 0.4,
                fill: true,
                backgroundColor: 'rgba(76, 175, 80, 0.1)'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: value => value + ' min'
                    }
                }
            }
        }
    });
}

// Data fetching and updates
async function fetchStats() {
    try {
        const response = await fetch('/api/stats');
        const data = await response.json();
        updateDashboard(data);
    } catch (error) {
        console.error('Error fetching stats:', error);
    }
}

function updateDashboard(data) {
    // Update today's usage
    const todayUsage = Math.round(data.todayUsage / 60000); // Convert ms to minutes
    document.getElementById('todayUsage').textContent = `${todayUsage} min`;
    
    // Update progress bar
    const progress = (todayUsage / data.dailyGoal) * 100;
    const progressBar = document.getElementById('usageProgress');
    progressBar.style.width = `${Math.min(progress, 100)}%`;
    progressBar.setAttribute('aria-valuenow', progress);
    
    // Update daily goal
    document.getElementById('dailyGoal').textContent = `${data.dailyGoal} min`;
    
    // Update weekly average
    document.getElementById('weeklyAverage').textContent = `${data.weeklyAverage} min`;
    
    // Update recent sessions table
    updateSessionsTable(data.recentSessions);
    
    // Update chart if we have enough data
    if (data.recentSessions && data.recentSessions.length > 0) {
        updateChart(data.recentSessions);
    }
}

function updateSessionsTable(sessions) {
    const tableBody = document.getElementById('sessionsTable');
    tableBody.innerHTML = '';
    
    if (sessions.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = '<td colspan="4" class="text-center">No sessions recorded yet</td>';
        tableBody.appendChild(row);
        return;
    }
    
    sessions.forEach(session => {
        const row = document.createElement('tr');
        const startTime = new Date(session.startTime);
        const duration = Math.round(session.duration / 60000); // Convert ms to minutes
        
        row.innerHTML = `
            <td>${startTime.toLocaleTimeString()}</td>
            <td>${session.url}</td>
            <td>${duration} min</td>
            <td>
                <span class="badge ${session.action === 'continue' ? 'bg-primary' : 'bg-success'}">
                    ${session.action}
                </span>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
}

function updateChart(sessions) {
    // Group sessions by date
    const sessionsByDate = {};
    
    sessions.forEach(session => {
        const date = new Date(session.startTime).toLocaleDateString();
        if (!sessionsByDate[date]) {
            sessionsByDate[date] = 0;
        }
        sessionsByDate[date] += session.duration / 60000; // Convert ms to minutes
    });
    
    // Sort dates
    const sortedDates = Object.keys(sessionsByDate).sort((a, b) => {
        return new Date(a) - new Date(b);
    });
    
    // Update chart data
    usageChart.data.labels = sortedDates;
    usageChart.data.datasets[0].data = sortedDates.map(date => sessionsByDate[date]);
    usageChart.update();
}

// Goal setting
const goalModal = new bootstrap.Modal(document.getElementById('goalModal'));
const editGoalBtn = document.getElementById('editGoalBtn');
const setGoalBtn = document.getElementById('setGoalBtn');
const saveGoalBtn = document.getElementById('saveGoalBtn');
const goalMinutes = document.getElementById('goalMinutes');

editGoalBtn.addEventListener('click', () => {
    goalMinutes.value = document.getElementById('dailyGoal').textContent.split(' ')[0];
    goalModal.show();
});

setGoalBtn.addEventListener('click', () => {
    goalMinutes.value = document.getElementById('dailyGoal').textContent.split(' ')[0];
    goalModal.show();
});

saveGoalBtn.addEventListener('click', async () => {
    const minutes = parseInt(goalMinutes.value);
    if (minutes > 0 && minutes <= 1440) {
        try {
            const response = await fetch('/api/goal', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ minutes })
            });
            
            if (response.ok) {
                document.getElementById('dailyGoal').textContent = `${minutes} min`;
                goalModal.hide();
                fetchStats(); // Refresh stats
            }
        } catch (error) {
            console.error('Error setting goal:', error);
        }
    }
});

// Export data
document.getElementById('exportDataBtn').addEventListener('click', async () => {
    try {
        const response = await fetch('/api/stats');
        const data = await response.json();
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `mindfulscroll-data-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    } catch (error) {
        console.error('Error exporting data:', error);
    }
});

// Initialize dashboard
document.addEventListener('DOMContentLoaded', () => {
    initChart();
    fetchStats();
    
    // Refresh data every minute
    setInterval(fetchStats, 60000);
    
    // Initialize Bootstrap dropdowns
    const dropdownElementList = [].slice.call(document.querySelectorAll('.dropdown-toggle'));
    dropdownElementList.map(function (dropdownToggleEl) {
        return new bootstrap.Dropdown(dropdownToggleEl);
    });
}); 