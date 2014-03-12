var net = require('net');

var PORT = 8081;

var server =  net.createServer(function(sock) {
	sock.setEncoding('utf-8');
    console.log('Connected: ' + sock.remoteAddress +':'+ sock.remotePort);
    
    sock.on('data', function(data) {
    	console.log('message received: %d', data.length);
    	var index = data.indexOf(':');
    	if(index < 0){
    		if(data.charAt(0) == 'q'){
    			sock.write('goodbye\r\n');
    			setTimeout(function () {
    			      sock.destroy();
    			    }, 3000);
    		}
    	}else{
        	var size = parseInt(data.substring(0, index), 10);    	
        	for(i = 0; i < size; i++)
        		sock.write('x');
        	sock.write('\r\n');    		
    	}
    });
    
    sock.on('end', function(data) {
        console.log('Disconnected: ' + sock.remoteAddress +':'+ sock.remotePort);
    });
    
    sock.on('error', function(e){
    	console.log('error : %j', e);
    });
    
    sock.write('hello\r\n');
	sock.write('message format: [echo size]:[you message]\r\n');    
});

server.listen(PORT, function(){
	console.log('Server address: %j', server.address());
});

