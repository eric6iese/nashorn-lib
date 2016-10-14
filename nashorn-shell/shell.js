/**
* Kommandozeilen-Ausführungen von Skripten.
*/
var System = Java.type('java.lang.System');
var Thread = Java.type('java.lang.Thread');
var ProcessBuilder = Java.type('java.lang.ProcessBuilder');
var Redirect = ProcessBuilder.Redirect;

var File = Java.type('java.io.File');
var InputStream = Java.type('java.io.InputStream');
var Reader = Java.type('java.io.Reader');
var OutputStreamWriter = Java.type('java.io.OutputStreamWriter');
var BufferedWriter = Java.type('java.io.BufferedWriter');
var Files = Java.type('java.nio.file.Files');
var Paths = Java.type('java.nio.file.Paths');

/**
* Hilfsmethode: Sendet alle Daten aus this.in an den Process und leert das Feld danach.
*/
function copyStream(input, output){
	// commons-io für das Kopieren von streamdaten verwenden
	var maven = require('rhox-maven');
	maven.include({group: 'commons-io', name: 'commons-io', version: '2.5'})
	var IOUtils = org.apache.commons.io.IOUtils;
	try {
		if (input instanceof InputStream){
			try {
				IOUtils.copy(input, output);
			}finally {
				input.close();
			}
		} else if (input instanceof Reader){
			output = new OutputStreamWriter(output);
			try {
				IOUtils.copy(input, output);
			}finally {
				input.close();
			}
		} else {
			output = new BufferedWriter(new OutputStreamWriter(output));
			var writeLine = function(line){
				output.write(line.toString());
				output.newLine();
			};	
			if (Array.isArray(input)){
				input.forEach(writeLine);
			} else {
				writeLine(input);
			}
		}
	} finally {
		output.close();
	}
}

/**
* Bildet eine zustandsbehaftete, pseudo-kommandozeile ab.
*/
function Shell() {

	// private member
	var workdir = null;  
	var resolve = function(path){
		if (workdir == null){
		  return Paths.get(path);
		}
		return workdir.resolve(path).toAbsolutePath();
	}
  
  	/**
	* Out kann von außen noch nicht geändert werden.
	*/
	var out = System.out;
  
	// public member
	
	/**
	* Standard-eingabe.
	* Kann von außen geändert werden, v.a. für exec wichtig.
	*/
	this.in = null;	
	
	/**
	* Ändert das Standard-Arbeitsverzeichnis für mit der Shell erstellte Prozesse auf das angegebene.
	* Null sorgt für das Zurücksetzen auf den Default.
	* @return die Shell selbst. Dadurch kann die Operation bei Bedarf direkt mit weiteren verkettet werden.
	*/
	this.cd = function(dir){
		if (dir == null){
			workdir = null;
		} else if (workdir == null){
			workdir = Paths.get(dir).toAbsolutePath();
		} else {
			workdir = workdir.resolve(dir).toAbsolutePath();
		}
		return this;
	}
  
	/**
	* Liefert den aktuellen Pfad als String zurück.
	*/
	this.pwd = function(){
		if (workdir){
			return System.getProperty('user.dir');
		} else {
			return workdir.toString();
		}
	}
	
	/**
	* Löscht die angegebene Datei relativ zum aktuellen Pfad.
	*/
	this.rm = function(file){
		var target = resolve(file);
		Files.delete(target);
	}
	
	/**
	* Gibt die übergebene Zeile auf der Kommandozeile nach stdout aus, wie üblich.
	*/
	this.println = function(line){
		out.println(line);
	}
	
	/**
	* Führt einen Befehl normal auf der Kommandozeile aus, auf den auch direkt alle Ein- und Ausgaben umgeleitet werden.
	*/
	this.start = function(commandline){
		var args;
		if (Array.isArray(commandline)){
			args = Java.to(commandline, 'java.lang.String[]');
		}else {
			args = commandline.toString();
		}
		/*if (exec.contains('/') || exec.contains('\\')){
			exec = resolve(exec).toRealPath().toString();
		}
		var args = [exec].concat(args);*/
		var processBuilder = new ProcessBuilder(args);
		if (workdir){
			processBuilder.directory(workdir.toFile());
		}
		processBuilder.redirectOutput(Redirect.INHERIT);
		processBuilder.redirectError(Redirect.INHERIT);
		
		/**
		* In wird nicht gepipt, wenn stdin verwendet wird.
		* Ansonsten wird der vorhandene in in einem separaten Prozess in die Pipe geschrieben.
		*/
		processBuilder.redirectInput(this.in ? Redirect.PIPE : Redirect.INHERIT);
		
		var process = processBuilder.start();		
		if (this.in){
			var input = this.in;
			new Thread(function(){
				copyStream(input, process.getOutputStream());
			}).start();
			this.in = null;
		}
		return {
			destroy: function(){
				process.destroy();
			},
			waitFor: function(){
				return process.waitFor();
			}
		};
	}
	
	/**
	* Führt einen Befehl normal auf der Kommandozeile aus, auf den auch direkt alle Ein- und Ausgaben umgeleitet werden.
	* Der Aufruf kehrt mit Beendigung des Kommandos zurück.
	*/
	this.exec = function(exec, args){
		var process = this.start(exec, args);
		return process.waitFor();
	}
};

/**
* Die Shell-Klasse.<br/>
* Der Konstruktor erzeugt eine neue Shell, die eigene Zustände verwalten kann.
* Diese verwendet zunächst das Standard-Arbeitsverzeichnis.
*/
module.exports = Shell;