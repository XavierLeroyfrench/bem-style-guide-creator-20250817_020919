const http = require('http');

let server;

function startServer(port) {
    server = http.createServer(handleRequests);
    server.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}

function stopServer() {
    if (server) {
        server.close(() => {
            console.log('Server has been stopped');
        });
    }
}

function handleRequests(req, res) {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Welcome to the BEM Style Guide Creator');
}

module.exports = { startServer, stopServer };