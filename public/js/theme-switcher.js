document.addEventListener('DOMContentLoaded', () => {
    const themeToggleButton = document.getElementById('theme-toggle-button');
    const themeIconLight = document.getElementById('theme-icon-light');
    const themeIconDark = document.getElementById('theme-icon-dark');
    const htmlElement = document.documentElement;

    // Function to apply the theme (sets class on <html> and toggles icon visibility)
    const applyTheme = (theme) => {
        if (theme === 'dark') {
            htmlElement.classList.add('dark');
            if (themeIconLight) themeIconLight.classList.add('hidden');
            if (themeIconDark) themeIconDark.classList.remove('hidden');
        } else {
            htmlElement.classList.remove('dark');
            if (themeIconLight) themeIconLight.classList.remove('hidden');
            if (themeIconDark) themeIconDark.classList.add('hidden');
        }
    };

    // Function to toggle theme and save preference
    const toggleTheme = () => {
        const currentTheme = htmlElement.classList.contains('dark') ? 'dark' : 'light';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        applyTheme(newTheme);
        localStorage.setItem('theme', newTheme);
    };

    // Event listener for the toggle button
    if (themeToggleButton) {
        themeToggleButton.addEventListener('click', toggleTheme);
    }

    // Initial theme setup on page load
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme) {
        applyTheme(savedTheme);
    } else if (systemPrefersDark) {
        applyTheme('dark');
    } else {
        applyTheme('light'); // Default to light if no preference or saved theme
    }
});
