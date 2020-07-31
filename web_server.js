


const http = require('http');
const fs = require('fs');
const url = require('url');
const args = process.argv.slice(2)
// create server object
http.createServer((req, res) => {
    let path = '.' + url.parse(req.url, true).pathname;
    console.log(path);
    if (path === './') {
	path = './fancy.html';
    }
    fs.readFile(path, (err,data) => {
	if (err) {
	    res.writeHead(404, {'Content-type': 'text/html'});
	    return res.end("404 Not Found");
	}
	res.writeHead(200, {'Content-type': 'text/html'});
	res.write(data);
	return res.end();	
    });
}).listen(args[0]);
