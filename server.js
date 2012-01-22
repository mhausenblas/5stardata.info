var http = require('http');
var sys = require("sys");
var http = require("http"); 
var url = require("url");
var querystring = require("querystring");
var path = require("path");
var fs = require("fs");


// config
var DEBUG = true; // debug messages flag

var PORT = 1337;

var SERVER_200 = "200";
var SERVER_404 = "404";
var SERVER_500 = "500";

function serve(filename, mediatype, req, res) {
	parseLocalFile(filename, function(data, status, msg){
		if(status === SERVER_200){
			writeData(res, data, mediatype);
		}
		if(status === SERVER_404) {
			a404(res, msg);
		}
		if(status === SERVER_500) {
			a500(res, msg);
		}
	});
}

function getFileNameFromURI(fileuri){
	var filename = url.parse(fileuri).pathname;
	if(filename.substring(0, 1) === '/') filename = filename.substring(1, filename.length);
	return filename;
}

function parseLocalFile(fileuri, datareadyproc) {
	var filename = getFileNameFromURI(fileuri);
	var start = 0, end = 0;
		
	if(DEBUG) {
		start = new Date().getTime();
		sys.debug("Looking for " + filename);
	} 
	path.exists(filename, function(exists) {
		if(!exists) {
			datareadyproc(null, SERVER_404, getFileNameFromURI(fileuri) + " doesn't exist ...");
			return;
		}
		fs.readFile(filename, function(err, filecontent) {
			if(err) {
				datareadyproc(null, SERVER_500, "Error reading " + getFileNameFromURI(fileuri) + " ...");
				return;
			} 
			end = new Date().getTime();
			if(DEBUG) sys.debug("Successfully served " + filename + " in " + (end-start) + "ms");
			datareadyproc(filecontent, SERVER_200, fileuri);
		});
	});
}

function writeData(res, data, mediatype) {
	res.writeHead(200, {"Content-Type": mediatype});
	res.write(data);
	res.end();
}

function a404(res, msg){
	res.writeHead(404, {"Content-Type": "text/html"});
	res.write("<h1 style='border-bottom: 1px solid #e0e0e0'>404</h1>\n");
	res.write("<p>Sorry, seems I've got a 404 here for you.</p>\n");
	if(msg) {
		res.write(msg + "\n");
	}
	return res.end();
}

function a500(res, err){
	res.writeHead(500, {"Content-Type": "text/html"});
	res.write("<h1 style='border-bottom: 1px solid #e0e0e0'>500</h1>\n");
	res.write("<p>Hmm, something went wrong here, my bad, nothing you can do about it (yeah, it's a 500 ;)</p>\n");
	res.write("<p>" + err + "</p>\n");
	res.end();
}



// MAIN

http.createServer(function (req, res) {
	console.log("Handling " + req.url);
	
	switch (req.url) {
		case "/":
			serve("index.html", "text/html", req, res);
			break;
		case "style.css":
			serve("style.css", "text/css", req, res);
			break;
		case "jquery-1.4.2.min.js":
			serve("jquery-1.4.2.min.js", "application/json", req, res);
			break;
		case "data-highlight.js":
			serve("data-highlight.js", "application/json", req, res);
			break;
		case "5star-steps.png":
			serve("5star-steps.png", "image/png", req, res);
			break;
		case "temperature-saturday.sparql":
			serve("temperature-saturday.sparql", "text/plain", req, res);
			break;
		case "gtd-3.csv":
			serve("gtd-3.csv", "text/csv", req, res);
			break;
		case "gtd-2.xls":
			serve("gtd-2.xls", "application/vnd.ms-excel", req, res);
			break;
		case "gtd-1.pdf":
			serve("gtd-1.pdf", "application/pdf ", req, res);
			break;
		default:
			serve(req.url, "text/html", req, res);
	}
}).listen(PORT);


console.log('Serving 5stardata.info ...');


