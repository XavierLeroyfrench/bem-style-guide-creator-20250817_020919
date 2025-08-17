const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

class ExportFeature {
    constructor(outputDirectory) {
        this.outputDirectory = outputDirectory;
        this.validFormats = ['pdf', 'docx', 'html']; // Define valid formats
    }

    exportGuide(format) {
        return new Promise((resolve, reject) => {
            if (!this.validFormats.includes(format)) {
                return reject('Invalid format specified. Valid options are: ' + this.validFormats.join(', '));
            }

            const fileName = `style_guide.${format}`;
            const filePath = path.join(this.outputDirectory, fileName);

            if (!fs.accessSync(this.outputDirectory, fs.constants.W_OK)) {
                return reject('Output directory is not writable.');
            }

            exec(`generateStyleGuide --format ${format} --output ${filePath}`, (error) => {
                if (error) {
                    return reject(`Error generating style guide: ${error.message}`);
                }
                resolve(filePath);
            });
        });
    }

    downloadFile(filePath) {
        return new Promise((resolve, reject) => {
            if (!fs.existsSync(filePath)) {
                return reject('File does not exist.');
            }
            const readStream = fs.createReadStream(filePath);
            const downloadPath = path.join(this.outputDirectory, path.basename(filePath));
            
            if (!fs.accessSync(this.outputDirectory, fs.constants.W_OK)) {
                return reject('Output directory is not writable.');
            }

            const writeStream = fs.createWriteStream(downloadPath);
            readStream.pipe(writeStream);
            writeStream.on('finish', () => resolve(`File downloaded to ${downloadPath}`));
            writeStream.on('error', (error) => reject(`Error downloading file: ${error.message}`));
        });
    }

    shareGuide(link) {
        return new Promise((resolve, reject) => {
            // Simulating a safer sharing mechanism (e.g., using an API instead of exec)
            const shareMessage = `File shared at ${link}`;
            // Implement the actual sharing logic here (e.g., using an email or messaging API)

            resolve(shareMessage);
        });
    }
}

module.exports = ExportFeature;