const fs = require('fs').promises;
const path = require('path');
const Joi = require('joi');

const guideFilePath = path.join(__dirname, 'styleguide.json');

const guideSchema = Joi.object({
    id: Joi.string().required(),
    title: Joi.string().required(),
    content: Joi.string().required(),
});

async function generateGuide(data) {
    validateData(data);
    const guides = await loadGuides();
    guides.push(data);
    await saveGuides(guides);
    return data;
}

async function fetchGuide(id) {
    const guides = await loadGuides();
    return guides.find(guide => guide.id === id) || null;
}

async function updateGuide(id, data) {
    validateData(data);
    const guides = await loadGuides();
    const index = guides.findIndex(guide => guide.id === id);
    if (index !== -1) {
        guides[index] = { ...guides[index], ...data };
        await saveGuides(guides);
        return guides[index];
    }
    return null;
}

async function deleteGuide(id) {
    const guides = await loadGuides();
    const updatedGuides = guides.filter(guide => guide.id !== id);
    if (updatedGuides.length !== guides.length) {
        await saveGuides(updatedGuides);
        return true;
    }
    return false;
}

async function loadGuides() {
    try {
        if (await fileExists(guideFilePath)) {
            const data = await fs.readFile(guideFilePath);
            return JSON.parse(data);
        }
    } catch (error) {
        console.error('Error reading guides:', error);
        return [];
    }
    return [];
}

async function saveGuides(guides) {
    await fs.writeFile(guideFilePath, JSON.stringify(guides, null, 2));
}

function validateData(data) {
    const { error } = guideSchema.validate(data);
    if (error) {
        throw new Error(`Validation Error: ${error.message}`);
    }
}

async function fileExists(filePath) {
    try {
        await fs.access(filePath);
        return true;
    } catch {
        return false;
    }
}

module.exports = {
    generateGuide,
    fetchGuide,
    updateGuide,
    deleteGuide
};