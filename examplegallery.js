const fs = require('fs').promises;
const path = require('path');

class ExampleGallery {
    constructor() {
        this.examples = [];
        this.loadExamples();
    }

    async loadExamples() {
        const examplesPath = path.join(__dirname, 'examples.json');
        try {
            const data = await fs.readFile(examplesPath, 'utf8');
            this.examples = JSON.parse(data);
        } catch (error) {
            console.error('Error loading examples:', error);
        }
    }

    async addExample(exampleData) {
        const newId = this.generateNewId();
        const newExample = { id: newId, ...exampleData };
        this.examples.push(newExample);
        await this.saveExamples();
        return newExample;
    }

    async removeExample(id) {
        const index = this.examples.findIndex(ex => ex.id === id);
        if (index !== -1) {
            this.examples.splice(index, 1);
            await this.saveExamples();
            return true;
        }
        return false;
    }

    getExample(id) {
        return this.examples.find(ex => ex.id === id) || null;
    }

    async saveExamples() {
        const examplesPath = path.join(__dirname, 'examples.json');
        try {
            await fs.writeFile(examplesPath, JSON.stringify(this.examples, null, 2));
        } catch (error) {
            console.error('Error saving examples:', error);
        }
    }

    generateNewId() {
        return this.examples.length ? Math.max(...this.examples.map(ex => ex.id)) + 1 : 1;
    }
}

module.exports = new ExampleGallery();