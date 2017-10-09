/**
 * GENERAL
 * =======
 * Author : Rainer Meier <skybeam (at) users.sourceforge.net>
 * Version: 1.0
 * License: GPLv2
 * 
 * DESCRIPTION
 * ===========
 * This script allows execution of another script (given by parameter) in
 * elevated privileges mode on Windows Vista with UAC activated.
 * 
 * This is required as there seems to be no possibility to run a batch/cmd
 * script on Windows Vista with elevated rights. Even if you right-click a
 * cmd script and select to run it as Administrator it does not get elevated
 * rights.
 * 
 * USAGE
 * =====
 * This script here just allows you to call any script (batch, cscript ...)
 * with elevated rights.
 * 
 * NOTE: To run WPKG in elevated mode you can either write a batch file which
 * is calling 'cscript \\path\to\wpkg.js ...' or run cscript directly by this
 * script.
 * Running batch file:
 * <script> \\path\to\<batch-name.cmd> [optional arguments]
 * Running cscript:
 * <script> cscript \\path\to\wpkg.js <argument1> [argument2 [argument3 [...]]]
 * 
 * NOTE: Running cscript directly does not allow you to set custom environment
 * variables like the common SOFTWARE variable! Running this script here from a
 * batch script which is setting the variables will not work as the environment
 * of the child process which is run in elevated mode is reset to the windows
 * defaults.
 * So the following execution chain won't work (wpkg.js will not see the
 * exported SOFTWARE variable):
 * <set SOFTWARE variable> => execute-elevated.js => (elevated) wpkg.js
 * Only the following will work:
 * execute-elevated.js => (elevated) <batch to set SOFTWARE> => wpkg.js
 * This also works with the exisiting wrapper:
 * execute-elevated.js => (elevated) <batch to set SOFTWARE> => wrapper.js
 * 
 * Here is some sample code you can use for your own batch file. I use this one
 * to install all software which belongs to a specific profile to the current
 * machine. No matter what its name is - I always use the same profile. This is
 * useful for example if you need to upgrade your default bunch of software on
 * a customer machine.
 * 
 * @echo off
 * echo Running WPKG
 * set WPKG_PATH=\\software\RemInst\wpkg\wrapper.js
 * set SOFTWARE=\\software\RemInst\software
 * set SETTINGS=\\software\RemInst\settings
 * set PROFILE=autosetup
 *
 * start /wait "wpkg" cscript "%WPKG_PATH%" /synchronize /profile:%PROFILE%
 * 
 * 
 * ADDITIONAL NODES
 * ================
 * Please note that using this script here is not required when launching
 * WPKG from WPKG client (as a system service) as the system service does
 * not require to elevate its privileges. This script is only required if you
 * want to MANUALLY invoke wpkg.js/wrapper.js on a Windows Vista system with
 * UAC enabled.
 * 
 * Also note that the paths to the scripts specified should be UNC paths as
 * elevated programs cannot access network drives which are eventually
 * available when launching this script. So don't use something like
 * Z:\wpkg\wpkg.js but use \\server\share\wpkg\wpkg.js instead.
 */
function showUsage() {
	var scriptName = WScript.ScriptName;
	var message = "\
Usage: \n";
	message += scriptName + "<command> [[argument1 [argument2 ...]]]\n\n";
	message += "\
Example:\n";
	message += scriptName + " \\\\path\\"+"to\\my-custom-wpkg-caller.cmd\n"
	message += scriptName + " \\\\path\\"+"to\\my-custom-wpkg-caller.cmd /synchronize\n";
	message += scriptName + " cscript \\\\path\\"+"to\\wpkg.js /synchronize";
	WScript.Echo(message);
}

/**
 * Call the main function with arguments while catching all errors and
 * forwarding them to the error output.
 */
try {
	main();
} catch (e) {
	var message = "Message:      " + e.message + "\n" +
				"Description:  " + e.description + "\n" +
				"Error number: " + hex(e.number) + "\n" +
				"Stack:        " + e.stack  + "\n" +
				"Line:         " + e.lineNumber;
	WScript.Echo(message);
	WScript.Quit(2);
}

/**
 * Main execution method. Actually runs the script
 */
function main() {
	// get arguments
	var argv = WScript.Arguments;

	// check argument count
	if ( argv.length < 1 ) {
		showUsage();
		WScript.Quit(1)
	}
	
	// parse command and arguments
	var command = argv(0);
	var args = "";
	for (var i=1; i<argv.length; i++) {
		args += " " + argv(i);
	}

	// evaluate working directory - command is run from that directory
	var fso = new ActiveXObject("Scripting.FileSystemObject");
	var path = WScript.ScriptFullName;
	workdir = fso.GetParentFolderName(path);

	var shell = new ActiveXObject("WScript.Shell");
	command = shell.ExpandEnvironmentStrings(command);
	args = shell.ExpandEnvironmentStrings(args);

	// var shellExec = shell.exec(cmd);
	var appShell = new ActiveXObject("Shell.Application");
	var shellExec = appShell.ShellExecute(command, args, workdir, "runas");
}

/**
 * User-defined function to format error codes.
 * VBScript has a Hex() function but JScript does not.
 */
function hex(nmb) {
	if (nmb > 0) {
		return nmb.toString(16);
	} else {
		return (nmb + 0x100000000).toString(16);
	}
}