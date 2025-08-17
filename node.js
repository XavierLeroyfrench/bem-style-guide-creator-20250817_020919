const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('./models/User');

class UserAuthentication {
    async register(username, password) {
        if (!this.validateInput(username, password)) {
            throw new Error('Invalid input; ensure username and password meet security standards.');
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, password: hashedPassword });
        await user.save();
    }

    async login(username, password) {
        if (!this.validateInput(username, password)) {
            throw new Error('Invalid input; ensure username and password meet security standards.');
        }
        const user = await User.findOne({ username });
        if (user && await bcrypt.compare(password, user.password)) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
            return token;
        }
        throw new Error('Invalid credentials');
    }

    async authenticate(token) {
        return jwt.verify(token, process.env.JWT_SECRET);
    }

    validateInput(username, password) {
        const usernameRegex = /^[a-zA-Z0-9]{3,}$/; // At least 3 alphanumeric characters
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+={}:;<>?~`]{8,16}$/; // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
        return usernameRegex.test(username) && passwordRegex.test(password);
    }
}

module.exports = new UserAuthentication();

// styleguidegenerator.js
const fs = require('fs');
const path = require('path');

class StyleGuideGenerator {
    constructor(outputDir) {
        this.outputDir = outputDir;
    }

    generate(styleData) {
        const filePath = path.join(this.outputDir, 'styleguide.json');
        try {
            fs.writeFileSync(filePath, JSON.stringify(styleData, null, 2));
        } catch (error) {
            console.error('Error writing style guide:', error);
            throw new Error('Could not generate style guide. Please check filesystem permissions.');
        }
    }
}

module.exports = StyleGuideGenerator;

// customuibuilder.js
const fs = require('fs');
const path = require('path');

class CustomUIBuilder {
    constructor(outputDir) {
        this.outputDir = outputDir;
    }

    build(componentData) {
        const filePath = path.join(this.outputDir, 'customUI.js');
        try {
            fs.writeFileSync(filePath, this.createComponentString(componentData));
        } catch (error) {
            console.error('Error building custom UI:', error);
            throw new Error('Could not build custom UI. Please check filesystem permissions.');
        }
    }

    createComponentString(data) {
        return `export default function ${data.name}() {
            return <div>${data.content}</div>;
        }`;
    }
}

module.exports = CustomUIBuilder;

// exportfeature.js
const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

class ExportFeature {
    constructor(outputDir) {
        this.outputDir = outputDir;
    }

    exportToZip() {
        const zipPath = path.join(this.outputDir, 'export.zip');
        const output = fs.createWriteStream(zipPath);
        const archive = archiver('zip');

        output.on('close', () => {
            console.log(`Exported ${archive.pointer()} total bytes.`);
        });

        output.on('error', (error) => {
            console.error('Error exporting files:', error);
            throw new Error('Could not export files. Please check filesystem permissions.');
        });

        archive.pipe(output);
        archive.directory(this.outputDir, false);
        archive.finalize();
    }
}

module.exports = ExportFeature;

// documentationmodule.js
const fs = require('fs');
const path = require('path');

class DocumentationModule {
    constructor(outputDir) {
        this.outputDir = outputDir;
    }

    generateDocumentation(content) {
        const filePath = path.join(this.outputDir, 'documentation.md');
        try {
            fs.writeFileSync(filePath, content);
        } catch (error) {
            console.error('Error generating documentation:', error);
            throw new Error('Could not generate documentation. Please check filesystem permissions.');
        }
    }
}

module.exports = DocumentationModule;

// index.js
const express = require('express');
const UserAuthentication = require('./userauthenticationmodule');
const StyleGuideGenerator = require('./styleguidegenerator');
const CustomUIBuilder = require('./customuibuilder');
const ExportFeature = require('./exportfeature');
const DocumentationModule = require('./documentationmodule');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.post('/register', async (req, res) => {
    try {
        await UserAuthentication.register(req.body.username, req.body.password);
        res.status(201).send('User registered');
    } catch (error) {
        res.status(400).send(error.message);
    }
});

app.post('/login', async (req, res) => {
    try {
        const token = await UserAuthentication.login(req.body.username, req.body.password);
        res.status(200).json({ token });
    } catch (error) {
        res.status(401).send(error.message);
    }
});

app.post('/generate-styleguide', (req, res) => {
    const generator = new StyleGuideGenerator('./output');
    try {
        generator.generate(req.body);
        res.send('Style guide generated');
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.post('/build-custom-ui', (req, res) => {
    const builder = new CustomUIBuilder('./output');
    try {
        builder.build(req.body);
        res.send('Custom UI built');
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.post('/export', (req, res) => {
    const exporter = new ExportFeature('./output');
    try {
        exporter.exportToZip();
        res.send('Files exported');
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.post('/generate-documentation', (req, res) => {
    const documentation = new DocumentationModule('./output');
    try {
        documentation.generateDocumentation(req.body.content);
        res.send('Documentation generated');
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});