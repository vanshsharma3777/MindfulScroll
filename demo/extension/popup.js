document.addEventListener('DOMContentLoaded', async () => {
  // Fetch today's usage and goal
  try {
    const response = await fetch('http://localhost:3000/api/stats');
    const data = await response.json();
    
    updateUI(data);
  } catch (error) {
    console.error('Error fetching stats:', error);
  }

  // Set goal button handler
  document.getElementById('set-goal').addEventListener('click', async () => {
    const minutes = prompt('Enter daily limit in minutes:');
    if (minutes && !isNaN(minutes)) {
      try {
        const response = await fetch('http://localhost:3000/api/goal', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ minutes: parseInt(minutes) })
        });

        if (response.ok) {
          const data = await response.json();
          updateUI(data);
        }
      } catch (error) {
        console.error('Error setting goal:', error);
      }
    }
  });
});

function updateUI(data) {
  const { todayUsage, dailyGoal } = data;
  
  document.getElementById('today-usage').textContent = `${Math.round(todayUsage / 60)} min`;
  document.getElementById('daily-goal').textContent = `${dailyGoal} min`;
  
  const progress = (todayUsage / (dailyGoal * 60)) * 100;
  document.getElementById('progress').style.width = `${Math.min(progress, 100)}%`;
  
  // Change progress bar color based on usage
  const progressBar = document.getElementById('progress');
  if (progress > 100) {
    progressBar.style.background = '#f44336';
  } else if (progress > 80) {
    progressBar.style.background = '#ff9800';
  } else {
    progressBar.style.background = '#4CAF50';
  }
} 