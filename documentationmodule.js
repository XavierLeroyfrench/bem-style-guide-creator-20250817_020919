const fs = require('fs');
const path = require('path');

const documentationFilePath = path.join(__dirname, 'documentation.json');

function readDocumentation() {
    if (fs.existsSync(documentationFilePath)) {
        const data = fs.readFileSync(documentationFilePath);
        return JSON.parse(data);
    }
    return {};
}

function writeDocumentation(data) {
    fs.writeFileSync(documentationFilePath, JSON.stringify(data, null, 2));
}

function getDocumentation(topic) {
    const docs = readDocumentation();
    return docs[topic] || null;
}

function updateDocumentation(topic, content) {
    const docs = readDocumentation();
    docs[topic] = content;
    writeDocumentation(docs);
}

function searchDocumentation(query) {
    const docs = readDocumentation();
    return Object.entries(docs)
        .filter(([topic, content]) => topic.includes(query) || content.includes(query))
        .map(([topic]) => topic);
}

module.exports = { getDocumentation, updateDocumentation, searchDocumentation };