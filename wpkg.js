var WPKG_VERSION = "1.3.0";
/*******************************************************************************
 * 
 * WPKG - Windows Packager
 * 
 * Copyright 2003 Jerry Haltom<br>
 * Copyright 2005 Aleksander Wysocki <papopypu (at) op . pl><br>
 * Copyright 2005-2006 Tomasz Chmielewski <mangoo (at) wpkg . org><br>
 * Copyright 2007-2011 Rainer Meier <r.meier (at) wpkg.org><br>
 * 
 * Please report your issues to the list on http://wpkg.org/
 */

/**
 * Displays command usage.
 */
function showUsage() {
var message = "" +
"If you cannot read this since it is displayed within a dialog-window please \n" +
"execute 'cscript wpkg.js /help' on the command line. This will print all \n" +
"messages to the console. \n\n" +
"Command Line Switches \n" +
"===================== \n" +
"Note: These command line switches overwrite parameters within config.xml. For \n" +
"example the /quiet flag overwrites an eventually present quiet parameter within \n" +
"config.xml. \n" +
"Usually you should specify as few parameters as possible since changing \n" +
"config.xml on the server might be much easier than changing all client-side \n" +
"stored parameters. Typically you would use the following command-line in \n" +
"production: \n" +
"	wpkg.js /synchronize \n" +
"\n" +
"Frequently used parameters (package operations, you need to choose one): \n" +
"======================================================================== \n" +
"\n" +
"/install:<package>[,package2[,package3,[...]]] \n" +
"	Install the specified package(s) on the system. \n" +
"\n" +
"/query:<option> \n" +
"	Display a list of packages matching the specified criteria. Valid \n" +
"	options are: \n" +
"\n" +
"	a - Query all packages (includes installed packages and package database). \n" +
"	x - List packages which are not installed but in package database. \n" +
"	i - List all packages which are currently installed. \n" +
"	I - List packages which are about to be installed during synchronization. \n" +
"	u - List packages which are about to be upgraded during synchronization. \n" +
"	d - List packages which are about to be downgraded during synchronization. \n" +
"	r - List packages which are about to be removed during synchronization. \n" +
"	m - List all modifications which would apply during synchronization \n" +
"	    (equal to Iudr) \n" +
"	n - List packages which belong to the profile but are not modified during \n" +
"	    synchronization. \n" +
"	s - List host attributes from settings (wpkg.xml). \n" +
"	l - List host attributes read from local host. \n" +
"\n" +
"/remove:<package>[,package2[,package3,[...]]] \n" +
"	Remove the specified package(s) from the system. \n" +
"\n" +
"/show:<package> \n" +
"	Display a summary of the specified package, including it's state. \n" +
"\n" +
"/upgrade:<package>[,package2[,package3,[...]]] \n" +
"	Upgrade the already installed package(s) on the system. \n" +
"\n" +
"/synchronize \n" +
"	Synchronize the current program state with the suggested program state \n" +
"	of the specified profile. This is the action that should be called at \n" +
"	system boot time for this program to be useful. \n" +
"\n" +
"/help \n" +
"	Show this message. \n" +
"\n" +
"\n" +
"Optional parameters (usually defined within config.xml): \n" +
"======================================================== \n" +
"\n" +
"/base:<path> \n" +
"	Set the local or remote path to find the xml input files. \n" +
"	Can also be set to a web URL for direct XML retrieval from wpkg_web. \n" +
"\n" +
"/dryrun[:<true>|<false>] \n" +
"	Do not execute any actions. Implies debug mode. \n" +
"\n" +
"/quiet[:<true>|<false>] \n" +
"	Use the event log to record all error/status messages. Use this when \n" +
"	running unattended. \n" +
"\n" +
"/nonotify[:<true>|<false>] \n" +
"	Logged in users are not notified about impending updates. \n" +
"\n" +
"/noreboot[:<true>|<false>] \n" +
"	System does not reboot regardless of need. \n" +
"\n" +
"/quitonerror[:<true>|<false>] \n" +
"	Quit execution if the installation of any package was unsuccessful \n" +
"	(default: install next package and show the error summary). \n" +
"\n" +
"/sendStatus[:<true>|<false>] \n" +
"	Send status messages on STDOUT which can be parsed by calling program to \n" +
"	display status information to the user. \n" +
"\n" +
"/noUpgradeBeforeRemove[:<true>|<false>] \n" +
"	Usually WPKG upgrades a package to the latest available version before it \n" +
"	removes the package. This allows administrators to fix bugs in the package \n" +
"	and assure proper removal.\n" +
"\n" +
"/applymultiple[:<true>|<false>] \n" +
"	Apply profiles of all host nodes with matching attributes. \n" +
"	Only first matching host node is returned if not switched on. \n" +
"	This parameter must be used with caution, it can break existing setup. \n" +
"\n" +
"Rarely used parameters (mainly for testing): \n" +
"============================================ \n" +
"\n" +
"/config:<path> \n" +
"	Path to the configuration file to be used. The path might be absolute \n" +
"	or relative but including the XML file name. This parameter is entirely \n" +
"	OPTIONAL and should normally not be specified at all. \n" +
"	If not specified the configuration will be searched at: \n" +
"	<script-path>\\config.xml \n" +
"	where <script-path> is the directory from which the script is executed. \n" +
"		e.g. '\\\\server\\share\\directory\\config.xml'. \n" +
"		e.g. 'directory\\config.xml'. \n" +
"	You can use environment variables as well as the following expressions: \n" +
"	 [HOSTNAME]  Replaced by the executing hostname. \n" +
"	 [PROFILE]   Replaced by the concatenated list of profiles applied. \n" +
"\n" +
"/settings:<path> \n" +
"	Path to the settings (local WPKG database) file to be used. The path might \n" +
"	be absolute or relative but including the XML file name. This parameter is \n" +
"	entirely OPTIONAL and should normally not be specified at all. \n" +
"	If not specified the settings file will be searched at: \n" +
"	%SystemRoot%\\system32\\wpkg.xml \n" +
"		e.g. '%SystemRoot%\\system32\\wpkg-custom.xml'. \n" +
"		e.g. '\\\\server\share\directory\\[HOSTNAME].xml'. \n" +
"	If you store the settings file on a share make sure the names is unique! \n" +
"	You can use environment variables as well as the following expressions: \n" +
"	 [HOSTNAME]  Replaced by the executing hostname. \n" +
"	 [PROFILE]   Replaced by the concatenated list of profiles applied. \n" +
"\n" +
"/queryMode:<mode> \n" +
"	Allows to switch to remote mode where package verification is skipped. \n" +
"	 remote: Disable package checks and assume that packages in settings \n" +
"	         database are still correctly installed. In remote mode also the \n" +
"	         host information is read from the local settings database. \n" +
"	 local:  Default setting. Query verifies package status using all checks. \n" +
"	Note: Query mode can only be used with the query switch. \n" +
"\n" +
"/profile:<profile> \n" +
"	Force the name of the profile to use. If not specified, the profile to use \n" +
"	is looked up in hosts.xml. \n" +
"\n" +
"/debug[:<true>|<false>] or /verbose[:<true>|<false>] \n" +
"	Enable debug output. Please note that this parameter only influences \n" +
"	notification and event log output. It does not affect the logging level. \n" +
"	It is possible to get debug-level output even without using this \n" +
"	switch. \n" +
"\n" +
"/force[:<true>|<false>] \n" +
"	When used in conjunction with /synchronize WPKG will ignore the local \n" +
"	settings file (wpkg.xml) and re-build the database with installed \n" +
"	packages. \n" +
"	When used in conjunction with /remove forces removal of the specified \n" +
"	package even if not all packages which depend on the one to be removed \n" +
"	could be removed. \n" +
"\n" +
"/forceinstall[:<true>|<false>] \n" +
"	Force installation over existing packages. \n" +
"\n" +
"/host:<hostname> \n" +
"	Use the specified hostname instead of reading it from the executing host. \n" +
"\n" +
"/os:<hostos> \n" +
"	Use the specified operating system string instead of reading it from the \n" +
"	executing host. \n" +
"\n" +
"/ip:<ip-address-1,ip-address-2,...,ip-address-n> \n" +
"	Use the specified ipaddresses instead of reading it from the executing host. \n" +
"\n" +
"/domainname:<domain> \n" +
"	Name of the windows domain the computer belongs to. \n" +
"	This permit to use group membership even on a non-member workstation. \n" +
"\n" +
"/group:<group-name-1,group-name-2,...,group-name-n>\n" +
"	Name of the group the computer must belongs to instead of reading it from \n" +
"	the executing host. \n" +
"\n" +
"/ignoreCase[:<true>|<false>] \n" +
"	Disable case sensitivity of packages and profiles. Therefore you can \n" +
"	assign the package 'myapp' to a profile while only a package 'MyApp' is \n" +
"	defined within the packages. \n" +
"	Note that this change requires modification of the package/profile/host nodes \n" +
"	read from the XML files. All IDs are converted to lowercase. \n" +
"	Note: This requires converting all profile/package IDs to lowercase. \n" +
"		  Therefore you will only see lowercase entries within the log files \n" +
"		  and also within the local package database. \n" +
"\n" +
"/logAppend[:<true>|<false>] \n" +
"	Append log files instead of overwriting existing files. \n" +
"	NOTE: You can specify a log file pattern which will create a new file on \n" +
"	each run. Appending logs might cause problems with some log rotation \n" +
"	scripts as well. So use it with caution. \n" +
"\n" +
"/logfilePattern:<pattern> \n" +
"	Pattern for log file naming: \n" +
"	Recognized patterns: \n" +
"	 [HOSTNAME]  Replaced by the executing hostname. \n" +
"	 [PROFILE]   Replaced by the concatenated list of profiles applied. \n" +
"	 [YYYY]      Replaced by year (4 digits). \n" +
"	 [MM]        Replaced by month number (2 digits). \n" +
"	 [DD]        Replaced by the day of the month (2 digits). \n" +
"	 [hh]        Replaced by hour of the day (24h format, 2 digits). \n" +
"	 [mm]        Replaced by minutes (2 digits). \n" +
"	 [ss]        Replaced by seconds (2 digits). \n" +
"\n" +
"	 Examples: \n" +
"		'wpkg-[YYYY]-[MM]-[DD]-[HOSTNAME].log' \n" +
"			 results in a name like 'wpkg-2007-11-04-myhost.log' \n" +
"	NOTE: Using [PROFILE] causes all log messages before reading profiles.xml \n" +
"			to be temporarily written to local %TEMP% folder. So they might \n" +
"			appear on the final log file with some delay. \n" +
"\n" +
"/logLevel:[0-31] \n" +
"	Level of detail for log file: \n" +
"	use the following values: \n" +
"	Log level is defined as a bitmask. Just sum up the values of each log \n" +
"	severity you would like to include within the log file and add this value \n" +
"	to your config.xml or specify it at /logLevel:<#>. \n" +
"	Specify 0 to disable logging. \n" +
"	  1: log errors only \n" +
"	  2: log warnings \n" +
"	  4: log information \n" +
"	  8: log audit success \n" +
"	 16: log audit failure \n" +
"	Example: \n" +
"	 31 log everything (1+2+4+8+16=31) \n" +
"	 13 log errors, information and audit success (1+4+8=13) \n" +
"	  3 log errors and warnings only (1+2=3) \n" +
"	Default is 0 which will suppress all messages printed before log level is \n" +
"	properly initialized by config.xml or by /logLevel:<#> parameter. \n" +
"\n" +
"/log_file_path:<path> \n" +
"	Path where the log files will be stored. Also allows specifying an UNC \n" +
"	path (e.g. '\\server\share\directory'). Make sure the path exists and \n" +
"	that the executing user has write access to it. \n" +
"	NOTE: If you set this parameter within config.xml please note that you \n" +
"			need to escape backslashes: \n" +
"			e.g. '\\\\server\\share\\directory'. \n" +
"\n" +
"/noforcedremove[:<true>|<false>] \n" +
"	Do not remove packages from local package database if remove fails even \n" +
"	if the package does not exist in the package database on the server and \n" +
"	is not referenced within the profile. \n" +
"	By default packages which have been removed from the server package \n" +
"	database and the profile will be uninstalled and then removed \n" +
"	from the local package database even if uninstall failed. \n" +
"	This has been introduced to prevent a package whose uninstall script \n" +
"	fails to repeat its uninstall procedure on each execution without the \n" +
"	possibility to fix the problem since the package (including its \n" +
"	uninstall string) is available on the local machine only. \n" +
"	HINT: If you like the package to stay in the local database (including \n" +
"	uninstall-retry on next boot) just remove it from the profile but do not \n" +
"	completely delete it from the package database. \n" +
"\n" +
"/noremove[:<true>|<false>] \n" +
"	Disable the removal of all packages. If used in conjunction with the \n" +
"	/synchronize parameter it will just add packages but never remove them. \n" +
"	Instead of removing a list of packages which would have been removed \n" +
"	during that session is printed on exit. Packages are not removed from \n" +
"	the local settings database (wpkg.xml). Therefore it will contain a list \n" +
"	of all packages ever installed. \n" +
"	Note that each package which is requested to be removed (manually or by \n" +
"	a synchronization request) will be checked for its state by executing its \n" +
"	included package checks. If the package has been removed manually it will \n" +
"	also be removed from the settings database. This does not apply to packages \n" +
"	which do not specify any checks. Such packages will remain in the local \n" +
"	settings database even if the software has been removed manually. \n" +
"\n" +
"/noDownload[:<true>|<false>] \n" +
"	Ignore all download nodes in packages. \n" +
"	Useful for testing and in case your download targets already exist. \n" +
"\n" +
"/norunningstate[:<true>|<false>] \n" +
"	Do not export the running state to the registry. \n" +
"\n" +
"/rebootcmd:<option> \n" +
"	Use the specified boot command, either with full path or \n" +
"	relative to the location of wpkg.js \n" +
"	Specifying 'special' as option uses tools\psshutdown.exe \n" +
"	from www.sysinternals.com - if it exists - and a notification loop \n";

	alert(message);
}

/*******************************************************************************
 * 
 * Global variables
 * 
 ******************************************************************************/
/** base where to find the XML input files */
var wpkg_base = "";

/** forces to check for package existence but ignores wpkg.xml */
var force = false;

/** force installation */
var forceInstall = false;

/**
 * Forced remove of non-existing packages from wpkg.xml even if uninstall
 * command fails.
 */
var noForcedRemove = false;

/** defined if script should quit on error */
var quitonerror = false;

/** Debug output. */
var debug = false;

/** Dry run */
var dryrun = false;

/** notify user using net send? */
var nonotify = false;

/** timeout for user notifications. Works only if msg.exe is available */
var notificationDisplayTime = 10;

/** set to true to prevent reboot */
var noreboot = false;

/** stores if package removal should be skipped - see /noremove flag */
var noRemove = false;

/** allows disabling/enabling of running state export to registry */
var noRunningState = false;

/** type of reboot command */
var rebootCmd = "standard";

/** set to true for quiet mode */
var quietDefault = false;

/** registry path where WPKG stores its running state */
var sRegWPKG_Running = "HKLM\\Software\\WPKG\\running";

/** configuration file to hold the settings for the script */
var config_file_name = "config.xml";

/** name of package database file */
var packages_file_name = "packages.xml";
/** name of profiles database file */
var profiles_file_name = "profiles.xml";
/** name of hosts definition database file */
var hosts_file_name = "hosts.xml";

/**
 * specify if manually installed packages should be kept during synchronization
 * true: keep manually installed packages false: remove any manually installed
 * package which does not belong to the profile
 */
var keepManual = true;

/**
 * path where log-files are stored.<br>
 * Defaults to "%TEMP%" if empty.
 */
var log_file_path = "%TEMP%";

/** path where downloads are stored, defaults to %TEMP% if not defined */
var downloadDir = "%TEMP%";

/** timeout for downloads */
var downloadTimeout = 7200;

/** if set to true logfiles will be appended, otherwise they are overwritten */
var logAppend = false;

/**
 * set to true to enable sending of status messages to STDOUT, regardless of the
 * status of /debug
 */
var sendStatus = false;

/**
 * Set to true to disable upgrade-before-remove feature by default
 */
var noUpgradeBeforeRemove = false;

/**
 * use the following values: Log level is defined as a bitmask. Just add sum up
 * the values of each log severity you would like to include within the log file
 * and add this value to your config.xml or specify it at /logLevel:<num>.
 *
 * Specify 0 to disable logging.
 * 
 * <pre>
 * 1: log errors only
 * 2 : log warnings
 * 4 : log information
 * 8 : log audit success
 * </pre>
 * 
 * Example:
 * 
 * <pre>
 * 31 log everything (1+2+4+8+16=32)
 * 13 logs errors, information and audit success (1+4+8=13)
 *  3 logs errors and warnings only (1+2=3)
 * </pre>
 * 
 * Default is 0 which will suppress all messages printed before log level is
 * properly initialized by config.xml or by /logLevel:<#> parameter.
 */
var logLevelDefault = 0xFF;

/**
 * var logfile pattern Recognized patterns:
 * 
 * <pre>
 * [HOSTNAME]	replaced by the executing hostname
 * [PROFILE]	replaced by the  name
 * [YYYY]		replaced by year (4 digits)
 * [MM]			replaced by month number (2 digits)
 * [DD]			replaced by the day of the month (2 digits)
 * [HH]			replaced by hour of the day (24h format, 2 digits)
 * [mm]			replaced by minute (2 digits)
 * </pre>
 * 
 * Examples:
 * 
 * <pre>
 * wpkg-[YYYY]-[MM]-[DD]-[HOSTNAME].log
 * </pre>
 * 
 * results in a name like "wpkg-2007-11-04-myhost.log"
 */
var logfilePattern = "wpkg-[HOSTNAME].log";

/** web file name of package database if base is an http url */
var web_packages_file_name = "packages_xml_out.php";
/** web file name of profile database if base is an http url */
var web_profiles_file_name = "profiles_xml_out.php";
/** web file name of hosts database if base is an http url */
var web_hosts_file_name = "hosts_xml_out.php";

/** name of local settings file */
var settings_file_name = "wpkg.xml";

/** path to settings file, defaults to system folder if set to null */
var settings_file_path = null;

/** defines if package/profile IDs are handled case sensitively */
var caseSensitivity = true;

/** set to true to want to apply profiles of all matching host nodes */
var applyMultiple = false;

/** globally disable any downloads */
var noDownload = false;

/**
 * Allows to disable insert of host attributes to local settings DB. This is
 * handy for testing as the current test-suite compares the local wpkg.xml
 * database and the file will look different on all test machines if these
 * attribute are present. This setting might be removed if all test-cases
 * are adapted.
 */
var settingsHostInfo = true;

/**
 * Query mode. In order to "simulate" the result of a query on a system on
 * anohter (remote-) system you can set queryMode to "remote". This will
 * disable package checks because they will not return the same results on a
 * remote system.
 */
var queryMode = "local";

/**
 * XML namespaces.
 */
var namespaceSettings = "http://www.wpkg.org/settings";
var namespaceHosts = "http://www.wpkg.org/hosts";
var namespaceProfiles = "http://www.wpkg.org/profiles";
var namespacePackages = "http://www.wpkg.org/packages";
var namespaceConfig = "http://www.wpkg.org/config";

/*******************************************************************************
 * 
 * Caching variables - used by internal functions.
 * 
 ******************************************************************************/

/** file to which the log is written to */
var logfileHandler = null;

/** path to the log file (corresponds to logfileHandler) */
var logfilePath = null;

/** store whether log file was opened in append mode */
var logfileAppendMode = logAppend;

/** stores if the user was notified about start of actions */
var was_notified = false;

/**
 * holds a list of packages which have been installed during this execution this
 * is used to prevent dependency packages without checks and always execution to
 * be executed several times as well as preventing infinite- loops on recursive
 * package installation.
 */
var packagesInstalled = new Array();

/**
 * holds a list of packages which have been removed during this execution This
 * is used to prevent removing packages multiple times during a session because
 * they are referenced as dependencies by multiple other packages.
 */
var packagesRemoved = new Array();

/** host properties used within script */
var hostName = null;
var hostOs = null;
var domainName = null;
var ipAddresses = null;
var hostGroups = null;
var hostArchitecture = null;
var hostAttributes = null;

/** String representing path where the settings are stored */
var settings_file = null;

/** Flag whether settings path was processed to replace parameters */
var settings_file_processed = false;

/** declare variables for data storage */
var packages = null;
var profiles = null;
var hosts = null;
var settings = null;
var config = null;

/** List of profiles assigned directly to current host */
var applyingProfilesDirect = null;

/** profiles applying to the current host (including dependencies) */
var applyingProfilesAll = null;

/** caches the host node entries applying to the current host */
var applyingHostNodes = null;

/** Packages belonging to current host (package nodes) */
var profilePackageNodes = null;

/** stores the locale ID (LCID) which applies for the local executing user */
var LCID = null;

/** stores the locale ID (LCID) which applies for the local machine */
var LCIDOS = null;

/** caches the language node applying to the current system locale */
var languageNode = null;

/** declare log level variable */
var logLevel = null;

/** actual value for log level */
var logLevelValue = 0x03;

/** buffer to store log entries while no real log file is available */
var logBuffer = null;

/** flag which is true if log is ready to be initialize */
var logInitReady = false;

/** flag which is set to true internally during log initialization */
var logInitializing = false;

/** declare quiet mode variable */
var quiet = null;

/** current value of quiet operation flag */
var quietMode = quietDefault;

/** stores if a postponed reboot is scheduled */
var postponedReboot = false;

/** set to true when a reboot is in progress */
var rebooting = false;

/** set to true to skip write attempts to event log */
var skipEventLog = false;

/** set to true to log event log entries to STDOUT (fallback mode) */
var eventLogFallback = false;

/** holds an array of packages which were not removed due to the /noremove flag */
var skippedRemoveNodes = null;

/**
 * holds status of change: true: System has been changed (package
 * installed/removed/updated/downgraded... false: System has not been touched
 * (yet)
 */
var systemChanged = false;

/**
 * Holds a list of packages which have been manually installed.
 */
var manuallyInstalled = null;

/**
 * Marks volatile releases and "inverts" the algorithm that a longer version
 * number is newer. For example 1.0RC2 would be newer than 1.0 because it
 * appends characters to the version. Using "rc" as a volatile release marker
 * the algorithm ignores the appendix and assumes that the string which omits
 * the marker is newer.
 *
 * Resulting in 1.0 to be treated as newer than 1.0RC2.
 *
 * NOTE: The strings are compared as lower-case. So use lower-case definitions
 * only!
 */
var volatileReleaseMarkers = ["rc", "i", "m", "alpha", "beta", "pre", "prerelease"];

/** stores if system is running on a 64-bit OS */
var x64 = null;

/** Stores variables assigned to host definitions applying to current host */
var hostsVariables = null;

/** Stores variables from profiles assigned to current hsot */
var profilesVariables = null;

/***********************************************************************************************************************
 * 
 * Program execution
 * 
 **********************************************************************************************************************/

/**
 * Call the main function with arguments while catching all errors and
 * forwarding them to the error output.
 */
try {
	main();
} catch (e) {
	// Log error message.
	error("Message:      " + e.message + "\n" +
			"Description:  " + e.description + "\n" +
			"Error number: " + hex(e.number) + "\n" +
			"Stack:        " + e.stack  + "\n" +
			"Line:         " + e.lineNumber + "\n"
			);
	notifyUserFail();
	// Make sure log is initialized to write the output.
	if (logBuffer != null) {
		initializeLog();
	}
	exit(2);
}

/**
 * Main execution method. Actually runs the script
 */
function main() {
	// Do not open pop-up window while initializing.
	setQuiet(true);

	// Initialize WPKG internals.
	initialize();

	// Process command line arguments to determine course of action.
	// Get special purpose argument lists.
	var argv = getArgv();
	var argn = argv.Named;
	// var argu = argv.Unnamed;
	if (argn.Item("query") != null) {
		// Do not log to event log during query.
		var eventLogStatus = isSkipEventLog();
		setSkipEventLog(true);

		if (getQueryMode() == "remote") {
			getSettingHostAttributes();
		}
		
		// Now all parameters are set to build the final log file name
		// even if [PROFILE] is used.
		// WScript.Echo("Initializing Log");
		// WScript.Echo("Buffer: " + logBuffer);
		// Flag log file ready for initialization.
		logInitReady = true;

		// Do not log to log file during query.
		var logValue = getLogLevel();
		// setLogLevel(0);

		// Read query argument characters.
		var queryRequest = argn.Item("query").split("");
		
		// Supported arguments:
		// a Query all packages.
		// x List packages which are not installed but in package database.
		// i List all packages which are currently installed.
		// I List packages which are about to be installed during synchronization.
		// u List packages which are about to be upgraded during synchronization.
		// d List packages which are about to be downgraded during synchronization.
		// r List packages which are about to be removed during synchronization.
		// m List all modifications which would apply during synchronization (equal to Iudr)
		// n List packages which belong to the profile but are not modified during synchronization.
		// s List host attributes from settings (wpkg.xml).
		// l List host attributes read from local host.
		var listSyncInstall = false;
		var listSyncUpgrade = false;
		var listSyncDowngrade = false;
		var listSyncRemove = false;
		var listSyncUnmodified = false;
		for (var i=0; i<queryRequest.length; i++) {
			var requestCharacter = queryRequest[i];
			switch (requestCharacter) {
			case "a":
				queryAllPackages();
				break;

			case "x":
				queryUninstalledPackages();
				break;

			case "i":
				queryInstalledPackages();
				break;

			case "I":
				listSyncInstall = true;
				break;

			case "u":
				listSyncUpgrade = true;
				break;

			case "d":
				listSyncDowngrade = true;
				break;

			case "r":
				listSyncRemove = true;
				break;

			case "n":
				listSyncUnmodified = true;
				break;

			case "m":
				listSyncInstall = true;
				listSyncUpgrade = true;
				listSyncDowngrade = true;
				listSyncRemove = true;
				break;

			case "s":
				queryHostInformationFromSettings();
				break;

			case "l":
				queryHostInformation();
				break;

			default:
				break;
			}
		}
		// Print requested output.
		if (listSyncInstall || listSyncUpgrade || listSyncDowngrade || listSyncRemove || listSyncUnmodified) {
			queryProfilePackages(listSyncInstall, listSyncUpgrade, listSyncDowngrade, listSyncRemove, listSyncUnmodified);
		}

		setSkipEventLog(eventLogStatus);
		setLogLevel(logValue);
	} else {

		// set profile-based log level (if available)
		var profileLogLevel = getProfilesLogLevel();
		if (profileLogLevel != null) {
			setLogLevel(profileLogLevel);
		}

		// Now all parameters are set to build the final log file name
		// even if [PROFILE] is used.
		// WScript.Echo("Initializing Log");
		// WScript.Echo("Buffer: " + logBuffer);
		// Flag log file ready for initialization.
		logInitReady = true;

		var message;
		if(isDebug()) {
			var hst = getHostNodes();
			message = "Hosts file contains " + hst.length + " hosts:";
			for (var iHost = 0; iHost < hst.length; iHost++ ) {
				message += "\n'" + getHostNodeDescription(hst[iHost]) + "'";
			}
			dinfo(message);

			var settingsPkg = getSettingNodes();
			message = "Settings file contains " + settingsPkg.length + " packages:";
			for (var iSettings = 0; iSettings < settingsPkg.length; iSettings++) {
				if (settingsPkg[iSettings] != null) {
					 message += "\n'" + getPackageID(settingsPkg[iSettings]) + "'";
				}
			}
			dinfo(message);

			var packageNodes = getPackageNodes();
			message = "Packages file contains " + packageNodes.length + " packages:";
			for (var iPackage = 0; iPackage < packageNodes.length; iPackage++) {
				if (packageNodes[iPackage] != null) {
					 message += "\n'" + getPackageID(packageNodes[iPackage]) + "'";
				}
			}
			dinfo(message);

			var profileNodes = getProfileNodes();
			message = "Profile file contains " + profileNodes.length + " profiles:";
			for (var iProfile = 0; iProfile < profileNodes.length; iProfile++) {
				if (profileNodes[iProfile] != null) {
					 message += "\n'" + getProfileID(profileNodes[iProfile]) + "'";
				}
			}
			dinfo(message);

			// Get list of profiles directly assigned to host.
			var profiles = getProfileList();
			message = "Using profile(s): ";
			for (var i=0; i < profiles.length; i++) {
				message += "\n'" + profiles[i] + "'";
			}
			dinfo(message);
		}

		// Check if all referenced profiles are available.
		var profileList = getProfileList();
		var error = false;
		message = "Could not locate referenced profile(s):\n";
		for (var iProf = 0; iProf < profileList.length; iProf++) {
			var currentProfile = getProfileNode(profileList[iProf]);
			if (currentProfile == null) {
				error = true;
				message += profileList[iProf] + "\n";
			}
		}
		if (error) {
			throw new Error(message);
		}
		
		if (argn.Item("show") != null) {
			var requestedPackageName = argn.Item("show");
			// if case sensitive mode is disabled convert package name to lower case
			if (!isCaseSensitive()) {
				requestedPackageName = requestedPackageName.toLowerCase();
			}
			var message = queryPackage(getPackageNodeFromAnywhere(requestedPackageName), null);
			info(message);
		} else if (argn.Item("install") != null) {
			var packageList = argn.Item("install").split(",");
			for (var iPackage=0; iPackage < packageList.length; iPackage++) {
				installPackageName(packageList[iPackage], true);
			}
		} else if (argn.Item("remove") != null) {
			var packageList = argn.Item("remove").split(",");
			for (var iPackage=0; iPackage < packageList.length; iPackage++) {
				removePackageName(packageList[iPackage]);
			}
		} else if (argn.Item("upgrade") != null) {
			var packageList = argn.Item("upgrade").split(",");
			for (var iPackage=0; iPackage < packageList.length; iPackage++) {
				installPackageName(packageList[iPackage], false);
			}
		} else if (isArgSet(argv, "/synchronize")) {
			synchronizeProfile();
		} else {
			showUsage();
			throw new Error("No action specified.");
		}
	}
	exit(0);
}


/**
 * Adds a sub-node for the given XML node entry.
 * 
 * @param XMLNode
 *            the XML node to add to (e.g. packages or settings)
 * @param subNode
 *            the node to be added to the XMLNode (for example a package node)
 *            NOTE: The node will be cloned before add
 * @return Returns true in case of success, returns false if no node could be
 *         added
 */
function addNode(XMLNode, subNode) {
	var returnvalue = false;
	var result = XMLNode.appendChild(subNode.cloneNode(true));
	if(result != null) {
		returnvalue = true;
	}
	return returnvalue;
}


/**
 * Adds a package node to the settings XML node. In case a package with the same
 * ID already exists it will be replaced.
 * 
 * @param packageNode
 *            the package XML node to add.
 * @param saveImmediately
 *            Set to true in order to save settings immediately after adding.
 *            Settings will not be saved immediately if value is false.
 * @return true in case of success, otherwise returns false
 */
function addSettingsNode(packageNode, saveImmediately) {
	// first remove entry if one already exists

	// get current settings node
	var packageID = getPackageID(packageNode);
	var settingsNode = getSettingNode(packageID);

	if (settingsNode != null) {
		dinfo("Removing currently existing settings node first: '" +
				getPackageName(settingsNode) + "' (" + getPackageID(settingsNode) +
				"), Revision " + getPackageRevision(settingsNode) + ".");
		removeSettingsNode(settingsNode, false);
	}

	dinfo("Adding settings node: '" +
			 getPackageName(packageNode) + "' (" + getPackageID(packageNode) +
			 "), Revision " + getPackageRevision(packageNode) + ".");

	var success = addNode(getSettings(), packageNode);
	// save settings if remove was successful
	if (success && saveImmediately) {
		saveSettings(true);
	}
	return success;
}

/**
 * Adds a package node to the list of skipped packages during removal process.
 * 
 * @param packageNode
 *            the node which has been skipped during removal
 */
function addSkippedRemoveNodes(packageNode) {
	var skippedNodes = getSkippedRemoveNodes();
	skippedNodes.push(packageNode);
}

/**
 * Appends dependent profile nodes of the specified profile to the specified
 * array. Recurses into self to get an entire dependency tree.
 */
function appendProfileDependencies(profileArray, profileNode) {
	var profileNodes = getProfileDependencies(profileNode);

	// add nodes if they are not yet part of the array
	for (var i=0; i < profileNodes.length; i++) {
		var currentNode = profileNodes[i];
		if(!searchArray(profileArray, currentNode)) {
			dinfo("Adding profile dependencies of profile '" +
					getProfileID(profileNode) + "': '" +
					getProfileID(currentNode) + "'");
			profileArray.push(currentNode);

			// add dependencies of these profiles as well
			appendProfileDependencies(profileArray, currentNode);
		} else {
			dinfo("Profile '" +
					getProfileID(currentNode) + "' " +
					"already exists in profile dependency tree. Skipping.");
		}
	}
}

/**
 * Evaluates all checks in the check nodes array and returns its result.
 * @param checkNodes Array of XML <check /> nodes to be evaluated.
 * @returns {Boolean} true if all checks are true. False if at least one failed.
 */
function checkAll(checkNodes) {
	if (checkNodes == null) {
		return true;
	}

	// Initialize return value.
	var result = true;

	// Save environment.
	var previousEnv = getEnv();
	
	// Loop over every condition check.
	// If all are successful, we consider package as installed.
	for (var i = 0; i < checkNodes.length; i++) {
		try {
			if (!checkCondition(checkNodes[i])) {
				result = false;
				break;
			}
		} catch (err) {
			message = "Error evaluating check: " + err.description;
			if (isQuitOnError()) {
				throw new Error(message);
			} else {
				error(message);
				result = false;
				break;
			}
		} finally {
			// Restore environment.
			loadEnv(previousEnv);
		}
	}
	return result;
}

/**
 * Checks for the success of a check condition for a package.
 * 
 * @param checkNode
 *            XML check node to be evaluated
 * @throws Error
 *             Throws error in case of invalid XML node definition
 */
function checkCondition(checkNode) {
	var shell = new ActiveXObject("WScript.Shell");

	// get attributes of check
	var checkType = checkNode.getAttribute("type");
	var checkCond = checkNode.getAttribute("condition");
	var checkPath = checkNode.getAttribute("path");
	var checkValue = checkNode.getAttribute("value");

	// In remote mode try to verify the check using cached check results in
	// settings database.
	if (getQueryMode() == "remote") {
		// Logical checks shall be evaluated as usual.
		// Only look for previous check results for other types of checks.
		if (checkType != "logical") {
			var result = getSettingsCheckResult(checkNode);
			if (result == null) {
				error("Result of check of type '" + checkType + "' with condition '" +
						checkCond + "', path '" + checkPath + "' and value '" +
						checkValue + "' is missing in settings database. " +
						"Trying to evaluate locally. Results might be inaccurate");
			} else {
				return result;
			}
		}
	}
	
	// Sanity check: must have Type set here.
	if (checkType == null) {
		throw new Error("Check Type is null - this is not permitted. Perhaps a typo? " +
						"To help find it, here are the other pieces of information: " +
						"condition='" + checkCond + "', path='" + checkPath +
						"', value='" + checkValue + "'.");
	}

	// Initialize return value;
	var returnValue = false;
	
	// get expanded values for path and value used by some checks
	var checkPathExpanded = null;
	if (checkPath != null) {
		checkPathExpanded = shell.ExpandEnvironmentStrings(checkPath);
	}
	var checkValueExpanded = null;
	if (checkValue != null) {
		checkValueExpanded = shell.ExpandEnvironmentStrings(checkValue);
	}

	switch(checkType) {
	// check type: registry
	case "registry":
		// Sanity check: must have Cond and Path set for all registry checks.
		if ((checkCond == null) || (checkPath == null)) {
			throw new Error("Condition and / or path is null for a registry check. Perhaps " +
							"a typo? To help find it, here are the other pieces of information: " +
							"condition='" + checkCond + "', path='" + checkPath +
							"', value='" + checkValue + "'.");
		}

		// branch on check condition
		switch (checkCond) {
		case "exists":
			if (getRegistryValue(checkPath) != null) {
				// Some debugging information.
				dinfo("The registry path '" + checkPath + "' exists: the check was successful.");
				returnValue = true;
			} else if (getRegistryValue(checkPathExpanded) != null) {
				dinfo("The expanded registry path '" + checkPathExpanded + "' exists: the check was successful.");
				returnValue = true;
			} else {
				// path does not exist
				dinfo("Neither the registry path '" + checkPath + "' nor its expanded value of '" +
						checkPathExpanded + "' exist: the check failed.");
				returnValue = false;
			}
			break;

		case "equals":
			// read registry value and convert it to string in order to compare
			// to supplied
			// string within the 'value' attribute
			var readValue = getRegistryValue(checkPath);

			// check if value is eventually null (non-existing)
			if (readValue == null) {
				// the path might have to be expanded
				readValue = getRegistryValue(checkPathExpanded);
				if (readValue == null) {
					dinfo("The registry path '" + checkPath + "' did not exist. Check failed.");
					returnValue = false;
					break;
				}
				dinfo("The expanded registry path '" + checkPathExpanded + "' could be read.");
			} else {
				dinfo("The registry path '" + checkPath+ "' could be read.");
			}

			// try treating the value as array
			var registyValue = "";
			try {
				var readArray = readValue.toArray();
				dinfo("The registry value received is an array, concatenating values for comparison.");
				for (var iRegKey=0; iRegKey<readArray.length; iRegKey++) {
					registyValue = registyValue + readArray[iRegKey] + "";
					if ( (iRegKey+1) < readArray.length) {
						registyValue += "\n";
					}
				}
			} catch(notAnArray) {
				dinfo("The registry value received is a scalar value.");
				registyValue = readValue + "";
			}

			if (registyValue == checkValue) {
				// Some debugging information.
				dinfo("The registry path '" + checkPath + "' contained the correct value: '" +
						checkValue + "'. The check was successful.");
				returnValue = true;
			} else {
				// Try if expanded value matches (case-insensitive).
				if (registyValue.toLowerCase() == checkValueExpanded.toLowerCase()) {
					dinfo("The registry path '" + checkPath + "' contained the expanded value: '" +
							checkValueExpanded + "'. The check was successful.");
					returnValue = true;
				} else {
					dinfo("The registry path '" + checkPath + "' did not contain the value: '" +
							 checkValue + "'. Instead it contained '" + registyValue + "'. the check failed.");
					returnValue = false;
				}
			}
			break;

		default:
			throw new Error("Check condition " + checkCond + " unknown " +
							"for type registry.");
			break;
		}
		
		// The result of Registry checks shall be stored in local settings node.
		addSettingsCheckResult(checkNode, returnValue);
		
		break;

	// check type: file
	case "file":
		// Sanity check: must have Cond and Path set for all file checks.
		if ((checkCond == null) ||
			(checkPath == null)) {
			throw new Error("Condition and / or path is null for a file check. Perhaps " +
							"a typo? To help find it, here are the other pieces of information: " +
							"condition='" + checkCond + "', path='" + checkPath +
							"', value='" + checkValue + "'");
		}

		// expand environment variables
		// use only expanded value here
		checkPath = checkPathExpanded;

		if (checkCond == "exists") {
			var fso = new ActiveXObject("Scripting.FileSystemObject");
			if (fso.FileExists(checkPath)) {
				// Some debugging information.
				dinfo("The path '" + checkPath + "' exists and is a file: the test was successful.");
				returnValue = true;
			} else if (fso.FolderExists(checkPath)) {
				// Some debugging information.
				dinfo("The path '" + checkPath + "' exists and is a folder: the test was successful.");
				returnValue = true;
			} else {
				// Some debugging information.
				dinfo("The path '" + checkPath + "' does not exist: the test failed.");
				returnValue = false;
			}

		} else if (checkCond == "sizeequals") {
			// sanity check: must have Value set for a size check.
			if (checkValue == null) {
				throw new Error("Value is null for a file sizeequals check. Perhaps " +
								"a typo? To help find it, here are the other pieces of information: " +
								"condition='" + checkCond +
								"', path='" + checkPath +
								"', value='" + checkValue + "'.");
			}

			var filesize = getFileSize(checkPath);
			if (filesize == checkValueExpanded) {
				dinfo("The file '" + checkPath + "' has size " + filesize + ": the test was successful.");
				returnValue = true;
			} else {
				dinfo("The file '" + checkPath + "' has size " + filesize + " - wanted " +
						checkValueExpanded + ": the test fails.");
				returnValue = false;
			}
		} else if (checkCond.substring(0,7) == "version") {
			// Sanity check: Must have a value set for version check.
			if (checkValue == null) {
				throw new Error("Value is null for a file version check. Perhaps " +
								"a type? To help find it, here are the other pieces of information: " +
								"condition='" + checkCond + "', path='" + checkPath +
								"', value='" + checkValue + "'.");
			} // if checkValue == null

			var fileVersion = getFileVersion(checkPath);

			if (fileVersion == null || fileVersion == "") {
				 // no file version could be obtained
				 dinfo("Unable to find the file version for '" + checkPath + "'.");
				 returnValue = false;
			} else {

				var fileVersionCompare = versionCompare(fileVersion, checkValueExpanded);
				dinfo ("Checking file version " + fileVersion + " is " + checkCond +
						 " (than) " + checkValueExpanded + " - got result " + fileVersionCompare + ".");
	
				var fileVersionCompResult = false;
				switch (checkCond) {
					case "versionsmallerthan":
						if (fileVersionCompare < 0) {
							fileVersionCompResult = true;
						}
						break;
					case "versionlessorequal":
						if (fileVersionCompare <= 0) {
							fileVersionCompResult = true;
						}
						break;
					case "versionequalto":
						if (fileVersionCompare == 0) {
							fileVersionCompResult = true;
						}
						break;
					case "versiongreaterorequal":
						if (fileVersionCompare >= 0) {
							fileVersionCompResult = true;
						}
						break;
					case "versiongreaterthan":
						if (fileVersionCompare > 0) {
							fileVersionCompResult = true;
						}
						break;
					default:
						error("Unknown operation on file versions : " + checkCond);
						fileVersionCompResult = false;
						break;
				}
	
				dinfo("File version check for file '" + checkPath + "' returned " +
					fileVersionCompResult + " for operation type " + checkCond + ".");
				returnValue = fileVersionCompResult;
			}

		} else if (checkCond.substring(0,4) == "date") {
			var fileDate = null;
			var comparisonDesc = "";
			var dateType = checkCond.substring(4,10);
			// Evaluate if modification date shall be checked.
			if (dateType == "modify") {
				dinfo("Checking file modification date.");
				// Evaluate file modification date.
				fileDate = getFileDateModification(checkPath);
				comparisonDesc = "Modification";
			} else if (dateType == "create") {
				dinfo("Checking file creation date.");
				// Evaluate file creation date.
				fileDate = getFileDateCreation(checkPath);
				comparisonDesc = "Creation";
			} else if (dateType == "access") {
				dinfo("Checking file access date.");
				// Evaluate file access date.
				fileDate = getFileDateLastAccess(checkPath);
				comparisonDesc = "Access";
			} else {
				throw new Error ("Invalid file date comparison type: " + checkCond + ".");
			}

			// If file date could not be read: Comparison failed.
			if (fileDate == null) {
				dinfo("File modification date could not be read, check failed.");
				returnValue = false;
				break;
			}
			// Make sure file date is in Date() format.
			fileDate = new Date(fileDate);
			
			// Parse comparison date.
			var firstChar = checkValueExpanded.substring(0,1);
			var comparisonDate = null;
			var comparisonType = "string";
			if (firstChar == "+" || firstChar == "-") {
				// Relative date. Create time offset in minutes.
				dinfo("Reading relative comparison date: " + checkValueExpanded + " minutes.");
				var timeOffset = parseInt(checkValueExpanded) * 1000 * 60;
				var now = new Date();
				comparisonDate = new Date(now.getTime() + timeOffset);
			} else if (firstChar == "@" ) {
				// Remember type of comparison.
				comparisonType = "file";
				// Evaluate date of reference file.
				var filePath = checkValueExpanded.substring(1);
				if (dateType == "modify") {
					dinfo("Reading file modification date of reference file '" + filePath + "'.");
					// Evaluate file modification date.
					comparisonDate = getFileDateModification(filePath);
				} else if (dateType == "create") {
					dinfo("Reading file creation date of reference file '" + filePath + "'.");
					// Evaluate file creation date.
					comparisonDate = getFileDateCreation(filePath);
				} else if (dateType == "access") {
					dinfo("Reading file access date of reference file '" + filePath + "'.");
					// Evaluate file access date.
					comparisonDate = getFileDateLastAccess(filePath);
				}
				// If comparison date could not be read then comparison failed.
				if (comparisonDate == null) {
					dinfo("File comparison date could not be read, check failed.");
					returnValue = false;
					break;
				}
				// Make sure comparison date is in Date() format.
				comparisonDate = new Date(comparisonDate);

			} else {
				dinfo("Reading comparison date: " + checkValueExpanded + ".");
				switch (checkValueExpanded) {
				case "yesterday":
					// Relative date. Create time offset of one day.
					var timeOffset = -1000 * 60 * 60 * 24;
					var now = new Date();
					comparisonDate = new Date(now.getTime() + timeOffset);
					break;

				case "last-week":
					// Relative date. Create time offset of one week ago.
					var timeOffset = -1000 * 60 * 60 * 24 * 7;
					var now = new Date();
					comparisonDate = new Date(now.getTime() + timeOffset);
					break;

				case "last-month":
					// Relative date. Create time offset of one month ago.
					var timeOffset = -1000 * 60 * 60 * 24 * 30;
					var now = new Date();
					comparisonDate = new Date(now.getTime() + timeOffset);
					break;

				case "last-year":
					// Relative date. Create time offset of one year ago.
					var timeOffset = -1000 * 60 * 60 * 24 * 365;
					var now = new Date();
					comparisonDate = new Date(now.getTime() + timeOffset);
					break;

				default:
					// Date is supposed to be in ISO format.
					comparisonDate = parseISODate(checkValueExpanded, false);
					break;
				}
			}
			// Check whether comparison date has been evaluated properly.
			if (comparisonDate == null) {
				throw new Error ("Unable to evaluate date from value '" + checkValueExpanded + "'.");
			}

			var success = false;

			// Get file date of file specified in path.
			var comparison = checkCond.substring(10);

			var comparisonCond = "";
			switch (comparison) {
			case "olderthan":
				comparisonCond = "older than";
				if (fileDate.getTime() < comparisonDate.getTime()) {
					success =  true;
				} else {
					success = false;
				}
				break;

			case "equalto":
				var fileDateCompare = new Date(fileDate);
				// Reduce accuracy to milliseconds for equal comparison when comparing to user string.
				if (comparisonType != "file") {
					fileDateCompare.setMilliseconds(0);
					comparisonDate.setMilliseconds(0);
				}
				comparisonCond = "equal to";
				if (fileDateCompare.getTime() == comparisonDate.getTime()) {
					success =  true;
				} else {
					success = false;
				}
				break;

			case "newerthan":
				comparisonCond = "newer than";
				if (fileDate.getTime() > comparisonDate.getTime()) {
					success =  true;
				} else {
					success = false;
				}
				break;
				
			default:
				throw new Error ("Invalid file date comparison parameter: '" + checkCond + "'.");
				break;
			}

			if (success) {
				dinfo(comparisonDesc + " date of file '" + checkPath + "' is " + fileDate +
						" which is " + comparisonCond + " the comparison date " +
						comparisonDate + " check succeeded.");
			} else {
				dinfo(comparisonDesc + " date of file '" + checkPath + "' is " + fileDate +
						" which isn't " + comparisonCond + " the comparison date " +
						comparisonDate + " check failed.");
			}
			returnValue = success;
		} else {
			throw new Error("Check condition " + checkCond + " unknown for " +
							"type file.");
		}

		// The result of Registry checks shall be stored in local settings node.
		addSettingsCheckResult(checkNode, returnValue);
		
		break;

	// check type: uninstall
	case "uninstall":
		// Sanity check: must have Cond and Path set for all uninstall checks.
		if ((checkCond == null) ||
			(checkPath == null)) {
			throw new Error("Condition and / or path is null for an uninstall check. Perhaps " +
							"a typo? To help find it, here are the other pieces of information: " +
							"condition='" + checkCond +
							"', path='" + checkPath + "'.");
		}
		var uninstallLocations = scanUninstallKeys(checkPath);
		// If expanded path is different to path read these keys too.
		if (checkPath != checkPathExpanded) {
			var uninstallLocationsExpanded = scanUninstallKeys(checkPathExpanded);
			for (var i=0; i < uninstallLocationsExpanded.length; i++) {
				uninstallLocations.push(uninstallLocationsExpanded[i]);
			}
		}

		if (checkCond == "exists") {
			if (uninstallLocations.length > 0) {
				dinfo("Uninstall entry for " + checkPath + " was found: test successful.");
				returnValue = true;
			} else {
				dinfo("Uninstall entry for " + checkPath + " missing: test failed.");
				returnValue = false;
			}
		} else if (checkCond.substring(0,7) == "version") {
			// check versions of all installed instances
			// for version checks we need a value
			if (checkValue == null) {
				throw new Error ("Uninstall entry version check has been specified but no" +
						"'value' is defined. Please add a 'value=<version>' attribute.");
			}

			if (uninstallLocations.length <= 0) {
				dinfo("No uninstall entry for '" + checkPath + "' found. " +
						"Version comparison check failed.");
				returnValue = false;
			} else {
	
				var uninstallCheckResult = true;
				for (var iUninstKey=0; iUninstKey < uninstallLocations.length; iUninstKey++) {
					var uninstallValue = getRegistryValue(uninstallLocations[iUninstKey] + "\\DisplayVersion");
	
					dinfo("Found version of '" + checkPath + "' at " + uninstallLocations[iUninstKey] +
						": " + uninstallValue + "\n" + "Comparing to expected version: " + checkValue + ".");
	
					// check if valid version value was returned
					if (uninstallValue == null || uninstallValue == "") {
						error("Check condition '" + checkCond + "' cannot be executed" +
							" since no version information is available for '" + checkPath + "'" +
							" at " + uninstallLocations[iUninstKey] + ".");
						uninstallCheckResult = false;
						break;
					} else {
	
						var uninstallVersionCompare = versionCompare(uninstallValue, checkValueExpanded);
						dinfo ("Comparing uninstall version '" + uninstallValue + "' to expected version '" +
								checkValueExpanded + "' using condition '" + checkCond  + "' returned " + uninstallVersionCompare + ".");
		
						var uninstallVersionCompResult = false;
						switch (checkCond) {
							case "versionsmallerthan":
								if (uninstallVersionCompare < 0) {
									uninstallVersionCompResult = true;
								}
								break;
							case "versionlessorequal":
								if (uninstallVersionCompare <= 0) {
									uninstallVersionCompResult = true;
								}
								break;
							 case "versionequalto":
								if (uninstallVersionCompare == 0) {
									uninstallVersionCompResult = true;
								}
								break;
							case "versiongreaterorequal":
								if (uninstallVersionCompare >= 0) {
									uninstallVersionCompResult = true;
								}
								break;
							 case "versiongreaterthan":
								if (uninstallVersionCompare > 0) {
									uninstallVersionCompResult = true;
								}
								break;
							default:
								error("Unknown operation on uninstall version check: " + checkCond + ".");
								uninstallVersionCompResult = false;
								break;
						}
		
						dinfo("Uninstall version check for package '" + checkPath + "' returned " +
							uninstallVersionCompResult + " for operation type " + checkCond + ".");
		
						// in case the current entry does not match the condition,
						// immediately return
						// else the next uninstall entry might be checked
						if (uninstallVersionCompResult == false) {
							uninstallCheckResult = false;
							break;
						}
					}
				}
				// If all checks succeeded, set return value to true.
				if (uninstallCheckResult) {
					returnValue = true;
				}
			}
		} else {
			throw new Error("Check condition " + checkCond + " unknown for " +
							"type uninstall.");
		}

		// The result of Registry checks shall be stored in local settings node.
		addSettingsCheckResult(checkNode, returnValue);
		
		break;

	// check type: execution
	case "execute":
		// check if path to script is given
		if (checkPath == null) {
			throw new Error("No path is specified for execute check!");
		}
		if (checkCond == null) {
			dinfo("No execute condition specified, assuming 'exitcodeequalto'.");
			checkCond = "exitcodeequalto";
		}
		if (checkValueExpanded == null || checkValueExpanded == "") {
			dinfo("No execute value specified, assuming '0'.");
			checkValueExpanded = 0;
		} else {
			checkValueExpanded = parseInt(checkValueExpanded);
			if(isNaN(checkValueExpanded) == true) {
				checkValueExpanded = 0;
			}
		}

		// use expanded path only
		checkPath = checkPathExpanded;
		// execute and catch return code
		var exitCode = exec(checkPath, 3600, null);

		var executeResult = false;
		switch (checkCond) {
			case "exitcodesmallerthan":
				if (exitCode < checkValueExpanded) {
					executeResult = true;
				}
				break;
			case "exitcodelessorequal":
				if (exitCode <= checkValueExpanded) {
					executeResult = true;
				}
				break;
			 case "exitcodeequalto":
				if (exitCode == checkValueExpanded) {
					executeResult = true;
				}
				break;
			case "exitcodegreaterorequal":
				if (exitCode >= checkValueExpanded) {
					executeResult = true;
				}
				break;
			 case "exitcodegreaterthan":
				if (exitCode > checkValueExpanded) {
					executeResult = true;
				}
				break;
			default:
				dinfo("Invalid execute condition specified '" + checkCond
					+ "', check failed.");
				executeResult = false;
				break;
		}

		dinfo("Execute check for program '" + checkPath + "' returned '" +
				exitCode + "'. Evaluating condition '" + checkCond +
				"' revealed " + executeResult + " when comparing to expected" +
				" value of '" + checkValueExpanded + "'.");
		returnValue = executeResult;
		break;

	// check type: logical
	case "logical":

		// check if logical condition is set
		if (checkCond == null) {
			throw new Error("Condition is null for a logical check.");
		}

		var subcheckNodes = getChecks(checkNode);

		switch (checkCond) {
		case "not":
			var checkResult = false;
			for (var iNotNodes=0; iNotNodes < subcheckNodes.length; iNotNodes++) {
				// check if one of the subchecks return false
				if (!checkCondition(subcheckNodes[iNotNodes])) {
					checkResult = true;
					break;
				}
			}
			if (checkResult) {
				dinfo("Result of logical 'NOT' check is true.");
			} else {
				dinfo("Result of logical 'NOT' check is false.");
			}
			returnValue = checkResult;
			break;

		case "and":
			var checkResult = true;
			for (var iAndNodes = 0; iAndNodes < subcheckNodes.length; iAndNodes++) {
				// check if one of the subchecks return false
				if (!checkCondition(subcheckNodes[iAndNodes])) {
					checkResult = false;
					break;
				}
			}
			if (checkResult) {
				dinfo("Result of logical 'AND' check is true.");
			} else {
				dinfo("Result of logical 'AND' check is false.");
			}
			returnValue = checkResult;
			break;

		case "or":
			// check if one of the sub-checks returns true
			var checkResult = false;
			for (var iOrNodes = 0; iOrNodes < subcheckNodes.length; iOrNodes++) {
				if (checkCondition(subcheckNodes[iOrNodes])) {
					checkResult = true;
					break;
				}
			}
			if (checkResult) {
				dinfo("Result of logical 'OR' check is true.");
			} else {
				dinfo("Result of logical 'OR' check is false");
			}
			returnValue = checkResult;
			break;

		case "atleast":
			if (checkValue == null) {
				throw new Error("Check condition logical 'atleast' requires a value.");
			}

			// count number of checks which return true
			var numAtLeastNodes=0;
			var checkResult = false;
			for (var iAtLeastNodes = 0; iAtLeastNodes < subcheckNodes.length; iAtLeastNodes++) {
				if (checkCondition(subcheckNodes[iAtLeastNodes])) {
					numAtLeastNodes++;
				}
				// check if at least x checks revealed true
				if (numAtLeastNodes >= checkValue) {
					checkResult = true;
					break;
				}
			}
			if (checkResult) {
				dinfo("Result of logical 'AT LEAST' check is true.");
			} else {
				dinfo("Result of logical 'AT LEAST' check is false.");
			}
			returnValue = checkResult;
			break;

		case "atmost":
			// check if maximum x checks return true
			var checkResult = true;
			var numAtMostNodes = 0;
			for (var iAtMostNodes = 0; iAtMostNodes < subcheckNodes.length; iAtMostNodes++) {
				if (checkCondition(subcheckNodes[iAtMostNodes])) {
					numAtMostNodes++;
				}
				if (numAtMostNodes > checkValue) {
					checkResult = false;
					break;
				}
			}
			if (checkResult) {
				dinfo("Result of logical 'AT MOST' check is true.");
			} else {
				dinfo("Result of logical 'AT MOST' check is false.");
			}
			returnValue = checkResult;
			break;

		default:
			throw new Error("Check condition " + checkCond + " unknown for " +
			"type logical.");
			break;
		}
		
		// Logical checks shall not be added to local settings node.
		break;

	// Check type: host
	case "host":
		// check if logical condition is set
		if (checkCond == null) {
			throw new Error("Condition is null for a host check.");
		}
		if (checkValueExpanded == null) {
			throw new Error("Value is null for a host check.");
		}

		// Verify if the host check matches current host.
		returnValue = checkHostAttribute(checkCond, checkValueExpanded);

		// The result of Registry checks shall be stored in local settings node.
		addSettingsCheckResult(checkNode, returnValue);

		break;

	// no such check type
	default:
		throw new Error("Check condition type " + checkType + " unknown.");
		break;
	}

	return returnValue;
}

/**
 * Checks whether the specified host attribute matches the expression passed as
 * argument.
 * 
 * @param attributeName
 *              Name of host attribute to match. See getHostInformation()
 *              function for valid host attributes.
 * @param expression
 *              Regular expression (or list for certain attributes) to use for
 *              matching.
 * @returns {Boolean} True if attribute matches the expression.
 */
function checkHostAttribute(attributeName, expression) {
	// Terminate if attribute name is not specified.
	if (attributeName == null) {
		error("Host attribute matching failed. No attribute name specified.");
		return false;
	}
	var hostAttribute = attributeName;

	// Terminate if expression is not specified.
	if (expression == null) {
		error("Host attribute matching for attribute '" + hostAttribute + "' failed. No expression specified.");
		return false;
	}
	// Expand environment variables in expressions.
	var checkExpression = new ActiveXObject("WScript.Shell").ExpandEnvironmentStrings(expression);

	// Initialize return value.
	var returnValue = false;

	// Fetch current host attributes.
	var globalHostInformation = getHostInformation();

	// Add "environment" key since we want to support environment matching too.
	var hostInformation = new ActiveXObject("Scripting.Dictionary");
	var keys = globalHostInformation.keys().toArray();
	for (var i=0; i<keys.length; i++) {
		hostInformation.Add(keys[i], globalHostInformation.Item(keys[i]));
	}
	hostInformation.Add("environment", "");

	// First verify if the requested host information attribute exists.
	var hostInfoValue = hostInformation.Item(hostAttribute);
	if (hostInfoValue == null || (typeof(hostInfoValue) == "object" && hostInfoValue.length <= 0) ) {
		dinfo("Host match requires attribute '" + hostAttribute + "' "
				+ "which is not defined for current host. No match found."); 
		return false;
	}
	
	var attrMatchExpression = new RegExp(checkExpression, "i");
	// First try to match array objects.
	if (typeof(hostInfoValue) == "object" && hostInfoValue.length > 0) {
		for (var iHostInfo=0; iHostInfo < hostInfoValue.length; iHostInfo++) {
			// Get value from attribute array
			var hostInfoElement = hostInfoValue[iHostInfo];
			dinfo("Comparing multi-valued attribute '" + hostAttribute + "' with value '" +
					hostInfoElement + "' using expression '" + checkExpression + "'.");

			// Compare attribute array element with expected
			// value.
			if (attrMatchExpression.test(hostInfoElement) == true) {
				dinfo("Match for attribute '" + hostAttribute + "' with value '" + hostInfoElement + "' found.");
				returnValue = true;
				break;
			}
		}
	// } else if (typeof(host[hostNodeAttrName]) != "object") {
	} else {
		// Match simple attributes.
		switch (hostAttribute) {
			case "environment":
				// Match environment condition to actual environment variable.

				// Get condition value from from parameter, could be multiple, separated by '|'.
				var environmentConditions = checkExpression.split('|');
				returnValue = true;
				for (var iEnv=0; iEnv < environmentConditions.length; iEnv++) {
					var environmentCondition = environmentConditions[iEnv];
					// Split environment conditions into key and value pairs.
					var envConditionSplit = environmentCondition.split("=");
					// Need at least the key and value. If there are less components, then skip it.
					if (envConditionSplit.length >= 2) {
						// The first value is the key.
						var envKey = envConditionSplit[0];
						if (envKey == "") {
							dinfo("Invalid empty environment variable name.");
							returnValue = false;
							break;
						}

						// Fetch environment value.
						var expandString = "%" + envKey + "%";
						var envValueRead = new ActiveXObject("WScript.Shell").ExpandEnvironmentStrings(expandString);
						
						if (envValueRead == expandString) {
							// Environment variable is not defined, match failed.
							dinfo("Required environment not matched. Environment variable '" + envKey + "' not defined.");
							returnValue = false;
							break;
						}

						// All following values are belonging to the value.
						/*
						var valueParts = new Array();
						for (var iValues=1; iValues < envConditionSplit.length; iValues++) {
							valueParts.push(envConditionSplit[iValues]);
						}
						// Join values to re-assemble the value specified.
						var envValue = valueParts.join("");
						*/

						// Re-assemble value.
						var valueStartOffset = envKey.length + 1;
						var envValue = environmentCondition.substr(valueStartOffset);

						// Check environment using regular expression match.
						var envMatchExpression = new RegExp(envValue, "i");
						if (envMatchExpression.test(envValueRead) == true) {
							dinfo("Required environment matched. Environment variable '" + envKey +
									"' with value '" + envValueRead + "' matches '" + envValue + "'.");
							// Check next value. All of them need to be true.
							continue;
						} else {
							dinfo("Required environment dit not match. Environment variable '" + envKey +
									"' with value '" + envValueRead + "' does not match '" + envValue + "'.");
							returnValue = false;
							break;
						}
					} else {
						error("Invalid environment match expression '" + environmentCondition + "'. Match skipped.");
					}
				}
				break;

			case "lcid":
				// Check whether any LCID matches the current host executing user LCID.
				var attributeLCIDs = checkExpression.split(",");
				for (var iLCID=0; iLCID < attributeLCIDs.length; iLCID++) {
					// check if it corresponds to the system LCID
					var currentLcid = trimLeadingZeroes(trim(attributeLCIDs[iLCID]));
					if (currentLcid == hostInfoValue) {
						dinfo("Required LCID match found. LCID '" + currentLcid + "' matches current user LCID.");
						returnValue = true;
						break;
					}
				}
				if (!returnValue) {
					dinfo("None of the required LCID values (" + checkExpression +
							") matched the current host LCID of '" + hostInfoValue + "'.");
				}
				break;

			case "lcidOS":
				// Check whether any LCID matches the current host OS LCID.
				var attributeLCIDs = checkExpression.split(",");
				for (var iLCIDOS=0; iLCIDOS < attributeLCIDs.length; iLCIDOS++) {
					// check if it corresponds to the system LCID
					var currentLcid = trimLeadingZeroes(trim(attributeLCIDs[iLCIDOS]));
					if (currentLcid == hostInfoValue) {
						dinfo("Required OS LCID match found. LCID '" + currentLcid + "' matches current host LCID.");
						returnValue = true;
						break;
					}
				}
				if (!returnValue) {
					// Check if any LCID matched the current host.
					dinfo("None of the required LCID values (" + checkExpression +
							") matched the current host LCID of '" + hostInfoValue + "'.");
				}
				break;
				
			default:
				// perform simple regular expression match of
				// attribute
				if (attrMatchExpression.test(hostInfoValue) == true) {
					dinfo("Host attribute '" + hostAttribute + "' with value '" +
							hostInfoValue + "' matches expression '" + checkExpression + "'.");
					returnValue = true;
				} else {
					dinfo("Host attribute '" + hostAttribute + "' with value '" +
							hostInfoValue + "' does not match expression '" + checkExpression + "'.");
					returnValue = false;
				}
				break;
		}
	}
	return returnValue;
}


/**
 * Creates a new hosts XML root-node and returns it
 * 
 * @return new hosts node
 */
function createHosts() {
	var newHosts = createXml("wpkg:wpkg", namespaceHosts);
	return newHosts;
}

/**
 * Creates a new packages XML root-node and returns it
 * 
 * @return new profiles node
 */
function createPackages() {
	var newPackages = createXml("packages:package", namespacePackages);
	return newPackages;
}

/**
 * Creates a new profiles XML root-node and returns it
 * 
 * @return new profiles node
 */
function createProfiles() {
	var newProfiles = createXml("profiles:profiles", namespaceProfiles);
	return newProfiles;
}

/**
 * Creates a new settings XML root-node and returns it
 * 
 * @return new settings node
 */
function createSettings() {
	var newSettings = createXml("wpkg:wpkg", namespaceSettings);
	if (settingsHostInfo) {
		// Add host attributes.
		// NOTE: These attributes are currently not used by WPKG but might be
		// useful if wpkg.xml is copied to an external system so wpkg.xml
		// will include some host information.
		var hostInformation = getHostInformation();
		var attributes = hostInformation.keys().toArray();
		for (var i=0; i<attributes.length; i++) {
			var value = hostInformation.Item(attributes[i]);
			newSettings.setAttribute(attributes[i], value);
		}
	}
	return newSettings;
}

/**
 * Create a new settings XML root-node by reading a file and returns it
 * 
 * @param fileName String pointing to the settings file to be created
 *                 (full path).
 * @return settings root node as stored within the file
 */
function createSettingsFromFile(fileName) {
	var newSettings = loadXml(fileName, null, "settings");
	return newSettings;
}

/**
 * Downloads a file as specified within a download node.
 * 
 * @param downloadNode
 *            XML 'download' node to be used
 * @return true in case of successful download, false in case of error
 */
function download(downloadNode) {
	// get attributes
	var url = getDownloadUrl(downloadNode);
	var target = getDownloadTarget(downloadNode);
	var timeout = getDownloadTimeout(downloadNode);
	var expandURL = getDownloadExandURL(downloadNode);

	// initiate download
	return downloadFile(url, target, timeout, expandURL);
}

/**
 * Downloads all files from the given array of download XML nodes
 * 
 * @param downloadNodes
 *            Array of download XML nodes to be downloaded
 * @return true in case of successful download, false in case of error
 */
function downloadAll(downloadNodes) {
	var returnValue = true;
	if (downloadNodes != null) {
		for (var i=0; i<downloadNodes.length; i++) {
			var result = download(downloadNodes[i]);
			// stop downloading if
			if (result != true) {
				returnValue = false;
			}
		}
	}
	return returnValue;
}

/**
 * Removes eventually existing temporary downloads of the specified XML node
 * 
 * @param downloadNode
 *            XML node which contains the download definition to clean
 */
function downloadClean(downloadNode) {
	// get download attributes
	var target = getDownloadTarget(downloadNode);

	// evaluate target directory
	if (target == null || target == "") {
			error("Invalid download target specified: " + target);
		target = downloadDir;
	} else {
		target = downloadDir + "\\" + target;
	}
	target = new ActiveXObject("WScript.Shell").ExpandEnvironmentStrings(target);
	var fso = new ActiveXObject("Scripting.FileSystemObject");
	// delete temporary file if it already exists
	if (fso.FileExists(target)) {
		fso.DeleteFile(target);
	}
}


/**
 * Cleans all temporary files belonging to the download XML nodes within the
 * passed array of download XML nodes
 * 
 * @param downloadNodes
 *            Array of download XML nodes
 */
function downloadsClean(downloadNodes) {
	if (downloadNodes != null) {
		for (var i=0; i<downloadNodes.length; i++) {
			downloadClean(downloadNodes[i]);
		}
	}
}


/**
 * Builds settings document tree containing actually installed packages. Tests
 * all packages from given doc tree for "check" conditions. If given conditions
 * are positive, package is considered as installed.
 */
function fillSettingsWithInstalled() {

	var packagesNodes = getPackageNodes();

	// check each available package
	var foundPackage = false;
	for (var i = 0; i < packagesNodes.length; i++) {
		var packNode = packagesNodes[i];

		// add package node to settings if it is installed
		if (isInstalled(packNode)) {
			addSettingsNode(packNode, true);
			foundPackage = true;
		}
	}
	if (foundPackage) {
		saveSettings(true);
	}
}

/**
 * Returns the command line argument for this command node. A command node can
 * be an <install/>, <upgrade/> or <remove/> node.
 * 
 * @param cmdNode
 *            cmd XML node to read from
 * @return command defined within the given cmd XML node, returns null
 *         if no command is defined.
 */
function getCommandCmd(cmdNode) {
	return cmdNode.getAttribute("cmd");
}

/**
 * Returns the value of an exit code node within the given command node. A
 * command node can be an <install/>, <upgrade/> or <remove/> node. In case no
 * such exit code was defined null will be returned. In case the code is defined
 * the string "success" is returned. In case the exit code specifies an
 * immediate reboot then the string "reboot" is returned.
 * 
 * @return returns string "reboot" in case a reboot is required.<br>
 *         returns string "delayedReboot" in case a reboot should be scheduled
 *         as soon as possible<br>
 *         returns string "postponedReboot" in case a reboot after installing
 *         all packages is required<br>
 *         returns string "success" in case exit code specifies successful
 *         installation.<br>
 *         returns null in case the exit code is not defined.
 */
function getCommandExitCodeAction(cmdNode, exitCode) {
	var returnValue = null;
	var exitNode = cmdNode.selectSingleNode("exit[@code='" + exitCode + "']");
	if (exitNode == null) {
		exitNode = cmdNode.selectSingleNode("exit[@code='any']");
	}
	if (exitNode == null) {
		exitNode = cmdNode.selectSingleNode("exit[@code='*']");
	}
	if (exitNode != null) {
		if (exitNode.getAttribute("reboot") == "true") {
			// This exit code forces a reboot.
			info("Command '" + getCommandCmd(cmdNode) + "' returned " +
				" exit code [" + exitCode + "]. This exit code " +
				"requires an immediate reboot.");
			returnValue = "reboot";
		} else if (exitNode.getAttribute("reboot") == "delayed")  {
			info("Command '" + getCommandCmd(cmdNode) + "' returned " +
				" exit code [" + exitCode + "]. This exit code " +
				"schedules a reboot after execution of all commands.");
			returnValue = "delayedReboot";
		} else if (exitNode.getAttribute("reboot") == "postponed")  {
			info("Command '" + getCommandCmd(cmdNode) + "' returned " +
				" exit code [" + exitCode + "]. This exit code " +
				"schedules a reboot after execution of all packages.");
			returnValue = "postponedReboot";
		} else {
			// This exit code is successful.
			info("Command '" + getCommandCmd(cmdNode) + "' returned " +
				" exit code [" + exitCode + "]. This exit code " +
				"indicates success.");
			returnValue = "success";
		}
	}
	return returnValue;
}


/**
 * Return value of include attribute of the given cmd node.
 * Returns null if include attribute is not set.
 * 
 * @param cmdNode
 * 		The command node to read the include attribute from.
 * 
 * @returns Value of include attribute, returns null if attribute is undefined.
 */
function getCommandInclude(cmdNode) {
	return cmdNode.getAttribute("include");
}


/**
 * Returns the timeout value for this command node. A command node can be an
 * <install/>, <upgrade/> or <remove/> node.
 * 
 * @param cmdNode
 *            cmd XML node to read from.
 * @return the timeout for the given cmd XML node - returns 0 if no timeout is
 *         defined
 */
function getCommandTimeout(cmdNode) {
	var timeout = cmdNode.getAttribute("timeout");
	if (timeout == null) {
		timeout = 0;
	}
	return parseInt(timeout);
}

/**
 * Returns the value of the workdir attribute of the given cmd XML node.
 * 
 * @param cmdNode
 *            cmd XML node to read from
 * @return the workdir attribute value. Returns null in case value is not
 *         defined.
 */
function getCommandWorkdir(cmdNode) {
	var workdir = cmdNode.getAttribute("workdir");
	return workdir;
}

/**
 * Returns condition node of a given XML node. Returns null if there is no
 * condition node specified.
 * 
 * @param xmlNode XML node which is supposed to have a <condition /> sub-node.
 * @returns Array of condition XML-nodes, might be null if no condition is specified
 */
function getConditions(xmlNode) {
	// Read condition nodes (might be 0, 1 or any number)
	var conditionNodes = xmlNode.selectNodes("condition");

	/*
	var conditionNodes = xmlNode.selectNodes("wpkg:condition");
	if (conditionNodes.length <= 0) {
		// Maybe namespace has not been specified correctly.
		// Try reading from default namespace.
		conditionNodes = xmlNode.selectNodes("condition");
	}
	*/

	// Per specification only one single condition node shall be specified
	/*
	if (conditionNodes != null && conditionNodes.length > 1) {
		error("More than one condition node specified. Ignoring all but the first condition.");
	}
	*/

	// Return condition node.
	return conditionNodes;
}

/**
 * Returns XML node which contains the configuration
 */
function getConfig() {
	if (config == null) {
		// load config

		// get argument list
		var argv = getArgv();
		// Get special purpose argument lists.
		var argn = argv.Named;

		// if set to true it will throw an error to quit in case of
		// file-not-found
		var exitIfNotFound = false;

		// stores config file path
		var config_file = null;

		// will be used for file operations
		var fso = new ActiveXObject("Scripting.FileSystemObject");

		if (argn("config") != null) {
			var configPath = argn("config");
			var wshObject = new ActiveXObject("WScript.Shell");
			var expConfigPath = wshObject.ExpandEnvironmentStrings(configPath);
			config_file = fso.GetAbsolutePathName(expConfigPath);
			// config was explicitly specified - I think we should quit if it
			// is not available
			exitIfNotFound = true;
		} else {
			// if config_file_name (config.xml) exists, use it
			var fullScriptPATH = WScript.ScriptFullName;
			var base = fso.GetParentFolderName(fullScriptPATH);
			config_file = fso.BuildPath(base, config_file_name);
			// config is optional in this case
			exitIfNotFound = false;
		}

		if (fso.FileExists(config_file)) {
			try {
				// Read in config.xml.
				config = loadXml(config_file, null, "config");
				if (config == null) {
					throw new Error("Unable to parse config file!");
				}
			} catch (e) {
				// There was an error processing the config.xml file. Alert the
				// user
				error("Error reading "+ config_file + ": " + e.description);
				exit(99); // Exit code 99 means config.xml read error.
			}
		} else {
			var message = config_file + " could not be found.";
			if (exitIfNotFound) {
				error(message);
				exit(99); // Exit code 99 means config.xml read error.
			} else {
				dinfo(message);
			}
		}
		// create empty config if no config could be read
		if (config == null) {
			config = createXml("config");
		}
	}
	return config;
}

/**
 * Returns array of <param> nodes from the configuration. Returns array of size
 * 0 in case no parameter is defined.
 * 
 * @return <param> nodes
 */
function getConfigParamArray() {
	return getConfig().selectNodes("param");
}

/**
 * Returns download XML node array on a given XML node
 * 
 * @param xmlNode
 *            the xml node to read child-nodes of type download from
 * @param downloadsArray
 *            array of downloads to be extended with the ones from the given XML
 *            node, specify null to return a new array.
 * @return XML node array on a given package XML node containing all package
 *         downloads. returns empty array if no downloads are defined
 */
function getDownloads(xmlNode, downloadsArray) {
	var downloadsArrayRef = downloadsArray;
	if (downloadsArrayRef == null) {
		downloadsArrayRef = new Array();
	}
	// Only fetch download nodes if downloads are not disabled.
	// Just hide download nodes in case downloads are disabled.
	if (!isNoDownload()) {
		var downloads = xmlNode.selectNodes("download");
		if (downloads != null) {
			var filteredDownloads = filterConditionalNodes(downloads, true);
			for(var i=0; i<filteredDownloads.length; i++) {
				downloadsArrayRef.push(filteredDownloads[i]);
			}
		}
	}
	return downloadsArrayRef;
}

/**
 * Returns 'target' attribute from the given download XML node
 * 
 * @param downloadNode
 *            download XML node
 * @return value of 'target' attribute, null if attribute is not defined
 */
function getDownloadTarget(downloadNode){
	return downloadNode.getAttribute("target");
}

/**
 * Returns 'timeout' attribute from the given download XML node
 * 
 * @param downloadNode
 *            download XML node
 * @return {Number} Value of 'timeout' attribute, returns value of downloadTimeout if no
 *         timeout value exists or it cannot be parsed. Returns integer.
 */
function getDownloadTimeout(downloadNode) {
	var returnValue = downloadTimeout;
	var timeout = downloadNode.getAttribute("timeout");
	if (timeout != null) {
		try {
			returnValue = parseInt(timeout);
		} catch(e) {
			error("Error parsing timeout attribute: " + e.description);
		}
	}

	return returnValue;
}

/**
 * Returns value of expandURL attribute from a download node.
 * @param downloadNode The download XML node.
 * @returns true if variables shall be expanded in URL attribute,
 * 		false if they should not be expanded. Defaults to true if attribute is undefined.
 */
function getDownloadExandURL(downloadNode) {
	var returnValue = true;
	var attributeValue = downloadNode.getAttribute("expandURL");
	if (attributeValue != null && attributeValue == "false") {
		returnValue = false;
	}
	return returnValue;
}

/**
 * Returns 'url' attribute from the given download XML node
 * 
 * @param downloadNode
 *            download XML node
 * @return value of 'url' attribute, null if attribute is not defined
 */
function getDownloadUrl(downloadNode) {
	return downloadNode.getAttribute("url");
}

/**
 * Gets the size of a file (in Bytes). The path is allowed to contain
 * environment variables like "%TEMP%\somefile.txt".
 * 
 * @param file
 *          path to the file whose size has to be returned
 * @return size of the file (in Bytes), returns -1 if file size could not be
 *         determined
 */
function getFileSize (file) {
	var size = -1;
	try {
		dinfo ("Finding size of '" + file + "'\n");
		var expandedPath = new ActiveXObject("WScript.Shell").ExpandEnvironmentStrings(file);
		var FSO = new ActiveXObject("Scripting.FileSystemObject");
		var fsof = FSO.GetFile(expandedPath);
		size = fsof.Size;
	} catch (e) {
		size = -1;
		dinfo("Unable to get file size for '" + file + "': " +
				 e.description);
	}
	dinfo ("Leaving getFileSize with size " + size);
	return size;
}

/**
 * Gets the creation date of a file.
 * 
 * @param file
 *          Path to the file from which to read the creation date.
 * @returns Date when the file has been created.
 * Returns null if file date could not be read.
 */
function getFileDateCreation(file) {
	var fileDate = null; // new Date();
	try {
		dinfo ("Reading creation date of '" + file + "'.");
		var expandedPath = new ActiveXObject("WScript.Shell").ExpandEnvironmentStrings(file);
		var FSO = new ActiveXObject("Scripting.FileSystemObject");
		var fsof = FSO.GetFile(expandedPath);
		fileDate = fsof.DateCreated;
	} catch (e) {
		fileDate = null;
		dinfo("Unable to get file creation date for '" + file + "': " +
				 e.description);
	}
	return fileDate;
}

/**
 * Gets the last modified date of a file.
 * 
 * @param file
 *          Path to the file from which to read the last modification date.
 * @returns Date when the file has been last modified.
 * Returns null if file date could not be read.
 */
function getFileDateModification(file) {
	var fileDate = null; // new Date();
	try {
		dinfo ("Reading last modification date of '" + file + "'.");
		var expandedPath = new ActiveXObject("WScript.Shell").ExpandEnvironmentStrings(file);
		var FSO = new ActiveXObject("Scripting.FileSystemObject");
		var fsof = FSO.GetFile(expandedPath);
		fileDate = fsof.DateLastModified;
	} catch (e) {
		fileDate = null;
		dinfo("Unable to get file last modification date for '" + file + "': " +
				 e.description);
	}
	return fileDate;
}

/**
 * Gets the last access date of a file.
 * 
 * @param file
 *          Path to the file from which to read the last access date.
 * @returns Date when the file has been last accessed.
 * Returns null if file date could not be read.
 */
function getFileDateLastAccess(file) {
	var fileDate = null; // new Date();
	try {
		dinfo ("Reading last access date of '" + file + "'.");
		var expandedPath = new ActiveXObject("WScript.Shell").ExpandEnvironmentStrings(file);
		var FSO = new ActiveXObject("Scripting.FileSystemObject");
		var fsof = FSO.GetFile(expandedPath);
		fileDate = fsof.DateLastAccessed;
	} catch (e) {
		fileDate = null;
		dinfo("Unable to get file last accessed date for '" + file + "': " +
				 e.description);
	}
	return fileDate;
}

/**
 * Returns the version of a file.
 * 
 * @return string representation of version, null in case no version could be
 *         read.
 */
function getFileVersion (file) {
	var version = null;
	try {
		dinfo ("Trying to find version of " + file);
		var FSO = new ActiveXObject("Scripting.FileSystemObject");
		version = FSO.GetFileVersion(file);
		dinfo ("Obtained version '" + version + "'.");
	} catch (e) {
		version = null;
		dinfo("Unable to find file version for " + file + " : " +
			e.description);
	}
	return version;
}

/**
 * Returns the hostname of the machine running this script. The hostname might
 * be overwritten by the /host:<hostname> switch.
 */
function getHostname() {
	if (hostName == null) {
		var WshNetwork = WScript.CreateObject("WScript.Network");
		setHostname(WshNetwork.ComputerName.toLowerCase());
	}
	return hostName;
}

/**
 * Returns a string representing the regular expression associated to the host
 * definition in hosts.xml.
 */
function getHostNameAttribute(hostNode) {
	return hostNode.getAttribute("name");
}

/**
 * Returns the operating system of the machine running this script. The return
 * format is:
 * 
 * <pre>
 * <OS-caption>, <OS-description>, <CSD-version>, <OS-version>
 * example output:
 * microsoft windows 7 professional, , sp1, 6.1.7601
 * </pre>
 * 
 * It might be overwritten by the /os:<hostos> switch.
 * 
 * Note: Some values might be empty.
 * 
 * @returns Host operating system specification as a plain string converted to
 *          lower case letters to ease parsing
 */
function getHostOS() {
	if (hostOs == null) {
		var strComputer = ".";
		var strQuery = "Select * from Win32_OperatingSystem";
			try {
				var objWMIService = GetObject("winmgmts:{impersonationLevel=impersonate}!\\\\" +
												strComputer + "\\root\\cimv2");
				var colOSes = objWMIService.ExecQuery(strQuery,"WQL",48);
				var osEnum = new Enumerator(colOSes);
				for (; !osEnum.atEnd(); osEnum.moveNext()) {
					var osItem = osEnum.item();
					var OtherTypeDescription = "";
					var CSDVersion = "";
						if (osItem.OtherTypeDescription != null) {
							OtherTypeDescription = osItem.OtherTypeDescription;
						}
						if (osItem.CSDVersion != null) {
							CSDVersion = osItem.CSDVersion.replace(/Service Pack /i,"SP");
						}
						var strSystem = trim(osItem.Caption) + ", "
								+ OtherTypeDescription + ", "
								+ CSDVersion + ", "
								+ osItem.Version;
						hostOs = strSystem.toLowerCase();
						dinfo("Host operating system: " + hostOs);
				}
			} catch (e) {
				dinfo("Warning: unable to get operating system information.");
			}
	}
	return hostOs;
}

/**
 * Returns name of domain on which the executing host is member of.
 * 
 * @returns Returns domain name string.
 */
function getDomainName() {
	if (domainName == null) {
		try {
			var strComputer = "." ;

			// Get WMI object to read information from.
			var WMIServiceStr = "winmgmts:{impersonationLevel=impersonate}!\\\\"
								+ strComputer + "\\root\\cimv2";
			var objWMIService = GetObject(WMIServiceStr) ;

			// Query domain name from WMI.
			var QueryRes = objWMIService.ExecQuery("Select * from Win32_ComputerSystem where PartOfDomain=True ");
			var items=new Enumerator(QueryRes);
			items.moveFirst();
			if (items.atEnd() == true) {
				// Not a domain member
				dinfo("Not a domain member.");
				// set
				domainName = "";
			} else {
				var First = items.item();
				domainName = First.Domain.toLowerCase();
				dinfo("Domain Name: " + domainName);
			}
		} catch (e) {
			dinfo("Message: Unable to get domain information.");
		}
	}
	return domainName;
}

/**
 * Returns array of group names where the executing host is member of.
 * 
 * @returns Returns list of membership groups.
 */
function getHostGroups() {
	if (hostGroups == null) {
		hostGroups = new Array();
		try {
			var hostName = getHostname();
			var domainName = getDomainName();
			var obj = GetObject("WinNT://" + domainName + "/" + hostName + "$,user") ;
			var groups = obj.Groups();
			for (var item =new Enumerator(groups); !item.atEnd(); item.moveNext() ) {
				var group = item.item();
				dinfo("Found computer group: " + group.Name);
				hostGroups.push(group.Name);
			}
		} catch (e) {
			dinfo("Message: Unable to fetch computer membership groups. Probably not a domain member.");
		}
	}
	return hostGroups;
}

/**
 * Returns a list of attribute/value pair associated to the host
 * definition in hosts.xml.
 *
 * @param hostNode XML node of the host definition
 * @return dictionary of attribute/value pair.
 */
function getHostAttributes(hostNode) {
	var hostAttributes = new  ActiveXObject("Scripting.Dictionary");

	if(hostNode.attributes != null) {
		for (var i=0; i<hostNode.attributes.length; i++) {
			if (hostNode.attributes[i].value != null) {
				hostAttributes.Add(hostNode.attributes[i].name, hostNode.attributes[i].value);
			}
		}
	}
	return  hostAttributes;
}

/**
 * Returns a string identifying a host node including all attributes.
 * 
 * @param hostNode
 *            XML node of the host definition
 * @return a string of concatenate 'attribute=value'
 */
function getHostNodeDescription(hostNode) {
	// Get dictionary object of all attributes.
	var hostNodeAttrs = getHostAttributes(hostNode);

	// Fill all attributes into array.
	var attrsKeys = hostNodeAttrs.keys().toArray();
	var attrDesc = new Array();
	for (var i=0; i<attrsKeys.length; i++) {
		var attrName = attrsKeys[i];
		var attrValue = hostNodeAttrs.Item(attrName);
		attrDesc.push(attrName + "='" + attrValue + "'");
	}
	// Convert array to comma-separated list
	// attr1='value1',attr2='value2'
	return attrDesc.join(",");
}


/**
 * Collects information from local host and stores it into a scripting
 * dictionary object.
 * 
 * @returns host attributes stored within a dictionary object. This currently
 *          includes the following attributes: name, architecture, os,
 *          ipaddresses, domainname, groups, lcid
 */
function getHostInformation() {
	// Fetch host information if not already collected.
	// This information is supposed to be static during execution and
	// therefore it will be cached.
	if (hostAttributes == null) {
		hostAttributes = new ActiveXObject("Scripting.Dictionary");
		hostAttributes.Add("hostname", getHostname());
		hostAttributes.Add("architecture", getArchitecture());
		hostAttributes.Add("os", getHostOS());
		hostAttributes.Add("ipaddresses", getIPAddresses());
		hostAttributes.Add("domainname", getDomainName());
		hostAttributes.Add("groups", getHostGroups());
		hostAttributes.Add("lcid", getLocale());
		hostAttributes.Add("lcidOS", getLocaleOS());

		// Print information found for debug purposes.
		dinfo("Host properties: "
			+ "hostname='" + hostAttributes.Item("hostname") + "'\n"
			+ "architecture='" + hostAttributes.Item("architecture") + "'\n"
			+ "os='" + hostAttributes.Item("os") + "'\n"
			+ "ipaddresses='" + hostAttributes.Item("ipaddresses").join(",") + "'\n"
			+ "domain name='" + hostAttributes.Item("domainname") + "'\n"
			+ "groups='" + hostAttributes.Item("groups").join(",") + "'\n"
			+ "lcid='" + hostAttributes.Item("lcid") + "'\n"
			+ "lcidOS='" + hostAttributes.Item("lcidOS") + "'"
		);
	}
	return hostAttributes;
}

/**
 * Accepts a list of XML nodes (Array of XML nodes) which is then filtered for
 * XML nodes which either do not specify specific host matches or all specified
 * attributes match the current host. For example the following XML nodes would
 * match:
 * 
 * E.g.
 * 
 * <pre>
 * <host name="nodename"; os="windows"; attributeX="value" profile-id="default" />
 * <host name="nodename" profile-id="default" />
 * <package os="windows" package-id="value" ipaddresses="192\.168\.1\..*" />
 * <package package-id="value" />
 * </pre>
 * 
 * The last example matches since there is no limitation to host attributes in the definition.
 * 
 * The return value will be an Array object listing only the XML nodes which
 * match.
 * 
 * @param xmlNodes
 *            Array of XML nodes which shall be verified for current host match.
 * @param getAllMatches
 *            If set to true returns all matches. If set to false just returns the first matching node from xmlNodes. In this case the return array will contain only one element (or 0 if no match was found).
 * @returns Array of XML nodes which match the current host.
 */
function filterConditionalNodes(xmlNodes, getAllMatches) {
	// Create array to store the XML nodes which match this host.
	var applyingNodes = new Array();

	if(getAllMatches == null) {
		getAllMatches = true;
	}
	
	// Check if xmlNode array passed as argument is valid
	if (xmlNodes == null || xmlNodes.length <= 0) {
		return applyingNodes;
	}

	// Fetch current host attributes.
	var globalHostInformation = getHostInformation();

	// Add "environment" key since we want to support environment matching too.
	var hostInformation = new ActiveXObject("Scripting.Dictionary");
	var keys = globalHostInformation.keys().toArray();
	for (var i=0; i<keys.length; i++) {
		hostInformation.Add(keys[i], globalHostInformation.Item(keys[i]));
	}
	hostInformation.Add("environment", "");

	// Check all nodes whether they match the current host.
	for (var i=0; i < xmlNodes.length; i++) {
		var xmlNode = xmlNodes[i];
		if (xmlNode == null) {
			// Skip to next node
			continue;
		}
		// Set to true if all host attributes from XML specification match
		// this host.
		var hostMatchFound = true;

		// Fetch all XML attributes which correspond to a defined host property.
		var xmlNodeAttrs = new  ActiveXObject("Scripting.Dictionary");
		for (var iAttribute=0; iAttribute < xmlNode.attributes.length; iAttribute++) {
			if( hostInformation.Item(xmlNode.attributes[iAttribute].name) != null ) {
				xmlNodeAttrs.Add(xmlNode.attributes[iAttribute].name, xmlNode.attributes[iAttribute].value);
			}
		}
		
		// Check whether all of the attributes match the current host.
		var attrsKeys = xmlNodeAttrs.keys().toArray();
		for (var iAttr=0; iAttr<attrsKeys.length; iAttr++) {
			var xmlNodeAttrName = attrsKeys[iAttr];
			var xmlNodeAttrValue = xmlNodeAttrs.Item(xmlNodeAttrName);

			// Check whether the attribute matches the current host.
			var attributeMatchFound = checkHostAttribute(xmlNodeAttrName, xmlNodeAttrValue);
			
			// Verify if the attribute does match to current host.
			if (attributeMatchFound != true) {
				// No match found. Advance to next host.
				dinfo("No value of '" + xmlNodeAttrName + "' matched '" + xmlNodeAttrValue + "'. Skipping to next definition.");
				hostMatchFound = false;
				break;
			}
			/*
			 * else { // This attribute matched, continue with next attribute hostMatchFound = true; continue; }
			 */
		}

		// If not all attributes match the current host definition then the node is not included.
		// All nodes which do not specify advanced host match attributes are included too.
		if (hostMatchFound) {
			// All attributes matched

			// Print some debug information about which extended host attributes matched.
			if (xmlNodeAttrs.count > 0) {
				var attrsKeys = xmlNodeAttrs.keys().toArray();
				var attrDesc = new Array();
				for (var iAttrKeys=0; iAttrKeys<attrsKeys.length; iAttrKeys++) {
					attrDesc.push(attrsKeys[iAttrKeys] + "=" + xmlNodeAttrs.Item(attrsKeys[iAttrKeys]));
				}
				dinfo("XML node with special host attribute match found: " + attrDesc.join(", "));
			}

			// Verify if the XML node has a <condition /> sub-node
			var conditionMatched = true;
			var conditionNode = getConditions(xmlNode);
			if (conditionNode != null) {
				for (var iCond=0; iCond < conditionNode.length; iCond++) {
					var condition = conditionNode[iCond];
					// Run all checks
					conditionMatched = checkAll(getChecks(condition));
					if (conditionMatched) {
						dinfo("Additional conditions matched successfully.");
					} else {
						conditionMatched = false;
						dinfo("Additional conditions did not match.");
						break;
					}
				}
			}

			// Insert node to list of matched nodes.
			if (conditionMatched) {
				applyingNodes.push(xmlNode);
				if (!getAllMatches) {
					dinfo("Single-match mode. Host match finished.");
					break;
				}
			}
		} else {
			dinfo("Could not match all attributes of XML node to current host. Skipping to next definition.");
		}
	}

	return applyingNodes;
}

/**
 * Retrieves host nodes from given "hosts" XML documents. Searches for nodes
 * having matching attributes and returns their array.
 * 
 * First matching host node is returned by default. If switch /applymultiple is
 * used all matching host nodes are returned.
 * 
 * @return returns the first matching host XML node or the list of all matching
 *         host XML nodes if applymultiple is true. Returns null if no host node
 *         matches.
 */
function getHostsApplying() {
	if (applyingHostNodes == null) {
		// Create new array to store matching hosts.
		hostNodesApplying = new Array();

		// Get available host definitions.
		var hostNodes = getHostNodes();

		// Check each node independently.
		for (var iHost=0; iHost < hostNodes.length; iHost++) {
			var hostNode = hostNodes[iHost];

			// Check conditions to determine whether the host definition is
			// applied.
			var previousEnv = getEnv();
			var variables = getVariables(hostNode, null);

			// Apply variables to environment.
			for (var iVariable=0; iVariable < variables.length; iVariable++) {
				var varDefinition = variables[iVariable];
				var variableKeys = varDefinition.keys().toArray();
				for (var iVarKey = 0; iVarKey < variableKeys.length; iVarKey++) {
					var key = variableKeys[iVarKey];
					var value = varDefinition.Item(key);
					setEnv(key, value);
				}
			}
			
			// Checkthis host node for special conditions.
			var hostList = new Array();
			hostList.push(hostNode);
			hostList = filterConditionalNodes(hostList, true);
			if (hostList.length < 1) {
				// Restore environment.
				loadEnv(previousEnv);
				// Skipt to next host node.
				continue;
			}
			
			// Get host name attribute.
			var hostNameAttribute = getHostNameAttribute(hostNode);

			if (hostNameAttribute != null && hostNameAttribute != "") {
				// Try direct match first (non-regular-expression matching).
				if (hostNameAttribute.toUpperCase() == getHostname().toUpperCase()) {
					// Append host to applying hosts.
					hostNodesApplying.push(hostNode);

				} else {
					
					// Flag to check if IP-address match succeeded.
					var ipMatchSuccess = false;
					try {
						// Try IPv4-address matching.
						// Get IPv4 addresses (might be multiple).
						var ipAddresses = getIPAddresses();
	
						// check for each address if a host node matches
						// try non-regular-expression matching
						for (var iIPAdresses=0; iIPAdresses < ipAddresses.length; iIPAdresses++) {
							var ipAddress = ipAddresses[iIPAdresses];
	
							// splitvalues
							// dinfo("Trying to match IP '" + ipAddress + "' to " +
							// "'" + matchPattern + "'");
							var splitIP = ipAddress.split(".");
							var splitPattern = hostNameAttribute.split(".");
							// check if format was correct
							if (splitIP.length == 4 &&
								splitPattern.length == 4) {
								var firstValue = 0;
								var secondValue = 0;
								var match = true;
								for (var k=0; k<splitIP.length; k++) {
									// get first range value
									var ipOctet = parseInt(splitIP[k]);
									var matchOctet = splitPattern[k];

									// check if ip octet defines a range
									var splitMatchOctet = matchOctet.split("-");
									firstValue = parseInt(splitMatchOctet[0]);
									if (splitMatchOctet.length > 1) {
										secondValue = parseInt(splitMatchOctet[1]);
									} else {
										secondValue = firstValue;
									}
									if (firstValue > secondValue) {
										// swap values
										var temp = firstValue;
										firstValue = secondValue;
										secondValue = temp;
									}
									// let's finally see if the ip octet is outside the range
									if ((ipOctet < firstValue || ipOctet > secondValue)) {
										// if octet did not match the requirements
										// dinfo("no match!");
										match = false;
										// no need to continue
										break;
									}
								}
								// If all matched, take this profile.
								if (match) {
									dinfo("Found host '" + hostNameAttribute +
											"' matching IP '" + ipAddress + "'");
									// Append host to applying hosts.
									hostNodesApplying.push(hostNode);
									ipMatchSuccess = true;
									break;
								}
							}
						}
					} catch(e) {
						ipMatchSuccess = false;
						dinfo("IP-Address match failed: " + e.description);
					}

					// If we still got no match with, then try regular expression matching.
					if (!ipMatchSuccess) {
						try {
							var hostNameAttributeMatcher = new RegExp("^" + hostNameAttribute + "$", "i");
	
							if (hostNameAttributeMatcher.test(getHostname()) == true) {
								hostNodesApplying.push(hostNode);
							}
						} catch (e) {
							warning("Invalid regular expression for host name matching: '" +
									hostNameAttribute + "'.");
						}
					}
				}

			} else {

				// Host "name" attribute is missing or empty. Include host as potential match.
				// This allows to filter this host later using extended host matching
				hostNodesApplying.push(hostNode);
			}
			
			// Restore environment.
			loadEnv(previousEnv);
		}
		
		// Filter host nodes by matching them to the local host.
		// hostNodesApplying = filterConditionalNodes(hostNodesApplying, isApplyMultiple());

		// Matches might have returned multiple matching results. In case of
		// single-matching mode (default) only the first result shall be
		// returned
		if (!isApplyMultiple() && hostNodesApplying.length > 1) {
			var applyingHostNode = hostNodesApplying[0];
			hostNodesApplying = new Array();
			hostNodesApplying.push(applyingHostNode);
		}

		if (hostNodesApplying.length <= 0) {
			hostNodesApplying = null;
			throw new Error("Unable to find any matching host definition!");
		}
		applyingHostNodes = hostNodesApplying;
	}

	return applyingHostNodes;
}

/**
 * Returns an array of host nodes which specify the host regular expression and
 * the corresponding profile
 */
function getHostNodes() {
	return getHosts().selectNodes("host");
}

/**
 * Returns the profile-id associated with the given host node.
 * The node structure is defined as follows:
 * 
 * The profile-id or the enclosed <profile... /> nodes might be omitted but not
 * both!
 * 
 * @param hostNode XML node of the host definition
 * @return array of strings with referenced profiles
 * 		(array might be of length 0 if no profiles are defined)
 */
function getHostProfiles(hostNode) {
	// create array to store profile IDs
	var profileList = new Array();

	// try to receive profile ID from host node
	var profileID = hostNode.getAttribute("profile-id");

	if (profileID != null) {
		// convert to lower case if case-sensitivity is off
		if (!isCaseSensitive()) {
			profileList.push(profileID.toLowerCase());
		} else {
			profileList.push(profileID);
		}
	}

	// Load host definition environment (environment might be used in condition
	// checks.
	var previousEnv = getEnv();
	var variables = getVariables(hostNode, null);

	// Apply variables to environment.
	for (var iVariable=0; iVariable < variables.length; iVariable++) {
		var varDefinition = variables[iVariable];
		var variableKeys = varDefinition.keys().toArray();
		for (var iVarKey = 0; iVarKey < variableKeys.length; iVarKey++) {
			var key = variableKeys[iVarKey];
			var value = varDefinition.Item(key);
			setEnv(key, value);
		}
	}
	
	var profileNodes = hostNode.selectNodes("profile");
	if (profileNodes != null) {
		// Get only dependencies which match the current host.
		var matchingProfileNodes = filterConditionalNodes(profileNodes, true);
		for (var iProfile=0; iProfile<matchingProfileNodes.length; iProfile++) {
			var profileNode = matchingProfileNodes[iProfile];
			// get id attribute
			var profileId = profileNode.getAttribute("id");

			// convert to lower case if case-sensitivity is off
			if (!isCaseSensitive()) {
				profileList.push(profileId.toLowerCase());
			} else {
				profileList.push(profileId);
			}
		}
	}

	// Restore environment.
	loadEnv(previousEnv);
	
	if (profileList.length > 0) {
		var message = "Profiles applying to the current host:\n";
		for (var iProfileIndex=0; iProfileIndex<profileList.length; iProfileIndex++) {
			message += profileList[iProfileIndex] + "\n";
		}
		dinfo(message);
	} else {
		error("No profiles assigned to the current host!");
	}

	return profileList;
}

/**
 * Returns XML node which contains all host configurations
 */
function getHosts() {
	if(hosts == null) {
		var newHosts = createHosts();
		setHosts(newHosts);
	}
	return hosts;
}

/**
 * Returns a list of variables from the applying hosts definition.
 * 
 * @param array
 *            Object of type Array to which the the variables appended.
 *            In case null is supplied it returns a new Array object.
 * @return Object of type Scripting.Dictionary which contains all key/value
 *         pairs from the applying hosts.
 */
function getHostsVariables(array) {
	dinfo("Reading variables from hosts[s]");

	// Fetch host definitions which apply to current host.
	if (hostsVariables == null) {
		hostsVariables = new Array();
		var hostNodes = getHostsApplying() ;
		for (var iHostNode=0; iHostNode < hostNodes.length; iHostNode++) {
			var hostNode = hostNodes[iHostNode];
			dinfo("Reading variables from host: " + getHostNodeDescription(hostNode));

			// Add variables from host XML node.
			hostsVariables = getVariables(hostNode, hostsVariables);
		}
	}

	// Concatenate variable list if list was passed as parameter.
	var concatenatedVariables = hostsVariables;
	if (array != null) {
		// concatenatedVariables = concatenateDictionary(dictionary, hostsVariables);
		concatenatedVariables = hostsVariables.concat(array);
	}

	return concatenatedVariables;
}

/**
 * Returns the corresponding string defined within the configuration.
 * 
 * @param stringID
 *            the identification of the corresponding string as listed within
 *            the configuration
 * 
 * @return returns the string as it appears within the configuration. Returns
 *         null if the string id is not defined.
 */
function getLocalizedString(stringID) {
	if (languageNode == null && getConfig() != null) {
		// read node which contains all the strings
		var languagesNodes = getConfig().selectNodes("languages");

		if (languagesNodes != null) {
			// there might be multiple languages nodes
			for (var i=0; i < languagesNodes.length; i++) {
				// get language nodes
				var languageNodes = languagesNodes[i].selectNodes("language");

				for (var j=0; j < languageNodes.length && languageNode == null; j++) {
					var currentLangNode = languageNodes[j];

					// get associated language LCIDs
					var lcidString = currentLangNode.getAttribute("lcid");
					var lcids = lcidString.split(",");
					for (var k=0; k < lcids.length; k++) {
						// check if it corresponds to the system LCID
						var currentLcid = trimLeadingZeroes(trim(lcids[k]));
						if (currentLcid == getLocale()) {
							dinfo("Found language definition node for language ID " + currentLcid);
							languageNode = currentLangNode;
							break;
						}
					}
				}
			}
		}

	}

	// check if language has not been found
	if (languageNode == null) {
		// create empty node
		languageNode = createXml("language");
	}

	// try to find node matching the requested sting id
	var stringNode = languageNode.selectSingleNode("string[@id='" + stringID + "']");
	if (stringNode != null) {
		return stringNode.text;
	} else {
		dinfo("No locale language definition found for message ID '" + stringID +
			"' (language LCID '" + getLocale() + "').");
		return null;
	}
}

/**
 * Returns array of package IDs which includes package IDs of chained packages.
 * Returns empty array in case the package does not have any chained packages.
 * 
 * @param packageNode
 *            the package node to read the list of chained packages from
 * @param packageList
 *            optional reference to an array which is used to insert the chained
 *            packages to. Specify null to create a new Array
 * @return Array specified in packageList parameter extended by package IDs
 *         (string values) which represent the chained packages
 */
function getPackageChained(packageNode, packageList) {
	// output array
	if (packageList == null) {
		packageList = new Array();
	}

	if(packageNode != null) {
		var includeNodes = packageNode.selectNodes("chain");
		if (includeNodes != null) {
			matchingChainNodes = filterConditionalNodes(includeNodes, true);
			for (var i=0; i < matchingChainNodes.length; i++) {
				var dependId = matchingChainNodes[i].getAttribute("package-id");

				// convert to lower case if case-insensitive mode is on
				if (dependId != null) {
					if (!isCaseSensitive()) {
						dependId = dependId.toLowerCase();
					}
					packageList.push(dependId);
				}
			}
		}
	}

	return packageList;
}

/**
 * Defines how package checks are used during package installation.
 * 
 * Currently supported values:
 *
 * "always" (default):
 * When a package is new to the host then first the checks are run in order to
 * verify whether the package is already installed. If the checks succeed then
 * it is assumed that no further installation is needed. The package is silently
 * added to the host without executing any commands.
 * 
 * "never":
 * When a package is new to the host then the install commands are run in any
 * case (without doing checks first). Note: Checks will still be done after
 * package installation to verify whether installation was successful.
 *
 * @param packageNode Package XML node to read attribute from.
 * @returns "always" or "never" according to precheck-install attribute of
 *           package.
 */
function getPackagePrecheckPolicyInstall(packageNode) {
	var checkPolicy = "always";
	var installCheckPolicy = packageNode.getAttribute("precheck-install");
	if (installCheckPolicy != null) {
		checkPolicy = installCheckPolicy;
	}
	return checkPolicy;
}

/**
 * Defines how package checks are used during package removal.
 * 
 * Currently supported values:
 * 
 * "always":
 * When a package is removed from a host then the checks will be executed
 * before removal is processes. If the checks fail this potentially means that
 * the package has been removed already. In such case the package remove
 * commands will be skipped.
 * 
 * "never" (default):
 * When a package is about to be removed from the host then WPKG will execute
 * the remove commands in any case without executing the checks first.
 * Note: Checks will still be done after package removal to verify whether the
 * removal was successful.
 * 
 * @param packageNode Package XML node to read attribute from.
 * @returns "always" or "never" according to precheck-remove attribute of
 *           package.
 */
function getPackagePrecheckPolicyRemove(packageNode) {
	var checkPolicy = "never";
	var removeCheckPolicy = packageNode.getAttribute("precheck-remove");
	if (removeCheckPolicy != null) {
		checkPolicy = removeCheckPolicy;
	}
	return checkPolicy;
}

/**
 * Defines how package checks are used during package upgrade.
 * 
 * Currently supported values:
 *
 * "always":
 * When a package is upgraded the checks specified will be be executed before
 * the upgrade takes place. If checks succeed, then the upgrade will not be
 * performed (WPKG just assumes that the new version is already applied
 * correctly.
 * Please note that your checks shall verify a specific software version and
 * not just a generic check which is true for all versions. If your checks
 * are true for the old version too then WPKG would never perform the upgrade
 * in this mode.
 * 
 * "never" (default):
 * When a package is about to be upgraded then WPKG will execute the upgrade
 * commands in any case without executing the checks first. This is the
 * recommended behavior.
 * Note: Checks will still be done after package upgrade to verify whether the
 * upgrade was successful.
 * 
 * @param packageNode Package XML node to read attribute from.
 * @returns "always" or "never" according to precheck-upgrade attribute of
 *           package.
 */
function getPackagePrecheckPolicyUpgrade(packageNode) {
	var checkPolicy = "never";
	var upgradeCheckPolicy = packageNode.getAttribute("precheck-upgrade");
	if (upgradeCheckPolicy != null) {
		checkPolicy = upgradeCheckPolicy;
	}
	return checkPolicy;
}

/**
 * Defines how package checks are used during package downgrade.
 * 
 * Currently supported values:
 *
 * "always":
 * When a package is downgraded the checks specified will be be executed before
 * the downgrade takes place. If checks succeed, then the downgrade will not be
 * performed (WPKG just assumes that the old version is already applied
 * correctly.
 * Please note that your checks shall verify a specific software version and
 * not just a generic check which is true for all versions. If your checks
 * are true for the new/current version too then WPKG would never perform the
 * downgrade in this mode.
 * 
 * "never" (default):
 * When a package is about to be downgraded then WPKG will execute the
 * downgrade commands in any case without executing the checks first. This is
 * the recommended behavior.
 * Note: Checks will still be done after package downgrade to verify whether
 * the downgrade was successful.
 * 
 * @param packageNode Package XML node to read attribute from.
 * @returns "always" or "never" according to precheck-downgrade attribute of
 *           package.
 */
function getPackagePrecheckPolicyDowngrade(packageNode) {
	var checkPolicy = "never";
	var downgradeCheckPolicy = packageNode.getAttribute("precheck-downgrade");
	if (downgradeCheckPolicy != null) {
		checkPolicy = downgradeCheckPolicy;
	}
	return checkPolicy;
}

/**
 * Returns an array of <check /> XML sub-nodes on a given XML node.
 * In case extended host matching attributes are used only the checks which match the
 * current host are returned.
 * 
 * @param xmlNode The XML node from which all 'check' sub-nodes are read
 * @return Array of XML nodes containing all 'check'-nodes which match to the current host.
 *         Returns empty array if no checks are defined.
 *         If extended host matching attributes like "hostname", "os" or similar are used
 *         then checks which do not match the current host are not returned.
 */
function getChecks(xmlNode) {
	var checkNodes = xmlNode.selectNodes("check");
	/*
	var checkNodes = xmlNode.selectNodes("wpkg:check");
	if (checkNodes.length <= 0) {
		// Maybe amespace was wrongly specified.
		// Try default namespace.
		checkNodes = xmlNode.selectNodes("check");
	}
	*/
	return filterConditionalNodes(checkNodes);
}

/**
 * This is a convenience-method to get all downgrade commands.
 * 
 * @param packageNode
 *            package XML node which contains 'downgrade' nodes
 * @return Array of 'downgrade' XML nodes, returns empty array if no nodes are
 *         defined
 */
function getPackageCmdDowngrade(packageNode, includeChain) {
	// Fetch commands from package node.
	var commandNodes = getPackageCmd(packageNode, "downgrade", null);

	// Return list of applying install commands.
	return commandNodes;
}

/**
 * This is a convenience-method to get all install commands.
 * 
 * @param packageNode
 *            package XML node which contains 'install' nodes
 * @return Array of 'install' XML nodes, returns empty array if no nodes are
 *         defined
 */
function getPackageCmdInstall(packageNode, includeChain) {
	// Fetch commands from package node.
	var commandNodes = getPackageCmd(packageNode, "install", null);

	// Return list of applying install commands.
	return commandNodes;
}


/**
 * This is a convenience-method to get all remove commands.
 * 
 * @param packageNode
 *            package XML node which contains 'remove' nodes
 * @return Array of 'remove' XML nodes, returns empty array if no nodes are
 *         defined
 */
function getPackageCmdRemove(packageNode, includeChain) {
	// Fetch commands from package node.
	var commandNodes = getPackageCmd(packageNode, "remove", null);

	// Return list of applying install commands.
	return commandNodes;
}

/**
 * This is a convenience-method to get all upgrade commands.
 * 
 * @param packageNode
 *            package XML node which contains 'remove' nodes
 * @return Array of 'upgrade' XML nodes, returns empty array if no nodes are
 *         defined
 */
function getPackageCmdUpgrade(packageNode, includeChain) {
	// Fetch commands from package node.
	var commandNodes = getPackageCmd(packageNode, "upgrade", null);

	// Return list of applying install commands.
	return commandNodes;
}


/**
 * Returns a list of commands which apply to the given command type.
 * Common types are 'install', 'upgrade', 'downgrade' or 'remove' but WPKG
 * allows any custom type definition within the commands/command XML structure.
 * For example it is possible to specify <command type="test-type" /> and then
 * receive all "test-type" commands using this method.
 * 
 * @param packageNode
 *            package XML node which contains command nodes.
 * @param type
 *            Type description. Defines which command group to receive.
 * @param includeChain
 * 	        Array of command types (install/upgrade/downgrade/remove) already
 *          included.
 *          This is used to detect inclusion loops (recursive inclusion).
 * @return Array of command XML nodes, returns empty array if no nodes are
 *         defined
 */
function getPackageCmd(packageNode, type, includeChain) {
	// Verify input parameters.
	if (packageNode == null) {
		return null;
	}

	// Type must be specified in order to get command group.
	if (type == null || type == "") {
		return null;
	}

	var alreadyIncluded;
	if (includeChain == null) {
		alreadyIncluded = new Array();
	} else {
		alreadyIncluded = includeChain;
	}
	alreadyIncluded.push(type);
	
	// This variable holds the result set returned.
	var commandNodeList = new Array();
	
	// Fetch commands directly attached to package node
	var directCommandNodes = null;
	switch (type) {
	case "install":
		directCommandNodes = packageNode.selectNodes("install");
		break;
	case "upgrade":
		directCommandNodes = packageNode.selectNodes("upgrade");
		break;
	case "downgrade":
		directCommandNodes = packageNode.selectNodes("downgrade");
		break;
	case "remove":
		directCommandNodes = packageNode.selectNodes("remove");
		break;
	default:
		// Command type is none of the "default" types This command type is
		// supported in command nodes only.
		break;
	}

	// Fetch command-nodes from <commands><command type="type" /></commands> structure.
	var commandNodes = packageNode.selectNodes("commands/command[@type=\"" + type + "\"]");

	// Merge command lists.
	if (directCommandNodes != null) {
		for (var iCmd=0; iCmd < directCommandNodes.length; iCmd++) {
			commandNodeList.push(directCommandNodes[iCmd]);
		}
	}
	if (commandNodes != null) {
		for (var iCmd=0; iCmd < commandNodes.length; iCmd++) {
			commandNodeList.push(commandNodes[iCmd]);
		}
	}
	
	// Filter out all packages which do not apply to current host.
	commandNodeList = filterConditionalNodes(commandNodeList, true);

	// Expand command includes.
	// Create array which is returned as a complete command list.
	var fullCommandList = new Array();

	// Check all commands for inclusion.
	for (var iTypeCommands=0; iTypeCommands<commandNodeList.length; iTypeCommands++) {
		var command = commandNodeList[iTypeCommands];
		var include = getCommandInclude(command);
		
		// Inclusion found.
		if (include != null) {
			dinfo("Found inclusion for command type " + include + ".");
			
			// Clone array of already included command types which helps to
			// detect duplicated includes.
			// The same loop will check whether the type to be included has
			// already been included (recursive inclusion detection).
			var prevIncluded = new Array();
			for (var j=0; j<alreadyIncluded.length; j++) {
				var includeElement = alreadyIncluded[j];
				if (includeElement == include) {
					throw new Error("Recursive inclusion detected!");
				} else {
					prevIncluded.push(alreadyIncluded[j]);
				}
			}

			// Fetch commands of specified type (if any)
			var includedCommands = getPackageCmd(packageNode, include, prevIncluded);

			// Insert fetched commands to command list.
			if (includedCommands != null) {
				for (var iIncCmds=0; iIncCmds<includedCommands.length; iIncCmds++) {
					fullCommandList.push(includedCommands[iIncCmds]);
				}
			}
		} else {
			// Include command in command-list.
			fullCommandList.push(command);
		}
	}

	// Return list of applying commands.
	return fullCommandList;
}


/**
 * Returns array of package IDs which represent the package dependencies.
 * Returns empty array in case the package does not have any dependency.
 * 
 * @param packageNode
 *            the package node to read the list of dependencies from
 * @param packageList
 *            optional reference to an array which is used to insert the
 *            dependencies to. Specify null to create a new Array
 * @return Array specified in packageList parameter extended by package IDs
 *         (string values) which represent the dependencies
 */
function getPackageDependencies(packageNode, packageList) {
	// output array
	if (packageList == null) {
		packageList = new Array();
	}

	if(packageNode != null) {
		var dependNodes = packageNode.selectNodes("depends");
		if (dependNodes != null) {
			// Get only dependencies which match the current host.
			var matchingDependNodes = filterConditionalNodes(dependNodes, true);
			for (var i=0; i < matchingDependNodes.length; i++) {
				var dependId = matchingDependNodes[i].getAttribute("package-id");

				// convert to lower case if case-insensitive mode is on
				if (dependId != null) {
					if (!isCaseSensitive()) {
						dependId = dependId.toLowerCase();
					}
					packageList.push(dependId);
				}
			}
		}
	}

	return packageList;
}

/**
 * Returns the package execute attribute value (String)
 * 
 * @param packageNode
 *            the package node to get the attribute from
 * @return package execute attribute value, empty string if undefined
 */
function getPackageExecute(packageNode) {
	var execAttr = packageNode.getAttribute("execute");
	if (execAttr == null) {
		execAttr = "";
	}
	return execAttr;
}

/**
 * Returns the package ID string from the given package XML node.
 * 
 * @return package ID
 */
function getPackageID(packageNode) {
	return packageNode.getAttribute("id");
}

/**
 * Returns array of package IDs which represent the package includes. Returns
 * empty array in case the package does not have any dependency.
 * 
 * @param packageNode
 *            the package node to read the list of includes from
 * @param packageList
 *            optional reference to an array which is used to insert the
 *            includes to. Specify null to create a new Array
 * @return Array specified in packageList parameter extended by package IDs
 *         (string values) which represent the includes
 */
function getPackageIncludes(packageNode, packageList) {
	// output array
	if (packageList == null) {
		packageList = new Array();
	}

	if(packageNode != null) {
		var includeNodes = packageNode.selectNodes("include");
		if (includeNodes != null) {
			var matchingIncludeNodes = filterConditionalNodes(includeNodes, true);
			for (var i=0; i < matchingIncludeNodes.length; i++) {
				var dependId = matchingIncludeNodes[i].getAttribute("package-id");

				// convert to lower case if case-insensitive mode is on
				if (dependId != null) {
					if (!isCaseSensitive()) {
						dependId = dependId.toLowerCase();
					}
					packageList.push(dependId);
				}
			}
		}
	}

	return packageList;
}

/**
 * Reads the "manualInstall" attribute from a package node.
 * This attribute is true only if the package as installed manually via
 * command line. It is false for packages which are initially installed by
 * package synchronization.
 * 
 * @param packageNode the package from which the attribute is read.
 * @returns {Boolean} True if package was installed manually, false if it is
 *        applied by profile.
 */
function getPackageManualInstallation(packageNode) {
	// Initialize return variable.
	var isManualInstall = false;

	// Read yctual value.
	var manualInstall = packageNode.getAttribute("manualInstall");

	// Evaluate result.
	if (manualInstall != null && manualInstall == "true") {
		isManualInstall = true;
	}
	return isManualInstall;
}

/**
 * Returns the package name from the given package XML node
 * 
 * @return returns the package name attribute - empty string if no name is
 *         defined
 */
function getPackageName(packageNode) {
	var packageName = "";
	if(packageNode != null) {
		packageName = packageNode.getAttribute("name");
		if (packageName == null) {
			packageName = "";
		}
	}
	return packageName;
}

/**
 * Returns the corresponding package XML node from the package database
 * (packages.xml). Returns null in case no such package exists.
 */
function getPackageNode(packageID) {
	// get first node which matched the specified ID
	return getPackages().selectSingleNode("package[@id='" + packageID +"']");
}

/**
 * Returns the corresponding package XML node to the requested package ID by
 * searching the packages database first. If the package cannot be located
 * within the package database it prints an error and looks for the node within
 * the local settings database.
 * If even the local database does not contain such a package entry then it
 * prints an error about missing package definition. In case '/quitonerror' is
 * set it exits.
 *
 * If the package could be located within the local package database it prints
 * a warning and returns the local package node.
 *
 * Algorithmic description:
 *
 * <pre>
 * search package node within local package database
 * if found
 * 		return it
 * else
 * 		print warning
 * 		look for package within local settings
 * 		if found
 * 			print warning
 * 			return it
 * 		else
 * 			print error (or exit by throwing error in case of /quitonerror)
 * 			return null
 * 		fi
 * fi
 * </pre>
 */
function getPackageNodeFromAnywhere(packageID) {
	var packageNode = null;

	// try to get package node from package database
	var packageDBNode = getPackageNode(packageID);

	// check if node exists; if not then try to get the node from the settings
	if(packageDBNode != null) {
		// package found in package database, mark for installation/upgrade
		dinfo("Found package node '" + getPackageName(packageDBNode) + "' (" +
				getPackageID(packageDBNode) + ") in package database.");
		packageNode = packageDBNode;
	} else {
		// error package not in package database
		// looking for package node within the local settings file
		/*
		 * var packageNotFoundMessage = "Profile inconsistency: Package '" + packageID + "' does not exist within the
		 * package database. " + "Please contact your system administrator!";
		 * 
		 * warning(packageNotFoundMessage);
		 */

		// try to get package node from local settings
		var packageSettingsNode = getSettingNode(packageID);

		// if no package definition has been found jet the package is not
		// installed
		if(packageSettingsNode != null) {
			// Check if the package has been manually installed.
			var messageLocalOnly = "";
			var isManualInstall = getPackageManualInstallation(packageSettingsNode);
			if (isManualInstall == true) {
				messageLocalOnly = "Manually installed package not found in server database.";
			} else {
				messageLocalOnly = "Database inconsistency: Package with package ID '" +
								packageID + "' missing in package database. Package information " +
								"found on local installation:\n";
			}
			messageLocalOnly += "Package ID: " + messageLocalOnly + "\n" +
							"Package Name: " + getPackageName(packageSettingsNode) + "\n" +
							"Package Revision: " + getPackageRevision(packageSettingsNode) + "\n";
			warning(messageLocalOnly);
			packageNode = packageSettingsNode;
		} else {
			var messageNotFound = "Database inconsistency: Package with ID '" + packageID +
					"' does not exist within the package database or the local settings file. " +
					"Please contact your system administrator!";
			if (isQuitOnError()) {
				throw new Error(messageNotFound);
			} else {
				error(messageNotFound);
			}
		}
	}

	// return result
	return packageNode;
}

/**
 * Returns an array of all package nodes that can be installed. This list
 * includes all packages found in the package database. It does not include
 * local packages from the settings file (currently installed ones).
 * 
 * @return Array containing XML nodes (package nodes). Array might be of size 0
 */
function getPackageNodes() {
	// Retrieve packages.
	var packageNodes = getPackages().selectNodes("package");

	// make sure a package ID exists only once
	packageNodes = uniqueAttributeNodes(packageNodes, "id");

	// return this array
	return packageNodes;
}

/**
 * Returns the package notify attribute value
 * 
 * @param packageNode
 *            the package node to get the notify attribute from
 * @return Notify attribute value (true in case of String "true" false
 *         otherwise.
 */
function getPackageNotify(packageNode) {
	var returnvalue = true;
	var notify = packageNode.getAttribute("notify");
	if (notify == "false") {
		returnvalue = false;
	}
	return returnvalue;
}

/**
 * Returns the package priority from the given package XML node
 * 
 * @return package priority - returns 0 if no priority is defined
 */
function getPackagePriority(packageNode) {
	var priority = packageNode.getAttribute("priority");
	if (priority == null) {
		priority = 0;
	}
	return parseInt(priority);
}


/**
 * Returns the package reboot attribute value. This attribute can add
 * additional reboots but not limit or invalidate reboot flags set on the
 * command-level.
 *
 * This value can have three states:
 * 
 * <pre>
 * "true"      Immediate reboot after package installation.
 *             This will take precedence of any command-level reboot="postponed"
 *             attribute if present and reboot immediately after package
 *             installation.
 *             A reboot="true" attribute on command-level will still result in
 *             an immediate reboot.
 *             Resulting status depending on command-level reboot flag:
 *             "true"      immediate reboot after command execution
 *             "delayed"   reboot after package installation
 *             "postponed" reboot after package installation
 *             "false"     reboot after package installation
 * "postponed" Schedule reboot after installing all packages within this
 *             session, for example after synchronizing.
 *             Resulting status depending on command-level reboot flag:
 *             "true"      immediate reboot after command execution
 *             "delayed"   reboot after package installation
 *             "postponed" reboot after all actions are completed
 *             "false"     reboot after all actions are completed
 * "false"     No reboot unless one is defined at command-level.
 * or not set  Resulting status depending on command-level reboot flag:
 *             "true"      immediate reboot after command execution
 *             "delayed"   reboot after package installation
 *             "postponed" reboot after all actions are completed
 *             "false"     no reboot
 * </pre>
 *
 * As a result there are four possibilities to schedule a reboot in order of
 * precedence:
 * 
 * <pre>
 * immediate   Command node specified reboot=true, immediate reboot takes place.
 * package     Reboot is issued right after installing:
 *             - package specifies reboot="true"
 *               OR
 *             - any command node specified reboot="delayed"
 * postponed   Reboot will take place after all packages have been applied.
 *             - package specifies reboot="postponed"
 *               OR
 *             - any command node specified reboot="postponed"
 * none        No reboot is issued by this package:
 *             - package does not specify reboot or specifies reboot="false"
 *               AND
 *             - no command node specified any form of reboot reboot
 * </pre>
 *
 * This means that an immediate reboot always has the highest priority. You
 * can just set "reboot markers" on a "timeline" on package and command level
 * where the closest reboot marker will be executed:
 * immediate => package => postponed => none
 *
 * @return one of the states (string values):
 *             "true", always reboot after package installation
 *             "postponed", reboot before script exits
 *             "false", reboot only if command specified reboot=delayed/postponed
 *
 */
function getPackageReboot(packageNode) {
	var rebootAction = "false";
	var packageReboot = packageNode.getAttribute("reboot");
	if (packageReboot != null) {
		if (packageReboot == "true") {
			rebootAction = packageReboot;
		} else if (packageReboot == "postponed") {
			rebootAction = packageReboot;
		}
	}
	return rebootAction;
}

/**
 * Adds all packages referenced by the specified package node to the given
 * array. In other words all dependencies, chained packages and includes of the
 * given node will be appended to the array. If you specify null or an empty
 * array the array returned will contain all packages from the dependency tree
 * of the given package node.
 * 
 * @param packageNode
 *            full dependency tree of the specified package will be added to the
 *            given array.
 * @param packageArray
 *            Array to which all referenced packages are added to. Specify null
 *            to create a new array finally containing only the dependency tree
 *            of the specified package.
 * @return array containing all referenced packages (full package nodes). NOTE:
 *         The returned array is not sorted.
 */
function getPackageReferences(packageNode, packageArray) {
	if (packageArray == null) {
		packageArray = new Array();
	}

	// get dependencies, includes and chains
	var linkedPackageIDs = getPackageDependencies(packageNode, null);
	getPackageIncludes(packageNode, linkedPackageIDs);
	getPackageChained(packageNode, linkedPackageIDs);

	// add nodes if they are not yet part of the array
	for (var i=0; i < linkedPackageIDs.length; i++) {
		var currentNode = getPackageNodeFromAnywhere(linkedPackageIDs[i]);
		if (currentNode != null) {
			if(!searchArray(packageArray, currentNode)) {
				dinfo("Adding referenced package '" + getPackageName(currentNode) + "' (" +
						getPackageID(currentNode) + ") for package '" +
						getPackageName(packageNode) + "' (" + getPackageID(packageNode) +
						")");
				// add the package first (so it's not added again, this prevents
				// loops)
				packageArray.push(currentNode);

				// add dependencies of these package as well
				getPackageReferences(currentNode, packageArray);
			} else {
				dinfo("Referenced package '"  + getPackageName(currentNode) + "' (" +
						getPackageID(currentNode) + ") for package '" +
						getPackageName(packageNode) + "' (" + getPackageID(packageNode) +
						") already added.");
			}
		}
	}
}

/**
 * Returns the package version string from the given package XML node. Returns 0
 * if package has no revision specified.
 * 
 * @return String representing the package revision (might be a dot-separated
 *         version) <#>[.<#>]*
 */
function getPackageRevision(packageNode) {
	var packageRevision = packageNode.getAttribute("revision");
	if (packageRevision == null) {
		// set to string "0" if no revision is defined
		packageRevision = 0 + "";
	} else {
		// check if the revision contains the "%" character (environment
		// variable)
		if( packageRevision.match(new RegExp("%.+%"), "ig") ) {
			// Generate the correct environment.
			var previousEnv = getEnv();

			// set package specific environment
			loadPackageEnv(packageNode);

			// expand environment strings
			var wshObject = new ActiveXObject("WScript.Shell");
			packageRevision = wshObject.ExpandEnvironmentStrings(packageRevision);

			// reset environment
			loadEnv(previousEnv);
		}
	}
	return packageRevision;
}

/**
 * Returns XML node which contains all packages (package database).
 */
function getPackages() {
	if(packages == null) {
		var newPackages = createPackages();
		setPackages(newPackages);
	}
	return packages;
}

/**
 * Returns the action to be performed on a given package if the package is
 * applied to the current host.
 * Valid actions are:
 * "none"      No action; package installed already
 * "install"   Installation, package is new on the host
 * "upgrade"   Upgrade package which already exists on the system
 *             New version higher than installed version
 * "downgrade" Downgrade package which already exists on the system
 *             New version lower than installed version
 * 
 * @param packageNode
 *           The package to be checked.
 * @returns Action to be performed. Can be 0=nothing, 1=install, 2=upgrade, 3=downgrade.
 */
function getPackageInstallAction(packageNode) {
	// Action to be performed when
	var actionNone = "none";
	var actionInstall = "install";
	var actionUpgrade = "upgrade";
	var actionDowngrade = "downgrade";
	var action = actionNone;

	var packageName = getPackageName(packageNode);
	var packageID   = getPackageID(packageNode);
	var packageRev  = getPackageRevision(packageNode);
	var executeAttr = getPackageExecute(packageNode);
	// var notifyAttr  = getPackageNotify(packageNode);

	 // Search for the package in the local settings.
	var installedPackage = getSettingNode(packageID);

	// String to print in events which identifies the package.
	var packageMessage = "Package '" + packageName + "' (" + packageID + "): ";

	// Evaluate type of installation (install/upgrade/downgrade/none).
	// INSTALL:
	if (installedPackage == null) {
		// ONE-TIME INSTALL PACKAGE, NOT INSTALLED YET (according to settings)
		// Install the package after checking that it is not installed already.
		dinfo(packageMessage + "Not in local package database; Marking for installation.");
		action = actionInstall;

	// UPGRADE/DOWNGRADE:
	} else {
		// Get revision of installed package.
		var packageRevInstalled = getPackageRevision(installedPackage);
		// Compare Versions.
		var comparisonResult = versionCompare(packageRev, packageRevInstalled);

		if (comparisonResult > 0) {
			// ONE-TIME INSTALL PACKAGE, UPGRADE:
			info(packageMessage +
				"Already installed but version mismatch.\n" +
				"Installed revision: '" + packageRevInstalled + "'\n" +
				"Available revision: '" + packageRev + "'.\n" +
				"Preparing upgrade."
				);
			action = actionUpgrade;

		} else if (comparisonResult < 0) {
			// ONE-TIME INSTALL PACKAGE, DOWNGRADE:
			info(packageMessage +
				"Already installed but version mismatch.\n" +
				"Installed revision '" + packageRevInstalled + "'\n" +
				"Available revision: '" + packageRev + "'.\n" +
				"Preparing downgrade."
				);
			action = actionDowngrade;

		} else {
			// ONE-TIME INSTALL PACKAGE, ALREADY INSTALLED:

			if (executeAttr == "always") {
				// ALWAYS EXECUTION PACKAGE
				// Packages with exec attribute "always" will be installed on each run; regardless of their version.
				dinfo(packageMessage + "Is requested to be executed 'always'. Preparing installation.");
				action = actionInstall;

			} else if (isForceInstall()) {
				// if installation is forced, install anyway
				info(packageMessage + "Already installed. Re-installation enforced.");
				action = actionInstall;

			} else {
				// If execute is 'once' then package checks are not executed.
				// We just trust that the package is installed.
				if (executeAttr == "once") {
					dinfo(packageMessage + "Installed already.");
					action = actionNone;
				} else {
					// In case no execution attribute is defined
					// check real package state.
					if (getQueryMode() == "remote") {
						// Assume package is properly installed.
						action = actionNone;
					} else {
						// Verify that package is still installed.
						if (isInstalled(installedPackage)) {
							action = actionNone;
						} else {
							// Package found in local database but checks failed.
							// Maybe the user uninstalled the package manually.
							dinfo(packageMessage + "Installed but checks failed. Re-Installing.");
							action = actionInstall;
						}
					}
				}
			}
		}
	}
	return action;
}

/**
 * Returns list of packages which have been manually installed.
 * 
 * @returns List of packages manually installed in local settings database.
 *          Returns empty array if no package is found.
 */
function getPackagesManuallyInstalled() {
	if (manuallyInstalled == null) {
		// Get list of currently installed packages.
		var settings = getSettings();
		
		// Filter manually installed packages.
		// Fetch command-nodes from <commands><command type="type" /></commands> structure.
		manuallyInstalled = settings.selectNodes("package[@manualInstall=\"true\"]");

		// Return empty array if no package is found.
		if (manuallyInstalled == null) {
			manuallyInstalled = new Array();
		}
	}
	return manuallyInstalled;
}

/**
 * Returns an array of packages which are not assigned to the current host any more.
 * 
 * Packages which are manually installed are not included in the list of packages
 * to be removed. Except if the package does not exist on server side any more.
 * Therefore in case a package is removed from the server it is removed from
 * clients as well even if the package was installed manually because it is to be
 * assumed tha the administrator no longer wants to support this type of software.
 *  
 * @return Array of packages which will be removed during synchronization.
 */
function getPackagesRemoved() {
	dinfo("Evaluating packages to be removed.");
	/**
	 * Get package nodes referenced within the profile (and profile
	 * dependencies). This includes package dependencies as well.
	 */
	var profilePackageNodes = getProfilePackageNodes();

	// Get list of currently installed packages.
	var installedPackages = getSettingNodes();

	// Array to store packages to be removed.
	var removablesArray = new Array();

	// Loop over each installed package and check whether it still applies.
	for (var iInstalledPkg = 0; iInstalledPkg < installedPackages.length; iInstalledPkg++) {
		var installedPackageNode = installedPackages[iInstalledPkg];
		dinfo("Found installed package '" + getPackageName(installedPackageNode) + "' (" +
				getPackageID(installedPackageNode) + ").");

		// Search for the installed package in available packages.
		var found = false;

		for (var j=0; j < profilePackageNodes.length; j++) {
			var profilePackageNode = profilePackageNodes[j];
			if (getPackageID(installedPackageNode) == getPackageID(profilePackageNode)) {
				dinfo("Package '" + getPackageName(installedPackageNode) + "' (" +
						getPackageID(installedPackageNode) + ") found in profile packages.");
				found = true;
				break;
			}
		}

		// If package is no longer present, mark for remove if not installed manually.
		if (!found) {
			// Check if package was installed manually.
			// Manually installed packages remain on the system.
			var packageMessage = "Package '" + getPackageName(installedPackageNode) + "' (" +
			getPackageID(installedPackageNode) + "): ";
			var isManuallyInstalled = getPackageManualInstallation(installedPackageNode);
			if (isManuallyInstalled == true) {
				if (isZombie(installedPackageNode)) {
					// Package is not in server package database any more.
					dinfo("Package was manually installed but is " +
							"not in package database any more.  Marking package for removal.");
					removablesArray.push(installedPackageNode);
				} else {
					dinfo("Package was manually installed and is " +
							"still available in package database. Keeping package.");
				}
			} else {
				dinfo(packageMessage + "Marked for removal.");
				removablesArray.push(installedPackageNode);
			}
		}
	}

	return removablesArray;
}


/**
 * Returns a list of variables for the given package.
 * 
 * @param packageNode
 *            The package node to get the variables from.
 * @param array
 *            Object of type Array to which the the variables appended.
 *            In case null is supplied it returns a new Array object.
 * @return Object of type Scripting.Dictionary which contains all key/value
 *         pairs from the given package including its dependencies
 */
function getPackageVariables(packageNode, array) {
	dinfo("Reading variables from package '" + getPackageName(packageNode) + "'.");
	array = getVariables(packageNode, array);
	return array;
}

/**
 * Returns array of profile nodes which represent the profile dependencies.
 * Returns empty array in case the profile does not have any dependency.
 * 
 * @return Array of strings representing the references to dependent profiles
 */
function getProfileDependencies(profileNode) {
	// output array
	var dependencyNodes = new Array();

	var dependNodes = profileNode.selectNodes("depends");
	if (dependNodes != null) {
		// Get only dependencies which match the current host.
		var matchingDependNodes = filterConditionalNodes(dependNodes, true);
		for (var i=0; i < matchingDependNodes.length; i++) {
			var dependencyId = matchingDependNodes[i].getAttribute("profile-id");

			// convert dependency to lower case if case-sensitive mode is off
			if (dependencyId != null && !isCaseSensitive()) {
				dependencyId = dependencyId.toLowerCase();
			}

			// get the profile node
			var dependencyNode = getProfileNode(dependencyId);
			if (dependencyNode != null) {
				dependencyNodes.push(dependencyNode);
			} else {
				error("Profile '" + dependencyId + "' referenced but not " +
						"found. Ignoring profile.");
			}
		}
	}

	return dependencyNodes;
}

/**
 * Returns the corresponding profile ID stored within the given profile XML
 * node.
 * 
 * @return String representing the ID of the supplied profile node.
 */
function getProfileID(profileNode) {
	return profileNode.getAttribute("id");
}

/**
 * Returns an array of strings which represents the profiles directly referenced
 * by the applying host node. The profiles are evaluated as follows:
 * <pre>
 * - /profile:<profile> parameter
 * - /host:<hostname> parameter matching within hosts.xml
 * - profiles defined within host.xml which are assigned to the matching hosts entry
 * </pre>
 *
 * @return array of strings representing the referenced profiles
 */
function getProfileList() {
	if (applyingProfilesDirect == null) {
		var profilesMatching = new Array();

		// get arguments
		var argn = getArgv().Named;

		// Set the profile from either the command line or the hosts file.
		if (argn("profile") != null) {
			profilesMatching.push(argn("profile"));
		} else {
			var hostNodes = getHostsApplying();
			for (var ihostNode=0; ihostNode < hostNodes.length; ihostNode++) {
				profilesMatching = profilesMatching.concat(getHostProfiles(hostNodes[ihostNode]));
			}
			if (profilesMatching.length <= 0) {
				throw new Error("Could not find any profile for host " + getHostname() + ".");
			}
		}
		applyingProfilesDirect = profilesMatching;
	}
	return applyingProfilesDirect;
}

/**
 * Returns the corresponding profile XML node from the profile database
 * (profile.xml). Returns null in case no such profile exists.
 * 
 * @param profileID
 *            String representation of profile to get the node from.
 */
function getProfileNode(profileID) {
	// get first node which matched the specified ID
	return getProfiles().selectSingleNode("profile[@id='" + profileID +"']");
}

/**
 * Returns an array of all profile nodes available.
 * 
 * @return array of profile XML nodes.
 */
function getProfileNodes() {
	// Retrieve packages.
	var profileNodes = getProfiles().selectNodes("profile");

	// make sure a package ID exists only once
	profileNodes = uniqueAttributeNodes(profileNodes, "id");

	// return this array
	return profileNodes;
}

/**
 * Returns an array of strings which contains a list of package IDs referenced
 * by the currently applied profile(s).
 * 
 * The list will contain all referenced IDs within profile.xml which apply to
 * the current profile(s) (including profile dependencies). Packages which are
 * referenced but do not exist within the package database (packages.xml) are
 * included as well. So be aware that in case of inconsistency between
 * profiles.xml and packages.xml it might be possible that the returned list
 * refers to packages not available within packages.xml.
 * 
 * NOTE: The list does NOT contain IDs of package dependencies. Just the list of
 * packages as referred in profiles.xml. Dependency information is only available
 * within the concrete package nodes within packages.xml. Refer to
 * getProfilePackageNodes() to get packages including dependencies.
 * 
 * If you like to get a list of full package nodes have a look at
 * getProfilePackageNodes() but note that it cannot return full nodes for
 * packages referenced within profiles.xml but missing in the package database.
 * 
 * @return array of package IDs applying to this profile (empty array if no
 *         packages are assigned).
 */
function getProfilePackageIDs() {
	// Get array of all profiles that apply to the base profile.
	// This includes depending profiles
	var profileArray = getProfilesApplying();

	// Create array to store all referenced package IDs
	var packageIDs = new Array();

	// New date object, used for install/uninstall date comparison.
	var now = new Date();

	// Add each profile's package IDs to the array.
	for (var i=0; i < profileArray.length; i++) {
		profileNode = profileArray[i];

		// Load profile environment.
		var previousEnv = getEnv();

		// Array to store all variables found.
		var variables =  new Array();

		// Host variables first...
		variables = getHostsVariables(variables);

		// Get variables of this profile.
		variables = getVariables(profileNode, variables);

		// Apply variables to environment.
		for (var iVariable=0; iVariable < variables.length; iVariable++) {
			var varDefinition = variables[iVariable];
			var variableKeys = varDefinition.keys().toArray();
			for (var iVarKey = 0; iVarKey < variableKeys.length; iVarKey++) {
				var key = variableKeys[iVarKey];
				var value = varDefinition.Item(key);
				setEnv(key, value);
			}
		}

		// Fetch packages from profile.
		var profilePackageNodes = profileNode.selectNodes("package");
		// Filter out packages which shall not apply to this host
		var packageNodes = filterConditionalNodes(profilePackageNodes, true);

		// Add all package IDs to the array and avoid duplicates
		for (var j = 0; j < packageNodes.length; j++) {
			// get package ID
			var packageNode = packageNodes[j];
			var packageId = packageNode.getAttribute("package-id");
			// Skip package if package ID is not defined.
			if (packageId == null || packageId == "") {
				continue;
			}
			
			// Use package methods for profile package node because the
			// attribute is the same.
			var installDate = getProfilePackageInstallDate(packageNode);
			var uninstallDate = getProfilePackageUninstallDate(packageNode);
			var includePackage = true;

			// Check if package
			
			// Check if the package should be included regarding installation
			// period.
			if (installDate != null || uninstallDate != null) {
				// either install or uninstall date was defined
				if (now >= installDate &&
					now <= uninstallDate) {
					includePackage = true;
					dinfo("Package'" + packageId + "' specified an install date range: " +
						installDate + " to " + uninstallDate +
						"; current time (" + now + ") is within the time frame. Including package.");
				} else {
					includePackage = false;
					dinfo("Package '" + packageId + "' specified an install date range: " +
						installDate + " to " + uninstallDate +
						"; out of range, skipping package (local time: " + now + ").");
				}
			}

			// Search array for pre-existing ID, we don't want duplicates.
			if (includePackage) {
				// Check if package shall be included case-sensitive. If not;
				// convert to lower-case.
				if (!isCaseSensitive()) {
					packageId = packageId.toLowerCase();
				}
				var alreadyAdded = false;
				for (var k=0; k < packageIDs.length; k++) {
					if (packageIDs[k] == packageId) {
						alreadyAdded = true;
						break;
					}
				}
				if (!alreadyAdded) {
					packageIDs.push(packageId);
				}
			}
		}
		// Restore environment.
		loadEnv(previousEnv);
	}

	return packageIDs;
}

/**
 * Returns date object reflecting installation date defined in given node
 * 
 * @param packageNode
 *            the package definition node as specified within the profile
 *            definition
 * @return date object representing installation date. Null if date is undefined.
 */
function getProfilePackageInstallDate(packageNode) {
	var installDate = null;
	var packageInstallDate = packageNode.getAttribute("installdate");
	if (packageInstallDate != null) {
		installDate = parseISODate(packageInstallDate, false);
	}
	return installDate;
}

/**
 * Returns an array of package nodes that should be applied to the current
 * profile. This function returns full package nodes.
 *
 * NOTE: Since the profile
 * just contains the package IDs referenced within profiles.xml but not
 * existing within the packages database (packages.xml) will not be part of the
 * list.
 * 
 * In case you like to get a list of package IDs referenced by the profile
 * (regardless if the package definition exists) have a look at
 * getProfilePackageIDs().
 * 
 * @return array of package nodes applying to the assigned profile(s)
 */
function getProfilePackageNodes() {
	if (profilePackageNodes == null) {
		// Create a new empty package array.
		packageNodes = new Array();

		/*
		 * get package IDs which apply to the profile (without dependencies, includes and chained packages) regardless
		 * if the package definition is available or not.
		 */
		var packageIDs = getProfilePackageIDs();

		// get package definitions and all dependencies
		for ( var i = 0; i < packageIDs.length; i++) {
			var packageID = packageIDs[i];
			dinfo("Adding package with ID '" + packageID + "' to profile packages.");
			var packageNode = getPackageNodeFromAnywhere(packageID);

			// add dependencies first
			if (packageNode != null) {
				getPackageReferences(packageNode, packageNodes);
				if (!searchArray(packageNodes, packageNode)) {
					// Add the new node to the array _after_ adding dependencies.
					packageNodes.push(packageNode);
				}
			}
		}
		profilePackageNodes = packageNodes;
	}
	return profilePackageNodes;
}

/**
 * Returns Date representation of 'uninstalldate' attribute from the given
 * package definition as specified within the profile.
 * 
 * @param packageNode
 *            the package node to read the 'uninstalldate' attribute from
 * @return Date object representing uninstall date of the given package. Returns
 *         null in case the 'uninstalldate' attribute is not set.
 */
function getProfilePackageUninstallDate(packageNode) {
	var uninstallDate = null;
	var packageUninstallDate = packageNode.getAttribute("uninstalldate");
	if (packageUninstallDate != null) {
		uninstallDate = parseISODate(packageUninstallDate, true);
	}
	return uninstallDate;
}

/**
 * Returns XML node which contains all profiles (profile database).
 */
function getProfiles() {
	if(profiles == null) {
		var newProfiles = createProfiles();
		setProfiles(newProfiles);
	}
	return profiles;
}

/**
 * Returns an array of profile nodes that should be applied to the current
 * profile. This includes also all profile dependencies.
 * 
 * @return array of profiles (directly associated profiles and dependencies)
 */
function getProfilesApplying() {
	dinfo("Getting profiles which apply to this node.");
	if (applyingProfilesAll == null) {
		// create cache entry
		var profilesApplying = new Array();

		// get list of applying profiles
		var profileList = getProfileList();

		for (var i=0; i<profileList.length; i++) {
			// receive profile node
			var profileNode = getProfileNode(profileList[i]);

			if (profileNode != null) {
				dinfo("Applying profile: " + getProfileID(profileNode));

				// Add the current profile's node as the first element in the
				// array.
				profilesApplying.push(profileNode);

				appendProfileDependencies(profilesApplying, profileNode);
			} else {
				error("Profile '" + profileList[i] + "' applies to this host but was not found!");
			}
		}
		applyingProfilesAll = profilesApplying;
	}
	return applyingProfilesAll;
}

/**
 * Returns the log level associated with a given profile.
 * 
 * @return merged log levels from all applying profiles. For example if one
 *         profile specifies info logging and a second profile specifies error.
 *         The resulting log level will be info+error. Returns null if no custom
 *         log level is specified for this profile.
 */
function getProfilesLogLevel() {
	// set initial bitmask to 0x00;
	var logLevel = 0x00;

	// merge log levels
	try {
		var profileList = getProfileList();
		for (var i=0; i<profileList.length; i++) {
			var profileId = profileList[i];
			var profileNode = getProfileNode(profileId);
			if (profileNode != null) {
				// add bitmask
				logLevel = logLevel | profileNode.getAttribute("logLevel");
			}
		}
	} catch (e) {
		// Unable to read profile-specific log leve.
		// Maybe there is no profile found for this host.
		dinfo("No profile-specific log level found.");
	}
	if (logLevel > 0x00) {
		return logLevel;
	} else {
		return null;
	}
}

/**
 * Returns a list of variables from the Profile.
 * 
 * @param array
 *            Object of type Array to which the the variables are appended.
 *            In case null is supplied it returns a new Array object.
 * @return Object of type Scripting.Dictionary which contains all key/value
 *         pairs from the given profile including its dependencies
 */
function getProfileVariables(array) {
	dinfo("Reading variables from profile[s]");
	if (profilesVariables == null) {
		profilesVariables = new Array();
		var profileArray = getProfilesApplying();
		// dinfo(profileArray.length + " profiles apply to this host.");

		/*
		 * add each profile's variables to the array in reverse order reversing the order is done in order to allow
		 * overwriting of variables from dependent profiles
		 */

		for (var iProfiles=profileArray.length-1; iProfiles >= 0; iProfiles--) {
			var profileNode = profileArray[iProfiles];
			dinfo("Reading variables from profile " + getProfileID(profileNode));

			// Add variables from profile XML node.
			profilesVariables = getVariables(profileNode, profilesVariables);
		}
	}

	var concatenatedVariables = profilesVariables;
	if (array != null) {
		concatenatedVariables = profilesVariables.concat(array);
	}

	return concatenatedVariables;
}

/**
 * Returns current state of query mode.
 * @returns {String} Current query mode.
 */
function getQueryMode() {
	return queryMode;
}

/**
 * Returns the corresponding package XML node from the settings database
 * (wpkg.xml). Returns null in case no such package is installed.
 * 
 * @param packageID
 *            ID of the package to be returned
 * @return returns package XML node as stored within the settings. Returns null
 *         if no such package exists.
 */
function getSettingNode(packageID) {
	// get first node which matched the specified ID
	return getSettings().selectSingleNode("package[@id='" + packageID +"']");
}


/**
 * Tries to read host attributes from the settings database.
 * All host attributes found in the settings database will be used to override
 * attributes of the local host.
 */
function getSettingHostAttributes() {
	// Fetch settings.
	var settings = getSettings();
	var attributes = settings.attributes;

	// Check whether attributes are defined.
	if (attributes.length > 0) {

		// Reset cache for host information.
		resetHostInformationCache();
		
		for (var iAttribute=0; iAttribute < attributes.length; iAttribute++) {
			var node = attributes.item(iAttribute);
			var attribute = node.nodeName;

			var value = node.nodeValue;
			switch (attribute) {
			case "hostname":
				setHostname(value);
				break;

			case "architecture":
				setArchitecture(value);
				break;

			case "os":
				setHostOS(value);
				break;

			case "ipaddresses":
				var ipList = value.split(",");
				setIPAddresses(ipList);
				break;

			case "domainname":
				setDomainName(value);
				break;

			case "groups":
				var hostGroupList = value.split(",");
				setHostGroups(hostGroupList);
				break;

			case "lcid":
				setLocale(value);
				break;

			case "lcidOS":
				setLocaleOS(value);
				break;

			default:
				break;
			}
		}
	}
}

/**
 * Returns an array of all installed packages from the local wpkg.xml
 * 
 * @return Array of installed packages (XML nodes)
 */
function getSettingNodes() {
	// retrieve packages
	var packageNodes = getSettings().selectNodes("package");

	// make sure a package ID exists only once
	// commented since the local database should not contain duplicated entries
	packageNodes = uniqueAttributeNodes(packageNodes, "id");

	// return this array
	return packageNodes;
}

/**
 * Returns current path to settings file.
 * 
 * @returns Settings file FS object.
 */
function getSettingsPath() {
	if (settings_file == null || settings_file == "") {
		// Will be used for file operations.
		var fso = new ActiveXObject("Scripting.FileSystemObject");

		// Evaluate path.
		// Our default settings file is located in %SystemRoot%\system32.
		// If settings path was not specified via command line, then evaluate it
		// from the configuration file or fall back to default.
		if (settings_file_path == null) {
			var SystemFolder = 1;
			settings_file_path = fso.GetSpecialFolder(SystemFolder);
		}
		settings_file = settings_file_path + "\\" + settings_file_name;
		settings_file_processed = false;
	}

	if (!settings_file_processed) {
		// Check whether [PROFILE] epxression was used and repace it.
		var profileExp = new RegExp("\\[PROFILE\\]", "g");
		if (profileExp.test(settings_file) == true) {
			// This will throw an error if profile is not available yet.
			var profileList = getProfileList();
	
			// concatenate profile names or throw error if no names
			// available
			if (profileList.length > 0) {
				var allProfiles = "";
				for (var i=0; i<profileList.length; i++) {
					if (allProfiles == "") {
						allProfiles = profileList[i];
					} else {
						allProfiles += "-" + profileList[i];
					}
				}
				settings_file = settings_file.replace(profileExp, allProfiles);
			} else {
				throw new Error("Profile information not available.");
			}
		}
	
		// Check whether [HOSTNAME] expression was used and replace it.
		var hostnameExp = new RegExp("\\[HOSTNAME\\]", "g");
		if (hostnameExp.test(settings_file) == true) {
			settings_file = settings_file.replace(hostnameExp, getHostname());
		}
	}

	return settings_file;
}

/**
 * Returns XML node which contains all settings (local package database).
 */
function getSettings() {
	if(settings == null) {
		var newSettings = createSettings();
		setSettings(newSettings, true);
	}
	return settings;
}

/**
 * Returns the checkResults node of the settings database.
 * 
 * @returns checkResults node of currently loaded settings database.
 */
function getSettingsCheckResults() {
	var currentSettings = getSettings();
	var checkResults = currentSettings.selectSingleNode("checkResults");
	if (checkResults == null) {
		var xmlDoc = new ActiveXObject("Msxml2.DOMDocument.3.0");
		checkResults = xmlDoc.createElement("checkResults");
		currentSettings.appendChild(checkResults);
	}
	return checkResults;
}

/**
 * Adds the given check node to the checkResults list in the settings database.
 * 
 * @param checkNode Check XML node to be inserted.
 * @param result Result of the check on current node.
 */
function addSettingsCheckResult(checkNode, result) {
	try {
		// Clone XML node to be added to settings.
		var settingsCheckNode = checkNode.cloneNode(false);

		// Check if there is already a check with the same attributes.
		var previousChecks = getSettingsCheck(settingsCheckNode);

		// Fetching checkResults node from settings.
		var checkResults = getSettingsCheckResults();
	
		// If a check was found then remove it from the results in order to avoid
		// duplicate entries. Checks might also be executed multiple times (with
		// potentially different results) and only the last result should be kept.
		if (previousChecks != null) {
			for (var i=0; i < previousChecks.length; i++) {
				dinfo("Replacing check results of previous evaluation");
				var previousCheck = previousChecks[i];
				checkResults.removeChild(previousCheck);
			}
		}
	
		// Add result attribute.
		var resultValue = "false";
		if(result != null && result == true) {
			resultValue = "true";
		}
		settingsCheckNode.setAttribute("result", resultValue);
		
		// Add check results node.
		checkResults.appendChild(settingsCheckNode);
	
		// Save modified settings.
		saveSettings(false);
	} catch (e) {
		error("Unable to add result of check to settings: " + e.message);
	}
}

/**
 * Returns result of pre-evaluated check from settings node.
 * 
 * @param checkNode the check node for which to look in the settings
 * "checkResults" nodes to verify if the check has been executed already.
 * 
 * @returns result of already evaluated check. Returns null if the check has
 *          not been evaluated and saved to settings node before.
 */
function getSettingsCheckResult(checkNode) {
	var result = null;
	var previousChecks = getSettingsCheck(checkNode);
	if (previousChecks != null) {
		// Get latest check result.
		var previousCheck = previousChecks[previousChecks.length-1];
		var checkResult = previousCheck.getAttribute("result");
		if (checkResult != null && checkResult == "true") {
			result = true;
		} else {
			result = false;
		}
		dinfo("Found previously executed check with result '" + result + "'.");
	}
	return result;
}

/**
 * Takes a check as a parameter and looks for the same check in the local
 * settings database. If an identical check with results is found, then this
 * check is returned in an array. Returns null if no identical check could be
 * found in the local settings database.
 * 
 * @param checkNode check to seek for in local settings databse.
 *  
 * @returns Array of matching checks; returns null if no check match.
 */
function getSettingsCheck(checkNode) {
	if (checkNode == null) {
		return null;
	}
	var result = null;
	var currentSettings = getSettings();

	var checkResults = currentSettings.selectSingleNode("checkResults");

	if (checkResults != null) {
		var attributes = checkNode.attributes;

		// Check whether attributes are defined.
		if (attributes.length > 0) {
			var attributesClause = "";
			var checkMessage = "";
			for (var iAttribute=0; iAttribute < attributes.length; iAttribute++) {
				if (attributesClause != "") {
					attributesClause += " and ";
					checkMessage += ", ";
				}
				var node = attributes.item(iAttribute);
				var attribute = node.nodeName;
				var value = node.nodeValue.replace(new RegExp("\\\\", "g"), "\\\\");
				attributesClause += "@" + attribute + "=\"" + value + "\"";
				checkMessage += attribute + "='" + value +"'";
			}
			// Get all nodes which match the attributes.
			dinfo("Searching for previously executed checks with attributes " + checkMessage);
			var xPathQuery = "check[" + attributesClause + "]";
			// dinfo("Query to find previously executed check: " + xPathQuery);
			var checkNodes = checkResults.selectNodes(xPathQuery);

			if (checkNodes != null) {
				// Make sure the check nodes found do not contain any attributes
				// not present in comparison node.
				for (var iCheck=0; iCheck < checkNodes.length; iCheck++) {
					var checkNode = checkNodes[iCheck];
					// dinfo("Found previously executed check: " + checkNode.xml);
					var checkAttributes = checkNode.attributes;
					var allAttrFound = true;
					
					// Iterate over all attributes of the check node found and
					// verify that the attribute is found in comparison node.
					// (Except the result attribute)
					for (var iAttr=0; iAttr < checkAttributes.length; iAttr++) {
						var attrFound = false;
						var checkAttrSettings = checkAttributes.item(iAttr).nodeName;

						if (checkAttrSettings == "result") {
							attrFound = true;
						} else {
							for (var iRefAttr=0; iRefAttr < attributes.length; iRefAttr++) {
								var checkAttrRef = attributes.item(iRefAttr).nodeName;
								if (checkAttrRef == checkAttrSettings) {
									attrFound = true;
									break;
								}
							}
						}

						// If attribute has not been found in comparison node
						// Then the node contains different checks.
						if (attrFound == false) {
							allAttrFound = false;
							break;
						}
					}
					
					// If all attributes were found in original query node then
					// the check is identical to the one in the settings DB.
					if (allAttrFound) {
						if (result == null) {
							result = new Array();
						}
						result.push(checkNode);
					}
				}
			}
			if (result != null) {
				dinfo("Found " + result.length + " previously executed checks.");
			} else {
				dinfo("Unable to find any previously executed checks with these attributes.");
			}
		}
	}
	return result;
}


/**
 * Returns a list of package nodes (Array object) which have been scheduled for
 * removal but are not removed due to the /noremove flag.
 * 
 * @return Array of package nodes which would have been removed during this
 *         session
 */
function getSkippedRemoveNodes() {
	if (skippedRemoveNodes == null) {
		skippedRemoveNodes = new Array();
	}
	return skippedRemoveNodes;
}

/**
 * Returns a list of key/value pairs representing all variable definitions from
 * the given XML node.
 * 
 * @param XMLNode
 *            The XML node to get the variables from
 * @param array
 *            Object of type Array to which the the variables are appended.
 *            In case null is supplied it returns a new Array object.
 *            Each array element is a dictionary object containing a key and
 *            a value. The key is the variable name and the value is the
 *            variable value to be assigned.
 * @return Object of type Scripting.Dictionary which contains all key/value
 *         pairs from the given XML node.
 */
function getVariables(XMLNode, array) {
	// a new empty array of variables
	var variables = null;

	// make sure variables is either created or assigned
	if(array == null) {
		// variables = new ActiveXObject("Scripting.Dictionary");
		variables = new Array();
	} else {
		variables = array;
	}

	var variableNodes = XMLNode.selectNodes("variable");

	// Perform host matching on variables.
	variableNodes = filterConditionalNodes(variableNodes, true);

	for (var i=0; i < variableNodes.length; i++) {
		var variableName = variableNodes[i].getAttribute("name");
		var variableValue = variableNodes[i].getAttribute("value");

		if (variableName == null || variableValue == null) {
			error("Incomplete variable specification found. " +
					"Variable name is '" + variableName + "' and variable value is '" +
					variableValue + "'. Ignoring variable.");
			continue;
		}
		
		// Expand environment variables in value.
		// variableValue = shell.ExpandEnvironmentStrings(variableValue);
		dinfo("Got variable '" + variableName + "' of value '" + variableValue + "'");

		var variable = new ActiveXObject("Scripting.Dictionary");
		variable.Add(variableName, variableValue);
		
		// Add to variables list.
		variables.push(variable);
	}

	return variables;
}

/**
 * Installs the specified package node to the system. If an old package node is
 * supplied performs an upgrade. In case the old package node is null an
 * installation is performed.
 * 
 */
function installPackage(packageNode) {
	// Initialize return value.
	var success = false;
	
	var packageName = getPackageName(packageNode);
	var packageID   = getPackageID(packageNode);
	var packageRev  = getPackageRevision(packageNode);
	var executeAttr = getPackageExecute(packageNode);
	var notifyAttr  = getPackageNotify(packageNode);
	var rebootAttr  = getPackageReboot(packageNode);

	// Get check policies.
	var installCheckPolicy = getPackagePrecheckPolicyInstall(packageNode);
	var upgradeCheckPolicy = getPackagePrecheckPolicyUpgrade(packageNode);
	var downgradeCheckPolicy = getPackagePrecheckPolicyDowngrade(packageNode);

	dinfo("Going to install package '" + packageName + "' (" + packageID +
		"), Revision " + packageRev + ", (execute flag is '" + executeAttr +
		"', notify flag is '" + notifyAttr + "').");

	 // search for the package in the local settings
	var installedPackage = getSettingNode(packageID);

	// Check if package is manually installed.
	if (installedPackage != null) {
		var isManual = getPackageManualInstallation(installedPackage);
		if (isManual == true) {
			// Transfer manual install flag to new package.
			setPackageManualInstallation(packageNode, true);
		}
	}
	
	
	// if set then the package installation will be bypassed
	var bypass = false;
	// type of installation "install" or "upgrade"
	var typeInstall = "install";
	var typeUpgrade = "upgrade";
	var typeDowngrade = "downgrade";
	var installType = typeInstall;

	// string to print in events which identifies the package
	var packageMessage = "Package '" + packageName + "' (" + packageID + ")" +
						": ";

	// check if the package has been executed already
	if(searchArray(packagesInstalled, packageNode)) {
		// has been installed already during this session
		dinfo(packageMessage +
				"Already installed once during this session.\n" +
				"Checking if package is properly installed.");
		bypass=true;

		// check if installation of package node was successful
		if ((installedPackage != null) &&
			(versionCompare(getPackageRevision(installedPackage), packageRev) >= 0)) {
			// package successfully installed
			dinfo(packageMessage + "Verified; " +
				"package successfully installed during this session.");

			success = true;

		} else {
			dinfo(packageMessage +
				"Installation failed during this session.");
			// package installation must have been failed

			success = false;

		}
	} else {
		// mark package as processed
		packagesInstalled.push(packageNode);

		dinfo(packageMessage + "Not yet processed during this session.");
		bypass = false;
		// evaluate what do do with the package

		// Get action of package to be installed.
		var packageAction = getPackageInstallAction(packageNode);
		
		// Evaluate installation actions.
		switch (packageAction) {
		case "none":
			// No package actions shall be performed.
			dinfo(packageMessage + "Already installed.");
			installType = typeUpgrade;
			bypass = true;
			success = true;
			break;

		case "install":
			// Package needs to be installed.
			dinfo(packageMessage + "Prepared for installation.");
			installType = typeInstall;
			bypass = false;
			success = false;

			// If execute attribute is set to "always" just continue with installation.
			if (executeAttr == "always") {
				break;
			}
			if (installCheckPolicy == "never") {
				// Checks shall be bypassed and package is installed in any case.
				dinfo(packageMessage + "Skipping checks whether package is already installed.");
			} else {
				// Default is to execute checks first in order to evaluate if
				// package is already installed.
				if (isInstalled(packageNode)) {
					info(packageMessage +
						"Already installed (checks succeeded). Checking dependencies and chained packages.");

					// append new node to local xml
					addSettingsNode(packageNode, true);

					// install all dependencies
					var depSuccess = installPackageReferences(packageNode, "dependencies");
					if (depSuccess) {
						info(packageMessage +
							 "Package and all dependencies are already installed. Skipping.");

					} else {
						info(packageMessage +
							"Installed but at least one dependency is missing.");
					}

					// install all chained packages
					var chainedSuccess = installPackageReferences(packageNode, "chained");
					if (chainedSuccess) {
						info(packageMessage +
							 "Package and all chained packages are already installed. Skipping.");

					} else {
						info(packageMessage +
						"Installed but at least one chained package is missing.");
					}

					// Bypass installation as installations seems to be done already.
					bypass = true;
					installType = typeInstall;

					// Still set success to true since the package seems to be
					// installed properly (check succeed).
					success = true;

				} else {
					// Package not installed yet. Perform normal installation.
					info(packageMessage +
						"Not installed (checks failed). Preparing installation.");
				}
			}
			break;

		case "upgrade":
			// Package needs to be upgraded.
			dinfo(packageMessage + "Prepared for upgrade.");
			installType = typeUpgrade;
			bypass = false;
			success = false;

			// If check policy is set to "always" then verify if the upgrade
			// might have been performed already.
			if (upgradeCheckPolicy == "always" && isInstalled(packageNode)) {
				// Package marked for upgrade but upgrade is not necessary.
				dinfo(packageMessage +
						"Forced checks on upgrades succeeded. Package already up to date.");

				// Update local package database.
				addSettingsNode(packageNode, true);

				// Package does not need to be upgraded.
				bypass = true;
				success = true;
			}
			break;

		case "downgrade":
			// Package needs to be downgraded.
			dinfo(packageMessage + "Prepared for downgrade.");
			installType = typeDowngrade;
			bypass = false;
			success = false;

			// If check policy is set to "always" then verify if the downgrade
			// might have been performed already.
			if (downgradeCheckPolicy == "always" && isInstalled(packageNode)) {
				dinfo(packageMessage +
					"Forced checks on downgrade succeeded. Package already downgraded.");

				// Update local package database.
				addSettingsNode(packageNode, true);

				// Package does not need to be downgraded.
				bypass = true;
				success = true;
			}
			break;

		default:
			bypass = true;
			error("Unknown package action: " + packageAction);
			break;
		}
	}

	if (!bypass) {
		// Store current environment.
		var previousEnv = getEnv();

		try {
			// install dependencies
			var depInstallSuccess = installPackageReferences(packageNode, "dependencies");

			// abort installation in case dependencies could not be installed
			if (!depInstallSuccess) {
				throw new Error("Installing dependencies failed");
			}

			// print event log entry
			info("Installing '" + packageName + "' (" + packageID + ")...");
			logStatus("Performing operation (" + installType + ") on '" + packageName + "' (" + packageID + ")");

			// stores if the package needs a reboot after installation
			var rebootRequired = false;

			// stores if the package needs a reboot after installing all
			// packages
			var rebootPostponed = false;

			// Generate the correct environment.

			// Set package specific environment.
			loadPackageEnv(packageNode);

			// Select command lines to install.
			var cmds;
			dinfo("Install type: " + installType);
			if (installType == typeUpgrade) {
				// installation is an upgrade
				cmds = getPackageCmdUpgrade(packageNode, null);
				dinfo("Fetched " + cmds.length + " upgrade command(s).");
			} else if (installType == typeDowngrade) {
				// prepare downgrade
				cmds = getPackageCmdDowngrade(packageNode, null);
				dinfo("Fetched " + cmds.length + " downgrade command(s).");
			}else {
				// installation is default
				cmds = getPackageCmdInstall(packageNode, null);
				dinfo("Fetched " + cmds.length + " install command(s).");
			}

			// Get downloads from package node (if any).
			var downloadNodes = getDownloads(packageNode, null);
			// Append downloads from command node.
			for (var iCommands = 0; iCommands < cmds.length; iCommands++) {
				var commandNode = cmds[iCommands ];
				getDownloads(commandNode, downloadNodes);
			}

			// Download all specified downloads.
			var downloadResult = downloadAll(downloadNodes);
			if (downloadResult != true) {
				var failureMessage = "Failed to download all files.";
				if (isQuitOnError()) {
					throw new Error(failureMessage);
				} else {
					error(failureMessage);
				}
			}

			// execute each command line
			for (var iCmd = 0; iCmd < cmds.length; iCmd++) {
				// execute commands
				var cmdNode = cmds[iCmd];
				var cmd = getCommandCmd(cmdNode);
				if(cmd == null) {
					error("Error: Command missing. Please fix the package. Ignoring command.");
					continue;
				}
				var timeout = getCommandTimeout(cmdNode);
				var workdir = getCommandWorkdir(cmdNode);

				// mark system as changed (command execution in progress)
				setSystemChanged();
				if (notifyAttr) {
					// notify user about start of installation
					notifyUserStart();
				}

				var result = 0;
				result = exec(cmd, timeout, workdir);

				// search for exit code
				var exitAction = getCommandExitCodeAction(cmdNode, result);

				// check for special exit codes
				if (exitAction != null) {
					if (exitAction == "reboot") {
						// This exit code forces a reboot.
						info("Command in installation of " + packageName +
							" returned exit code [" + result + "]. This " +
							"exit code requires an immediate reboot.");
						reboot();
					} else if (exitAction == "delayedReboot") {
						// This exit code schedules a reboot
						info("Command in installation of " + packageName +
							" returned exit code [" + result + "]. This " +
							"exit code schedules a reboot.");
						// schedule reboot
						rebootRequired = true;
						// proceed with next command
						continue;
					} else if (exitAction == "postponedReboot") {
						info("Command in installation of " + packageName +
							" returned exit code [" + result + "]. This " +
							"exit code schedules a postponed reboot.");
						rebootPostponed = true;
						setPostponedReboot(rebootPostponed);
						// execute next command
						continue;
					} else {
						// this exit code is successful
						info("Command in installation of " + packageName +
							" returned exit code [" + result + "]. This " +
							"exit code indicates success.");
						// execute next command
						continue;
					}
				} else if(result == 0) {
					// if exit code is 0, return success
					// execute next command
					dinfo("Command in installation of " + packageName +
						" returned exit code [" + result + "]. Success.");
					continue;
				} else {
					// command did not succeed, throw an error
					throw new Error("Exit code returned non-successful value (" +
							result + ") on command '" + cmd + "'");
				}
			}

			// packages with checks have to pass the isInstalled() test
			if (getChecks(packageNode).length > 0 && !isInstalled(packageNode)) {
				// package failed for now
				success = false;

				// check if a delayed reboot has been scheduled
				// if reboot is scheduled it might be OK if the package check
				// fails
				if (rebootRequired || rebootAttr == "true") {
					warning("Package processing (" + installType + ") failed for package " +
						packageName + ".\nHowever the package requires a reboot to complete. Rebooting.");
					// reboot system without adding to local settings yet
					reboot();
				} else if (rebootPostponed || rebootAttr == "postponed") {
					warning("Package processing (" + installType + ") failed for package " +
						packageName + ".\nHowever the package schedules a postponed reboot.");
				} else {
					// package installation failed
					var failMessage = "Could not process (" + installType + ") " + packageName + ".\n" +
								"Failed checking after installation.";
					if (isQuitOnError()) {
						throw new Error(failMessage);
					} else {
						error(failMessage);
					}
				}
			} else {
				success = true;
				// append new node to local xml
				addSettingsNode(packageNode, true);

				// install chained packages
				var chainedStatus = installPackageReferences(packageNode, "chained");
				if (chainedStatus) {
					info(packageMessage +
						 "Package and all chained packages installed successfully.");

				} else {
					info(packageMessage +
					"Package installed but at least one chained package failed to install.");
				}

				// Reboot the system if needed.
				if (rebootRequired || rebootAttr == "true") {
					info("Installation of " + packageName + " successful, system " +
						"rebooting.");
					reboot();
				} else if (rebootPostponed || rebootAttr == "postponed") {
					info("Installation of " + packageName + " successful, postponed reboot scheduled.");
					setPostponedReboot(true);
				} else {
					info("Processing (" + installType + ") of " + packageName + " successful.");
				}
			}
		} catch (err) {
			success = false;
			var errorMessage = "Could not process (" + installType + ") package '" +
							 packageName + "' (" + packageID + "):\n" + err.description + ".";
			if (isQuitOnError()) {
				throw new Error(errorMessage);
			} else {
				error(errorMessage);
			}
		} finally {
			// cleaning up temporary downloaded files
			dinfo("Cleaning up temporary downloaded files");
			// clean downloads
			downloadsClean(downloadNodes);

			// restore old environment
			dinfo("Restoring previous environment.");
			// restore previous environment
			loadEnv(previousEnv);
		}
	}
	return success;
}

 /**
	 * Installs all packages references of the selected type. Returns true in
	 * case all references could be installed. Returns false if at least one
	 * reference failed.
	 * 
	 * @param packageNode
	 *            package to install the references of (XML node) NOTE: The
	 *            package itself is not installed.
	 * @param referenceType
	 *            select "dependencies" or "chained". Defaults to
	 *            "dependencies".
	 * @return true=all dependencies installed successful; false=at least one
	 *         dependency failed
	 */
 function installPackageReferences(packageNode, referenceType) {
 	var problemDesc = "";
 	var refSuccess = true;

 	// get references
 	var type;
 	var references = new Array();
 	switch (referenceType) {
	case "chained":
		type = "chained";
	 	references = getPackageChained(packageNode, null);
		break;

	default:
		type = "dependencies";
		references = getPackageDependencies(packageNode, null);
		break;
	}
 	if (references.length > 0) {
 		info("Installing references (" + type + ") of '" +
 				getPackageName(packageNode) +
 				"' (" + getPackageID(packageNode) + ").");
 	}
 	for (var i=0; i < references.length; i++) {
 		var refPackage = getPackageNodeFromAnywhere(references[i]);
 		if (refPackage == null) {
 			problemDesc += "Package references '" + references[i] +
 						"' but no such package exists";
 			refSuccess = false;
 			break;
 		} else {
 			// install this package
 			var success = installPackage(refPackage);
 			if (!success) {
 				problemDesc += "Installation of reference (" + type + ") package '"
 					+ getPackageName(refPackage) + "' ("
 					+ getPackageID(refPackage) + ") failed";
 				refSuccess = false;
 				// skip remaining references
 				break;
 			}
 		}
 	}
 	if (refSuccess) {
 		var successMessage = "Installation of references (" + type + ") for '" +
 						 getPackageName(packageNode) + "' (" +
 						 getPackageID(packageNode) + ") successfully finished.";
 		dinfo(successMessage);
 	} else {
 		var failMessage = "Installation of references (" + type + ") for '" +
 						 getPackageName(packageNode) + "' (" +
 						 getPackageID(packageNode) + ") failed. " + problemDesc;
 		if (isQuitOnError()) {
 			throw new Error(failMessage);
 		} else {
 			error(failMessage);
 		}
 	}

 	return refSuccess;
 }


/**
 * Installs a package by name.
 * 
 * @param name Package ID of package to be installed.
 * @param manualInstall Boolean value specifying whether the package is
 *        manually added. These packages are handled differently and not
 *        removed during synchronization. 
 */
function installPackageName(name, manualInstall) {
	// Check package name.
	if (name == null || name == "") {
		info("Package ID missing!");
		return;
	}

	// Query manual installation flag.
	var isManual = false;
	if (manualInstall != null && manualInstall == true) {
		isManual = true;
	}

	// Query the package node.
	var node = getPackageNode(name);

	if (node == null) {
		info("Package " + name + " not found!");
		return;
	}
	
	// Set manual installation flag.
	if (isManual) {
		setPackageManualInstallation(node, true);
	}

	 installPackage(node);
}

/**
 * Returns true if running on a 64-bit system. False if running on a 32-bit
 * system.
 * 
 * Please note that WPKG needs to be run from the local 64-bit cscript
 * instance in order to be able to access 64-bit directories and registry keys.
 * The 64-bit instance of cscript is located at %SystemRoot%\system32\. If
 * cscript from %SystemRoot%\SysWOW64\ is used (32-bit binary) then all reads to
 * %ProgramFiles% will be redirected to %ProgramFiles(x86). Hence it is not
 * possible for WPKG to access the "real" %ProgramFiles% folder with the 64-bit
 * binaries. The same applies for the registry. If 32-bit cscript is used all
 * reads to HKLM\Software\* are redirected to HKLM\Software\Wow6432Node\*.
 * 
 * WARNING: If cscript is invoked from a 32-bit application it is not possible
 * to run the 64-bit version of cscript since the real %SystemRoot%\System32
 * directory is not visible to 32-bit applications. So Windows will invoke the
 * 32-bit version even if the full path is specified!
 * 
 * A work-around is to copy the 64-bit cmd.exe from %SystemRoot%\System32
 * manually to a temporary folder and invoke it by using
 * c:\path\to\64-bit\cmd.exe /c \\path\to\wpkg.js
 * 
 * @return true in case the system is running on a 64-bit Windows version.
 *         otherwise false is returned.
 */
function is64bit() {
	if (x64 == null) {
		x64 = false;
		var architecture = getArchitecture();
		if (architecture != "x86") {
			x64 = true;
		}
	}
	return x64;
}

/**
 * Returns the current setting of apply multiple configuration.
 * 
 * @returns Current state of apply multiple setting.
 */
function isApplyMultiple() {
	return applyMultiple;
}


/**
 * returns current state of case sensitivity flag
 * 
 * @return true if case case sensitivity is enabled, false if it is disabled
 *         (boolean)
 */
function isCaseSensitive() {
	return caseSensitivity;
}

/**
 * Returns current debug status.
 * 
 * @return true if debug state is on, false if debug is off
 */
function isDebug() {
	return debug;
}

/**
 * Returns current dry run status.
 * 
 * @return true if dry run state is on, false if dry run is off
 */
function isDryRun() {
	return dryrun;
}

/**
 * Returns current value of the force flag.
 * 
 * @return true if force is enabled, false if it is disabled (boolean).
 */
function isForce() {
	return force;
}

/**
 * Returns current value of the forceinstall flag.
 * 
 * @return true if forced installation is enabled, false if it is disabled
 *         (boolean).
 */
function isForceInstall() {
	return forceInstall;
}

/**
 * Returns if log should be appended or overwritten
 * 
 * @return true in case log should be appended. false if it should be
 *         overwritten (boolean).
 */
function isLogAppend() {
	return logAppend;
}

/**
 * Check if package is installed.
 * 
 * @return returns true in case the package is installed, false otherwise
 * @throws Error
 *             in case checks could not be evaluated
 */
function isInstalled(packageNode) {
	var packageName = getPackageName(packageNode);
	var result = true;

	dinfo ("Checking existence of package: " + packageName);

	// Get a list of checks to perform before installation.
	var checkNodes = getChecks(packageNode);

	// When there are no check conditions, say "not installed".
	if (checkNodes.length == 0) {
		return false;
	}

	// Save current environment.
	var previousEnv = getEnv();

	// load package specific environment
	loadPackageEnv(packageNode);

	// Verify checks
	result = checkAll(checkNodes);

	// restore environment
	loadEnv(previousEnv);

	return result;
}

/**
 * Returns current status of /noDownload parameter
 * 
 * @return true in case downloads shall be disabled, false if downloads are enabled
 */
function isNoDownload() {
	return noDownload;
}

/**
 * Returns current status of /noforcedremove parameter
 * 
 * @return true in case forced remove is enabled, false if it is disabled
 */
function isNoForcedRemove() {
	return noForcedRemove;
}

/**
 * Returns if the nonotify flag is set or not.
 * 
 * @return true if nonotify flag is set, false if nonotify is not set (boolean)
 */
function isNoNotify() {
	return nonotify;
}

/**
 * Returns if the noreboot flag is set or not.
 * 
 * @return true if noreboot flag is set, false if noreboot is not set (boolean)
 */
function isNoReboot() {
	return noreboot;
}

/**
 * Returns the current state (boolean) of the noremove flag.
 * 
 * @return true if noremove flag is set, false if noremove is not set (boolean)
 */
function isNoRemove() {
	return noRemove;
}

/**
 * Returns if the noRunningState flag is set or not.
 * 
 * @return true if noRunningState flag is set, false if noRunningState is not
 *         set (boolean)
 */
function isNoRunningState() {
	return noRunningState;
}

/**
 * Returns the current state of postponed reboots. If it returns true a reboot
 * is scheduled when the script exits (after completing all actions).
 * 
 * @return current status of postponed reboot (boolean)
 */
function isPostponedReboot() {
	return postponedReboot;
}

/**
 * Returns current value of the sendStatus flag
 * 
 * @return true in case status should be sent, otherwise returns false
 */
function isSendStatus() {
	return sendStatus;
}

/**
 * Returns true in case a package has been processed yet. Returns false if no
 * package has been processed yet at all.
 * 
 * @return true in case a package has been processed, false otherwise.
 */
function isSystemChanged() {
	return systemChanged;
}

/**
 * Returns the current value of the upgrade-before-remove feature flag.
 * 
 * @return true in case upgrade-before-remove should be enabled, otherwise
 *         returns false.
 */
function isUpgradeBeforeRemove() {
	return !noUpgradeBeforeRemove;
}

/**
 * Returns current value of skip event log setting.
 * 
 * @return true in case event log logging is enabled, false if it is disabled
 *         (boolean).
 */
function isSkipEventLog() {
	return skipEventLog;
}

/**
 * Returns current state of event log fallback mode (logging to STDOUT instead
 * of event log.
 * 
 * @returns {Boolean} Current status of event log fallback mode.
 */
function isEventLogFallback() {
	return eventLogFallback;
}

/**
 * Returns true if quiet mode is on. False otherwise.
 * 
 * @return true if quiet flag is set, false if it is unset (boolean)
 */
function isQuiet() {
	return quietMode;
}

/**
 * Returns current value of quit on error setting (see '/quitonerror' parameter)
 * 
 * @return true in case quit on error is enabled, false if it is disabled
 *         (boolean).
 */
function isQuitOnError() {
	return quitonerror;
}

/**
 * Checks if a package is a zombie package which means that it exists within the
 * locale package database (wpkg.xml) but not on server database (packages.xml).
 * 
 * @return true in case the package is a zombie, false otherwise
 */
function isZombie(packageNode) {
	var packageName = getPackageID(packageNode);
	var allPackagesArray = getPackageNodes();
	var zombie = true;
	dinfo("Checking " + packageName + " zombie state.");
	for (var i=0; i < allPackagesArray.length; i++) {
		if (getPackageID(allPackagesArray[i]) == packageName) {
			zombie = false;
			break;
		}
	}

	// print message for zombie packages
	if (zombie) {
		var errorMessage = "Error while synchronizing package " + packageName +
		"\nZombie found: package installed but not in packages database.";
		if (isQuitOnError()) {
			errorMessage += " Aborting synchronization.";
			error(errorMessage);
			throw new Error(errorMessage);
		} else {
			errorMessage += " Removing package.";
			error(errorMessage);
		}
	}

	return zombie;
}


/**
 * Query and print local host information (read from the host where wpkg.js is
 * executed).
 */
function queryHostInformation() {
	// Reset cache for host information.
	resetHostInformationCache();

	var hostInfoAttributes = getHostInformation();
	var hostInfo = hostInfoAttributes.keys().toArray();
	// Initialize output message.
	var message = "Host information attributes from local host:\n";
	// Fetch all host information attributes.
	for (var i=0; i < hostInfo.length; i++) {
		var hostInfoKey = hostInfo[i];
		message += "    " + hostInfoKey + ":";

		// Pad label to 20 characters (minus one for the colon ":").
		var padding = 19 - hostInfoKey.length;
		for (var iPadding=0; iPadding < padding; iPadding++) {
			message += " ";
		}
		message += hostInfoAttributes.Item(hostInfoKey) + "\n";
	}
	message += "\n\n";

	// If remote query mode is active reset host information.
	if (getQueryMode() == "remote") {
		dinfo("Query mode: remote");
		getSettingHostAttributes();
	}
	
	// Print message.
	alert(message);
}


/**
 * Query and print host information fread from settings file. This requires
 * that host information is available in settings file. You must have
 * settingsHostInfo enabled in your configuration.
 */
function queryHostInformationFromSettings() {
	// Fetch settings.
	var settings = getSettings();
	var attributes = settings.attributes;

	// Initialize output message.
	var message = "Host information attributes from settings database:\n";

	// Check whether attributes are defined.
	if (attributes.length > 0) {
	
		for (var iAttribute=0; iAttribute < attributes.length; iAttribute++) {
			var node = attributes.item(iAttribute);
			var attribute = node.nodeName;
			var value = node.nodeValue;

			message += "    " + attribute + ":";
	
			// Pad label to 20 characters (minus one for the colon ":").
			var padding = 19 - attribute.length;
			for (var iPadding=0; iPadding < padding; iPadding++) {
				message += " ";
			}
			message += value + "\n";
		}
	} else {
		message += "    No host attributes found in settings database.\n" +
			"Make sure \"settingsHostInfo\" is enabled in your configuration.\n";
	}
	message += "\n\n";

	// Print message.
	alert(message);
}

/**
 * Queries all available packages (from package database and local settings) and
 * prints a quick summary.
 */
function queryAllPackages() {
	// Retrieve packages.
	var settingsNodes = getSettingNodes();
	var packagesNodes = getPackageNodes();

	// Concatenate both lists.
	var packageNodes = concatenateList(settingsNodes, packagesNodes);
	packageNodes = uniqueAttributeNodes(packageNodes, "id");

	// Create a string to append package descriptions to.
	var message = "All available packages (" + packageNodes.length + "):\n";

	// query all packages
	for (var i = 0; i < packageNodes.length; i++) {
		message += queryPackage(packageNodes[i], null) + "\n\n";
	}

	alert(message);
}

/**
 * Show the user a list of packages that are currently installed.
 */
function queryInstalledPackages() {
	// Retrieve currently installed nodes.
	var packageNodes = getSettingNodes();

	// Create a string to append package descriptions to.
	var message = "Packages currently installed:\n";

	for (var i = 0; i < packageNodes.length; i++) {
		message += queryPackage(packageNodes[i], null) + "\n\n";
	}

	alert(message);
}

/**
 * Show the user information about a specific package.
 * 
 * @param packageNode
 *            The package node to print information of
 * @param packageAction
 *            Optional argument to include the action applied to the package
 *            in the package information. If set to null the package action
 *            information is omitted from the output.
 * @return string representing the package information
 */
function queryPackage(packageNode, packageAction) {
	var message = "";
	if (packageNode != null) {
		var settingNode = getSettingNode(getPackageID(packageNode));
		var executeAttribute = getPackageExecute(packageNode);
		if (executeAttribute == null || executeAttribute == "") {
			executeAttribute = "-";
		}

		message = getPackageName(packageNode) + "\n";
		message += "    ID:                " + getPackageID(packageNode) + "\n";
		
		if (settingNode != null && packageAction != null) {
			var newPackageRevision = getPackageRevision(packageNode);
			var oldPackageRevision = getPackageRevision(settingNode);
			if (newPackageRevision != oldPackageRevision) {
				message += "    Revision (new):    " + getPackageRevision(packageNode) + "\n";
				message += "    Revision (old):    " + getPackageRevision(settingNode) + "\n";
			} else {
				message += "    Revision:          " + getPackageRevision(packageNode) + "\n";
			}
		} else {
			message += "    Revision:          " + getPackageRevision(packageNode) + "\n";
		}
		
		if (packageAction != null) {
			message += "    Action:            " + packageAction + "\n";
		}

		message += "    Reboot:            " + getPackageReboot(packageNode) + "\n";
		message += "    Execute:           " + executeAttribute + "\n";
		message += "    Priority:          " + getPackagePriority(packageNode) + "\n";
		if (settingNode != null) {
			message += "    Status:            Installed\n";
		} else {
			message += "    Status:            Not Installed\n";
		}
		
	} else {
		message += "No such package\n";
	}

	return message;
}

/**
 * Shows the user a list of packages that are currently not installed.
 */
function queryUninstalledPackages() {
	// Create a string to append package descriptions to.
	var message = "Packages not installed:\n";

	// Get list of all available packages from package database.
	var packageNodes = getPackageNodes();

	// Check for each package if it is installed.
	for (var i = 0; i < packageNodes.length; i++) {
		if (getSettingNode(getPackageID(packageNodes[i])) == null) {
			message += queryPackage(packageNodes[i], null) + "\n\n";
		}
	}

	alert(message);
}

/**
 * Query packages listed in the current profile.
 * @param listInstall List packages which are pending to be installed.
 * @param listUpgrade List packages which are pending to be upgraded.
 * @param listDowngrade List packages which are pending to be downgraded.
 * @param listRemove List packages which are pending to be removed.
 * @param listUnmodified List packages which are not modified during synchronization.
 */
function queryProfilePackages(listInstall, listUpgrade, listDowngrade, listRemove, listUnmodified) {
	// Message to be shown as a result of query.
	var message = "Current profile packages:\n";

	// Message which is appended when system is modified (includes execute="change" packages).
	var messageOnChangeOnly = "";

	// Flag whether the system would be modified when WPKG is run.
	var systemModified = false;

	var profilePackageNodes = getProfilePackageNodes();
	// Read all packages applying to current profile.
	for (var i=0; i<profilePackageNodes.length; i++) {
		var packageNode = profilePackageNodes[i];

		// Check package action which would be applied during synchronization.
		var packageAction = getPackageInstallAction(packageNode);

		// "none" No action; package installed already
		// "install" Installation, package is new on the host
		// "upgrade" Upgrade package which already exists on the system
		// New version higher than installed version
		// "downgrade" Downgrade package which already exists on the system
		// New version lower than installed version
		var packageMessage = "";
		var changesSystem = false;
		switch (packageAction) {
		case "none":
			if (listUnmodified) {
				packageMessage += queryPackage(packageNode, "None") + "\n\n";
			}
			break;

		case "install":
			if (listInstall) {
				packageMessage += queryPackage(packageNode, "Installation pending") + "\n\n";
				changesSystem = true;
			}
			break;

		case "upgrade":
			if (listUpgrade) {
				packageMessage += queryPackage(packageNode, "Upgrade pending") + "\n\n";
				changesSystem = true;
			}
			break;

		case "downgrade":
			if (listDowngrade) {
				packageMessage += queryPackage(packageNode, "Downgrade pending") + "\n\n";
				changesSystem = true;
			}
			break;

		default:
			break;
		}
		var executeAttribute = getPackageExecute(packageNode);
		if (executeAttribute == "changed") {
			messageOnChangeOnly += packageMessage;
		} else {
			message += packageMessage;
			// If the package modifies the system also packages which are
			// executed on change only shall be executed.
			if (changesSystem) {
				systemModified = changesSystem;
			}
		}
	}
	if (systemModified) {
		message += messageOnChangeOnly;
	}
	
	// Print packages which are pending for removal.
	if (listRemove) {
		var removeList = getPackagesRemoved();
		for (var i=0; i<removeList.length; i++) {
			var packageNode = removeList[i];
			message += queryPackage(packageNode, "Remove pending") + "\n\n";
		}
	}
	alert(message);
}

/**
 * Removes the specified package node from the system. This function will remove
 * all packages which depend on the one to be removed prior to the package
 * itself. In case the /force parameter is set the function will even remove the
 * requested package if not all packages depending on it could be removed. Note
 * that these packages might probably not work any more in such case.
 * 
 * @param packageNode
 *            Package to be removed
 * @return True in case of successful remove of package and all packages
 *         depending on it. False in case of failed package uninstall of failed
 *         uninstall of package depending on it.
 */
function removePackage(packageNode) {
	var packageName = getPackageName(packageNode);
	var packageID = getPackageID(packageNode);
	var notifyAttr = getPackageNotify(packageNode);

	// stores if the package needs a reboot after removing
	var rebootRequired = false;
	// stores if a postponed reboot should be scheduled
	var rebootPostponed = false;

	// Get package removal check policy.
	var checkPolicy = getPackagePrecheckPolicyRemove(packageNode);

	var success = true;
	var bypass = false;

	// string to print in events which identifies the package
	var packageMessage = "Package '" + packageName + "' (" + packageID + ")" +
						": ";

	// check if package has been processed already
	if(searchArray(packagesRemoved, packageNode)) {
		// package has been removed during this session already
		dinfo(packageMessage +
				"Already removed once during this session.\n" +
				"Checking if package has been removed properly.");
		bypass=true;

		// check if installation of package node was successful
		var installedPackage = getSettingNode(packageID);
		if (installedPackage == null) {
			// package successfully removed
			dinfo(packageMessage + "Verified; " +
				"package successfully removed during this session.");

			success = true;

		} else {
			dinfo(packageMessage +
				"Package removal failed during this session.");
			// package removal must have failed

			success = false;
		}
	} else {
		dinfo(packageMessage + "Not yet processed during this session.");
	}

	// Verify whether checks shall be used to verify if the package
	// has been removed already.
	if (checkPolicy == "always" && !isInstalled(packageNode)) {
		dinfo(packageMesseage + "Package already removed from system. Skipping removal.");
		// Package already removed. Skip removal.
		success = true;

		// Remove package node from local xml.
		removeSettingsNode(packageNode, true);

		// set package as processed in order to prevent processing multiple
		// times
		packagesRemoved.push(packageNode);

		// Cancel further removal processing.
		bypass = true;
	}


	if (!bypass) {
		// set package as processed in order to prevent processing multiple
		// times
		packagesRemoved.push(packageNode);

		if (isNoRemove()) {
			var message = "Package removal disabled: ";
			// check if the package is still installed
			if (isInstalled(packageNode)) {
				// the package is installed - keep it and add to skipped nodes
				dinfo(message + "Package " + packageName +  " (" + packageID +
					") will not be removed.");
				addSkippedRemoveNodes(packageNode);

				// package is not effectively removed
				success = false;
			} else {
				// Get a list of checks to perform before installation.
				var checkNodes = getChecks(packageNode);

				if (checkNodes.length != 0) {
					// package not installed - remove from local settings file
					dinfo(message + "Package " + packageName +  " (" + packageID +
						") will be removed from local settings because it is not installed.");
					removeSettingsNode(packageNode, true);
					success = true;
				} else {
					// unable to detect if the package is installed properly
					// assume it's still installed
					dinfo(message + "Package " + packageName +  " (" + packageID +
							") remains within local settings (no checks defined so WPKG " +
							"cannot verify if the package is still installed properly).");
					success = false;
				}
			}
		} else {
			// remove dependent packages first
			var allSuccess = removePackagesDependent(packageNode);
			if (!allSuccess && !isForce()) {
				// removing of at least one dependent package failed
				var failedRemove = "Failed to remove package which depends on '"
						+ packageName + " (" + packageID + "), skipping removal.\n"
						+ "You might use the /force flag to force removal but "
						+ "remember that the package depending on this one might "
						+ "stop working.";
				success = false;

				if (isQuitOnError()) {
					throw new Error(0, failedRemove);
				} else {
					error(failedRemove);
				}
			} else {
				// Save environment.
				var previousEnv = getEnv();
				
				try {
					info("Removing " + packageName + " (" + packageID + ")...");

					// select command lines to remove
					var cmds = getPackageCmdRemove(packageNode, null);

					// set package specific environment
					loadPackageEnv(packageNode);

					// Get downloads from package node (if any).
					var downloadNodes = getDownloads(packageNode, null);
					// Append downloads from command node.
					for (var iCommand = 0; iCommand < cmds.length; iCommand++) {
						var commandNode = cmds[iCommand ];
						getDownloads(commandNode, downloadNodes);
					}

					// Download all specified downloads.
					var downloadResult = downloadAll(downloadNodes);
					if (downloadResult != true) {
						var failureMessage = "Failed to download all files.";
						if (isQuitOnError()) {
							throw new Error(failureMessage);
						} else {
							error(failureMessage);
						}
					}
					
					// execute all remove commands
					for (var iCommand = 0; iCommand  < cmds.length; iCommand++) {
						// execute commands
						var cmdNode = cmds[iCommand ];
						var cmd = getCommandCmd(cmdNode);
						if(cmd == null) {
							error("Error: Command missing. Please fix the package. Ignoring command.");
							continue;
						}
						var timeout = getCommandTimeout(cmdNode);
						var workdir = getCommandWorkdir(cmdNode);

						// mark system as changed (command execution in
						// progress)
						setSystemChanged();
						if(notifyAttr) {
							notifyUserStart();
						}

						var result = exec(cmd, timeout, workdir);

						dinfo("Command returned result: " + result);

						// check if there is an exit code defined
						var exitAction = getCommandExitCodeAction(cmdNode, result);

						// Check for special exit codes.
						if (exitAction != null) {
							if (exitAction == "reboot") {
								// This exit code forces a reboot.
								info("Command in removal of " + packageName + " returned " +
									"exit code [" + result + "]. This exit code " +
									"requires an immediate reboot.");

								// Verify if the package is a zombie (not in package
								// database any more). If it is a zombie, and not referenced
								// in the profile then prevent endless reboots by removing
								// the package from local database.
								if(isZombie(packageNode)) {
									// check if still referenced within the profile
									var profilePackageArray = getProfilePackageNodes();
									var referenceFound = false;
									for (var iPackage = 0; iPackage < profilePackageArray.length; iPackage++) {
										if (packageID == getPackageID(profilePackageArray[iPackage])) {
											referenceFound = true;
											break;
										}
									}
									// if package is a zombie and not referenced
									// within the profile remove the settings entry
									if(!referenceFound && !isNoForcedRemove()) {
										removeSettingsNode(packageNode, true);
										info("Removed '" + packageName + "' ("
											+ packageID + ") from local settings.\n" +
												"Package initiated immediate reboot and is a zombie.");
									}
								}

								reboot();
							} else if(exitAction == "delayedReboot") {
								// This exit code schedules a reboot
										info("Command in removal of " + packageName +
											" returned exit code [" + result + "]. This " +
											"exit code schedules a reboot.");
								// schedule reboot
								rebootRequired = true;
								// execute next command
								continue;
							} else if(exitAction == "postponedReboot") {
								info("Command in removal of " + packageName +
									" returned exit code [" + result + "]. This " +
									"exit code schedules a postponed reboot.");
								rebootPostponed = true;
								setPostponedReboot(rebootPostponed);
								// execute next command
								continue;
							} else {
								// This exit code is successful.
								info("Command in removal of " + packageName + " returned " +
									" exit code [" + result + "]. This exit code " +
									"indicates success.");
								continue;
							}
						} else if(result == 0) {
							// if exit code is 0, return success
							// execute next command
							dinfo("Command in removal of " + packageName +
								" returned exit code [" + result + "]. Success.");
							continue;
						} else {
							// command did not succeed, log error
							var failedCmd = "Exit code returned non-successful value: " +
								result + "\nPackage: " + packageName + ".\nCommand:\n" + cmd;
							// error occurred during remove
							success = false;

							if (isQuitOnError()) {
								throw new Error(0, failedCmd);
							} else {
								error(failedCmd);
							}
						}
					}
				} catch (err) {
					success = false;
					var errorMessage = "Could not process (remove) package '" +
					 					packageName + "' (" + packageID + "):\n" + err.description + ".";
					if (isQuitOnError()) {
						throw new Error(errorMessage);
					} else {
						error(errorMessage);
					}
				} finally {
					// restore old environment
					dinfo("Restoring previous environment.");

					// restore previous environment
					loadEnv(previousEnv);
				}
			}

			// read reboot attribute
			var rebootAttr = getPackageReboot(packageNode);

			// Use package checks to prove if package has been removed.
			// Zombies are removed in any case (even if uninstall failed) except
			// if the
			// "/noforcedremove" parameter was set
			if (!isInstalled(packageNode)) {
				// Remove package node from local xml.
				removeSettingsNode(packageNode, true);

				if (rebootRequired || rebootAttr == "true") {
					info("Removal of " + packageName + " successful, system " +
						"rebooting.");
					reboot();
				} else if (rebootPostponed || rebootAttr == "postponed") {
					info("Removal of " + packageName + " successful, postponed reboot scheduled.");
				} else {
					info("Removal of " + packageName + " successful.");
				}
			} else {
				// Check if package is a zombie.
				if(isZombie(packageNode)) {
					// Check if still referenced within the profile.
					var packageArray = getProfilePackageNodes();
					var referenced = false;
					for (var i=0; i < packageArray.length; i++) {
						if (packageID == getPackageID(packageArray[i])) {
							referenced = true;
							break;
						}
					}
					// If package is a zombie and not referenced within the profile
					// remove the settings entry.
					if(!referenced && !isNoForcedRemove()) {
						removeSettingsNode(packageNode, true);
						warning("Errors occurred while removing '" + packageName + "' ("
							+ packageID + ").\nPackage has been removed anyway because it was a zombie " +
							"and not referenced within the profile.");
					}
				} else if (rebootRequired || rebootAttr == "true") {
					warning("Package processing (remove) failed for package " +
						packageName + ".\nHowever the package requires a reboot to complete. Rebooting.");
					// reboot system without adding to local settings yet
					reboot();
				} else if (rebootPostponed || rebootAttr == "postponed") {
					warning("Package processing (remove) failed for package " +
						packageName + ".\nHowever the package schedules a postponed reboot.");
				} else {
					// package installation failed
					success = false;
					message = "Could not process (remove) " + packageName + ".\n" +
								"Package still installed.";
					if (isQuitOnError()) {
						throw new Error(message);
					} else {
						error(message);
					}
				}
			}
		}
	}

	// return status
	return success;
}

/**
 * Removes a package by name.
 * 
 * @param name
 *            name of the package to be removed (package ID).
 * @return True in case of successful remove of package and all packages
 *         depending on it. False in case of failed package uninstall of failed
 *         uninstall of package depending on it.
 */
function removePackageName(name) {
	// Query the package node.
	var node = getSettingNode(name);

	// return code
	var success = false;

	dinfo("Removing package '" + name + "'.");

	if (node == null) {

		// check if the package has been removed during this session
		var alreadyRemoved = false;
		for (var iRemovedPkg = 0; iRemovedPkg < packagesRemoved.length; iRemovedPkg++) {
			var removedPackage = packagesRemoved[iRemovedPkg];
			if (name == getPackageID(removedPackage)) {
				alreadyRemoved = true;
				break;
			}
		}
		if (alreadyRemoved) {
			dinfo("Package '" + name + "' already removed during this session.");
			success = true;
		} else {
			info("Package '" + name + "' currently not installed.");
			success = false;
		}
	} else {
		success = removePackage(node);
	}
	return success;
}

/**
 * Removes all packages which depends on the given package. Returns true in case
 * all packages could be removed. Returns false if at least one dependent
 * package failed to remove.
 * 
 * @param packageNode
 *            package to install the dependencies of (XML node) NOTE: The
 *            package itself is not installed.
 * @return true=all dependencies installed successful; false=at least one
 *         dependency failed
 */
function removePackagesDependent(packageNode) {
	var packageID = getPackageID(packageNode);
	var packageName = getPackageName(packageNode);

	var problemDesc = "";
	// search for all packages which depend on the one to be removed
	var dependencies = new Array();
	var installedPackages = getSettingNodes();
	for (var iInstPkg = 0; iInstPkg<installedPackages.length; iInstPkg++) {
		// get dependencies of this package
		var pkgDeps = getPackageDependencies(installedPackages[iInstPkg]);
		for (var j=0; j<pkgDeps.length; j++) {
			if (pkgDeps[j] == packageID) {
				dependencies.push(installedPackages[iInstPkg]);
				break;
			}
		}
	}
	if (dependencies.length > 0) {
		info("Removing packages depending on '" + packageName +
			"' (" + packageID + ").");
	}
	var depSuccess = true;
	for (var iDependencies = 0; iDependencies < dependencies.length; iDependencies++) {
		var dependingPackage = dependencies[iDependencies];
		// install this package
		var success = removePackage(dependingPackage);
		if (!success) {
			problemDesc += "Removal of depending package '"
				+ getPackageName(dependingPackage) + "' ("
				+ getPackageID(dependingPackage) + ") failed";
			depSuccess = false;
			// skip remaining dependencies
			break;
		}
	}

	if (depSuccess) {
		dinfo("Removal of depending packages for '" +
				 packageName + "' (" +
				 packageID + ") successfully finished.");
	} else {
		var failMessage = "Removal of depending packages for '" +
						 packageName + "' (" +
						packageID + ") failed. " + problemDesc;
		if (isQuitOnError()) {
			throw new Error(failMessage);
		} else {
			error(failMessage);
		}
	}

	return depSuccess;
}

/**
 * Removes a package node from the settings XML node
 * 
 * @param packageNode
 *            The package node to be removed from settings.
 * @param saveImmediately
 *            Set to true in order to save settings immediately after removing.
 *            Settings will not be saved immediately if value is false.
 * @return Returns true in case of success, returns false if no node could be
 *         removed
 */
function removeSettingsNode(packageNode, saveImmediately) {
	// make sure the settings node is selected
	var packageID = getPackageID(packageNode);
	dinfo("Removing package id '" + packageID + "' from settings.");
	var settingsNode = getSettingNode(packageID);
	var success = false;
	if(settingsNode != null) {
		success = removeNode(getSettings(), settingsNode);
	}
	// save settings if remove was successful
	if (success && saveImmediately) {
		saveSettings(true);
	}
	return success;
}

/**
 * Erases host information cache to enforce re-reading of host information when
 * getter methods like getHostInformation(), getHostOS(), getLocale() etc are
 * executed. 
 */
function resetHostInformationCache() {
	// Empty caches.
	hostName = null;
	hostOs = null;
	domainName = null;
	ipAddresses = null;
	hostGroups = null;
	hostArchitecture = null;
	hostAttributes = null;
}


/**
 * Sets state of multiple profile assignment.
 * 
 * @param newState
 *            new debug state
 */
function setApplyMultiple(newState) {
	applyMultiple = newState;
}

/**
 * Set new architecture for this host.
 * @param newArchitecture Architecture to used for this host.
 */
function setArchitecture(newArchitecture) {
	hostArchitecture = newArchitecture;
}

/**
 * Sets new status of the case-sensitive flag
 * 
 * @param newSensitivity
 *            true to enable case sensitivity, false to disable it (boolean)
 */
function setCaseSensitivity(newSensitivity) {
	caseSensitivity = newSensitivity;
}

/**
 * Sets debug value to the given state.
 * 
 * @param newState
 *            new debug state
 */
function setDebug(newState) {
	debug = newState;
}

/**
 * Sets domain name used by the script.
 * 
 * @param newDomainName
 *            new domain name
 */
function setDomainName(newDomainName) {
	domainName = newDomainName;
}

/**
 * Sets dry run value to the given state.
 * 
 * @param newState
 *            new dry run state
 */
function setDryRun(newState) {
	dryrun = newState;
}

/**
 * Sets a new value for the forceinstall flag.
 * 
 * @param newState
 *            new value for the forceinstall flag (boolean)
 */
function setForce(newState) {
	force = newState;
}

/**
 * Sets a new value for the forceinstall flag.
 * 
 * @param newState
 *            new value for the forceinstall flag (boolean)
 */
function setForceInstall(newState) {
	forceInstall = newState;
}

/**
 * Set new group names the host belongs to.
 * 
 * @param newGroupNames
 *            Array of group names the host belongs to.
 */
function setHostGroups(newGroupNames) {
	hostGroups = newGroupNames;
}

/**
 * Set a new host name which will be used by the script. This is useful for
 * debugging purposes.
 * 
 * @param newHostname
 *            host name to be used
 */
function setHostname(newHostname) {
	hostName = newHostname;
}

/**
 * Set new host OS variable overwriting automatically-detected value.
 * 
 * @param newHostOS
 *            host OS name
 */
function setHostOS(newHostOS) {
	hostOs = newHostOS;
}


/**
 * Sets a new profile-id attribute to the given host XML node
 * 
 * @param hostNode
 *            the host XML node to modify
 * @param profileID
 *            the new profile ID to be written to this node
 */
function setHostProfile(hostNode, profileID) {
	hostNode.setAttribute("profile-id", profileID);
}

/**
 * Set a new hosts node
 * 
 * @param newHosts
 *            the new hosts XML node to be used fro now on
 */
function setHosts(newHosts) {
	hosts = newHosts;
}

/**
 * Set a new IP address list array.
 * 
 * @param newIPAdresses
 *            Array of IP addresses to be used by script.
 */
function setIPAddresses(newIPAdresses) {
	ipAddresses = newIPAdresses;
}

/**
 * Set new value for log file pattern
 * 
 * @param pattern
 *            new pattern to be used
 * @return returns the pattern with expanded environment variables
 */
function setLogfilePattern(pattern) {
	var wshShell = new ActiveXObject("WScript.Shell");
	logfilePattern = wshShell.ExpandEnvironmentStrings(pattern);
	return logfilePattern;
}

/**
 * Sets new value for the no-download flag.
 * 
 * @param newState
 *            new value for the no-download flag (boolean).
 *            If set to true then all downloads are disabled (just skipped).
 */
function setNoDownload(newState) {
	noDownload = newState;
}

/**
 * Sets new value for the noforcedremove flag.
 * 
 * @param newState
 *            new value for the noforcedremove flag (boolean).
 */
function setNoForcedRemove(newState) {
	noForcedRemove = newState;
}

/**
 * Sets new state for the noreboot flag.
 * 
 * @param newState
 *            new state of the noreboot flag (boolean)
 */
function setNoReboot(newState) {
	noreboot = newState;
}

/**
 * Sets new state for the noremove flag.
 * 
 * @param newState
 *            new state of the noremove flag (boolean)
 */
function setNoRemove(newState) {
	noRemove = newState;
}

/**
 * Sets new state for the noRunningState flag.
 * 
 * @param newState
 *            new state of the noreboot flag (boolean)
 */
function setNoRunningState(newState) {
	noRunningState = newState;
}

/**
 * Sets a new package id-attribute to the given host XML node
 * 
 * @param packageNode
 *            the package XML node to modify
 * @param packageID
 *            the new package ID to be written to this node
 */
function setPackageID(packageNode, packageID) {
	packageNode.setAttribute("id", packageID);
}

/**
 * Set a new value for the manual installation flag of the given package.
 * Manual installations are flagged only for packages which are installed via
 * command line directly and not via synchronization.
 * 
 * @param packageNode package to be modified.
 * @param manualInstall {Boolean} new value of package installation flag.
 */
function setPackageManualInstallation(packageNode, manualInstall) {
	if (packageNode == null) {
		error("No package node specified. Cannot set manual installation flag.");
		return;
	}
	if (manualInstall == null) {
		error("No manual installation flag value specified.");
		return;
	}
	if (manualInstall == true) {
		packageNode.setAttribute("manualInstall", "true");
	}
}

/**
 * Set a new packages node.
 * 
 * @param newPackages
 *            the new packages XML node to be used fro now on
 */
function setPackages(newPackages) {
	packages = newPackages;
	// iterate through all packages and set the package id to lower case
	// this allows XPath search for lowercase value later on (case-insensitive)
	if (packages != null && !isCaseSensitive()) {
		var packageNodes = getPackageNodes();
		for (var i=0; i<packageNodes.length; i++) {
			var packageNode = packageNodes[i];
			setPackageID(packageNode, getPackageID(packageNode).toLowerCase());
		}
	}
}

/**
 * Sets the status of postponed reboot. A postponed reboot schedules a system
 * reboot after finishing all actions (right before the script exits).
 * 
 * @param newState
 *            new state of postponed reboot
 */
function setPostponedReboot(newState) {
	postponedReboot = newState;
}

/**
 * Sets a new profile id-attribute to the given profile XML node
 * 
 * @param profileNode
 *            the profile XML node to modify
 * @param profileID
 *            the new profile ID to be written to this node
 */
function setProfileID(profileNode, profileID) {
	profileNode.setAttribute("id", profileID);
}

/**
 * Set a new profiles node
 * 
 * @param newProfiles
 *            the new profiles XML node to be used fro now on
 */
function setProfiles(newProfiles) {
	profiles = newProfiles;
	// iterate through all profiles and set the profile id to lower case
	// this allows XPath search for lowercase value later on (case-insensitive)
	if (profiles != null && !isCaseSensitive()) {
		var profileNodes = getProfileNodes();
		for (var i=0; i<profileNodes.length; i++) {
			var profileNode = profileNodes[i];
			setProfileID(profileNode, getProfileID(profileNode).toLowerCase());
		}
	}
}

/**
 * Sets query mode to new state. Allowed states are "remote" and "local".
 * 
 * @param newState query mode value to be set.
 */
function setQueryMode(newState) {
	if (newState != null && (newState == "remote" || newState == "local")) {
		queryMode = newState;
	}
}

/**
 * Sets new state of the quiet flag
 * 
 * @param newState
 *            new status of quiet flag (boolean)
 */
function setQuiet(newState) {
	quietMode = newState;
}

/**
 * Sets a new value for the quit on error flag.
 * 
 * @param newState
 *            new value for the quit on error flag (boolean).
 */
function setQuitOnError(newState) {
	quitonerror = newState;
}

/**
 * Sets new value for the reboot command (rebootCmd).
 * 
 * @param newCommand
 */
function setRebootCmd(newCommand) {
	var wshShell = new ActiveXObject("WScript.Shell");
	rebootCmd = wshShell.ExpandEnvironmentStrings(newCommand);
}

/**
 * Set state of application so other applications can see that it is running by
 * reading from the registry.
 * 
 * @param statename
 *            String which is written to the registry as a value of the
 *            "running" key
 */
function setRunningState(statename) {
	var WshShell = new ActiveXObject("WScript.Shell");
	var val;

	try {
		val = WshShell.RegWrite(sRegWPKG_Running, statename);
	} catch (e) {
		val = null;
	}

	return val;
}

/**
 * Sets new value for the sendStatus flag which defines if status messages are
 * sent to the calling program using STDOUT
 * 
 * @param newStatus
 *            new value for the sendStatus flag (boolean)
 */
function setSendStatus(newStatus) {
	sendStatus = newStatus;
}

/**
 * Set a new settings node
 * 
 * @param newSettings
 *            the new settings XML node to be used fro now on
 */
function setSettings(newSettings, saveImmediately) {
	settings = newSettings;
	// iterate through all packages and set the package id to lower case
	// this allows XPath search for lowercase value later on (case-insensitive)
	if (settings != null && !isCaseSensitive()) {
		var packageNodes = getSettingNodes();
		for (var i=0; i<packageNodes.length; i++) {
			var packageNode = packageNodes[i];
			setPackageID(packageNode, getPackageID(packageNode).toLowerCase());
		}
	}
	// save new settings
	if(saveImmediately) {
		saveSettings(true);
	}
}

/**
 * Set path to local settings file (locak package database).
 * The path might contain environment variables as well as the following
 * expressions:
 *	 [HOSTNAME]  Replaced by the executing hostname.
 *	 [PROFILE]   Replaced by the concatenated list of profiles applied.
 * @param path path to settings XML file.
 */
function setSettingsPath(path) {
	if (path == null || path == "") {
		error("Path to settings is required");
		return;
	}

	var wshObject = new ActiveXObject("WScript.Shell");
	var expandedSettingsPath = wshObject.ExpandEnvironmentStrings(path);

	// Set global variable holding settings file path.
	settings_file = expandedSettingsPath;
}


/**
 * Sets the system changed attribute to true. Call this method to make WPKG
 * aware that a system change has been done.
 * 
 * @return returns current system change status (always true after this method
 *         has been called
 */
function setSystemChanged() {
	systemChanged = true;
	return systemChanged;
}

/**
 * Set new value for the boolean flag to disable/enable event log logging.
 * 
 * @param newValue
 *            value to be used for the skip event log flag from now on.
 */
function setSkipEventLog(newValue) {
	skipEventLog = newValue;
}

/**
 * Set event log fallback to new value (enabled/disabled).
 * 
 * @param newValue
 *           value to be used for the event log fallback flag.
 */
function setEventLogFallback(newValue) {
	eventLogFallback = newValue;
}

/**
 * Sorts package nodes by priority flag.
 * 
 * @param packageNodes
 *            JScript Array containing package node entries
 * @param sortBy
 *            select the field to sort on. Supported Values are "PRIORITY" and
 *            "NAME"
 * @param sortOrder
 *            order in which the elements are sorted (integer) valid values:<br>1
 *            sort ascending (default)<br>2 sort descending
 * 
 * @return new Array containing the same package nodes in sorted order (sorted
 *         by priority)
 */
function sortPackageNodes(packageNodes, sortBy, sortOrder) {
	// create array to do the sorting on
	var sortedPackages = new Array();
	for (var iPkgNodes = 0; iPkgNodes < packageNodes.length; iPkgNodes++) {
		sortedPackages.push(packageNodes[iPkgNodes]);
	}
	// Classic bubble-sort algorithm on selected attribute
	for (var iSortedPkg = 0; iSortedPkg < sortedPackages.length - 1; iSortedPkg++) {
		for (var j=0; j < sortedPackages.length - 1 - iSortedPkg; j++) {
			var prio1;
			var prio2;
			var priVal1 = null;
			var priVal2 = null;

			switch(sortBy) {
				case "NAME":
					priVal1 = getPackageName(sortedPackages[j]);
					priVal2 = getPackageName(sortedPackages[j + 1]);
					break;
				default:
					priVal1 = parseInt(getPackagePriority(sortedPackages[j]));
					priVal2 = parseInt(getPackagePriority(sortedPackages[j + 1]));
					break;
			}
			// If a priority is not set, we assume 0.

			if (priVal1 == null) {
				prio1 = 0;
			} else {
				prio1 = priVal1;
			}

			if (priVal2 == null) {
				prio2 = 0;
			} else {
				prio2 = priVal2;
			}

			var swapElements = false;
			switch (sortOrder) {
				case 2:
					if (prio1 < prio2) {
						swapElements = true;
					}
					break;
				default:
					if (prio1 > prio2) {
						swapElements = true;
					}
					break;
			}
			// If the priority of the first one in the list exceeds the second,
			// swap the packages.
			if (swapElements) {
				var tmp = sortedPackages[j];
				sortedPackages[j] = sortedPackages[j + 1];
				sortedPackages[j + 1] = tmp;
			}
		}
	}
	return sortedPackages;
}

/**
 * Sorts the settings file by package name. Returns sorted package XML node.
 */
function sortSettings() {
	// sort current setting nodes
	var sortedPackages = sortPackageNodes(getSettingNodes(), "NAME", 1);

	// Get setting checks.
	var settingsChecks = getSettingsCheckResults();
	
	// create new (empty) settings node
	var sortedSettings = createSettings();
	sortedSettings.appendChild(settingsChecks);
	
	// use this settings node
	setSettings(sortedSettings, false);

	// fill new settings node with sorted packages (same order)
	for (var i=0; i<sortedPackages.length; i++) {
		addSettingsNode(sortedPackages[i], false);
	}
}

/**
 * Synchronizes the current package state to that of the specified profile,
 * adding, removing or upgrading packages.
 */
function synchronizeProfile() {
	// send message to client
	logStatus("Starting software synchronization");

	/**
	 * Get package nodes referenced within the profile (and profile
	 * dependencies). This includes package dependencies as well.
	 */
	var profilePackageNodes = getProfilePackageNodes();
	dinfo("Synchronizing. Number of packages referenced by profile: " + profilePackageNodes.length + ".");

	var localPackages = getPackagesManuallyInstalled();
	if (localPackages.length > 0) {
		dinfo("Synchronizing. Locally installed packages: " + localPackages.length + ".");
		for(var i=0; i<localPackages.length; i++) {
			// Fetch latest package node to schedule installation/upgrade.
			var localPackage = localPackages[i];
			var latestVersion = getPackageNode(getPackageID(localPackage));
			if (latestVersion != null) {
				profilePackageNodes.push(latestVersion);
			}
		}
	}

	// Get list of packages scheduled for removal.
	// This excludes manually installed packages except if they do not exist.
	var removablesArray = getPackagesRemoved();

	dinfo("Number of packages to remove: " + removablesArray.length);
	logStatus("Number of packages to be removed: " + removablesArray.length);
	/*
	 * upgrade packages to be removed to latest version first. This allows system administrators to provide a fixed
	 * version of the package which allows clean uninstall.
	 * 
	 * This was done to allow fixing a broken uninstall-procedure on server side. Without upgrading to the latest
	 * version here it might happen that the package cannot be removed without the possibility to fix it. If you remove
	 * the package completely from the package database it will be forced to be removed from the local settings file
	 * even if uninstall fails.
	 * 
	 * NOTE: This is not done within the same loop as the removal (see below) in order to prevent re-installing already
	 * removed dependencies.
	 */
	// sort packages to upgrade the ones with highest priority first
	if (isUpgradeBeforeRemove()) {
		var sortedUpgradeList = sortPackageNodes(removablesArray, "PRIORITY", 2);
		for (var iSortedPkg = 0; iSortedPkg < sortedUpgradeList.length; iSortedPkg++) {
			var upgradePkgNode = sortedUpgradeList[iSortedPkg];
			// upgrade package if package is available on server database
			var serverPackage = getPackageNode(getPackageID(upgradePkgNode));
			if (serverPackage != null) {
				logStatus("Remove: Checking status of '" + getPackageName(serverPackage) +
						"' (" + (iSortedPkg+1) + "/" + sortedUpgradeList.length + ")");
				// start upgrade first
				installPackage(serverPackage);
			}
		}
	}

	// Remove packages which do not exist in package database or do not apply
	// to the profile
	// reverse-sort packages to remove the one with lowest priority first
	var sortedRemovablesArray = sortPackageNodes(removablesArray, "PRIORITY", 1);
	for (var iRemovables = 0; iRemovables < sortedRemovablesArray.length; iRemovables++) {
		var removePkgNode = sortedRemovablesArray[iRemovables];
		// remove package from system
		// the settings node might have been changed during update before
		// reload it.
		logStatus("Remove: Removing package '" + getPackageName(removePkgNode) +
				"' (" + (iRemovables+1) + "/" + sortedRemovablesArray.length + ")");
		// removePackage(getSettingNode(getPackageID(removePkgNode)));
		removePackageName(getPackageID(removePkgNode));
	}

	// create array to do the sorting on
	var sortedPackages = sortPackageNodes(profilePackageNodes, "PRIORITY", 2);

	/*
	 * Move packages with execute=changed attribute to independent array in order to allow them to be executed after the
	 * other packages.
	 */
	var packagesToInstall = new Array();
	var packagesAwaitingChange = new Array();
	// NOTE: This should not change the sort order of the packages.
	for (var iPkg = 0; iPkg < sortedPackages.length; iPkg++) {
		var packageNode = sortedPackages[iPkg];
		var executeAttribute = getPackageExecute(packageNode);
		if (executeAttribute == "changed") {
			packagesAwaitingChange.push(packageNode);
		} else {
			packagesToInstall.push(packageNode);
		}
	}

	/*
	 * Loop over each available package and install it. No check required if package is already installed or not. The
	 * install method will check by itself if the package needs to be installed/upgraded or no action is needed.
	 */
	for (var iInstallPkg=0; iInstallPkg < packagesToInstall.length; iInstallPkg++) {
		// install/upgrade package
		logStatus("Install: Verifying package '" + getPackageName(packagesToInstall[iInstallPkg]) +
				"' (" + (iInstallPkg + 1) + "/" + packagesToInstall.length + ")");
		installPackage(packagesToInstall[iInstallPkg]);
	}

	/*
	 * Install packages which might have been postponed because no other change has been done to the system.
	 */
	for(var iChangeAwait = 0; iChangeAwait < packagesAwaitingChange.length; iChangeAwait++) {
		// try applying this packages again now.
		if (isSystemChanged()) {
			logStatus("Install: Verifying package (system changed) '" + getPackageName(packagesAwaitingChange[iChangeAwait]) +
					"' (" + (packagesToInstall.length + iChangeAwait + 1) + "/" + sortedPackages.length + ")");

			installPackage(packagesAwaitingChange[iChangeAwait]);
		} else {
			logStatus("Install: No system change, skipping '" + getPackageName(packagesAwaitingChange[iChangeAwait]) +
					"' (" + (packagesToInstall.length + iChangeAwait + 1) + "/" + sortedPackages.length + ")");
		}
	}

	logStatus("Finished software synchronization");

	// If we had previously warned the user about an impending installation, let
	// them know that all action is complete.
	notifyUserStop();
}

/*******************************************************************************
 * XML handling
 * ****************************************************************************
 */

/**
 * Saves the root element to the specified XML file.
 */
function saveXml(root, path) {
	if (isDryRun()) {
		path += ".dryrun";
	}
	dinfo("Saving XML : " + path);
	var xmlDoc = new ActiveXObject("Msxml2.DOMDocument.3.0");
	var processing = xmlDoc.createProcessingInstruction("xml", "version='1.0' encoding='UTF-8'");
	xmlDoc.insertBefore(processing, xmlDoc.firstChild);
	xmlDoc.appendChild(root);
	if (xmlDoc.save(path)) {
		throw new Error(0, "Could not save XML document to " + path);
	}
}

/**
 * Creates a new root element of the specified name.
 * 
 * @param root
 *           Root element name to be created. Might be prefixed by a namespace.
 *           e.g. "packages" or "packages:packages"
 * @param rootNS
 *           Optionally specify a namespace.
 *           e.g. "http://www.wpkg.org/packages"
 */
function createXml(root, rootNS) {
	// Verify root node name.
	if (root == null) {
		return null;
	}
	// Evaluate namespace.
	var nameSpace = rootNS;
	if (nameSpace == null) {
		nameSpace = "";
	}

	// Create XML document.
	var xmlDoc = new ActiveXObject("Msxml2.DOMDocument.3.0");
	xmlDoc.async = false;

	// Create root node.
	var rootNode = xmlDoc.createNode(1, root, nameSpace);

	return rootNode;
}

/**
 * Loads XML from the given path and/or directory. Returns null in case XML
 * could not be loaded.
 * 
 * @param xmlPath
 *            optional path to XML file to be loaded, specify null if you do not
 *            want to load from XML file
 * @param xmlDirectory
 *            optional path to directory where XML file(s) might can be found.
 *            Specify null if you do not want to read from a directory.
 * @param type
 *            optional, type of XML to be loaded. If type is specified some
 *            validation on XML structure is done like the verification of root
 *            and child node names. In addition correct namespace is inserted
 *            into generated XML document.
 *            Supported types:
 *            - settings (local WPKG database XML)
 *            - hosts (hosts database)
 *            - profiles (profile database)
 *            - packages (package database)
 *            - config (configuration file)
 * @return XML root node containing all nodes from the specified files.
 */
function loadXml(xmlPath, xmlDirectory, type) {
	// Initialize return variable.
	var xmlDocument = new ActiveXObject("Msxml2.DOMDocument.3.0");
	
	// Validation variables.
	// Name of XML root node. If null it will not be verified.
	var rootNodeName = null;

	// Namespace of XML if it is to be created.
	var xmlNamespace = null;

	// Name of child elements to be read if multiple files are read from directory.
	var childElementNodeName = null;
	
	// Evaluate type.
	var xmlType = type;
	if (xmlType != null) {
		switch (xmlType) {
		case "settings":
			rootNodeName = "wpkg";
			// childElementNodeName = "package";
			// Multiple child nodes (packages and check results).
			childElementNodeName = null;
			xmlNamespace = namespaceSettings;
			break;

		case "hosts":
			rootNodeName = "wpkg";
			childElementNodeName = "host";
			xmlNamespace = namespaceHosts;
			break;

		case "profiles":
			rootNodeName = "profiles";
			childElementNodeName = "profile";
			xmlNamespace = namespaceProfiles;
			break;

		case "packages":
			rootNodeName = "packages";
			childElementNodeName = "package";
			xmlNamespace = namespacePackages;
			break;

		case "config":
			rootNodeName = "config";
			// Do not verify child nodes as there are multiple:
			// - param
			// - languages
			childElementNodeName = null;
			xmlNamespace = namespaceConfig;
			break;

		default:
			break;
		}
	}
	
	// create variable to return
	// var rootNodeName = "pkg:packages";
	// var rootNodeName = "packages";
	// source.setProperty("SelectionNamespaces", "xmlns:packages='http://www.wpkg.org/packages'");
	var filePaths = new Array();
	
	// Read data from specified XML directory (load all XML from folder).
	if (xmlDirectory != null) {
		dinfo("Trying to read XML files from directory: " + xmlDirectory);
		// check if directory exists
		var fso = new ActiveXObject("Scripting.FileSystemObject");
		if( fso.FolderExists( xmlDirectory ) ) {
			var folder = fso.GetFolder(xmlDirectory);
			var e = new Enumerator(folder.files);

			// read all files
			for( e.moveFirst(); ! e.atEnd(); e.moveNext() ) {
				var file = e.item();
				var filePath = xmlDirectory.replace( /\\/g, "/" ) + "/" + file.name;

				// search for last "."
				var dotLocation = file.name.toString().lastIndexOf('.');
				var extension = file.name.toString().substr(dotLocation + 1, file.name.toString().length);

				// make sure to read only .xml files
				if(extension == "xml") {
					// Add file to list of files to be read.
					filePaths.push(filePath);
				}
			}
			// Sort files by name (ASCII order).
			filePaths.sort(null);
		} else {
			dinfo("Specified XML directory does not exist: " + xmlDirectory);
		}
	}

	// Add XML single-file path to the list of files to be read.
	if (xmlPath != null) {
		filePaths.push(xmlPath.replace( /\\/g, "/" ));
	}

	for( var i=0; i < filePaths.length; i++) {
		var filePath = filePaths[i];
		dinfo("Reading XML file: " + filePath);

		// Read XML file from file system.
		var xsl = new ActiveXObject("Msxml2.DOMDocument.3.0");
		xsl.async = false;
		xsl.validateOnParse = false;
		/*
		var str = "<?xml version=\"1.0\"?>\r\n";
		str += "<xsl:stylesheet xmlns:xsl=\"http://www.w3.org/1999/XSL/Transform\" xmlns:wpkg=\"" + xmlNamespace + "\" version=\"1.0\">\r\n";
		str += "    <xsl:output encoding=\"utf-8\" indent=\"yes\" method=\"xml\" version=\"1.0\"/>\r\n";
		str += "    <xsl:template match=\"/\">\r\n";
		str += "        <" + "wpkg:" + rootNodeName + ">\r\n";
		str += "            <xsl:copy-of select=\"document('" +
								filePath +
								"')/wpkg:" + rootNodeName + "/child::*\"/>\r\n";
		str += "            <xsl:copy-of select=\"document('" +
								filePath +
								"')/" + rootNodeName + "/child::*\"/>\r\n";
		str += "        </" + "wpkg:" + rootNodeName + ">\r\n";
		str += "    </xsl:template>\r\n";
		str += "</xsl:stylesheet>\r\n";

		xsl.loadXML(str);
		*/
		xsl.load(filePath);
		// dinfo("XSLT: " + xsl.xml);

		// Apply transforms.
		var source = new ActiveXObject("Msxml2.DOMDocument.3.0");
		source.async = false;
		source.validateOnParse = false;
		try {
			source.loadXML(source.transformNode(xsl));
		} catch (e) {
			var errorMessage = "Error parsing xml '" + filePath + "': " + e.description;
			if (isQuitOnError()) {
				throw new Error(errorMessage);
			} else {
				error(errorMessage);
			}
		}
		
		// check if there was an error when loading XML
		if (source.parseError.errorCode != 0) {
			var loadError = source.parseError;
			var errorMessage = "Error parsing xml '" + filePath + "': " + loadError.reason + "\n" +
							"File      " + filePath + "\n" +
							"Line      " + loadError.line + "\n" +
							"Linepos   " + loadError.linepos + "\n" +
							"Filepos   " + loadError.filepos + "\n" +
							"srcText   " + loadError.srcText + "\n";
			if (isQuitOnError()) {
				throw new Error(errorMessage);
			} else {
				error(errorMessage);
			}
		} else {
			// dinfo("Loaded: " + source.xml);

			// Verify document structure.
			if (source.documentElement == null) {
				var message = "No root element found in '" + filePath + "'.";
				if (isQuitOnError()) {
					throw new Error(message);
				} else {
					error(message);
				}
				continue;
			}
			var xmlRootNodeName = source.documentElement.tagName;

			// Check name spaces.
			var rootComponents = xmlRootNodeName.split(":");
			var rootElementName = xmlRootNodeName;
			if (rootComponents.length > 1) {
				// nameSpace = rootComponents[0];
				rootElementName = rootComponents[1];
			}
			
			// Verify if root element is correct.
			if (rootNodeName != null && rootNodeName != rootElementName) {
				// Element does not match expected root element name.
				var message = "Invalid XML structure found. Root element '" +
						rootElementName + "' does not match expected element name of '" +
						rootNodeName + "'.";
				if (isQuitOnError()) {
					throw new Error(message);
				} else {
					error(message);
				}
				continue;
			}
			
			// If this is the only document to read, then just return it.
			if (filePaths.length <= 1) {
				xmlDocument = source;
				break;
			} else {
				// Merge document contents.
				if (xmlDocument.documentElement == null) {
					var rootName = rootElementName;
					if (xmlNamespace != null) {
						rootName = rootName + ":" + rootName;
					}
					var rootElement = createXml(rootName, xmlNamespace);
					xmlDocument.appendChild(rootElement);
				}
				// Fetch all document nodes from loaded XML document.
				var childPath;
				if (childElementNodeName != null) {
					childPath = childElementNodeName;
				} else {
					childPath = "*";
				}
				var documentNodes = source.documentElement.selectNodes(childPath);

				// Add all nodes to XML document to be returned.
				var xmlRoot = xmlDocument.documentElement;
				for (var iDocumentNode=0; iDocumentNode < documentNodes.length; iDocumentNode++) {
					xmlRoot.appendChild(documentNodes[iDocumentNode]);
				}
			}
		}
	}
	// In local (non-remote) mode the settings database read shall be reset in
	// order to assure to re-build the cached check-results.
	if (xmlType != null && xmlType == "settings" && getQueryMode() != "remote" ) {
		var documentElement = xmlDocument.documentElement;
		if (documentElement != null) {
			var checkResultsNode = documentElement.selectSingleNode("checkResults");
			if (checkResultsNode != null) {
				documentElement.removeChild(checkResultsNode);
			}
		}
	}
	return xmlDocument.documentElement;
}

/**
 * Removes a sub-node from the given XML node entry.
 * 
 * @param XMLNode
 *            the XML node to remove from (e.g. packages or settings)
 * @param subNode
 *            the node to be removed from the XMLNode (for example a package
 *            node)
 * @return Returns true in case of success, returns false if no node could be
 *         removed
 */
function removeNode(XMLNode, subNode) {
	var returnvalue = false;
	var result = XMLNode.removeChild(subNode);
	if(result != null) {
		returnvalue = true;
	}
	return returnvalue;
}

/**
 * Returns a new array of XML nodes unique by the specified attribute.
 */
function uniqueAttributeNodes(nodes, attribute) {
	// Hold unique nodes in a new array.
	var newNodes = new Array();

	// Loop over nodes provided nodes searching for duplicated entries.
	for (var i = 0; i < nodes.length; i++) {
		// Get node for this loop.
		var node = nodes[i];

		// Get attribute which should be unique
		var attributeValue = node.getAttribute(attribute);

		// Determine if node with attribute already exists.
		var found = false;

		// Loop over elements of new nodes array and look for pre-existing
		// element.
		for (var j = 0; j < newNodes.length; j++) {
			var newNodeAttribute = newNodes[j].getAttribute(attribute);
			if (attributeValue == newNodeAttribute) {
				found = true;
				break;
			}
		}

		// If it doesn't exist, add it.
		if (!found) {
			newNodes.push(node);
		}
	}
	return newNodes;
}

/*******************************************************************************
 * Initialization and cleanup
 * ****************************************************************************
 */

/**
 * Clean up function called at the end. Writes all required files, closes
 * handlers and prints/writes log. Then exits with the given exit code.
 */
function cleanup() {
	// write settings XML file
	// no need as we save on each settings modification now.
	// saveSettings();

	// If there is still something in the log buffer write it to a file.
	if (logBuffer != null) {
		initializeLog();
	}

	// close log file
	// do not close the file if reboot is in progress
	// this is done since there might still be some writes to the file
	// before the reboot actually takes place
	if (getLogLevel() > 0 && !rebooting && getLogFile() != null) {
		// close the log
		getLogFile().Close();
	}
}

/**
 * Ends program execution with the specified exit code.
 */
function exit(exitCode) {
	// print packages which have not been removed
	var skippedPackages = getSkippedRemoveNodes();
	if (skippedPackages.length > 0) {
		var message = "Packages where removal has been aborted:\n";
		for (var i=0; i<skippedPackages.length; i++) {
			var packageNode = skippedPackages[i];
			message += getPackageName(packageNode) + " (" +
					getPackageID(packageNode) + ")\n";
		}
		info(message);
	}

	// check if there is a postponed reboot scheduled
	// cleanup is done directly within the reboot function
	if (isPostponedReboot()) {
		// postponed reboot executed
		setPostponedReboot(false);
		reboot();
	}

	// run cleanup
	cleanup();

	// reset running state
	if (!isNoRunningState()) {
		// Reset running state.
		setRunningState("false");
	}

	WScript.Quit(exitCode);
}

/**
 * Initializes the system, all required variables...
 */
function initialize() {
	// Initialize configuration (read and set values).
	initializeConfig();

	// Parse command-line parameters.
	parseArguments(getArgv());

	// Print version number.
	dinfo("WPKG " + WPKG_VERSION + " starting...");

	// Inform to which value reboot command is set.
	dinfo("Reboot-Cmd is " + getRebootCmd() + ".");

	// Set quiet mode to desired value.
	if (quiet != null) {
		setQuiet(quiet);
	} else {
		setQuiet(quietDefault);
	}
	
	// get argument list
	var argv = getArgv();

	// Will be used for file operations.
	var fso = new ActiveXObject("Scripting.FileSystemObject");

	var httpregex = new RegExp("^http");

	var isWeb = false;
	var base = "";

	if(httpregex.test(wpkg_base) == true) {
		isWeb = true;
		base = wpkg_base;
	} else {
		// Use the executing location of the script as the default base
		// path.
		isWeb = false;
		if (wpkg_base == "") {
			var path = WScript.ScriptFullName;
			base = fso.GetParentFolderName(path);
		} else {
			base = fso.GetAbsolutePathName(wpkg_base);
		}
	}

	dinfo("Base directory is '" + base + "'.");
	dinfo("Log level is " + getLogLevel());

	var packages_file;
	var profiles_file;
	var hosts_file;
	var nodes;
	if (!isWeb) {
		// Append the settings file names to the end of the base path.
		packages_file = fso.BuildPath(base, packages_file_name);
		var packages_folder = fso.BuildPath(base, "packages");
		profiles_file = fso.BuildPath(base, profiles_file_name);
		var profiles_folder = fso.BuildPath(base, "profiles");
		hosts_file = fso.BuildPath(base, hosts_file_name);
		var hosts_folder = fso.BuildPath(base, "hosts");
		nodes = loadXml(profiles_file, profiles_folder, "profiles");
		if (nodes == null) {
			// cannot continue without profiles (probably network error
			// occurred)
			throw new Error(10, "No profiles found. Aborting");
		}
		setProfiles(nodes);
		nodes = loadXml(hosts_file, hosts_folder, "hosts");
		if (nodes == null) {
			// cannot continue without hosts (probably network error occurred)
			throw new Error(10, "No hosts found. Aborting");
		}
		setHosts(nodes);
		// load packages
		setPackages(loadXml(packages_file, packages_folder, "packages"));
	} else {
		packages_file = base + "/" + web_packages_file_name;
		profiles_file = base + "/" + web_profiles_file_name;
		hosts_file = base + "/" + web_hosts_file_name;
		nodes = loadXml(profiles_file, null, "profiles");
		if (nodes == null) {
			// cannot continue without profiles (probably network error
			// occurred)
			throw new Error(10, "No profiles found. Aborting");
		}
		setProfiles(nodes);
		nodes = loadXml(hosts_file, null, "hosts");
		if (nodes == null) {
			// cannot continue without hosts (probably network error occurred)
			throw new Error(10, "No hosts found. Aborting");
		}
		setHosts(nodes);
		// load packages
		setPackages(loadXml(packages_file, null, "packages"));
	}
	
	// Load packages and profiles.
	if (isForce() && isArgSet(argv, "/synchronize")) {
		dinfo("Skipping current settings. Checking for actually installed packages.");

		setSettings(createSettings(), true);

		fillSettingsWithInstalled();

	} else {
		// Load or create settings file.
		if (!fso.FileExists(getSettingsPath())) {
			dinfo("Settings file does not exist. Creating a new file.");

			setSettings(createSettings(), true);
		} else {
			dinfo("Reading settings file: " + getSettingsPath());
			// No need to save immediately because there is no change yet.
			setSettings(createSettingsFromFile(getSettingsPath()), false);
		}
	}
}

/**
 * Initializes configuration file
 */
function initializeConfig() {
	// get list of parameters (<param... /> nodes)
	var param = getConfigParamArray();

	// loop through all parameters
	for (var i=0; i < param.length; i++) {
		var name = param[i].getAttribute("name");
		var value= param[i].getAttribute("value");
		if (name == "volatileReleaseMarker") {
			volatileReleaseMarkers.push((param[i].getAttribute("value")).toLowerCase());
		} else if(value === "true" || value === "false" || value === "null") {
			// If value is boolean or null, we don't want " around it.
			// Otherwise it'll be assigned as a string.

			// Here is where the <param name='...' ... /> is used as the
			// variable name and assigned the
			// <param ... value='...' /> value from the config.xml file. We're
			// using eval to do variable
			// substitution for the variable name.
			eval ( name + " = " + value );
		} else {
			// Non-Boolean value, put " around it.

			// Here is where the <param name='...' ... /> is used as the
			// variable name and assigned the
			// <param ... value='...' /> value from the config.xml file. We're
			// using eval to do variable
			// substitution for the variable name.
			eval ( name + " = \"" + value + "\"" );
		}
	}
	// Expand environment variables.
	var wshShell = new ActiveXObject("WScript.Shell");
	if(rebootCmd != null) {
		rebootCmd = wshShell.ExpandEnvironmentStrings(rebootCmd);
	}
	if(logfilePattern != null) {
		logfilePattern = wshShell.ExpandEnvironmentStrings(logfilePattern);
	}

	// Check if log level shall be altered.
	if (logLevel != null) {
		setLogLevel(logLevel);
	} else {
		setLogLevel(logLevelDefault);
	}
}

/**
 * Initializes log file depending on information available. If log file path is
 * not set or unavailable creates logfile within %TEMP%. Sets log file handler
 * to null in case logging is disabled (logLevel=0)
 * @returns log file handler; returns null if no logfile was initialized.
 */
function initializeLog() {
	// Abort initialization if initialization is already running.
	if (logInitializing) {
		return logfileHandler;
	}
	/*
	 * Set initializing flag during initialization to prevent initialization loop when logs are written during
	 * initialization.
	 */
	logInitializing = true;

	// only initialize a log file if log level is greater than 0
	if (getLogLevel() <= 0) {
		if (logfileHandler != null) {
			logfileHandler.Close();
			logfileHandler = null;
		}
		logfilePath = null;
		return null;
	}

	/** stores the new filehandler created during this execution */
	var newLogfileHandler = null;
	var newLogfilePath = null;
	var newLogfileAppendMode = false;

	/** file system object */
	var fso = new ActiveXObject("Scripting.FileSystemObject");

	// try to initialize real log file
	try {
		// build log file name
		var today = new Date();
		var year = today.getFullYear();
		var month = today.getMonth() + 1;
		var day = today.getDate();
		var hour = today.getHours();
		var minute = today.getMinutes();
		var second = today.getSeconds();
		if (month < 10) {
			month = "0" + month;
		}
		if (day < 10) {
			day = "0" + day;
		}
		if (hour < 10) {
			hour = "0" + hour;
		}
		if (minute < 10) {
			minute = "0" + minute;
		}
		if (second < 10) {
			second = "0" + second;
		}

		var logFileName = getLogfilePattern().replace(new RegExp("\\[HOSTNAME\\]", "g"), getHostname());
		logFileName = logFileName.replace(new RegExp("\\[YYYY\\]", "g"), year);
		logFileName = logFileName.replace(new RegExp("\\[MM\\]", "g"), month);
		logFileName = logFileName.replace(new RegExp("\\[DD\\]", "g"), day);
		logFileName = logFileName.replace(new RegExp("\\[hh\\]", "g"), hour);
		logFileName = logFileName.replace(new RegExp("\\[mm\\]", "g"), minute);
		logFileName = logFileName.replace(new RegExp("\\[ss\\]", "g"), second);
		// only apply profile if required
		/*
		 * NOTE: In case profiles.xml is not valid this will quit the script on getProfile() call while keeping the
		 * temporary local log file handler. As a result errors at initialization will be logged to local log only. So
		 * make sure not to use the [PROFILE] placeholder if you like to remote- initialization logs (e.g. missing XML
		 * files).
		 */
		var regularExp = new RegExp("\\[PROFILE\\]", "g");
		if (regularExp.test(logFileName) == true) {
			// this will throw an error if profile is not available yet
			var profileList = getProfileList();
			// concatenate profile names or throw error if no names
			// available
			if (profileList.length > 0) {
				var allProfiles = "";
				for (var i=0; i<profileList.length; i++) {
					if (allProfiles == "") {
						allProfiles = profileList[i];
					} else {
						allProfiles += "-" + profileList[i];
					}
				}
				logFileName = logFileName.replace(regularExp, allProfiles);
			} else {
				throw new Error("Profile information not available.");
			}
		}

		if (log_file_path == null || log_file_path == "") {
			log_file_path = "%TEMP%";
		}

		newLogfilePath = new ActiveXObject("WScript.Shell").ExpandEnvironmentStrings(log_file_path + "\\" + logFileName);

		// Just open the log file in case it is not opened already or append mode changed from false to true.
		// Do not support switching from append mode to overwrite mode if the
		// log file is not changed as this would erase log entries.
		if (logfilePath != newLogfilePath || (logfileAppendMode != isLogAppend() && isLogAppend() == true)) {
			var newLogMessage = "Initializing new log file: '" + newLogfilePath + "' in ";
			if (isLogAppend()) {
				newLogMessage += "append";
			} else {
				newLogMessage += "replace";
			}
			newLogMessage += " mode.";

			dinfo(newLogMessage);
			try {
				// Evaluate append mode.
				// 2=write (use 8 for append mode)
				var openMode = 2;
				if (isLogAppend()) {
					openMode = 8;
				}

				// If new logfile path is identical to existing log file then just the append mode changed.
				if (logfilePath == newLogfilePath) {
					// Paths are identical, so mode must have been changed.
					// Re-open the file with new file mode.
					// NOTE: This should be handled as an atomic/synchronized
					// operation in multi-threaded environment (not for WSH).
					if(logfileHandler != null) {
						// Close file first.
						logfileHandler.Close();
						// Replace handler.
						logfileHandler = fso.OpenTextFile(newLogfilePath, openMode, true, -2);
						logfileAppendMode = isLogAppend();
					}
				} else {
					// Open mode:
					// 2=write (use 8 for append mode)
					// true=create if not exist
					// 0=ASCII, -1=unicode, -2=system default
					newLogfileHandler = fso.OpenTextFile(newLogfilePath, openMode, true, -2);
				}
				newLogfileAppendMode = isLogAppend();
			} catch (e) {
				// Fall back to local temp folder.
				newLogfilePath = new ActiveXObject("WScript.Shell").ExpandEnvironmentStrings("%TEMP%\\" + logFileName);
				dinfo("Failed to open log file: " + e.description + "; falling back to local logging: " + newLogfilePath);
				if (logfilePath != newLogfilePath) {
					// Open mode:
					// 2=write (use 8 for append mode)
					// true=create if not exist
					// 0=ASCII, -1=unicode, -2=system default
					newLogfileHandler = fso.OpenTextFile(newLogfilePath, 2, true, -2);
					newLogfileAppendMode = false;
				}
			}
		}
	} catch (err) {
		dinfo("Cannot initialize log file (" + err.description + "), probably not all data available " +
				"yet, stick with local log file. ");
		// Initialize local log file.
		var newLogfile = new ActiveXObject("WScript.Shell").ExpandEnvironmentStrings("%TEMP%\\wpkg-logInit.log");
		// create new temporary file - overwrite existing
		newLogfileHandler = fso.OpenTextFile(newLogfile, 8, true, -2);
		newLogfileAppendMode = true;
		dinfo("Initialized temporary local log file: " + logfilePath);
	}


	// In case a new log file handler was created switch handlers and move data
	// from old log file to new log file.
	if (newLogfileHandler != null) {
		// Switch to new log file handler.
		// NOTE: In multi-threaded environment this shall be synchronized.
		var oldLogfileHandler = logfileHandler;
		var oldLogfilePath = logfilePath;
		logfileHandler = newLogfileHandler;
		logfileAppendMode = newLogfileAppendMode;
		logfilePath = newLogfilePath;

		// Transfer all logs to the new logfile and close old log file.
		if (oldLogfileHandler != null) {
			oldLogfileHandler.Close();
		}
		if (oldLogfilePath != null) {
			// Read old log file and write contents to new log file.
			// Open read-only.
			var readerFile = fso.OpenTextFile(oldLogfilePath, 1, true, -2);
			while (!readerFile.AtEndOfStream) {
				logfileHandler.WriteLine(readerFile.ReadLine());
			}
			readerFile.Close();
			// delete old logfile
			fso.DeleteFile(oldLogfilePath, true);
		}
		// Write log buffer to file and clean buffer.
		if (logBuffer != null) {
			logfileHandler.Write(logBuffer);
			logBuffer = null;
		}
	}
	// Initialization finished.
	logInitializing = false;
	return logfileHandler;
}

/**
 * Processes command line options and sets internal variables accordingly.
 */
function parseArguments(argv) {
	// Initialize temporary log file
	// Note: this will be done automatically on first log output
	// initializeLog();

	// Parse bare arguments.
	// All which start with a "/" and do not have a ":" in them.
	for (var i=0; i < argv.length; i++) {
		var argument = argv.Item(i);
		switch (argument) {
		// Check for quiet mode.
		case "/quiet":
			quiet = true;
			break;

		// Check for log append flag.
		case "/logAppend":
			setLogAppend(true);
			break;

		// Check for dry run flag.
		case "/dryrun":
			setDryRun(true);
			setDebug(true);
			setNoReboot(true);
			break;

		// Check for debug flag.
		case "/debug":
		case "/verbose":
			setDebug(true);
			break;

		// Check for help flag.
		case "/help":
			showUsage();
			exit(0);
			break;

		// Check for nonotify flag.
		case "/nonotify":
			setNoNotify(true);
			break;

		// Check for noreboot flag.
		case "/noreboot":
			setNoReboot(true);
			break;

		// Check for noremove flag.
		case "/noremove":
			setNoRemove(true);
			break;

		// Check for force flag.
		case "/force":
			setForce(true);
			break;

		// Check for quot on error flag.
		case "/quitonerror":
			setQuitOnError(true);
			break;

		// Check if status messages should be sent.
		case "/sendStatus":
			setSendStatus(true);
			break;

		// Check if upgrade-before-remove feature should be enabled.
		case "/noUpgradeBeforeRemove":
			setUpgradeBeforeRemove(false);
			break;

		// Check if installation should be forced.
		case "/forceinstall":
			setForceInstall(true);
			break;

		// Check if forced remove shall be disabled.
		case "/noforcedremove":
			setNoForcedRemove(true);
			break;

		// Check if WPKG state shall be exported to registry.
		case "/norunningstate":
			setNoRunningState(true);
			break;

		// Check if WPKG shall work case-insensitive.
		case "/ignoreCase":
			setCaseSensitivity(false);
			break;

		// Check if multiple profiles shall be applied
		case "/applymultiple":
			setApplyMultiple(true);
			break;

		// Check if user likes to disable all downloads.
		case "/noDownload":
			setNoDownload(true);
			break;

		// Check if /synchronize parameter is set.
		case "/synchronize":
			// Do not do anything. The /synchronize parameter is handled by main() function.
			break;
			
		default:
			// Check if the argument is a named argument.
			var argument = argv.Item(i);
			if (argument.indexOf(":") < 0) {
				dinfo("Unknown argument: " + argv.Item(i));
			}
		}
	}

	// Get special purpose argument lists.
	var argn = argv.Named;

	// Process quiet mode flag.
	var quietFlagValue = argn.Item("quiet");
	if (quietFlagValue != null) {
		if (quietFlagValue == "true") {
			quiet = true;
		} else if (quietFlagValue == "false"){
			quiet = false;
		}
	}

	// Process log append mode flag.
	var logAppendFlagValue = argn.Item("logAppend");
	if (logAppendFlagValue != null) {
		if (logAppendFlagValue == "true") {
			setLogAppend(true);
		} else if (logAppendFlagValue == "false"){
			setLogAppend(false);
		}
	}

	// Process dryrun mode flag.
	var dryrunFlagValue = argn.Item("dryrun");
	if (dryrunFlagValue != null) {
		if (dryrunFlagValue == "true") {
			setDryRun(true);
			setDebug(true);
			setNoReboot(true);
		} else if (dryrunFlagValue == "false"){
			setDryRun(false);
			setNoReboot(false);
		}
	}

	// Process verbose mode flag.
	var verboseFlagValue = argn.Item("verbose");
	if (verboseFlagValue != null) {
		if (verboseFlagValue == "true") {
			setDebug(true);
		} else if (verboseFlagValue == "false"){
			setDebug(false);
		}
	}
	
	// Process debug mode flag.
	var debugFlagValue = argn.Item("debug");
	if (debugFlagValue != null) {
		if (debugFlagValue == "true") {
			setDebug(true);
		} else if (debugFlagValue == "false"){
			setDebug(false);
		}
	}

	// Process nonotify mode flag.
	var nonotifyFlagValue = argn.Item("nonotify");
	if (nonotifyFlagValue != null) {
		if (nonotifyFlagValue == "true") {
			setNoNotify(true);
		} else if (nonotifyFlagValue == "false"){
			setNoNotify(false);
		}
	}

	// Process noreboot mode flag.
	var norebootFlagValue = argn.Item("noreboot");
	if (norebootFlagValue != null) {
		if (norebootFlagValue == "true") {
			setNoReboot(true);
		} else if (norebootFlagValue == "false"){
			setNoReboot(false);
		}
	}

	// Process noremove mode flag.
	var noremoveFlagValue = argn.Item("noremove");
	if (noremoveFlagValue != null) {
		if (noremoveFlagValue == "true") {
			setNoRemove(true);
		} else if (noremoveFlagValue == "false"){
			setNoRemove(false);
		}
	}

	// Process force mode flag.
	var forceFlagValue = argn.Item("force");
	if (forceFlagValue != null) {
		if (forceFlagValue == "true") {
			setForce(true);
		} else if (forceFlagValue == "false"){
			setForce(false);
		}
	}

	// Process quitonerror mode flag.
	var quitonerrorFlagValue = argn.Item("quitonerror");
	if (quitonerrorFlagValue != null) {
		if (quitonerrorFlagValue == "true") {
			setQuitOnError(true);
		} else if (quitonerrorFlagValue == "false"){
			setQuitOnError(false);
		}
	}

	// Process sendStatus mode flag.
	var sendStatusFlagValue = argn.Item("sendStatus");
	if (sendStatusFlagValue != null) {
		if (sendStatusFlagValue == "true") {
			setSendStatus(true);
		} else if (sendStatusFlagValue == "false"){
			setSendStatus(false);
		}
	}

	// Process noUpgradeBeforeRemove mode flag.
	var noUpgradeBeforeRemoveFlagValue = argn.Item("noUpgradeBeforeRemove");
	if (noUpgradeBeforeRemoveFlagValue != null) {
		if (noUpgradeBeforeRemoveFlagValue == "true") {
			setUpgradeBeforeRemove(false);
		} else if (noUpgradeBeforeRemoveFlagValue == "false"){
			setUpgradeBeforeRemove(true);
		}
	}

	// Process forceinstall mode flag.
	var forceInstallFlagValue = argn.Item("forceinstall");
	if (forceInstallFlagValue != null) {
		if (forceInstallFlagValue == "true") {
			setForceInstall(true);
		} else if (forceInstallFlagValue == "false"){
			setForceInstall(false);
		}
	}

	// Process noforcedremove mode flag.
	var noForcedRemoveFlagValue = argn.Item("noforcedremove");
	if (noForcedRemoveFlagValue != null) {
		if (noForcedRemoveFlagValue == "true") {
			setNoForcedRemove(true);
		} else if (noForcedRemoveFlagValue == "false"){
			setNoForcedRemove(false);
		}
	}

	// Process norunningstate mode flag.
	var noRunningStateFlagValue = argn.Item("norunningstate");
	if (noRunningStateFlagValue != null) {
		if (noRunningStateFlagValue == "true") {
			setNoRunningState(true);
		} else if (noRunningStateFlagValue == "false"){
			setNoRunningState(false);
		}
	}

	// Process ignoreCase mode flag.
	var ignoreCaseFlagValue = argn.Item("ignoreCase");
	if (ignoreCaseFlagValue != null) {
		if (ignoreCaseFlagValue == "true") {
			setCaseSensitivity(false);
		} else if (ignoreCaseFlagValue == "false"){
			setCaseSensitivity(true);
		}
	}

	// Process applymultiple mode flag.
	var applyMultipleFlagValue = argn.Item("applymultiple");
	if (applyMultipleFlagValue != null) {
		if (applyMultipleFlagValue == "true") {
			setApplyMultiple(true);
		} else if (applyMultipleFlagValue == "false"){
			setApplyMultiple(false);
		}
	}

	// Process noDownload mode flag.
	var noDownloadFlagValue = argn.Item("noDownload");
	if (noDownloadFlagValue != null) {
		if (noDownloadFlagValue == "true") {
			setNoDownload(true);
		} else if (noDownloadFlagValue == "false"){
			setNoDownload(false);
		}
	}
	
	// Parse parameters with string values.

	// Fetch base folder where to read XML files from.
	if (argn("base") != null) {
		wpkg_base = argn("base");
	}
	
	// Process log level.
	if (argn.Item("logLevel") != null) {
		setLogLevel(parseInt(argn.Item("logLevel")));
	}
	
	// Set the profile from either the command line or the hosts file.
	if (argn.Item("host") != null) {
		setHostname(argn("host"));
	}

	// Parse OS override setting.
	if (argn.Item("os") != null) {
		setHostOS(argn("os"));
	}

	// Parse IP address override setting.
	if (argn.Item("ip") != null) {
		var ipListParam = argn.Item("ip").split(",");
		setIPAddresses(ipListParam);
	}

	// Parse domain name override setting.
	if (argn.Item("domainname") != null) {
		setDomainName(argn.Item("domainname"));
	}

	// Parse group override setting.
	if (argn.Item("group") != null) {
		var hostGroupParam = argn.Item("group").split(",");
		setHostGroups(hostGroupParam);
	}

	// Process log file pattern.
	if (argn.Item("logfilePattern") != null) {
		setLogfilePattern(argn.Item("logfilePattern"));
	}

	// Process path to log file.
	if (argn.Item("log_file_path") != null) {
		log_file_path = argn.Item("log_file_path");
	}

	// Parse reboot command.
	if (argn.Item("rebootcmd") != null) {
		setRebootCmd(argn.Item("rebootcmd"));
	}

	// Parse path to settings file.
	if (argn.Item("settings") != null) {
		setSettingsPath(argn.Item("settings"));
	}
	
	// Evaluate query mode.
	if (argn.Item("query") != null) {
		// Read query mode.
		setQueryMode(argn.Item("queryMode"));

		if (getQueryMode() == "remote") {
			dinfo("Query mode: remote");
		}
	}
}

/**
 * Saves settings to file system. Optionally allows sorting of package nodes.
 * 
 * @param sort {Boolean} Set to true in order to sort package nodes.
 */
function saveSettings(sort) {
	if (getQueryMode() == "remote") {
		// Do not save settings in remote qurey mode.
		dinfo("Skipping settings save: Remote query mode enabled.");
		return;
	}

	var sortPackages = true;
	if (sort != null && sort == false) {
		sortPackages = false;
	}
	
	if (sortPackages) {
		dinfo("Saving sorted settings to '" + getSettingsPath() + "'." + sort);
		sortSettings();
	} else {
		dinfo("Saving unsorted settings to '" + getSettingsPath() + "'." + sort);
	}

	// Do not save settings if settings are empty or in remote query mode.
	if (getSettingsPath() != null && settings != null) {
		saveXml(settings, getSettingsPath());
	} else {
		dinfo("Settings not saved! Either settings are empty or path is not set.");
	}
}

/*******************************************************************************
 * LOG FUNCTIONS
 * ****************************************************************************
 */

/**
 * Echos text to the command line or a prompt depending on how the program is
 * run.
 */
function alert(message) {
	WScript.Echo(message);
}

/**
 * Presents some debug output if debugging is enabled
 */
function dinfo(stringInfo) {
	log(8, stringInfo);
}

/**
 * Logs or presents an error message depending on interactivity.
 */
function error(message) {
	log(1, message);
}

/**
 * Returns log file handler. If logfile has not been initialized yet, starts
 * initialization and returns new filehandler.
 * 
 * Returns null in case logLevel is set to 0.
 * 
 * @return log file handler (returns null if log level is 0)
 */
function getLogFile() {
	return logfileHandler;
}

/**
 * Creates a log line from a given string. The severity string is automatically
 * padded to a fixed length too to make the log entries easily readable.
 * 
 * @param severity
 *            string which represents log severity
 * @param message
 *            string which represents the message to be logged
 * @return log entry in its default format:<br>YYYY-MM-DD hh:mm:ss, SEVERITY:
 *         <message>
 */
function getLogLine(severity, message) {
	var severityPadding = 7;
	// pad string with spaces
	for (var i = severity.length; i <= severityPadding; i++) {
		severity += " ";
	}

	// escape pipes (since they are used as new-line characters)
	var logLine = message.replace(new RegExp("\\|", "g"), "\\|");
	// replace new-lines by pipes
	logLine = logLine.replace(new RegExp("(\\r\\n)|(\\n\\r)|[\\r\\n]+", "g"), "|");

	// build date string
	var today = new Date();
	var year = today.getFullYear();
	var month = today.getMonth() + 1;
	var day = today.getDate();
	var hour = today.getHours();
	var minute = today.getMinutes();
	var second = today.getSeconds();
	if (month < 10) {
		month = "0" + month;
	}
	if (day < 10) {
		day = "0" + day;
	}
	if (hour < 10) {
		hour = "0" + hour;
	}
	if (minute < 10) {
		minute = "0" + minute;
	}
	if (second < 10) {
		second = "0" + second;
	}

	var tstamp = year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;

	// build log line
	logLine = tstamp + ", " + severity + ": " + logLine;

	return logLine;
}

/**
 * Returns the current log level:
 *
 * @return Log level<br>
 * 0: do not log anything, disables writing of a log-file<br>
 * 1: log errors only<br>
 * 2: log errors and warnings<br>
 * 4: log errors, warnings and information<br>
 */
function getLogLevel() {
	return logLevelValue;
}

/**
 * Logs or presents an info message depending on interactivity.
 */
function info(message) {
	log(4, message);
}

/**
 * Logs the specified event type and description in the Windows event log.
 *
 * Log types:
 * <pre>
 * 0    SUCCESS
 * 1    ERROR
 * 2    WARNING
 * 4    INFORMATION
 * 8    AUDIT_SUCCESS
 * 16   AUDIT_FAILURE
 * </pre>
 */
function log(type, description) {
	// just log information level to event log or everything in case debug is
	// enabled.
	if (((type & 7) > 0 || isDebug()) && !isSkipEventLog()) {
		if(isQuiet() && !isEventLogFallback()) {
			try {
				WshShell = WScript.CreateObject("WScript.Shell");
				WshShell.logEvent(type, "" + description);
			} catch (e) {
				// skip future event log entries and log an error
				setEventLogFallback(true);
				var message = "Error when writing to event log, falling back" +
							" to standard output (STDOUT).\n" +
							"Description: " + e.description + "\n" +
							"Error number: " + hex(e.number) + "\n" +
							"Stack: " + e.stack  + "\n" +
							"Line: " + e.lineNumber + "\n";
				error(message);

				// write message to STDOUT to ensure it is not lost
				alert(description);
			}
		} else {
			alert(description);
		}
	}
	if ((type & getLogLevel()) > 0) {
		// write to log file
		var logSeverity = "unspecified";
		switch(type) {
			case 0:
				logSeverity = "SUCCESS";
				break;
			case 1:
				logSeverity = "ERROR";
				break;
			case 2:
				logSeverity = "WARNING";
				break;
			case 4:
				logSeverity = "INFO";
				break;
			case 8:
				logSeverity = "DEBUG";
				break;
			case 16:
				logSeverity = "DEBUG";
				break;
		}

		var logFile = getLogFile();
		if (logFile != null) {
			// Write log to file.
			logFile.WriteLine(getLogLine(logSeverity, description));
		} else {
			// First write log line to buffer.
			if (logBuffer != null) {
				// Write log entry to local buffer.
				logBuffer += getLogLine(logSeverity, description) + "\r\n";
			} else {
				// Create new log buffer.
				logBuffer = getLogLine(logSeverity, description) + "\r\n";
			}
			if (logInitReady == true) {
				// Log file not initialized but ready to be initialized
				// If log is ready to be initialized, then initialize it.
				initializeLog();
			}
		}
	}
}

/**
 * Logs status message which can be read by WPKG client to display messages to
 * the user
 * 
 * @param message
 *            the message to be sent to the client.
 */
function logStatus(message) {
	if (isSendStatus()) {
		alert(getLogLine("STATUS", message));
	}
}

/**
 * Notifies the user/computer with a pop up message.
 */
function notify(message) {
	if (!isNoNotify()) {
		var msgPath = "%SystemRoot%\\System32\\msg.exe";
		var netPath = "%SystemRoot%\\System32\\net.exe";
		var cmd = "";
		// check if msg.exe exists
		var fso = new ActiveXObject("Scripting.FileSystemObject");
		if(fso.FileExists(new ActiveXObject("WScript.Shell").ExpandEnvironmentStrings(msgPath))) {
			// try msg method
			// cmd += "%COMSPEC% /U /C chcp 65001 && echo " + message + " | " +
			// msgPath + " * /TIME:" + notificationDisplayTime;
			cmd += msgPath + " * /TIME:" + notificationDisplayTime + " \"" + message + "\"";
		} else {
			// try net send method
			cmd += netPath + " SEND ";
			cmd += getHostname();
			cmd += " \"" + message + "\"";
		}
		try {
			exec(cmd, 0, null);
		} catch (e) {
			var errorMessage = "Notification failed. " + e.description;
			if (isQuitOnError()) {
				throw new Error(0, errorMessage);
			} else {
				error(errorMessage);
			}
		}
	} else {
		info("User notification suppressed. Message: " + message);
	}
}

/**
 * Sends a message to the system console notifying the user that installation
 * failed.
 */
function notifyUserFail() {
	// get localized message
	var msg = getLocalizedString("notifyUserFail");
	if (msg == null) {
		msg = "The software installation has failed.";
	}

	try {
		notify(msg);
	} catch (e) {
		error("Unable to notify the user that all action has been completed.");
	}
}

/**
 * Sends a message to the system console notifying of impending action.
 */
function notifyUserStart() {
	if (!was_notified) {
		// get localized message
		var msg = getLocalizedString("notifyUserStart");
		if (msg == null) {
			msg = "";
			msg += "Automatic software deployment is currently updating your ";
			msg += "system. Please wait until the process has finished. Thank you.";
		}

		was_notified = true;

		try {
			notify(msg);
		} catch (e) {
			throw new Error(0, "Unable to notify user that the system was " +
				"about to begin updating. " + e.description);
		}
	}
}

/**
 * Sends a message to the system console notifying them that all action is
 * complete.
 */
function notifyUserStop() {
	if(was_notified) {
		// get localized message
		var msg = getLocalizedString("notifyUserStop");
		if (msg == null) {
			msg = "";
			msg += "The automated software installation utility has completed ";
			msg += "installing or updating software on your system. No reboot was ";
			msg += "necessary. All updates are complete.";
		}

		try {
			notify(msg);
		} catch (e) {
			error("Unable to notify the user that all actions have been completed.");
		}
	}
}

/**
 * Set new locale LCID for user.
 * 
 * @param newLocale new locale to be used starting from now.
 */
function setLocale(newLocale) {
	if (newLocale != null) {
		LCID = newLocale;
	}
}

/**
 * Set new locale LCID for OS.
 * 
 * @param newLocale new locale to be used starting from now.
 */
function setLocaleOS(newLocale) {
	if (newLocale != null) {
		LCIDOS = newLocale;
	}
}

/**
 * Sets new log append value.
 * 
 * @param append
 *            true if log should be appended, false otherwise (boolean)
 */
function setLogAppend(append) {
	logAppend = append;
}


/**
 * Sets new logging level.
 *
 * @param newLevel new log level to be used:<br>
 * 0: do not log anything, disables writing of a log-file<br>
 * 1: log errors only<br>
 * 2: log errors and warnings<br>
 * 4: log errors, warnings and information
 */
function setLogLevel(newLevel) {
	logLevelValue = parseInt(newLevel);
}

/**
 * Sets new state for the nonotify flag.
 * 
 * @param newState
 *            new state of the nonotify flag (boolean)
 */
function setNoNotify(newState) {
	nonotify = newState;
}

/**
 * Sets new state for the upgrade-before-remove flag.
 * 
 * @param newState
 *            set to true if you want to enable the upgrade-before-remove
 *            feature. Otherwise set false.
 */
function setUpgradeBeforeRemove(newState) {
	noUpgradeBeforeRemove = !newState;
}

/**
 * Logs or presents a warning message depending on interactivity.
 */
function warning(message) {
	log(2, message);
}

/*******************************************************************************
 * SUPPLEMENTARY FUNCTIONS Not directly related to the application logic but
 * used by several functions to fulfill the task.
 * ****************************************************************************
 */


/**
 * Combines one list and another list into a single array.
 */
function concatenateList(list1, list2) {
	// Create a new array the size of the sum of both original lists.
	var list = new Array();

	for (var iList1 = 0; iList1 < list1.length; iList1++) {
		list.push(list1[iList1]);
	}

	for (var iList2 = 0; iList2 < list2.length; iList2++) {
		list.push(list2[iList2]);
	}

	return list;
}

/**
 * Concatenates two Dictionary object and returns concatenated list.
 * Does not modify any of the dictionaries passed as paramters. Returns new
 * Dictionary object instead.
 * If an element is listed in both dictionaries, then the value of the second
 * Dictionary is applied (overwrite).
 * Throws error in case an error occurs during dictionary append.
 * @param dictionary1 Dictionary to be used as a base.
 * @param dictionary2 Dictionary to be appended to dictionary1.
 * @returns Dictionary object containing values of dicitonary1 and dictionary2.
 */
function concatenateDictionary(dictionary1, dictionary2) {
	// Return variable.
	var concatenatedDictionary = new ActiveXObject("Scripting.Dictionary");

	var dictionaries = new Array();
	dictionaries.push(dictionary1);
	dictionaries.push(dictionary2);
	
	// Concatenate
	for (var iDictionary=0; iDictionary<dictionaries.length; iDictionary++) {
		var dictionary = dictionaries[iDictionary];
		var dictKeys = dictionaries[iDictionary].keys().toArray();

		for (var iDictKey=0; iDictKey<dictKeys.length; iDictKey++) {
			var key = dictKeys[iDictKey];
			var value = dictionary.Item(key);
	
			// remove eventually existing variable
			// I don't like to use
			// variables.Item(variableName)=variableValue;
			// because my IDE/parser treats it as an error:
			// "The left-hand side of an assignment must be a variable"
			try {
				concatenatedDictionary.Remove(key);
			} catch(e) {
				// dinfo("Dictionary element '" + key + "' was not defined before. Creating now.");
			}
			try {
				concatenatedDictionary.Add(key, value);
			} catch(e) {
				var message = "Dictionary element '" + key + "' with value '" + value + "'" +
					" could not be assigned to dictionary!";
				if (isQuitOnError()) {
					throw new Error(message);
				}
				error(message);
			}
		}
	}

	return concatenatedDictionary;
}


/**
 * Downloads a file by url, target directory and timeout
 * 
 * @param url
 *            full file URL to download (http://www.server.tld/path/file.msi)
 * @param target
 *            target directory do download to. This is specified relative to the
 *            downloadUrl path as specified within config.xml
 * @param timeout
 *            timeout in seconds
 * @return true in case of successful download, false in case of error
 */
function downloadFile(url, target, timeout, expandURL) {
	if (url == null || url == "") {
		error("No URL specified for download!");
		return false;
	}

	// evaluate target directory
	if (target == null || target == "") {
		error("Invalid download target specified: " + target);
		return false;
	} else {
		target = downloadDir + "\\" + target;
	}

	try {
		// Get shell to expand environment.
		var shell = new ActiveXObject("WScript.Shell");

		// Expand environment on target.
		target = shell.ExpandEnvironmentStrings(target);

		// Expand environment on URL.
		if (expandURL) {
			url = shell.ExpandEnvironmentStrings(url);
		}

		var fso = new ActiveXObject("Scripting.FileSystemObject");
		var stream = new ActiveXObject("ADODB.Stream");
		var xmlHttp = new createXmlHttp();

		dinfo("Downloading '" + url + "' to '" + target + "'");

		// open HTTP connection
		xmlHttp.open("GET", url, true);
		xmlHttp.setRequestHeader("User-Agent", "XMLHTTP/1.0");
		xmlHttp.send();

		for (var t=0; t < timeout; t++) {
			if (xmlHttp.ReadyState == 4) {
				break;
			}
			WScript.Sleep(1000);
		}

		// abort download if not finished yet
		if (xmlHttp.ReadyState != 4) {
			xmlHttp.abort();
			error("HTTP Timeout after " + timeout + " seconds.");
		}

		// check if download has been completed
		if (xmlHttp.status != 200) {
			error("HTTP Error: " + xmlHttp.status + ", " + xmlHttp.StatusText);
		}

		stream.open();
		stream.type = 1;

		stream.write(xmlHttp.responseBody);
		stream.position = 0;

		// delete temporary file if it already exists
		if (fso.FileExists(target)) {
			fso.DeleteFile(target);
		}

		// check if target folder exists, crate if required
		var folder = fso.getParentFolderName(target);
		var folderStructure = new Array();

		while (!fso.FolderExists(folder)) {
			folderStructure.push(folder);
			folder = fso.getParentFolderName(folder);
		}
		// create folders
		for (var i=folderStructure.length-1; i>=0; i--) {
			fso.createFolder(folderStructure[i]);
		}

		// write file
		stream.saveToFile(target);
		stream.close();

	} catch (e) {
		error("Download failed: " + e.description);
		return false;
	}

	return true;
}

/**
 * This method is used to return an XMLHTTP object. Depending on the MSXML
 * version used the factory is different.
 * 
 * @return XMLHTTP object
 */
function createXmlHttp() {
	var xmlHttpFactories = [
		function () {return new XMLHttpRequest();},
		function () {return new ActiveXObject("Msxml2.XMLHTTP");},
		function () {return new ActiveXObject("Msxml3.XMLHTTP");},
		function () {return new ActiveXObject("Microsoft.XMLHTTP");}
	];

	var xmlHttp = null;
	for (var i=0; i < xmlHttpFactories.length; i++) {
		try {
			xmlHttp = xmlHttpFactories[i]();
		} catch (e) {
			continue;
		}
		break;
	}
	return xmlHttp;
}



/**
 * Executes a shell command and blocks until it is completed, returns the
 * program's exit code. Command times out and is terminated after the specified
 * number of seconds.
 * 
 * @param cmd
 *            the command line to be executed
 * @param timeout
 *            timeout value in seconds (use value <= 0 for default timeout)
 * @param workdir
 *            working directory (optional). If set to null uses the current
 *            working directory of the script.
 * @return command exit code (or -1 in case of timeout)
 */
function exec(cmd, timeout, workdir) {
	if (isDryRun()) {
		return 0;
	}
	// Create shell object for variable expansion.
	var shell = new ActiveXObject("WScript.Shell");

	// Expand command for better traceability in logs.
	var cmdExpanded = shell.ExpandEnvironmentStrings(cmd);

	// Initialize shell execute object.
	var shellExec = null;

	try {

		// Timeout after an hour by default.
		if (timeout <= 0) {
			timeout = 3600;
		}

		// set working directory (if supplied)
		if (workdir != null && workdir != "") {
			workdir = shell.ExpandEnvironmentStrings(workdir);
			dinfo("Switching to working directory: " + workdir);
			shell.CurrentDirectory = workdir;
		}

		var executeMessage = "Executing command: '" + cmd + "'";
		if (cmd != cmdExpanded) {
			executeMessage += " ('" + cmdExpanded + "')";
		}
		dinfo(executeMessage + ".");
		var shellExec = shell.exec(cmd);
		var startTime = (new Date()).getTime();

		// close STDIN channel as we won't write to it and some command like
		// PowerShell might wait for it to be closed on exit
		shellExec.StdIn.close();

		var timeUsed = 0;
		var timeoutMilliseconds = timeout * 1000;
		var increment = 10;
		var incrementMax = 1000;
		while (shellExec.status == 0) {
			/*
			 * Unfortunately WSH is terribly broken when handling I/O streams from processes. AtEndOfStream blocks as
			 * well as ReadAll(), Read(x) and ReadLine(). So it's impossible to fetch STDOUT/ STDERR without blocking
			 * the main WPKG program. So either you can fetch the output or wait for the program to terminate, but not
			 * both. For WPKG it's more important to handle a timeout in order to handle programs which do not terminate
			 * properly or interactively ask for input. Unfortunately sub-processes seem to be blocked if they write
			 * more than 4k of data to STDOUT and/or STDERR buffer. So make sure your commands do not print too much on
			 * the console. If in doubt you might redirect STDOUT/STDERR to a file. For example by adding ">
			 * %TEMP%\myprog-out.txt 2>&1" to the command line. See
			 * <http://www.tech-archive.net/Archive/Scripting/microsoft.public.scripting.wsh/2004-10/0204.html> for a
			 * discussion on this topic.
			 */
			// Read and discard the output buffers to prevent process blocking
			/*
			 * if (!shellExec.StdOut.AtEndOfStream) { dinfo("STDOUT: " + shellExec.StdOut.ReadAll()); } if
			 * (!shellExec.StdErr.AtEndOfStream) { dinfo("STDERR: " + shellExec.StdErr.ReadAll()); }
			 */

			for(var i=0; i < 10 && shellExec.status == 0 && timeUsed < timeoutMilliseconds; i++) {
				WScript.Sleep(increment);
				timeUsed += increment;
			}

			if (shellExec.status != 0) {
				break;
			}
			increment = increment * 10;
			if(increment > incrementMax) {
				increment = incrementMax;
			}
			// Update time used to get real time used
			timeUsed = (new Date()).getTime() - startTime;
			if (timeUsed >= timeoutMilliseconds) {
				throw new Error("Timeout reached while executing.");
			}
		}

		return shellExec.exitCode;
	} catch (e) {
		// handle execution exception
		var message = "Command '" + cmd + "'";
		if (cmd != cmdExpanded) {
			message += " ('" + cmdExpanded + "')";
		}
		message += " was unsuccessful.\n" + e.description;
		if(isQuitOnError()) {
			throw new Error(message);
		} else {
			error(message);
			return -1;
		}
	} finally {
		// If process is not terminated then make sure it's terminated now.
		if (shellExec != null && shellExec.status == 0) {
			shellExec.Terminate();
		}
	}
}

/**
 * Returns script arguments
 */
function getArgv() {
	return WScript.Arguments;
}

/**
 * Returns processor architecture as reported by Windows.
 * Currently returns the following architecture strings:
 * <pre>
 * String       Description
 * x86          Intel x86 compatible 32-bit architecture
 * x64          AMD64 compatible 64-bit architecture
 * ia64         Itanium compatible 64-bit IA64 instruction set
 * </pre>
 * 
 * Other architectures are currently not supported.
 * 
 * @returns Processor architecture string.
 */
function getArchitecture() {
	if (hostArchitecture == null) {
		hostArchitecture = "x86";
		var wshObject = new ActiveXObject("WScript.Shell");
		// check if PROCESSOR_ARCHITECTURE is AMD64
		// NOTE: On 32-bit systems PROCESSOR_ARCHITECTURE is x86 even if the CPU is
		// actually a 64-bit CPU
		var architecture = wshObject.ExpandEnvironmentStrings("%PROCESSOR_ARCHITECTURE%");
		switch (architecture) {
			case "AMD64":
				hostArchitecture = "x64";
				break;
			case "IA64":
				hostArchitecture = "ia64";
				break;
		}
	}
	return hostArchitecture;
}

/**
 * This function retrieves the IP address from the registry.
 * 
 * @return array of IP address strings, array can be of length 0
 */
function getIPAddresses() {
	if (ipAddresses == null) {
		ipAddresses = new Array();

		var netCards = "SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\NetworkCards\\";
		var netInterfaces = "SYSTEM\\CurrentControlSet\\Services\\Tcpip\\Parameters\\Interfaces\\";

		var subKeys = getRegistrySubkeys(netCards, 0);
		if (subKeys != null) {
			for (var i=0; i < subKeys.length; i++) {
				// get service name entry
				var service = getRegistryValue("HKLM\\" + netCards + subKeys[i] + "\\ServiceName");
				 if (service != null && service != "") {
					dinfo("Found network service: " + service);

					var regBase = "HKLM\\" + netInterfaces +  service + "\\";
					var isInterface = getRegistryValue(regBase);
					if (isInterface == null) {
						dinfo("No TCP/IP Parameters for network service " + service);
					} else {
						// check if DHCP is enabled
						var isDHCP = getRegistryValue(regBase + "EnableDHCP");
						if (isDHCP != null && isDHCP > 0) {
							dinfo("Reading DHCP address.");
							// read DHCP address
							var dhcpIP = getRegistryValue(regBase + "DhcpIPAddress");
							if (dhcpIP != null && dhcpIP != "") {
								ipAddresses.push(dhcpIP);
								dinfo("Found DHCP address: " + dhcpIP);
							}
						} else {
							// try reading fixed IP
							dinfo("Reading fixed IP address(es).");

							var fixedIPsRegs = getRegistryValue(regBase + "IPAddress");
							if (fixedIPsRegs == null || fixedIPsRegs == "") {
								dinfo("Error reading fixed IP address(es).");
							} else {
								var fixedIPs = fixedIPsRegs.toArray();
								if (fixedIPs != null) {
									for (var j=0; j < fixedIPs.length; j++) {
										if (fixedIPs[j] != null &&
										fixedIPs[j] != "" &&
										fixedIPs[j] != "0.0.0.0") {
										ipAddresses.push(fixedIPs[j]);
										dinfo("Found fixed IP address: " + fixedIPs[j]);
										}
									}
								}
							}
						}
					}
				}
			}
		}
	}
	return ipAddresses;
}

/**
 * Returns the Windows LCID configured for the current user.<br>
 * NOTE: The LCID is read from "HKCU\Control Panel\International\Locale"
 * This is the locale of the user under which WPKG is run. In case WPKG GUI is
 * used this might probably differ from the real locale of the user but at
 * least it will match the system default locale. A user working on an English
 * installation will most probably be able to understand English messages even
 * if the users locale might be set to German. I was yet unable to find any
 * other reliable way to read the locale.
 * 
 * @return LCID value corresponding to current locale. See
 *         http://www.microsoft.com/globaldev/reference/lcid-all.mspx for a list
 *         of possible values. Leading zeroes are stripped.
 */
function getLocale() {
	if (LCID == null) {
		// set default to English - United States
		var defaultLocale = "409";
		var localePath = "HKCU\\Control Panel\\International\\Locale";

		// read the key
		var regLocale = getRegistryValue(localePath);
		if (regLocale != null) {
			// trim leading zeroes
			var locale = trimLeadingZeroes(regLocale).toLowerCase();
			dinfo("Found user locale: " + locale);
			LCID = locale;
		} else {
			LCID = defaultLocale;
			dinfo("Unable to locate user locale. Using default locale: " + defaultLocale);
		}
	}

	return LCID;
}

/**
 * Returns the Windows operating system install language LCID.<br>
 * NOTE: The LCID is read from the InstallLanguage value at
 * HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\Nls\Language\.
 * This is the locale under which the OS has been initially installed
 * regardless of the user locale settings.<br>
 * For example on an English Windows installation with the locale settings set
 * to German it will still return 409.
 * 
 * @returns LCID value corresponding to system install language. See
 *          http://www.microsoft.com/globaldev/reference/lcid-all.mspx for a list
 *          of possible values. Leading zeroes are stripped.
 */
function getLocaleOS() {
	if (LCIDOS == null) {
		// set default to English - United States
		var defaultLocale = "409";
		var localePath = "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Nls\\Language\\InstallLanguage";

		// read the key
		var regLocale = getRegistryValue(localePath);
		if (regLocale != null) {
			// trim leading zeroes
			var locale = trimLeadingZeroes(regLocale).toLowerCase();
			dinfo("Found system locale: " + locale);
			LCIDOS = locale;
		} else {
			LCIDOS = defaultLocale;
			dinfo("Unable to locate system locale. Using default locale: " + defaultLocale);
		}
	}

	return LCIDOS;
}

/**
 * Returns the logfile pattern currently in use
 * 
 * @return current value of logfilePattern
 */
function getLogfilePattern() {
	return logfilePattern;
}

/**
 * Returns the current value of the rebootCmd variable.
 * 
 * @return current value of rebootCmd
 */
function getRebootCmd() {
	return rebootCmd;
}

/**
 * Returns a string array containing the names of the subkeys of the given
 * registry key. The parentKey parameter has to be specified without the leading
 * HKCU part.
 * 
 * @param parentKey
 *            key to read subkeys from (e.g. "SOFTWARE\\Microsoft"
 * @param subLevels
 *            number of sub-levels to parse. Set to 0 in order to parse only
 *            direct sub-keys of the given parent key. If set to 1 it will parse
 *            the subkeys of all direct child keys as well. Set to 2 to parse 2
 *            levels. Set to negative value (e.g. -1) to parse recursively
 *            without any recursion limit.
 * 
 * @return array containing a list of strings representing the subkey names
 *         returns null in case of error or empty array in case of no available
 *         subkeys.
 */
function getRegistrySubkeys(parentKey, subLevels) {
	// dinfo("Getting registry subkeys from: " + parentKey);

	// get number of recursion levels
	if( subLevels == null ) {
		subLevels = 0;
	}

	// key representing HKEY_LOCAL_MACHINE
	var HKLM = 0x80000002;

	var returnArray = new Array();

	try {
		// Getting registry access object.
		var locator = new ActiveXObject("WbemScripting.SWbemLocator");
		var service = locator.ConnectServer(".", "root\\default");
		var regProvider = service.Get("StdRegProv");

		var enumKeyMethod = regProvider.Methods_.Item("EnumKey");
		var inputParameters = enumKeyMethod.InParameters.SpawnInstance_();
		inputParameters.hDefKey = HKLM;
		inputParameters.sSubKeyName = parentKey;
		var outputParam = regProvider.ExecMethod_(enumKeyMethod.Name, inputParameters);

		try {
			returnArray = outputParam.sNames.toArray();

			// if there is a sub key parse it as well if recursion is requested
			if (returnArray != null && ( subLevels >= 1 ) || subLevels < 0) {
				for (var i = 0; i < returnArray.length; i++) {
					var subKey = parentKey + "\\" + returnArray[i];
					var subKeys = getRegistrySubkeys(subKey, subLevels - 1);
					if (subKeys != null) {
						for (var j = 0; j < subKeys.length; j++) {
							returnArray.push(returnArray[i] + "\\" + subKeys[j]);
						}
					}
				}
			}
		} catch (readError) {
			/*
			 * a read error on outputParam.sNames typically means that there are no sub-keys available.
			 */
		}

	} catch(err) {
		error("Error when searching registry sub-keys at 'HKLM\\" +
				 parentKey + "'\nCode: " + hex(err.number) + "; Descriptions: " +
				 err.description);
		returnArray = null;
	}

	return returnArray;
}

/**
 * Returns value of given key in registry. If a key is specified instead of a
 * registry value returns its "(default)" value. In case no default value is
 * assigned returns an empty string ("").
 * 
 * In case no such key or value exists within the registry, returns null
 * 
 * @return registry value, key default value (or "") or null if path does not
 *         exist. In case the read value is a REG_DWORD returns an integer. In
 *         case the value is of type REG_MULTI_SZ returns a VBArray of strings.
 *         In case value is of type REG_BINARY returns VBArray of integer.
 */
function getRegistryValue(registryPath) {
	registryPath = trim(registryPath);
	var originalPath = registryPath;

	var WshShell = new ActiveXObject("WScript.Shell");
	var val = "";
	try {
		val = WshShell.RegRead(registryPath);
	} catch (e) {
		var readError = e.description;
		// dinfo("Error reading value at '" + registryPath + "', trying to read
		// it as a key");

		// supplied path is probably a key, test for key existence
		if (registryPath.match(new RegExp("\\\\$", "g")) == null) {
			// dinfo("String '" + registryPath + "' is not backslash " +
			// "terminated, adding trailing backslash and test for key
			// existence");

			registryPath = registryPath + "\\";
			try {
				val = WshShell.RegRead(registryPath);
			} catch (keyErr) {
				val = null;
				// readError = keyErr.description;
				// dinfo("Error reading key'" + registryPath + "': " +
				// readError);
			}
		}

		// force error message to get returned error string
		// in case the key does not exist
		var noSuchKeyError = "";
		try {
			WshShell.RegRead("HKLM\\SOFTWARE\\NOSUCHKEY\\");
		} catch (noKeyError) {
			noSuchKeyError = noKeyError.description;
			// dinfo("Error when reading inexistent key: " + noSuchKeyError);
		}
		// check if the error message we got is the same
		if (noSuchKeyError.replace(new RegExp("HKLM\\\\SOFTWARE\\\\NOSUCHKEY\\\\"),
			registryPath) == readError) {

			// check if key exists for 32-bit applications in redirected path
			// (only if the path if not already pointing to the Wow6432Node key
			if (is64bit() &&
				originalPath.match(new RegExp("^HKLM\\\\SOFTWARE", "i")) &&
				!originalPath.match(new RegExp("^HKLM\\\\SOFTWARE\\\\Wow6432Node", "i"))) {
				// dinfo("Searching for value at 32-bit redirection node.");
				var redirectPath = originalPath.replace(new RegExp("^HKLM\\\\SOFTWARE", "i"),
														"HKLM\\Software\\Wow6432Node");
				val = getRegistryValue(redirectPath);
			} else {
				// dinfo("No such key or value at '" + registryPath + "'
				// returning null.");
				// return null - not found
				val = null;
			}
		} else {
			// dinfo("Key found at '" + registryPath + "'.");
		}
	}

	return val;
}

/**
 * User-defined function to format error codes. VBScript has a Hex() function
 * but JScript does not.
 */
function hex(nmb) {
	if (nmb > 0) {
		return nmb.toString(16);
	} else {
		return (nmb + 0x100000000).toString(16);
	}
}

/**
 * Scans an argument vector for an argument "arg". Returns true if found, else
 * false.
 */
function isArgSet(argv, arg) {
	// Loop over argument vector and return true if we hit it...
	for (var i = 0; i < argv.length; i++) {
		if (argv(i) == arg) {
			return true;
		}
	}
	// ...otherwise, return false.
	return false;
}

/**
 * Loads environment for the specified package (including applying hosts and
 * profile variables).
 * 
 * NOTE: You should invoke saveEnv() before loading the package environment.
 * This allows you to call loadEnv() after operations are done to restore
 * the previous environment.
 * 
 * <pre>
 * [...]
 * var previousEnv = getEnv();
 * loadPackageEnv(package);
 * // do some actions
 * loadEnv(previousEnv);
 * </pre>
 *
 * @param packageNode The package definition to load the environment from
 */
function loadPackageEnv(packageNode) {

	// Array to store all variables found.
	var variables =  new Array();

	// Host variables first...
	variables = getHostsVariables(variables);

	// ...then profile variables...
	variables = getProfileVariables(variables);

	// ...and lastly package variables.
	variables = getPackageVariables(packageNode, variables);

	// Apply variables to environment.
	for (var iVariable=0; iVariable < variables.length; iVariable++) {
		var varDefinition = variables[iVariable];
		var variableKeys = varDefinition.keys().toArray();
		for (var iVarKey = 0; iVarKey < variableKeys.length; iVarKey++) {
			var key = variableKeys[iVarKey];
			var value = varDefinition.Item(key);
			dinfo("Setting variable: '" + key + "=" + value + "'.");
			setEnv(key, value);
		}
	}
}

/**
 * Restores environment using the given dictionary object.
 * Variables which are not defined within the dictionary object are unset.
 * Variables which are defined within the dictionary object are set to the
 * value defined in the dictionary object.
 * @param environment
 *           Optionally specify a Scripting.Dictionary object which contains
 *           the environment to load. If null is passed loads the environment
 *           previously saved with parameter-less saveEnv().
 * @return Always returns true.
 */
function loadEnv(environment) {
	// dinfo("Loading environment");
	if (environment == null) {
		return true;
	}
	var success = true;
	var procEnv = new ActiveXObject("WScript.Shell").Environment("Process");
	for(var e = new Enumerator(procEnv); !e.atEnd(); e.moveNext()) {
		var env = e.item(e);
		var splitEnv = env.split("=", 1);
		var key = splitEnv[0];
		if (key != null && key != "") {
			if (environment.Exists(key)) {
				// dinfo("Setting environment variable '" + key + "' to value '" + environment(key) + "'.");
				procEnv(key) = environment(key);
				// yields warning in my IDE:
				// procEnv.Remove(key);
				// procEnv.add(key, environment.Item(key));
			} else {
				procEnv.Remove(key);
			}
		}
	}
	return success;
}

/**
 * Parses Date according to ISO 8601. See <http://www.w3.org/TR/NOTE-datetime>.
 * 
 * Generic format example:
 * 
 * <pre>
 * 	"YYYY-MM-DD hh:mm:ss"
 * Valid date examples:
 * 	(the following dates are all equal if ceil is set to false)
 * 	"2007-11-23 22:00"			(22:00 local time)
 * 	"2007-11-23T22:00"			(Both, "T" and space delimiter are allowed)
 * 	"2007-11-23 22:00:00"		(specifies seconds which default to 0 above)
 * 	"2007-11-23 22:00:00.000"	(specifies milliseconds which default to 0)
 * It is allowed to specify the timezone as well:
 * 	"2007-11-23 22:00+01:00"	(22:00 CET)
 * 	"2007-11-23 21:00Z"			(21:00 UTC/GMT = 22:00 CET)
 * 	"2007-11-23 22:00+00:00"	(21:00 UTC/GMT = 22:00 CET)
 * </pre>
 *
 * If 'ceil' is set to true then unspecified date components do not fall back
 * to "floor" (basically 0) but will be extended to the next value.
 * This allows easy comparison if the current date is within a parsed "!ceil"
 * date and a parsed "ceil" date.
 * 
 * Examples:
 * <pre>
 * ceil=false:
 * 	"2007-11-23"	=> "2007-11-23 00:00:00"
 * 	"2007-11"		=> "2007-11-01 00:00:00"
 * ceil=true:
 * 	"2007-11-23"	=> "2007-11-24 00:00:00"
 * 	"2007-11"		=> "2007-12-01 00:00:00"
 * </pre>
 *
 * so you can specify a range in the following format
* <pre>
 * if (parseISODate("2007-11", !ceil) >= currentDate &&
 *     parseISODate("2007-11", ceil) <= currentDate) {
 * 		// this will be true for all dates within November 2007
 * 		...
 * }
 * </pre>
 *
 * TIMEZONES:
 *
 * As specified by ISO 8601 the date is parsed as local date in case no
 * time zone is specified. If you define a time zone then the specified time
 * is parsed as local time for the given time zone. So if you specify
 * "2007-11-23 22:00+05:00" this will be equal to "2007-11-23 18:00+01:00" while
 * "+01:00" is known as CET as well. The special identifier "Z" is equal to
 * "+00:00" time zone offset.
 * 
 * Specifying an empty string as dateString is allowed and will results in
 * returning the first of January 00:00 of the current year (ceil=false) or
 * first of January 0:00 of the next year (ceil=true).
 * 
 * @param dateString
 *            the string to be parsed as ISO 8601 date
 * @param ceil
 *            defines if missing date components are "rounded-up" or "rounded
 *            down", see above
 * @return Date object representing the specified date. Returns null if the
 *         date cannot be parsed.
 */
function parseISODate(dateString, ceil) {
	// <YYYY>[-]<MM>[-]<DD>[T ]<hh>:<mm>:<ss>.<ms>[
	// make sure dateString is defined
	var now = new Date();
	var dateStringValue = dateString;
	if (dateStringValue == null) {
		dateStringValue = now.getFullYear() + "";
	}

	// http://www.w3.org/TR/NOTE-datetime
	var regexp = "([0-9]{4})(?:-?([0-9]{1,2})(?:-?([0-9]{1,2})" +
			"(?:[T ]([0-9]{1,2}):([0-9]{1,2})(?::([0-9]{1,2})(?:\\.([0-9]{1,3}))?)?" +
			"(?:(Z)|(?:([-+])([0-9]{1,2})(?::([0-9]{1,2}))?))?)?)?)?";

	// execute matching
	var matches = dateStringValue.match(new RegExp(regexp));

	var ceilValue = ceil;
	if (ceilValue == null) {
		ceilValue = false;
	}

	// create new date object using the year parsed
	var date = new Date(now.getFullYear(), 0, 1);
	if (matches[1]) {
		date.setFullYear(matches[1]);
	} else {
		dinfo("Date '" + dateString + "' could not be parsed.");
		return null;
	}
	/*
	 else if (ceilValue) {
		date.setFullYear(date.getFullYear() + 1);
	} */
	// parse months
	if (matches[2]) {
		date.setMonth(matches[2] - 1);
	} else if (ceilValue) {
		// month not defined, advance to next year
		date.setFullYear(date.getFullYear() + 1);
		ceilValue = false;
	}
	// parse days (of the month)
	if (matches[3]) {
		date.setDate(matches[3]);
	} else if (ceilValue) {
		// date (day of the month) not defined, advance to next month
		date.setMonth(date.getMonth() + 1);
		ceilValue = false;
	}
	// parse hours
	if (matches[4]) {
		date.setHours(matches[4]);
	} else if (ceilValue) {
		// hours not defined, advance to next day
		date.setDate(date.getDate() + 1);
		ceilValue = false;
	}
	// parse minutes
	if (matches[5]) {
		date.setMinutes(matches[5]);
	} else if (ceilValue) {
		// minutes not defined, advance to next hour
		date.setHours(date.getHours() + 1);
		ceilValue = false;
	}
	// parse seconds
	if (matches[6]) {
		date.setSeconds(matches[6]);
	} else if (ceilValue) {
		// seconds not defined, advance to next minute
		date.setMinutes(date.getMinutes() + 1);
		ceilValue = false;
	}
	// parse milliseconds
	if (matches[7]) {
		date.setMilliseconds(Number(matches[7]));
	} else if (ceilValue) {
		// milliseconds not defined, advance to next second
		date.setSeconds(date.getSeconds() + 1);
		ceilValue = false;
	}
	// parse timezone offset
	var timeZoneSet = false;
	if (matches[8] == "Z") {
		matches[9] = 0;
		matches[10] = 0;
		timeZoneSet = true;
	}
	if (matches[9] || timeZoneSet) {
		// if offset is specified, translate time to local time
		var dateOffset = 0;
		if (matches[11]) {
			dateOffset = Number(matches[11]);
		}
		// convert to milliseconds
		dateOffset += Number(matches[10]) * 60;

		// evaluate prefix
		dateOffset *= (matches[9] == "+") ? 1 : -1;

		// calculate actual time
		// get UTC representation of the specified date in milliseconds
		time = Date.UTC(date.getFullYear(),
						date.getMonth(),
						date.getDate(),
						date.getHours(),
						date.getMinutes(),
						date.getSeconds(),
						date.getMilliseconds());

		// subtract specified offset to get UTC representation of specified date
		time -= dateOffset * 60 * 1000;

		// create new date object using the UTC time specified
		date = new Date(time);
	}

	return date;
}

/**
 * Reboots the system using tools\psshutdown.exe from the script execution
 * directory.
 */
function psreboot() {
	if (!isNoReboot() ) {
		rebooting = true;
		// RFL prefers shutdown tool to this method: allows user to cancel
		// if required, but we loop for ever until they give in!
		// get localized message
		var msg = getLocalizedString("notifyUserReboot");
		if (msg == null) {
			msg="Rebooting to complete software installation. Please note that "+
				"some software might not work until the machine is rebooted.";
		}
		// Overwrites global variable rebootcmd!
		var rebootCmd = "tools\\psshutdown.exe";
		var fso = new ActiveXObject("Scripting.FileSystemObject");
			if (!fso.FileExists(rebootCmd)) {
				var path = WScript.ScriptFullName;
				var psBase = fso.GetParentFolderName(path);
				rebootCmd = fso.BuildPath(psBase, rebootCmd);
				if (!fso.FileExists(rebootCmd)) {
					throw new Error("Could not locate rebootCmd '" + rebootCmd + "'.");
				}
			}
		var shutdown=rebootCmd + " -r -accepteula ";

		cleanup();
		for (var iCountdown1 = 60; iCountdown1 != 0; iCountdown1 = iCountdown1-1) {
			// This could be cancelled.
			var cmd1 = shutdown + " -c -m \"" + msg + "\" -t " + iCountdown1;
			info("Running a shutdown command: "+ cmd1);
			exec(cmd1, 0, null);
			WScript.Sleep(iCountdown1 * 1000);
		}
		// Hmm. We're still alive. Let's get more annoying.
		for (var iCountdown2 = 60; iCountdown2 != 0; iCountdown2 = iCountdown2 - 3) {
			var cmd2 = shutdown + " -m \"" + msg + "\" -t "+ iCountdown2;
			info("Running a shutdown command: " + cmd2);
			exec(cmd2, 0, null);
			WScript.Sleep(iCountdown2 * 1000);
		}
		// And if we're here, there's problem.
		notify("This machine needs to reboot.");

	} else {
		info("System reboot was initiated but overridden.");
	}

	exit(0);
}

/**
 * Reboots the system.
 */
function reboot() {
	if (!isNoReboot() ) {
		// set global var that all functions know that a reboot is in progress
		rebooting = true;
		switch (getRebootCmd()) {
		case "standard":
			var wmi = GetObject("winmgmts:{(Shutdown)}//./root/cimv2");
			var win = wmi.ExecQuery("select * from Win32_OperatingSystem where Primary=true");
			var e = new Enumerator(win);

			info("System reboot in progress!");

			if (!isNoRunningState()) {
				// Reset running state.
				setRunningState("false");
			}
			// make sure files are written
			cleanup();
			for (; !e.atEnd(); e.moveNext()) {
				var x = e.item();
				x.win32Shutdown(6);
			}
			exit(3010);
			break;
		case "special":
			psreboot();
			break;
		default:
			var fso = new ActiveXObject("Scripting.FileSystemObject");
			if (!fso.FileExists(getRebootCmd())) {
				var path = WScript.ScriptFullName;
				var toolBase = fso.GetParentFolderName(path);
				setRebootCmd(fso.BuildPath(toolBase, getRebootCmd()));
				if (!fso.FileExists(getRebootCmd())) {
					throw new Error("Could not locate rebootCmd '" + getRebootCmd() + "'.");
				}
			}
			info("Running a shutdown command: " + getRebootCmd());
			// close files
			cleanup();
			// execute shutdown
			exec(getRebootCmd(), 0, null);
			exit(3010);
			break;
		}
	} else {
		info("System reboot was initiated but overridden.");
	}

	// exit with code "3010 << 8" (770560) which means 3010 shifted by 8 bits.
	// exiting with code 3010 will make WPKG client to initiate a reboot
	// which is unlikely to be expected because reboot command is overridden.
	exit(3010 << 8);
}

/**
 * Fetches current environment and returns Scripting.Dictionary object
 * containing current environment.
 * @returns {ActiveXObject} Dictionary representing current environment.
 */
function getEnv() {
	// dinfo("Fetching environment");
	var currentEnvironment = new ActiveXObject("Scripting.Dictionary");
	var procEnv = new ActiveXObject("WScript.Shell").Environment("Process");
	for(var e=new Enumerator(procEnv); !e.atEnd(); e.moveNext()) {
		var env = e.item(e);
		var envKey = env.split("=", 1);
		var key = envKey[0];
		if (key != null && key != "") {
			var valueStartOffset = key.length + 1;
			currentEnvironment.add(envKey[0], env.substr(valueStartOffset));
		}
	}
	return currentEnvironment;
}


/**
 * Set an environment variable in the current script environment.
 * @param key Environment variable name.
 * @param value Value to assign to the variable.
 */
function setEnv(key, value) {
	if (key == null) {
		dinfo("Cannot set environment variable: No key specified!");
		return;
	}
	if (value == null) {
		dinfo("Cannot set environment variable '" + key + "': No value specified!");
		return;
	}

	// Expand environment variables in variable definition.
	var shell = new ActiveXObject("WScript.Shell");
	// Somehow an empty string is not accepted as string in set instruction below.
	// So make sure value is of type string.
	var valueExpanded = shell.ExpandEnvironmentStrings(value) + "";

	// Fetch process environment.
	var procEnv = new ActiveXObject("WScript.Shell").Environment("Process");

	// Set environment.
	procEnv(key) = valueExpanded;

	/*
	 if (procEnv.Exist(key)) {
		 procEnv.Remove(key);
	 }
	 procEnv.add(key, value);
	 */
}


/**
 * Scans uninstall list for given name. Uninstall list is placed in registry
 * under HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Uninstall Every
 * subkey represents package that can be uninstalled. Function checks each
 * subkey for containing value named DisplayName. If this value exists, function
 * returns true if nameSearched matches it.
 * 
 * @param nameSearched
 *            The uninstall string to look for (as it appears within control
 *            panel => add/remove software)
 * @return returns an array of registry paths to the uninstall entries found. An
 *         array is returned since the same software might be installed more
 *         than once (32-bit and 64-bit versions). Returns an empty array in
 *         case no uninstall entry could be located.
 */
function scanUninstallKeys(nameSearched) {
	var uninstallPath = new Array();
	var scanKeys = new Array();
	scanKeys.push("SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Uninstall");
	if (is64bit()) {
		// scan redirected path as well (assures that 32-bit applications are
		// found)
		scanKeys.push("SOFTWARE\\Wow6432Node\\Microsoft\\Windows\\CurrentVersion\\Uninstall");
	}

	// try regular expression matching
	var regularExpression = true;
	for (var i=0; i < scanKeys.length; i++) {
		var regPath = scanKeys[i];
		/*
		 * recursive registry reading is very slow with WSH. Therefore supporting Sub-keys in uninstall entries slows
		 * down uninstall key scanning dramatically. So I leave it off for the moment. Please use registry key checks if
		 * you need to check an uninstall key defined within a sub-key of the uninstall registry location
		 */
		// var keyNames = getRegistrySubkeys(regPath, -1);
		var keyNames = getRegistrySubkeys(regPath, 0);
		/*
		 * for (var k=0; k < keyNames.length; k++) { dinfo("Uninstall key: " + keyNames[k]); }
		 */

		for (var j=0; j < keyNames.length; j++) {
			var registryPath = "HKLM\\" + regPath + "\\" + keyNames[j];
			var displayName = getRegistryValue(registryPath + "\\DisplayName");

			if (displayName != null) {
				// first try direct 1:1 matching
				if (displayName == nameSearched) {
					dinfo("Uninstall entry '" + displayName +
							"' matches string '" + nameSearched + "'.");
					uninstallPath.push(registryPath);
					break;
				} else if(regularExpression) {
					try {
						// try regular-expression matching
						var displayNameRegExp = new RegExp("^" + nameSearched + "$");

						if (displayNameRegExp.test(displayName) == true) {
							dinfo("Uninstall entry '" + displayName +
									"' matches expression '" + nameSearched+  "'.");
							uninstallPath.push(registryPath);
							break;
						}
					} catch (error) {
						regularExpression = false;
						dinfo("Unable to match uninstall key with regular expression. " +
								"Usually this means that the string '" + nameSearched +
								"'does not qualify as a regular expression: " +
								error.description);
					}
				}
			}
		}
	}
	return uninstallPath;
}

/**
 * Scans the specified array for the specified element and returns true if
 * found.
 */
function searchArray(array, element) {
	for (var i=0; i < array.length; i++) {
		var e = array[i];
		if (element == e) {
			return true;
		}
	}

	return false;
}

/**
 * Removes leading / trailing spaces.
 */
function trim(string) {
	if(string != null) {
		return(string.replace(new RegExp("(^\\s+)|(\\s+$)"),""));
	} else {
		return null;
	}
}

/**
 * Removes leading zeroes from a string (does not touch trailing zeroes)
 */
function trimLeadingZeroes(string) {
	if(string != null) {
		return(string.replace(new RegExp("^[0]*"),""));
	} else {
		return null;
	}
}

/**
 * Remove duplicate items from an array.
 */
function uniqueArray(array) {
	// Hold unique elements in a new array.
	var newArray = new Array();

	// Loop over elements.
	for (var i = 0; i < array.length; i++) {
		var found = false;
		for (var j = 0; j < newArray.length; j++) {
			if (array[i] == newArray[j]) {
				found = true;
				break;
			}
		}

		if (!found) {
			newArray.push(array[i]);
		}
	}

	return newArray;
}

/**
 * versionCompare - compare two version strings.
 *
 * The algorithm is supposed to deliver "human" results. It's not just
 * comparing numbers but also allows versions with characters.
 * 
 * Some version number contain appendices to the version string indicating
 * "volatile" versions like "pre releases". For example some packages use
 * versions like "1.0RC1" or "1.0alpha2". Usually a version like "1.0RC1" would
 * be considered to be newer than "1.0" by the algorithm but in case of "RC"
 * versions this would be wrong. To handle such cases a number of strings are
 * defined in order to define such volatile releases.
 * 
 * The list of prefixes is defined in the global volatileReleaseMarker array.
 *
 * Valid comparisons include:
 * <pre>
 * A        B              Result
 * "1"      "2"            B is newer
 * "1"      "15"           B is newer
 * "1.0"    "1.2.b"        B is newer
 * "1.35"   "1.35-2"       B is newer
 * "1.35-2" "1.36"         B is newer
 * "1.35R3" "1.36"         B is newer
 * "1"      "1.0.00.0000"  Versions are equal
 * "1"      "1.0"          Versions are equal
 * "1.35"   "1.35-2"       B is newer
 * "1.35-2" "1.35"         A is newer
 * "1.35R3" "1.36R4"       B is newer
 * "1.35-2" "1.35-2.0"     Versions are equal
 * "1.35.1" "1.35.1.0"     Versions are equal
 * "1.3RC2" "1.3"          B is newer (special case where A is an "RC" version)
 * "1.5"    "1.5I3656"     A is newer (B is an "I"/integration version)
 * "1.5"    "1.5M3656"     A is newer (B is an "M"/milestone version)
 * "1.5"    "1.5u3656"     B is newer (B is an update version)
 * </pre>
 *
 * @return  0 if equal,<br>
 *         -1 if a < b,<br>
 *         +1 if a > b
 */
function versionCompare(a, b) {
	// first split the version into sub-versions separated by dots
	// eg. "1.00.1b20-R0" => 1, 00, 1b20-R0
	// constants defining the return values
	dinfo("Comparing version: '" + a + "' <=> '" + b + "'.");
	var BNEWER = -1;
	var ANEWER = 1;
	var EQUAL = 0;

	// small optimization, in most cases the strings will be equal.
	if (a == b) {
		return EQUAL;
	}

	var versionA = a.split(".");
	var versionB = b.split(".");
	var length = 0;
	versionA.length >= versionB.length ? length = versionA.length : length = versionB.length;
	var result = EQUAL;

	// split by sub-version-numbers
	// e.g. 1b20-R0" => 1b20, R0
	for (var i = 0; i < length; i++) {
		var versionPartsA = new Array();
		var versionPartsB = new Array();
		var partsSplitter = new RegExp("[^0-9a-zA-Z]");
		if( i < versionA.length ) {
			versionPartsA = versionA[i].split(partsSplitter);
		} else {
			// there is no such part on A side
			// assume 0
			versionPartsA.push(0);
		}
		if( i < versionB.length ) {
			versionPartsB = versionB[i].split(partsSplitter);
		} else {
			// there is no such part on B side
			// assume 0
			versionPartsB.push(0);
		}
		var versionParts = 0;
		versionPartsA.length > versionPartsB.length ? versionParts = versionPartsA.length : versionParts = versionPartsB.length;

		// split these parts into char/number fields
		// e.g "1b20" => 1, b, 20
		for (var j = 0; j < versionParts; j++) {
			// get A-side version part
			var versionPartA;
			if( j < versionPartsA.length ) {
				versionPartA = "" + versionPartsA[j];
			} else {
				// A does not have such a part, so B seems to be a higher
				// revision
				result = BNEWER;
				break;
			}
			// get B-side version part
			var versionPartB;
			if( j < versionPartsB.length ) {
				versionPartB = "" + versionPartsB[j];
			} else {
				// B does not have such a part, so A seems to be a higher
				// revision
				result = ANEWER;
				break;
			}

			// both versions have such a part, compare them
			dinfo("Comparing version fragments: '" + versionPartA + "' <=> '" + versionPartB + "'");

			// first split the part into number/character parts
			var numCharSplitter = new RegExp("([0-9]+)|([a-zA-Z]+)", "g");
			var numCharPartsA = versionPartA.match(numCharSplitter);
			var numCharPartsB = versionPartB.match(numCharSplitter);
			var numCharLength = 0;
			numCharPartsA.length > numCharPartsB.length ? numCharLength = numCharPartsA.length : numCharLength = numCharPartsB.length;
			// now start comparing the parts
			for (var k = 0; k < numCharLength; k++) {
				var numCharPartA;
				var numCharPartB;
				// get A-side
				if( k < numCharPartsA.length ) {
					numCharPartA = numCharPartsA[k];
				} else {
					// A-side does not have such a part, so B seems to be either
					// a higher revision or appends a volatile version
					// identifier
					var bSideString = numCharPartsB[k];
					// check if it matches one from the volatile list
					for (var vId = 0; vId < volatileReleaseMarkers.length; vId++) {
						if (bSideString.toLowerCase() == volatileReleaseMarkers[vId]) {
							dinfo("Special case: '" + a + "' is newer because '" + b + "' " +
									"is considered to have a volatile version appendix (" +
									volatileReleaseMarkers[vId] + ").");
							result = ANEWER;
							break;
						}
					}
					if (result == EQUAL) {
						// B is newer
						result = BNEWER;
					}
					break;
				}
				if( k < numCharPartsB.length ) {
					numCharPartB = numCharPartsB[k];
				} else {
					// B-side does not have such a part, so A seems to be either
					// a higher revision or appends a volatile version
					// identifier
					var aSideString = numCharPartsA[k];
					// check if it matches one from the volatile list
					for (var volId = 0; volId < volatileReleaseMarkers.length; volId++) {
						if (aSideString.toLowerCase() == volatileReleaseMarkers[volId]) {
							dinfo("Special case: '" + a + "' is newer because '" + b + "' " +
									"is considered to have a volatile version appendix (" +
									volatileReleaseMarkers[volId] + ").");
							result = BNEWER;
							break;
						}
					}
					if (result == EQUAL) {
						result = ANEWER;
					}
					break;
				}

				// both versions have such a part, compare them
				// strip off leading zeroes first
				var stripExpression = new RegExp("^[0 \t]*(.+)$");
				var strippedA = numCharPartA.match(stripExpression);
				numCharPartA = strippedA[1];

				var strippedB = numCharPartB.match(stripExpression);
				numCharPartB = strippedB[1];

				var numCharSplitA = numCharPartA.split("");
				var numCharSplitB = numCharPartB.split("");
				if (numCharSplitB.length > numCharSplitA.length) {
					// version B seems to be higher
					result = BNEWER;
					break;
				} else if (numCharSplitA.length > numCharSplitB.length) {
					// version a seems to be higher
					result = ANEWER;
					break;
				}

				// both versions seem to have equal length, compare them
				for (var l = 0; l < numCharSplitA.length; l++) {
					var characterA = numCharSplitA[l];
					var characterB = numCharSplitB[l];
					if (characterB > characterA) {
						// B seems to be newer
						result = BNEWER;
						break;
					} else if( characterA > characterB) {
						// A seems to be newer
						result = ANEWER;
						break;
					}
				}

				// stop evaluating
				if(result != EQUAL) {
					break;
				}
			}

			// stop evaluating
			if(result != EQUAL) {
				break;
			}
		}

		// stop evaluating
		if(result != EQUAL) {
			break;
		}
	}

	return result;
}
