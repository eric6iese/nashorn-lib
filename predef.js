// Predefined global variables and functions

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
// Many favorite java classes like ArrayList from java.util
// are _not_ imported as there are viable js Alternatives
// (array and Java.to/from suffices)
if (typeof Stream === 'undefined'){
	var Stream = Java.type('java.util.stream.Stream');
}
if (typeof Collectors === 'undefined'){
	var Collectors = Java.type('java.util.stream.Collectors');
}
if (typeof Collections === 'undefined'){
	var Collections = Java.type('java.util.Collections');
}
if (typeof Comparator === 'undefined'){
	var Comparator = Java.type('java.util.Comparator');
}

// java.io
if (typeof File === 'undefined'){
	var File = Java.type('java.io.File');
}
if (typeof Charset === 'undefined'){
	var Charset = Java.type('java.nio.charset.Charset');
}
if (typeof StandardCharsets === 'undefined'){
	var StandardCharsets = Java.type('java.nio.charset.StandardCharsets');
}
if (typeof Files === 'undefined'){
	var Files = Java.type('java.nio.file.Files');
}
if (typeof Paths === 'undefined'){
	var Paths = Java.type('java.nio.file.Paths');
}

// import rhox-classpath AND overwrite the Java.type-Function with it! 
// Module loader
if (typeof require === 'undefined'){
	load(__DIR__ + '/jvm-npm/jvm-npm.js');
	(function () {
		var classpath = require("rhox-classpath");
		Java.type = classpath.type.bind(classpath);	
	})();
}

// Custom function:
// Imports multiple fqn-classes with a single import statement
if (typeof Java.import === 'undefined'){
	var global = this;
	function importClasses(classes){
		classes.split(/[\s;]+/).filter(function(clazz){
			return typeof global[name] === 'undefined';
		}).forEach(function(clazz){
				var type = Java.type(clazz);
				var pos = clazz.lastIndexOf('.');
				var name = pos == -1 ? clazz : name.substring(pos);
				global[name] = type;			
		});
	}
	Java.import = importClasses;
}

"Initialized classpath and main java classes"
