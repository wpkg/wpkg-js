/**
 * Script which allows to execute WPKG within 64-bit environment (using
 * 64-bit cscript.exe) on 64-bit operating systems like Windows XP x64 or
 * Windows Vista x64.
 * 
 * How to install:
 * - Put wrapper.js into the same directory where you run wpkg.js from
 *   e.g. \\server\RemInst\wpkg\wrapper.js
 * - Put your 64-bit cmd.exe from %SystemRoot%\system32\cmd.exe to the 64-bit
 *   sub-folder:
 *   e.g. \\server\RemInst\wpkg\64-bit\cmd.exe
 *   NOTE: Make sure you really copy the 64-bit cmd.exe. Do not copy cmd.exe
 *   from %SystemRoot%\SysWOW64\cmd.exe since this is the 32-bit binary.
 *   Quite strange but Microsoft put all 64-bit binaries to system32 while
 *   all 32-bit binaries are located at SysWOW64.
 *   (WOW64 = Windows on Windows-64)
 * - Configure WPKG-Client to run the wrapper instead while keeping all
 *   parameters.
 * 
 * Directory structure:
 * \\server\RemInst\wpkg
 *                    |- [XML files]
 *                    |- wpkg.js
 *                    |- wrapper.js
 *                    |- 64-bit
 *                          |- cmd.exe
 *
 * WPKG Client configuration:
 * WPKG file path (required): \\server\RemInst\wpkg\wrapper.js
 * WPKG parameters:           /synchronize
 * 
 * IMPORTANT, IMPORTANT, IMPORTANT, IMPORTANT, IMPORTANT, IMPORTANT
 * ================================================================
 * File checks:
 * If you use file checks within your 32-bit packages you have to check
 * for %ProgramFiles(x86)%\file\path... as well since %ProgramFiles% will
 * point to the install location of native 64-bit binaries and 32-bit
 * binaries cannot be found there.
 * To create a package which supports both (32/64-bit) systems I recommend
 * using a logical "or" check. For example:
 * <check type='logical' condition='or'>
 * <check type='file' condition='versiongreaterorequal' path='%ProgramFiles(x86)%\Skype\Phone\Skype.exe' value='3.6.0.216' />
 * <check type='file' condition='versiongreaterorequal' path='%ProgramFiles%\Skype\Phone\Skype.exe' value='3.6.0.216' />
 * </check>
 * 
 * Registry checks:
 * Registry values of 32-bit applications are redirected to
 * "HKLM\Software\Wow6432Node\*". WPKG will try to look up each value directly
 * at "HKLM\Software\*" first and in case it cannot find it it will look for
 * the corresponding key within "Wow6432Node". Therefore you might check for
 * "HKLM\Software\TortoiseSVN\AddedIcon" which will look up the 64-bit version
 * on 64-bit Windows and the 32-bit version on 32-bit Windows.
 * In case you installed only 32-bit TortoiseSVN on 64-bit Windows it will try
 * to find the 64-bit key and if it fails read the one at
 * "HKLM\Software\Wow6432Node\TortoiseSVN\AddedIcon".
 */

/**
 * Global variables
 */
// var cmd64="64-bit\\cmd.exe"
var cmd64="%SystemRoot%\\sysnative\\cmd.exe"
var wpkg="wpkg.js"

/**
 * Execute correct cmd
 */
var fso = new ActiveXObject("Scripting.FileSystemObject");
var path = WScript.ScriptFullName;
base = fso.GetParentFolderName(path);

var exitCode = 0;

var wshObject = new ActiveXObject("WScript.Shell");
/* check if ProgramFiles(x86) is defined. This is defined on 64-bit systems
 * only. NOTE that it is defined for 64-bit and 32-bit applications while
 * the PROCESSOR_ARCHITECTURE variable does not allow to detect a 64-bit
 * system by a 32-bit process.
 */
var architecture = wshObject.ExpandEnvironmentStrings("%ProgramFiles(x86)%");

var command = "";
if (architecture != "" && architecture != "%ProgramFiles(x86)%") {
	// 64-bit system
	command += base + "\\" + cmd64 + " /c cscript " + base + "\\" + wpkg;
} else {
	// 32-bit system
	command += "cmd /c cscript " + base + "\\" + wpkg;
}

var argv = WScript.Arguments;
for (var i=0; i<argv.length; i++) {
	command += " " + argv(i);
}

var shell = new ActiveXObject("WScript.Shell");
command = shell.ExpandEnvironmentStrings(command);

// execute command
var exitCode = exec(command, 3600);
WScript.Quit(exitCode);

/**
 * Executes a shell command and blocks until it is completed, returns the
 * program's exit code. Command times out and is terminated after the
 * specified number of seconds.
 *
 * @param cmd the command line to be executed
 * @param timeout timeout value in seconds
 * @param workdir working directory (optional). If set to null uses the current
 *                working directory of the script.
 * @return command exit code (or -1 in case of timeout)
 */
function exec(cmd, timeout, workdir) {
	var exitCode = 0;
	try {
		var shell = new ActiveXObject("WScript.Shell");

		// Timeout after an hour by default.
		if (timeout == 0) {
			timeout = 3600;
		}

		// set working directory (if supplied)
		if (workdir != null && workdir != "") {
			workdir = shell.ExpandEnvironmentStrings(workdir);
			dinfo("Switching to working directory: " + workdir);
			shell.CurrentDirectory = workdir;
		}

		var shellExec = shell.Exec(cmd);

		var count = 0;
		var timeout = timeout * 100;
		while (shellExec.status == 0) {
			if (count >= timeout) {
				shellExec.Terminate();
				return -1;
			}
			WScript.sleep(10);
			count++;
			try {
				// read all stdout from sub-command
				// WScript.StdErr.WriteLine(shellExec.StdErr.ReadLine());
				WScript.StdOut.WriteLine(shellExec.StdOut.ReadLine());
			} catch (e) {
				// ignore
			}

			// WScript.Echo("Iteration: " + count);
		}

		// if script terminated, flush remaining log
		// WScript.StdErr.Write(shellExec.StdOut.ReadAll());
		WScript.StdOut.Write(shellExec.StdOut.ReadAll());
		exitCode = shellExec.exitCode;
	} catch (e) {
		// handle execution exception
		var message = "Command '" + cmd + "\" was not successful.\n" + e.description;
		WScript.Echo(message);
	}
	return exitCode;
}
