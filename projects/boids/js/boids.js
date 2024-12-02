

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('boidsCanvas');
    const ctx = canvas.getContext('2d');

    // Set canvas to full height/width of its container
    canvas.width = canvas.parentElement.offsetWidth;
    canvas.height = canvas.parentElement.offsetHeight;

    // Handle tab switching for boid settings
    const tabs = document.querySelectorAll('.tab');
    const settingsGroups = document.querySelectorAll('.settings-group');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs and settings
            tabs.forEach(t => t.classList.remove('active'));
            settingsGroups.forEach(group => group.classList.remove('active'));

            // Add active class to selected tab and its settings group
            tab.classList.add('active');
            const boidType = tab.dataset.boid;
            document.querySelector(`.settings-group[data-boid="${boidType}"]`).classList.add('active');
        });
    });

    console.log('Boids Simulation Initialized');
});
