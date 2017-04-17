// Predefined global variables and functions

// Module loader
if (typeof require === 'undefined'){
	load(__DIR__ + '/jvm-npm/jvm-npm.js');
}

// Import nashorn shell scripting extensions
if (typeof readLine === 'undefined'){
	function readLine(line){
		return System.console().readLine(line);
	}
}

// Important global Java objects for scripting

// java.lang
if (typeof System === 'undefined'){
	var System = Java.type('java.lang.System');
}
if (typeof Thread === 'undefined'){
	var Thread = Java.type('java.lang.Thread');
}

// java.util
if (typeof Collectors === 'undefined'){
	var Collectors = Java.type('java.util.stream.Collectors');
}
// Many favorite java classes like ArrayListe from java.util
// are not imported because there are viable js Alternatives

// java.io
if (typeof File === 'undefined'){
	var File =  Java.type('java.io.File');
}
if (typeof Charset === 'undefined'){
	var Charset =  Java.type('java.nio.charset.Charset');
}
if (typeof StandardCharsets === 'undefined'){
	var StandardCharsets =  Java.type('java.nio.charset.StandardCharsets');
}
if (typeof Files === 'undefined'){
	var Files =  Java.type('java.nio.file.Files');
}
if (typeof Paths === 'undefined'){
	var Paths =  Java.type('java.nio.file.Paths');
}

// import rhox-classpath AND overwrite the Java.type-Function with it! 
var classpath = require("rhox-classpath");
Java.type = classpath.type.bind(classpath);

"Initialized classpath and main java classes"