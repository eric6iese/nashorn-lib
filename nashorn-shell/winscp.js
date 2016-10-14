/**
* Funktionen f�r die Verwendung von ssh u.a. per putty.
*/
// TODO: Struktur f�r Logindaten definieren.
var host = '';
var user = ''; 
var password = ''; 


// Commands
var winscpHome = 'C:\\Program Files (x86)\\WinSCP\\'
var winscpCommand = [winscpHome + 'WinSCP.exe']

var ProcessBuilder = java.lang.ProcessBuilder;
var Redirect = ProcessBuilder.Redirect;
var File = java.io.File;
var Files = java.nio.file.Files;
var System = java.lang.System;
var ln = System.getProperty('line.separator');


/**
* F�hrt alle �bergebenen Kommandos in WSCP aus.
* 
*/
exports.exec = function(shellcommands){
	var logfile = File.createTempFile('winscp', 'log');
	logfile.deleteOnExit();
	var cmds = winscpCommand.concat([
		'/log=' + logfile,
		'/command',
		'open sftp://' + user + ':' + password + '@' + host ]); //+ ' -hostkey="' + hostkey + '"']);
	cmds = cmds.concat (shellcommands);
	cmds.push('exit');
	print('Execute Commands: ' + cmds.join(ln));
	var process = new ProcessBuilder(cmds).
		redirectInput(Redirect.INHERIT).
		redirectOutput(Redirect.INHERIT).
		redirectError(Redirect.INHERIT).
		start();
	process.waitFor();
	
	// theoretisch k�nnte das hier auch ayynchron w�hrend der Ausf�hrung erfolgen,
	// der Entwicklungsaufwand w�re aber enorm hoch
	var lines = Java.from(Files.readAllLines(logfile.toPath()));
	lines.forEach(function(line){
	  if (!line.startsWith('<')){
	    return;
	  }
	  var line = line.split('[Shell] ', 2);
	  if (line.length < 2){
	    return;
	  }	  
	  System.out.println(line[1]);
	});
};