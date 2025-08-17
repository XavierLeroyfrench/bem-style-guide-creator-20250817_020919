const express = require('express');
const userAuth = require('./userauthenticationmodule');
const styleGuideGenerator = require('./styleguidegenerator');
const customUIBuilder = require('./customuibuilder');
const exportFeature = require('./exportfeature');
const documentationModule = require('./documentationmodule');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Centralized error handling middleware
app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.status || 500).json({
        message: err.message || 'Internal Server Error',
        error: err.details || {},
    });
});

// User Authentication Middleware
app.use('/api', userAuth);

// Generate Style Guide
app.post('/api/style-guide', (req, res, next) => {
    const styles = req.body;
    try {
        const styleGuide = styleGuideGenerator.generate(styles);
        res.status(200).json(styleGuide);
    } catch (error) {
        next({ message: 'Error generating style guide', details: error });
    }
});

// Custom UI Builder
app.post('/api/custom-ui', (req, res, next) => {
    const uiComponents = req.body;
    try {
        const customUI = customUIBuilder.build(uiComponents);
        res.status(200).json(customUI);
    } catch (error) {
        next({ message: 'Error building custom UI', details: error });
    }
});

// Export Feature
app.post('/api/export', (req, res, next) => {
    const exportData = req.body;
    try {
        const exportedFile = exportFeature.export(exportData);
        const filePath = path.resolve(__dirname, exportedFile);
        fs.stat(filePath, (err) => {
            if (err) {
                return next({ message: 'File not found', details: err });
            }
            res.download(filePath, (downloadErr) => {
                if (downloadErr) {
                    next({ message: 'Error downloading file', details: downloadErr });
                }
            });
        });
    } catch (error) {
        next({ message: 'Error exporting data', details: error });
    }
});

// Documentation Module
app.get('/api/documentation', (req, res, next) => {
    try {
        const documentation = documentationModule.generate();
        res.status(200).json(documentation);
    } catch (error) {
        next({ message: 'Error generating documentation', details: error });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});