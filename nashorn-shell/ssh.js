/**
* Funktionen f�r die Verwendung von ssh u.a. per putty.
*/
// TODO: Struktur f�r Logindaten definieren.
var host = '';
var user = ''; 
var password = ''; 

var Shell = require('shell');
var native = require('rhox-native');

// imports
var System = java.lang.System;
var Thread = java.lang.Thread;
var ProcessBuilder = java.lang.ProcessBuilder;
var Redirect = ProcessBuilder.Redirect;
var File = java.io.File;
var Files = java.nio.file.Files;
var Paths = java.nio.file.Paths;
var PrintStream = java.io.PrintStream;
var InputStreamReader = java.io.InputStreamReader;
var BufferedReader = java.io.BufferedReader;

/**geco
* �ffnet eine neue Puttysession
*/
exports.openWindow = function(){
  // Putty
  var puttyHome = 'C:\\Program Files (x86)\\PuTTY\\'
  var putty = [puttyHome + 'putty', user + '@' + host, '-pw', password, '-t', '-t']
  var runtime = java.lang.Runtime.getRuntime();
  runtime.exec(putty);
}

// Use cygwin instead of plink
var ssh = ['D:\\devenv\\cygwin64\\bin\\ssh', user + '@' + host, '-t', '-t'];

// Linefeed f�r externe Konsole
var ln = '\n';
// Linefeed f�r diese Konsole
// var ln = java.lang.System.getProperty('line.separator');

/**
* Das Password l�sst sich bei ssh nur direkt �ber die Tastatur eingeben...
* Darum hack ichs �ber Autoit.
*/
function sendPassword(){
	var au = new native.win32.ComObject('AutoItX3.Control');
	var path = Paths.get(System.getProperty('java.home'));
	if (path.getFileName().toString() == 'jre'){
	  path = path.getParent();
	}
	var name = path.resolve('bin').resolve('jjs.exe').toString();
	au.WinActivate(name);
	au.Send(password + ln);
}

/**
* �ffnet eine neue SSH-Session auf dem Server.
*/
exports.openSession = function(){
	var process = new Shell().start(ssh);
	sendPassword();
	process.waitFor();
}

/**
* �ffnet eine neue SSH-Session, f�hrt die angegebenen Kommandos einzeln aus und schlie�t sich dann wieder, wartet darauf und schlie�t sich wieder.
*/
exports.exec = function(shellcommands){
	shellcommands = shellcommands.concat(['exit']);	
	var sh = new Shell();
	sh.in = shellcommands;
	var process = sh.start(ssh);
	sendPassword();
	process.waitFor();
};

/**
* Wie exec, schreibt die Ergebnisse aber in einen String und liefert diesen zur�ck.
*/
/* Currently unused
exports.execAndGet = function(shellcommands){
	var maven = require('rhox-maven');
	maven.include('org.zeroturnaround:zt-exec:1.9');
	var ProcessExecutor = org.zeroturnaround.exec.ProcessExecutor;
	
	var input = ln + shellcommands.join(ln) + ln + 'exit';
	return new ProcessExecutor().
		command(ssh).
		redirectInput(new java.io.ByteArrayInputStream(input.getBytes())).
		redirectErrorStream(true).
		readOutput(true).
		execute().
        outputUTF8();
};*/