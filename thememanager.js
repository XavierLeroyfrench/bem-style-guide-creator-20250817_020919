const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

class ThemeManager {
    constructor() {
        this.themesFilePath = path.join(__dirname, 'themes.json');
        this.loadThemes();
    }

    loadThemes() {
        if (fs.existsSync(this.themesFilePath)) {
            const data = fs.readFileSync(this.themesFilePath);
            try {
                this.themes = JSON.parse(data);
            } catch (error) {
                console.error("Error parsing JSON data:", error);
                this.themes = [];
            }
        } else {
            this.themes = [];
        }
    }

    saveThemes() {
        fs.writeFileSync(this.themesFilePath, JSON.stringify(this.themes, null, 2));
    }

    validateThemeData(themeData) {
        if (!themeData.name || !themeData.colors) {
            throw new Error('Invalid theme data: "name" and "colors" are required properties.');
        }
    }

    createTheme(themeData) {
        this.validateThemeData(themeData);
        const newTheme = {
            id: uuidv4(),
            ...themeData
        };
        this.themes.push(newTheme);
        this.saveThemes();
        return newTheme;
    }

    updateTheme(id, themeData) {
        this.validateThemeData(themeData);
        const themeIndex = this.themes.findIndex(theme => theme.id === id);
        if (themeIndex !== -1) {
            this.themes[themeIndex] = { ...this.themes[themeIndex], ...themeData };
            this.saveThemes();
            return this.themes[themeIndex];
        }
        throw new Error('Theme not found');
    }

    deleteTheme(id) {
        const themeIndex = this.themes.findIndex(theme => theme.id === id);
        if (themeIndex !== -1) {
            const deletedTheme = this.themes.splice(themeIndex, 1);
            this.saveThemes();
            return deletedTheme[0];
        }
        throw new Error('Theme not found');
    }

    getThemes() {
        return this.themes;
    }
}

module.exports = new ThemeManager();