const fs = require('fs').promises;
const path = require('path');

class ThemeCustomizer {
    constructor(themeDir) {
        this.themeDir = themeDir;
        this.currentTheme = {};
    }

    async loadTheme(themeName) {
        const themePath = path.join(this.themeDir, `${themeName}.json`);
        try {
            const data = await fs.readFile(themePath, 'utf8');
            this.currentTheme = JSON.parse(data);
            return this.currentTheme;
        } catch (err) {
            throw new Error('Error loading theme. Please try again.');
        }
    }

    async saveTheme(themeName, themeData) {
        const themePath = path.join(this.themeDir, `${themeName}.json`);
        try {
            await fs.writeFile(themePath, JSON.stringify(themeData, null, 2), 'utf8');
            return `Theme ${themeName} saved successfully.`;
        } catch (err) {
            throw new Error('Error saving theme. Please try again.');
        }
    }

    async updateTheme(newStyles) {
        try {
            this.currentTheme = { ...this.currentTheme, ...newStyles };
            await this.saveTheme('currentTheme', this.currentTheme); // Assuming theme name for saving is 'currentTheme'
            return this.currentTheme;
        } catch (error) {
            throw new Error('Error updating theme. Please try again.');
        }
    }

    getCurrentTheme() {
        return this.currentTheme;
    }
}

module.exports = ThemeCustomizer;