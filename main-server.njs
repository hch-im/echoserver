var net = require('net');
var debug = true;

var PORT = 8081;
var HOST = '0.0.0.0';
var maxSize = 1024 * 1024 * 10;

var server =  net.createServer(function(sock) {
	sock.setEncoding('utf-8');
	sock.setTimeout(10000, function(){
		sock.destroy();
	});
	
	if(debug) console.log('Connected: ' + sock.remoteAddress +':'+ sock.remotePort);
    
    sock.on('data', function(data) {
    	if(debug) console.log('message received: %d', data.length);
    	var size = 0;
    	switch(data[0]){
    	case 'B':
    	case 'b':
        	var index = data.indexOf('$'); 
        	var size = parseInt(data.substring(1, index), 10);           	
    		break;
    	case 'K':
    	case 'k':
        	var index = data.indexOf('$'); 
        	var size = parseInt(data.substring(1, index), 10);           	
        	size *= 1024;
    		break;
    	case 'M':
    	case 'm':
        	var index = data.indexOf('$'); 
        	var size = parseInt(data.substring(1, index), 10);           	
        	size *= (1024 * 1024);    		
    		break;
    	case 'Q':
    	case 'q':
			sock.write('goodbye\r\n');
			setTimeout(function () {
			      sock.destroy();
			    }, 3000);    		
    		break;
    	default:
    		//nothing
    		break;
    	}
    	
    	if(size > maxSize) size = maxSize;
    	if(size > 0){
    		var i = size;
        	while(i-- > 0)
        		sock.write('x');
        	sock.write('\r\n');    		    		
    		if(debug) console.log('send: ' + size);
    	}
    });
    
    sock.on('end', function(data) {
    	if(debug) console.log('Disconnected: ' + sock.remoteAddress +':'+ sock.remotePort);
    });
    
    sock.on('error', function(e){
    	console.log('error : %j', e);
    });
    
    sock.write('hello\r\n');
	sock.write('message format: [B|K|M][echo size]$[you message]\r\n');    
});

server.listen(PORT, HOST, function(){
	console.log('Server address: %j', server.address());
});

//setInterval(function() {
//	global.gc();
//    if(debug) console.log('heap size: %d', getMemUsed());
//}, 5000);
