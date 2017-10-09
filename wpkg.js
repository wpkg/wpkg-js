/*******************************************************************************
 *
 * WPKG 0.9.2 - Windows Packager
 * Copyright 2003 Jerry Haltom
 * Copyright 2005 Tomasz Chmielewski <tch (at) wpkg . org>
 * Copyright 2005 Aleksander Wysocki <papopypu (at) op . pl>
 *
 * Please report your issues to the list on http://wpkg.org/
 *
 *
 * Command Line Switches
 *
 * /profile:<profile>
 *     Forces the name of the current profile. If not specified, the profile is
 *     looked up using hosts.xml.
 *
 * /base:<path>
 *     Sets the local or remote path to find the settings files.
 *
 * /query:<option>
 *     Displays a list of packages matching the specified criteria. Valid
 *     options are:
 *
 *     a - all packages
 *     i - packages that are currently installed on the system
 *     x - packages that are not currently installed on the system
 *     u - packages that can be upgraded
 *
 * /show:<package>
 *     Displays a summary of the specified package, including it's state.
 *
 * /install:<package>
 *     Installs the specified package on the system.
 *
 * /remove:<package>
 *     Removes the specified package from the system.
 *
 * /upgrade:<package>
 *     Upgrades the already installed package on the system.
 *
 * /synchronize
 *     Synchronizes the current program state with the suggested program state
 *     of the specified profile. This is the action that should be called at
 *     system boot time for this program to be useful.
 *
 * /quiet
 *     Uses the event log to record all error/status output. Use this when
 *     running unattended.
 *
 * /nonotify
 *     Logged on users are not notified about impending updates.
 *
 * /noreboot
 *     System does not reboot regardless of need.
 *
 * /force
 *     Uses force when performing actions (does no honour wpkg.xml).
 *
 * /forceinstall
 *     Forces installation over existing packages.
 *
 * /debug
 * /verbose
 *     Prints some debugging info.
 *
 * /dryrun
 *     Does not execute any action. Assumes /debug on.
 *
 * /help
 *     Shows this message.
 *
 ******************************************************************************/

/*******************************************************************************
 *
 * Global variables
 *
 ******************************************************************************/

// script wide properties
var force;        // when true: doesn't consider wpkg.xml but checks existence of packages.
var forceInstall; // forces instalation over existing packages

var debug;
var dryrun;

var quiet;
var profile;
var host;
var base;

var packages_file;
var profiles_file;
var settings_file;
var hosts_file;

var packages;
var profiles;
var settings;
var hosts;

var nonotify = false;
var noreboot = false;

var packagesDocument;
var profilesDocument;
var settingsDocument;
var hostsDocument;


var was_notified = false;

// environment variables to apply to all packages
var global_env_vars;

// names of remote configuration files
// these must be located in the directory specified by the /base switch, or by
// default, the current directory

var packages_file_name = "packages.xml";
var profiles_file_name = "profiles.xml";
var hosts_file_name    = "hosts.xml";

// name of the local settings file, which is located in the System32 folder of
// the current system

var settings_file_name = "wpkg.xml";

var sRegPath = "SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Uninstall";


/*******************************************************************************
 *
 * Program execution
 *
 ******************************************************************************/

// call the main function with arguments.
try {
    main(WScript.Arguments);
} catch (e) {
    error(e.description);
    notifyUserFail();
    exit(2);
}

/**
 * Processes command lines and decides what to do.
 */
function main(argv) {

    // get special purpose argument lists
    var argn = argv.Named;
    var argu = argv.Unnamed;

    // process property named arguments that set values
    if (isArgSet(argv, "/debug") || isArgSet(argv, "/verbose")) {
        debug = true;
    } else {
        debug = false;
    }
    
    // process property named arguments that set values
    if (isArgSet(argv, "/dryrun")) {
        dryrun = true;
        debug = true;
    } else {
        dryrun = false;
    }
    
    // if the user is wanting command help, give it to him
    if (isArgSet(argv, "/help")) {
        showUsage();
        exit(0);
    }

    // process property named arguments that set values
    if (isArgSet(argv, "/quiet")) {
        quiet = true;
    } else {
        quiet = false;
    }

    // if the user passes /nonotify, we don't want to notify the user
    if (isArgSet(argv, "/nonotify")) {
        nonotify = true;
    }

    // if the user passes /noreboot, we don't want to reboot
    if (isArgSet(argv, "/noreboot")) {
        noreboot = true;
    }

    // process property named arguments that set values
    if (isArgSet(argv, "/force")) {
        force = true;
    } else {
        force = false;
    }
    
    // process property named arguments that set values
    if (isArgSet(argv, "/forceinstall")) {
        forceInstall = true;
    } else {
        forceInstall = false;
    }
    
    
    // will use the fso a bit
    var fso = new ActiveXObject("Scripting.FileSystemObject");
    
    // set host name
    var WshNetwork = WScript.CreateObject("WScript.Network");
    host = WshNetwork.ComputerName.toLowerCase();

    if (argn("base") != null) {
        base = argn("base");
        var base = fso.GetAbsolutePathName(base);
    } else {
        // use the executing location of the script as the default base path
        var path = WScript.ScriptFullName;
        base = fso.GetParentFolderName(path);
    }
    

    // append the settingsfile names to the end of the base path
    packages_file = fso.BuildPath(base, packages_file_name);
    profiles_file = fso.BuildPath(base, profiles_file_name);
    hosts_file = fso.BuildPath(base, hosts_file_name);

    // our settings file is located in System32
    var SystemFolder = 1;
    var settings_folder = fso.GetSpecialFolder(SystemFolder);
    settings_file = fso.BuildPath(settings_folder, settings_file_name);


    // load packages and profiles
    packages = loadXml(packages_file);
    profiles = loadXml(profiles_file);
    hosts = loadXml(hosts_file);


    if (force  &&  isArgSet(argv, "/synchronize")) {
        if (debug)  info("Skipping current settings. Checking for actually installed packages.");

        settings = createXml("wpkg");

        fillSettingsWithInstalled(settings, packages);
        saveXml(settings, settings_file);
    } else {
        // load or create settings file
        if (!fso.fileExists(settings_file)) {
            if (debug)  info("Settings file does not exist. Creating a new file.");

            settings = createXml("wpkg");

            saveXml(settings, settings_file);
        } else {
            settings = loadXml(settings_file);
        }
    }


    if (debug) {
        var packs = settings.selectNodes("package");
        info("settings file contains " + packs.length + " packages:");
        var dsds=0;
        for (dsds=0; dsds<packs.length; ++dsds) {
            if (null != packs[dsds]) {
               info(packs[dsds].getAttribute("id"));
            }
        }
        info("");
    }



    if (debug) {
        var packs = packages.selectNodes("package");
        info("packages file contains " + packs.length + " packages:");
        var dsds=0;
        for (dsds=0; dsds<packs.length; ++dsds) {
            if (null != packs[dsds]) {
               info(packs[dsds].getAttribute("id"));
            }
        }
        info("");
    }



    // set the profile from either the command line or the hosts file
    if (argn("profile") != null) {
        profile = argn("profile");
    } else {
        profile = retrieveProfile(hosts, host);

        if (null == profile) {
            throw new Error("Could not find profile for host " + host + ".");
        }
    }

    if (debug)  info("Using profile: " + profile);

    
    // check for existance of the current profile
    if (profiles.selectSingleNode("profile[@id='" + profile + "']") == null) {
        throw new Error("Could not locate the selected profile " + profile +
            ".");
    }
    
    // process command line arguments to determine course of action
    
    if (argn("query") != null) {
        var arg = argn("query").slice(0,1);
        if (arg == "a") {
            queryAllPackages();
        } else if (arg == "i") {
            queryInstalledPackages();
        } else if (arg == "x") {
            queryUninstalledPackages();
        } else if (arg == "u") {
            queryUpgradablePackages();
        }
        exit(0);
    } else if (argn("show") != null) {
        queryPackage(argn("show"));
    } else if (argn("install") != null) {
        installPackageName(argn("install"));
        exit(0);
    } else if (argn("remove") != null) {
        removePackageName(argn("remove"));
        exit(0);
    } else if (argn("upgrade") != null) {
        upgradePackageName(argn("upgrade"));
        exit(0);
    } else if (isArgSet(argv, "/synchronize")) {
        synchronizeProfile();
        exit(0);
    } else {
        throw new Error("No action specified.");
    }
}

/**
 * Displays command usage.
 */
function showUsage() {
    var message = "";
    message += "WPKG 0.9.2 - Windows Packager\n";
    message += "Copyright 2004 Jerry Haltom\n";
    message += "Copyright 2005 Tomasz Chmielewski <tch (at) wpkg . org>\n";
    message += "Copyright 2005 Aleksander Wysocki <papopypu (at) op . pl>\n";
    message += "\n";
    message += "Please report your issues to the list on http://wpkg.org/\n";
    message += "\n";
    message += "\n";
    message += "/profile:<profile>\n";
    message += "    Forces the name of the current profile. If not specified, the profile is\n";
    message += "    looked up using hosts.xml.\n";
    message += "\n";
    message += "/base:<path>\n";
    message += "    Sets the local or remote path to find the settings files.\n";
    message += "\n";
    message += "/query:<option>\n";
    message += "    Displays a list of packages matching the specified criteria. Valid\n";
    message += "    options are:\n";
    message += "\n";
    message += "    a - all packages\n";
    message += "    i - packages that are currently installed on the system\n";
    message += "    x - packages that are not currently installed on the system\n";
    message += "    u - packages that can be upgraded\n";
    message += "\n";
    message += "/show:<package>\n";
    message += "    Displays a summary of the specified package, including it's state.\n";
    message += "\n";
    message += "/install:<package>\n";
    message += "    Installs the specified package on the system.\n";
    message += "\n";
    message += "/remove:<package>\n";
    message += "    Removes the specified package from the system.\n";
    message += "\n";
    message += "/upgrade:<package>\n";
    message += "    Upgrades the already installed package on the system.\n";
    message += "\n";
    message += "/synchronize\n";
    message += "    Synchronizes the current program state with the suggested program state\n";
    message += "    of the specified profile.\n";
    message += "\n";
    message += "/quiet\n";
    message += "    Uses the event log to record all error/status output. Use this when\n";
    message += "    running unattended.\n";
    message += "\n";    
    message += "/nonotify\n";
    message += "   Logged on users are not notified about impending updates.\n";
    message += "\n";
    message += "/noreboot\n";
    message += "   System does not reboot regardless of need.\n";
    message += "\n";
    message += "/force\n";
    message += "    Uses force when performing actions.\n";
    message += "\n";
    message += "/forceinstall\n";
    message += "    Forces installation over existing packages.\n";
    message += "\n";
    message += "/debug\n";
    message += "/verbose\n";
    message += "    Prints some debugging info.\n";
    message += "\n";
    message += "/dryrun\n";
    message += "    Does not execute any action. Assumes /debug on.\n";
    message += "\n";
    message += "/help\n";
    message += "    Shows this message.\n";
    alert(message);
}

/**
 * Scans an argument vector for an argument "arg". Returns true if found, else
 * false
 */
function isArgSet(argv, arg) {
    // loop over argument vector and return true if we hit it
    for (var i = 0; i < argv.length; i++) {
        if (argv(i) == arg) {
            return true;
        }
    }
    // otherwise, return false
    return false;
}

/**
 * Sends a message to the system console notifying of impending action.
 */
function notifyUserStart() {
    if (!was_notified) {
        var msg = "";
        msg += "The automated software installation utility has or is ";
        msg += "currently applying software updates to your system. Please ";
        msg += "check the time shown at the beginning of this message to ";
        msg += "determine if it is out of date. If not, please save all your ";
        msg += "open documents, as the system might require a reboot. If so, ";
        msg += "the system will be rebooted with no warning when installation ";
        msg += "is complete. Thank you.";
        
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
    var msg = "";
    msg += "The automated software installation utility has completing ";
    msg += "installing or updating software on your system. No reboot was ";
    msg += "necessary. All updates are complete.";
    
    try {
        notify(msg);
    } catch (e) {
        error("Unable to notify the user that all action has been completed.");
    }
}


/**
 * Sends a message to the system console notifying the user that installation
 * failed.
 */
function notifyUserFail() {
    var msg = "";
    msg += "The software installation has failed.";

    try {
	notify(msg);
    } catch (e) {
	error("Unable to notify the user that all action has been completed.");
    }
}

/**
 * Synchronizes the current package state to that of the specified profile,
 * adding, removing or upgrading packages.
 */
function synchronizeProfile() {
    // accquire packages that should be present
    var packageArray = getAvailablePackages();

    if (debug) { info("number of available packages: " + packageArray.length); }

    
    // grab currently installed package nodes
    var installedPackages = settings.selectNodes("package");
    
    // loop over each installed package and check weither it still applies
    for (var i = 0; i < installedPackages.length; i++) {
        var installedPackageNode = installedPackages(i);
        if (debug) { info("found installed package: " + installedPackageNode.getAttribute("id")); }
        
        // search for the installed package in available packages
        var found = false;
        for (j in packageArray) {
            if (debug) { info("testing available package: " + packageArray[j].getAttribute("id")); }


            if (packageArray[j].getAttribute("id") ==
                installedPackageNode.getAttribute("id")) {
                if (debug) { info("package: " + installedPackageNode.getAttribute("id") + " found in available packages."); }

                found = true;
                break;
            }
        }
        
        // if package is no longer present, remove it
        if (!found) {
            if (debug) { info("removing package: " + installedPackageNode.getAttribute("id")); }

            notifyUserStart();
            removePackage(installedPackageNode);
        }
    }
    
    // create a native jscript array to do the sorting on
    var sortedPackages = new Array(packageArray.length);
    for (var i = 0; i < packageArray.length; i++) {
        sortedPackages[i] = packageArray[i];
    }
    
    // classic bubble-sort algorithm on the "priority" attribute
    var len = packageArray.length;
    for (var i = 0; i < len - 1; i++) {
        for (var j = 0; j < len - 1 - i; j++) {
            var pri1;
            var pri2;
            var szpri1 = sortedPackages[j].getAttribute("priority");
            var szpri2 = sortedPackages[j + 1].getAttribute("priority");
            
            // if a priority is not set, we assume 0
            
            if (szpri1 == null) {
                pri1 = 0;
            } else {
                pri1 = parseInt(szpri1);
            }
            
            if (szpri2 == null) {
                pri2 = 0;
            } else {
                pri2 = parseInt(szpri2);
            }
            
            // if the priority of the first one in the list exceeds the second,
            // swap the packages
            if (pri1 < pri2) {
                var tmp = sortedPackages[j];
                sortedPackages[j] = sortedPackages[j + 1];
                sortedPackages[j + 1] = tmp;
            }
        }
    }
    
    // sorting complete
    packageArray = sortedPackages;
    
    // loop over each available package and determine weither to install or
    // upgrade
    for (var i = 0; i < packageArray.length; i++) {
        var packageNode = packageArray[i];
        var packageId   = packageNode.getAttribute("id");
        var packageName = packageNode.getAttribute("name");
        var packageRev  = parseInt(packageNode.getAttribute("revision"));

        var executeAttr = packageNode.getAttribute("execute");
        var notifyAttr  = packageNode.getAttribute("notify");    
	
        // search for the package in the local settings
        var installedPackage = settings.selectSingleNode("package[@id='" +
            packageId + "']");
            
        if (executeAttr == "once") {
            if (null == installedPackage) {
                try {
                    if (notifyAttr != "false") {
                        notifyUserStart();
                    }

                    executeOnce(packageNode);
                } catch (e) {
                    throw new Error("Installation error while synchronizing " +
                        "package " + packageName + ", synchronization aborting." +
                        "\n\n" + e.description);
                }
            }
        } else if (executeAttr == "always") {
           // do not look if package is installed
            try {
                if (notifyAttr != "false") {
                    notifyUserStart();
                }
                executeOnce(packageNode);
            } catch (e) {
                throw new Error("Installation error while synchronizing " +
                    "package " + packageName + ", synchronization aborting." +
                    "\n\n" + e.description);
            }
	    
        } else {
            // if the package is not installed, install it
            if (installedPackage == null) {
                try {
                    if (notifyAttr != "false") {
                        notifyUserStart();
                    }
                    installPackage(packageNode);
                } catch (e) {
                    throw new Error("Installation error while synchronizing " +
                        "package " + packageName + ", synchronization aborting." +
                        "\n\n" + e.description);
                }
            } else if (parseInt(installedPackage.getAttribute("revision")) <
                packageRev) {
                try {
                    if (notifyAttr != "false") {
                        notifyUserStart();
                    }
                    upgradePackage(installedPackage, packageNode);
                } catch (e) {
                    throw new Error("Upgrade error while synchronizing " +
                        "package " + packageName + ", synchronization aborting." +
                        "\n\n" + e.description);
                }
            }
        }
    }
    
    // if we had previously warned the user about an impending installation, let
    // them know that all action is complete
    if (was_notified) {
        notifyUserStop();
    }
}

function queryAllPackages() {
    // retrieve packages
    var settingsNodes = settings.selectNodes("package");
    var packagesNodes = packages.selectNodes("package");
    
    // concatinate both lists
    var packageNodes = concatinateList(settingsNodes, packagesNodes);
    var packageNodes = uniqueAttributeNodes(packageNodes, "id");
    
    // create a string to append package descriptions to
    var message = new String();
    
    for (var i = 0; i < packageNodes.length; i++) {
        var packageNode     = packageNodes[i];
        var packageName     = packageNode.getAttribute("name");
        var packageId       = packageNode.getAttribute("id");
        var packageRevision = packageNode.getAttribute("revision");
        var packageReboot   = packageNode.getAttribute("reboot");
        
        if (packageReboot != "true") {
            packageReboot = "false";
        }
        
        message += packageName + "\n";
        message += "    ID:         " + packageId + "\n";
        message += "    Revision:   " + packageRevision + "\n";
        message += "    Reboot:     " + packageReboot + "\n";
        if (searchList(settingsNodes, packageNode)) {
            message += "    Status:     Installed\n";
        } else {
            message += "    Status:     Not Installed\n";
        }
        message += "\n";
    }
    
    info(message);
}

/**
 * Show the user a list of packages that are currently installed.
 */
function queryInstalledPackages() {
    // retrieve currently installed nodes
    var packageNodes = settings.selectNodes("package");
    
    // create a string to append package descriptions to
    var message = new String();
    
    for (var i = 0; i < packageNodes.length; i++) {
        var packageNode     = packageNodes(i);
        var packageName     = packageNode.getAttribute("name");
        var packageId       = packageNode.getAttribute("id");
        var packageRevision = packageNode.getAttribute("revision");
        var packageReboot   = packageNode.getAttribute("reboot");
        
        if (packageReboot != "true") {
            packageReboot = "false";
        }
        
        message += packageName + "\n";
        message += "    ID:         " + packageId + "\n";
        message += "    Revision:   " + packageRevision + "\n";
        message += "    Reboot:     " + packageReboot + "\n";
        message += "    Status:     Installed\n";
        message += "\n";
    }
    
    info(message);
}

/**
 * Shows the user a list of packages that are currently not installed.
 */
function queryUninstalledPackages() {
    // create a string to append package descriptions to
    var message = new String();
    
    // retrieve currently installed nodes
    var packageNodes = packages.selectNodes("package");
    
    // loop over each package
    for (var i = 0; i < packageNodes.length; i++) {
        var packageNode     = packageNodes(i);
        var packageId       = packageNode.getAttribute("id");
        var packageName     = packageNode.getAttribute("name");
        var packageRevision = packageNode.getAttribute("revision");
        var packageReboot   = packageNode.getAttribute("reboot");
        
        if (packageReboot != "true") {
            packageReboot = "false";
        }
        
        // search for the package in the local settings
        var installedPackage = settings.selectSingleNode("package[@id='" +
            packageId + "']");
            
        // if the package is not installed, install it
        if (installedPackage == null) {
            message += packageName + "\n";
            message += "    ID:         " + packageId + "\n";
            message += "    Revision:   " + packageRevision + "\n";
            message += "    Reboot:     " + packageReboot + "\n";
            message += "    Status:     Not Installed\n";
            message += "\n";
        }
    }
    
    info(message);
}

/**
 * Installs a package by name.
 */
function installPackageName(name) {
    // query the package node
    var node = packages.selectSingleNode("package[@id='" + name + "']");
    
    if (node == null) {
        info("Package " + name + " not found!");
        return;
    }

    var executeAttr = node.getAttribute("execute");
    if (executeAttr == "once") {
        executeOnce(node);
    } else {
        installPackage(node);
    }
}

/**
 * Upgrades a package by name.
 */
function upgradePackageName(name) {
    // query the package node
    var nodeNew = packages.selectSingleNode("package[@id='" + name + "']");
    var nodeOld = settings.selectSingleNode("package[@id='" + name + "']");
    
    if (nodeOld == null) {
        info("Package " + name + " not installed!");
        return;
    }
    
    if (nodeNew == null) {
        info("New package " + name + " not found!");
        return;
    }

    var executeAttr = nodeNew.getAttribute("execute");
    if (executeAttr != "once") {
        upgradePackage(nodeOld, nodeNew);
    }
}

/**
 * Removes a package by name.
 */
function removePackageName(name) {
    // query the package node
    var node = settings.selectSingleNode("package[@id='" + name + "']");
    
    if (node == null) {
        info("Package " + name + " not currently installed.");
        return;
    }
    
    removePackage(node);
}


/**
 * Builds settings document tree containing actually installed packages.
 * Tests all packages from given doc tree for "check" conditions.
 * If given conitions are positive, package is considered as installed.
 */
function fillSettingsWithInstalled(settingsDoc, packagesDoc) {

    var packagesNodes = packagesDoc.selectNodes("package");

    for (var i = 0; i < packagesNodes.length; i++) {
        var packNode = packagesNodes[i];

        if (checkInstalled(packNode)) {
            var clone = packNode.cloneNode(true);

            settingsDoc.appendChild(clone);
        }
    }
}



/**
 * Returns value of given key in registry.
 */
function getRegistryValue(keyName) {
    var WshShell = new ActiveXObject("WScript.Shell");
    var val;
    try {
        val = WshShell.RegRead(keyName);
    } catch (e) {
        val = null;
    }

    return val;
}


/**
 * Scans uninstall list for given name.
 * Uninstall list is placed in registry under 
 *    HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Uninstall
 * Every subkey represents package that can be uninstalled.
 * Function checks each subkey for containing value named DisplayName.
 * If this value exists, function returns true if nameSearched matches it.
 */

function scanUninstallKeys(nameSearched) {
    var HKLM = 0x80000002;
    var dName;
    try
    {
        oLoc = new ActiveXObject("WbemScripting.SWbemLocator");
        oSvc = oLoc.ConnectServer(null, "root\\default");
        oReg = oSvc.Get("StdRegProv");
        //-------------------------------------------------------------

        oMethod = oReg.Methods_.Item("EnumKey");
        oInParam = oMethod.InParameters.SpawnInstance_();
        oInParam.hDefKey = HKLM;
        oInParam.sSubKeyName = sRegPath;
        oOutParam = oReg.ExecMethod_(oMethod.Name, oInParam);

        aNames = oOutParam.sNames.toArray();

        for (i = 0; i < aNames.length; i++) {
            dName = getRegistryValue("HKLM\\" + sRegPath + "\\" + aNames[i] + "\\DisplayName");

            if (null != dName) {
                if (dName == nameSearched) {
                    return true;
                }
            }
        }
    }
    catch(err)
    {
        WScript.Echo("Error occurred when searching registry for " +
                                nameSearched +
                                "\nCode: " + 
                                hex(err.number) + 
                                "; Descriptions: " + 
                                err.description);
    }

    return false;
}


//User-defined function to format error codes.
//VBScript has a Hex() function but JScript does not.
function hex(nmb)
{
    if (nmb > 0)
        return nmb.toString(16);
    else
        return (nmb + 0x100000000).toString(16);
}



/**
 * Checks for the success of a check condition for a package.
 */
function checkCondition(checkType, checkCond, checkPath) {

    if (checkType == "registry") {
        if (checkCond == "exists") {
            var WshShell = new ActiveXObject("WScript.Shell");
            var val;
            try {
                val = WshShell.RegRead(checkPath);
            } catch (e) {
                val = null;
            }

            if (val != null) {
                return true;
            }
        } else {
            throw new Error("Check condition " + checkCond + " unknown " +
                "for type registry.");
        }
    } else if (checkType == "file") {
        if (checkCond == "exists") {
            var fso = new ActiveXObject("Scripting.FileSystemObject");
            if (fso.FileExists(checkPath)) {
                return true;
            }
        } else {
            throw new Error("Check condition " + checkCond + " unknown for " +
                "type file.");
        }

    } else if (checkType == "uninstall") {
        if (checkCond == "exists") {
            if (scanUninstallKeys(checkPath)) {
                return true;
            }
        } else {
            throw new Error("Check condition " + checkCond + " unknown for " +
                "type uninstall.");
        }

    } else {
        throw new Error("Check condition type " + checkType + " unknown.");
    }
    
    return false;
}

/**
 *  Check if package is installed.
 */
function checkInstalled(packageNode) {


    var packageName = packageNode.getAttribute("name");

    if (debug)  { info ("checking existence of package:" + packageName); }
    
    // get a list of checks to perform before installation.
    var checkNodes = packageNode.selectNodes("check");
    var installed = true;

    
    // when there are no check conditions, say "not installed"
    if (checkNodes.length == 0) {
        return false;
    }

    // loop over every condition check
    // if all are successful, we consider package as installed
    for (var i = 0; i < checkNodes.length; i++) {
        var checkNode = checkNodes(i);
        var checkType = checkNode.getAttribute("type");
        var checkCond = checkNode.getAttribute("condition");
        var checkPath = checkNode.getAttribute("path");
        
        if (checkType == null ||
            checkCond == null ||
            checkPath == null) {
            throw new Error("Invalid check condition on package " +
                packageName + ", aborting.");
        } else if (! checkCondition(checkType, checkCond, checkPath)) {
            info("Checking presence of " + packageName +
                "; " + checkType + " check condition failed !");

            installed = false;
            //break;
        } else {
            info("Checking presence of " + packageName +
                "; " + checkType + " check condition met.");
        }
    }

    return installed;
}

/**
 * Executes command of the package and registers this fact.
 */
function executeOnce(packageNode) {
    var packageName = packageNode.getAttribute("name");
    
    info("Executing commands for " + packageName + "...");
        
    // select command lines to install
    var cmds = packageNode.selectNodes("install");
        
    // execute each command line
    for (var i = 0; i < cmds.length; i++) {
        var cmdNode = cmds(i);
        var cmd = cmdNode.getAttribute("cmd");
        var timeout = cmdNode.getAttribute("timeout");
            
        if (timeout == null) {
            timeout = 0;
        } else {
            timeout = parseInt(timeout);
        }
            
        try {

            if (debug) { info("executing command : " + cmd); }
            var result = 0;
            result = exec(cmd, timeout);
            if (debug) { info("command returned result: " + result); }

            // if exit code is 0, return successfully
            if (result == 0) {
                continue;
            }

            // search for exit code
            var exitNode = cmdNode.selectSingleNode("exit[@code='" +
                result + "']");

            // check for special exit codes
            if (exitNode != null) {
                if (exitNode.getAttribute("reboot") == "true") {
                    // this exit code forces a reboot
                    info("Command of " + packageName +
                        " returned non-zero exit code [" + result + "]. This " +
                        "exit code requires an immediate reboot.");
                    reboot();
                } else {
                    // this exit code is successful
                    info("Command of " + packageName +
                        " returned non-zero exit code [" + result + "]. This " +
                        "exit code is not an error.");
                    continue;
                }
            }

            // command did not succeed, throw error
            throw new Error(0, "Exit code returned non-successful value: " +
                result + ".\n\n" + cmd);
        } catch (e) {
            throw new Error("Could not execute " + packageName + ". " +
                e.description);       
        }
    }
    
    // append new node to local xml
    settings.appendChild(packageNode);
    saveXml(settings, settings_file);
    
    // reboot the system if this package is suppose to
    if (packageNode.getAttribute("reboot") == "true") {
        info("Execution of commands of " + packageName + " successful, system " +
            "rebooting.");
        reboot();
    } else {
        info("Execution of " + packageName + " successful.");
    }
}


/**
 * Installs the specified package node to the system.
 */
function installPackage(packageNode) {
    var packageName = packageNode.getAttribute("name");
    
    // get a list of checks to perform before installation.
    var checkNodes = packageNode.selectNodes("check");
    var bypass = false;


    // when "/forceinstall" say "not installed"
    if (!forceInstall) {
        bypass = checkInstalled(packageNode);
        if (bypass) {
                info("Bypassing installation of package " + packageName);
        }
    }


    
    if (!bypass) {
        info("Installing " + packageName + "...");
        
        // select command lines to install
        var cmds = packageNode.selectNodes("install");
        
        // execute each command line
        for (var i = 0; i < cmds.length; i++) {
            var cmdNode = cmds(i);
            var cmd = cmdNode.getAttribute("cmd");
            var timeout = cmdNode.getAttribute("timeout");
            
            if (timeout == null) {
                timeout = 0;
            } else {
                timeout = parseInt(timeout);
            }
            
            try {


                if (debug) { info("executing command : " + cmd); }

                var result = 0;
                result = exec(cmd, timeout);
                if (debug) { info("command returned result: " + result); }

                // if exit code is 0, return successfully
                if (result == 0) {
                    continue;
                }

                // search for exit code
                var exitNode = cmdNode.selectSingleNode("exit[@code='" +
                    result + "']");

                // check for special exit codes
                if (exitNode != null) {
                    if (exitNode.getAttribute("reboot") == "true") {
                        // this exit code forces a reboot
                        info("Command in installation of " + packageName +
                            " returned non-zero exit code [" + result + "]. This " +
                            "exit code requires an immediate reboot.");
                        reboot();
                    } else {
                        // this exit code is successful
                        info("Command in installation of " + packageName +
                            " returned non-zero exit code [" + result + "]. This " +
                            "exit code is not an error.");
                        continue;
                    }
                }

                // command did not succeed, throw error
                throw new Error(0, "Exit code returned non-successful value: " +
                    result + ".\n\n" + cmd);
            } catch (e) {
                throw new Error("Could not install " + packageName + ". " +
                    e.description);
            }
        }

        if (!checkInstalled(packageNode)) {
            throw new Error("Could not install " + packageName + ". " +
                            "Failed checking after installation.");
        }
    }
    
    // append new node to local xml
    settings.appendChild(packageNode);
    saveXml(settings, settings_file);
    
    // reboot the system if this package is suppose to
    if (packageNode.getAttribute("reboot") == "true") {
        info("Installation of " + packageName + " successful, system " +
            "rebooting.");
        reboot();
    } else {
        info("Installation of " + packageName + " successful.");
    }
}

/**
 * Upgrades the old package node to the new package node.
 */
function upgradePackage(oldPackageNode, newPackageNode) {
    info("Upgrading " + newPackageNode.getAttribute("name") + "...");
    var packageName = newPackageNode.getAttribute("name");
    
    // select command lines to install
    var cmds = newPackageNode.selectNodes("upgrade");
    
    // execute each command line
    for (var i = 0; i < cmds.length; i++) {
        var cmdNode = cmds(i);
        var cmd = cmdNode.getAttribute("cmd");
        var timeout = cmdNode.getAttribute("timeout");
        
        if (timeout == null) {
            timeout = 0;
        } else {
            timeout = parseInt(timeout);
        }
        
        try {
            if (debug) { info("executing command : " + cmd); }
            var result = 0;
            result = exec(cmd, timeout);
            if (debug) { info("command returned result: " + result); }


            // if exit code is 0, return successfully
            if (result == 0) {
                continue;
            }
            
            // search for exit code
            var exitNode = cmdNode.selectSingleNode("exit[@code='" + result +
                "']");
                
            // if found, command was successful
            if (exitNode != null) {
                info("Command in upgrade of " + packageName + " returned " +
                    "non-zero exit code [" + result + "]. This exit code " +
                    "is not an error.");
                continue;
            }

            // check for special exit codes
            if (exitNode != null) {
                if (exitNode.getAttribute("reboot") = "true") {
                    // this exit code forces a reboot
                    info("Command in upgrade of " + packageName + " returned " +
                        "non-zero exit code [" + result + "]. This exit code " +
                        "requires an immediate reboot.");
                    reboot();
                } else {
                    // this exit code is successful
                    info("Command in upgrade of " + packageName + " returned " +
                        "non-zero exit code [" + result + "]. This exit code " +
                        "is not an error.");
                    continue;
                }
            }
            
            // command did not succeed, throw error
            throw new Error(0, "Exit code returned non-successful value: " +
                result + ".\n\n" + cmd);
        } catch (e) {
            throw new Error("Could not upgrade " + packageName + ". " +
                e.description);
        }
    }


    if (!checkInstalled(newPackageNode)) {

        if (!checkInstalled(oldPackageNode)) {
            //remove old node
            settings.removeChild(oldPackageNode);
            saveXml(settings, settings_file);
        }

        throw new Error("Could not upgrade " + packageName + ". " +
                        "Failed checking after installation.");

    } else {
        // replace local node with new node
        settings.removeChild(oldPackageNode);
        settings.appendChild(newPackageNode);
        saveXml(settings, settings_file);
    }


    info("Upgrade of " + newPackageNode.getAttribute("name") + " successful.");
    
    // reboot the system if this package is suppose to
    if (newPackageNode.getAttribute("reboot") == "true") {
        reboot();
    }
}

/**
 * Removes the specified package node from the system.
 */
function removePackage(packageNode) {
    var  failure = false;

    var packageName = packageNode.getAttribute("name");
    info("Removing " + packageName + "...");
    
    // select command lines to remove
    var cmds = packageNode.selectNodes("remove");
    
    // execute each command line
    for (i = 0; i < cmds.length; i++) {
        var cmdNode = cmds(i);
        var cmd = cmdNode.getAttribute("cmd");
        var timeout = cmdNode.getAttribute("timeout");
        
        if (timeout == null) {
            timeout = 0;
        } else {
            timeout = parseInt(timeout);
        }
        
        try {
            if (debug) { info("executing command : " + cmd); }

            var result = exec(cmd, timeout);
            if (debug) { info("command returned result: " + result); }
            
            // if exit code is 0, return successfully
            if (result == 0) {
                continue;
            }
            
            // search for exit code
            var exitNode = cmdNode.selectSingleNode("exit[@code='" + result +
                "']");
                
            // if found, command was successful
            if (exitNode != null) {
                info("Command in removal of " + packageName + " returned " +
                    "non-zero exit code [" + result + "]. This exit code " +
                    "is not an error.");
                continue;
            }

            // check for special exit codes
            if (exitNode != null) {
                if (exitNode.getAttribute("reboot") = "true") {
                    // this exit code forces a reboot
                    info("Command in removal of " + packageName + " returned " +
                        "non-zero exit code [" + result + "]. This exit code " +
                        "is not an error.");
                    reboot();
                } else {
                    // this exit code is successful
                    info("Command in removal of " + packageName + " returned " +
                        "non-zero exit code [" + result + "]. This exit code " +
                        "requires an immediate reboot.");
                    continue;
                }
            }
            
            // command did not succeed, throw error
            throw new Error(0, "Exit code returned non-successful value: " +
                result + ".\n\n" + cmd);
        } catch (e) {
            failure = true;
            break;

//            throw new Error("Could not remove " + packageName + ". " +
//                e.description);
        }
    }
    

    if (!checkInstalled(packageNode)) {
        // remove package node from local xml
        settings.removeChild(packageNode);
        saveXml(settings, settings_file);
    } else {
        failure = true;

//        throw new Error("Could not remove " + packageName + ". " +
//                        "Check after removing failed.");
    }
        
    
    // log a nice informational message
    if (!failure) {
        info("Removal of " + packageNode.getAttribute("name") + " successful.");
    } else {
        info("Errors occurred while removing " + packageName + ". ");
        return;
    }
    
    // reboot the system if this package is suppose to
    if (packageNode.getAttribute("reboot") == "true") {
        reboot();
    }
}

/**
 * Returns an array of package nodes that should be applied to the current
 * profile.
 */
function getAvailablePackages() {
    // get array of all profiles that apply to the base profile
    var profileArray = getAvailableProfiles();


    // create new empty package array
    var packageArray = new Array();
    
    // add each profile's packages to the array
    for (var i in profileArray) {
        profileNode = profileArray[i];

        // search for package tags in each profile
        var packageNodes = profileNode.selectNodes("package");

        // append all the resulting profile's identified by profile-id
        for (var j = 0; j < packageNodes.length; j++) {
            var packageId = packageNodes(j).getAttribute("package-id");

            // grab the package node
            var packageNode = packages.selectSingleNode("package[@id='" +
                packageId + "']");

            // search array for pre-existing package, we don't want duplicates
            if (searchArray(packageArray, packageNode)) {
                continue;
            }
            
            // sometimes nodes can be null
            if (packageNode != null) {
                // add the new node to the array
                packageArray.push(packageNode);
            }
        }
    }
    
    return packageArray;
}

/**
 * Returns an array of profile nodes that should be applied to the current
 * profile.
 */
function getAvailableProfiles() {
    // create array to hold available package nodes
    var profileArray = new Array();
    
    // acquire the node of the current profile
    var profileNode = profiles.selectSingleNode("profile[@id='" + profile +
        "']");

    if (debug) { info("profile: " + profile + " profileNode: " + profileNode); }
        
    // add the current profile's node as the first element in the array
    profileArray.push(profileNode);
    
    // append dependencies of the current profile to the list (recursive)
    appendProfileDependencies(profileArray, profileNode);
    
    return profileArray;
}

/**
 * Appends dependent profile nodes of the specified profile to the specifed
 * array. Recurses into self to get an entire dependency tree.
 */
function appendProfileDependencies(profileArray, profileNode) {
    var dependencyNodes = profileNode.selectNodes("depends");
    for (var i = 0; i < dependencyNodes.length; i++) {
        var dependentId = dependencyNodes(i).getAttribute("profile-id");
        
        // select profile that matches the "profile-id" attribute
        var dependentNode = profiles.selectSingleNode("profile[@id='" +
            dependentId + "']");
            
        // if the profile doesn't exist, we have a bad dependency
        if (dependentNode == null) {
            throw new Error(0, "Invalid dependency \"" + dependentId +
                "\" from profile \"" + profileNode.getAttribute("id") + "\".");
        }
        
        // search array for pre-existing profile, we don't want duplicates
        if (searchArray(profileArray, dependentNode)) {
            continue;
        }
        
        // add the new node to the array, and add it's dependencies also
        // (recurse)
        profileArray.push(dependentNode);
        appendProfileDependencies(profileArray, dependentNode);
    }
}

/**
 * Scans the specified array for the specified element and returns true if
 * found.
 */
function searchArray(array, element) {
    for (var i in array) {
        var e = array[i];
        if (element == e) {
            return true;
        }
    }
    
    return false;
}

/**
 * Scans the specified list for the specified element and returns true if
 * found.
 */
function searchList(list, element) {
    for (var i = 0; i < list.length; i++) {
        var e = list(i);
        if (element == e) {
            return true;
        }
    }
    
    return false;
}

/**
 * Returns a new array of nodes unique by the specified attribute.
 */
function uniqueAttributeNodes(nodes, attribute) {
    // hold unique nodes in a new array
    var newNodes = new Array();
    
    // loop over nodes
    for (var i = 0; i < nodes.length; i++) {
        var node = nodes[i];
        var val = node.getAttribute(attribute);
        
        // determine if node with attribute already exists
        var found = false;
        for (var j = 0; j < newNodes.length; j++) {
            var newVal = newNodes[j].getAttribute(attribute);
            if (val == newVal) {
                found = true;
                break;
            }
        }
        
        // if it doesn't exist, add it
        if (!found) {
            newNodes.push(node);
        }
    }
    
    return newNodes;
}

/**
 * Combines one list and another list into a single array.
 */
function concatinateList(list1, list2) {
    // create a new array the size of the sum of both original lists
    var list = new Array();
    
    for (var i = 0; i < list1.length; i++) {
        list.push(list1(i));
    }
    
    for (var i = 0; i < list2.length; i++) {
        list.push(list2(i));
    }
    
    return list;
}

/**
 * Remove duplicate items from an array.
 */
function uniqueArray(array) {
    // hold unique elements in a new array
    var newArray = new Array();
    
    // loop over elements
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
 * Retrieves profile from given "hosts" XML document.
 * Searches for node having attribute "name" matching
 * given hostName. Returns it's attribute "profile-id".
 *
 * Check is performed using regular expression object:
 * "name" attribute value as the pattern and 
 * hostName as matched string.
 * First matching profile is returned.
 */

function retrieveProfile(hosts, hostName) {

    if (null == hostName) {
        //error! lack of attribute "profile-id"
        throw new Error("Error! Lack of host name: " + hostName + ".");
    }


    var hostNodes = hosts.selectNodes("host");
    var i;
    var node;

    var attrName;
    var attrProfile;

    for (i=0; i<hostNodes.length; ++i) {
        node = hostNodes[i];
        if (null != node) {
            attrName = node.getAttribute("name");
            if (null != attrName) {
                if (hostName.toUpperCase() == attrName.toUpperCase()) {

                    attrProfile = node.getAttribute("profile-id");

                    if (null == attrProfile) {
                        //error! lack of attribute "profile-id"
                        throw new Error("Error! Lack of attribute \"profile-id\" for host description " + 
                            attrName + ".");
                    }

                    return attrProfile;
                }
            } else {
                //error! lack of attribute "name"
            }
        }
    }



    for (i=0; i<hostNodes.length; ++i) {
        node = hostNodes[i];

        if (null != node) {
            attrName = node.getAttribute("name");

            if (null != attrName) {
                var reg = new RegExp(attrName, "i");

                if (reg.test(hostName)) {
                    attrProfile = node.getAttribute("profile-id");

                    if (null == attrProfile) {
                        //error! lack of attribute "profile-id"
                        throw new Error("Error! Lack of attribute \"profile-id\" for host description " + 
                            attrName + ".");
                    }

                    return attrProfile;
                }
            } else {
                //error! lack of attribute "name"
            }
        }
    }

    throw new Error("Could not find profile for host " + hostName + ".");
}


/**
 * Loads an XML file and returns the root element.
 */
function loadXml(path) {
//    var xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
    var xmlDoc = new ActiveXObject("Msxml2.DOMDocument.3.0");

    xmlDoc.async = false;
    xmlDoc.resolveExternals= false;
    xmlDoc.validateOnParse = false;

    if (xmlDoc.load(path)) {
        return xmlDoc.documentElement;
    } else {
        // Obtain the ParseError object
        var  xPE = xmlDoc.parseError;

        error("Error while parsing XML document:  " + path);
        //error("url       " + xPE.url);
        error("Reason    " + xPE.reason);
        error("Line      " + xPE.line);
        error("Linepos   " + xPE.linepos);
        error("Filepos   " + xPE.filepos);
        error("srcText   " + xPE.srcText);

        throw new Error(0, "Unable to load specified XML document from " +
            path);
    }
}


/**
 * Saves the root element to the specified XML file.
 */
function saveXml(root, path) {

    if (dryrun) {
        path += ".dryrun";
    }

    if (debug) { info("saving XML : " + path); }

    var xmlDoc = new ActiveXObject("Msxml2.DOMDocument.3.0");
    xmlDoc.appendChild(root);
    if (xmlDoc.save(path)) {
        throw new Error(0, "Could not save XML document to " + path);
    }
}

/**
 * Creates a new root element of the specified name.
 */
function createXml(root) {
    var xmlDoc = new ActiveXObject("Msxml2.DOMDocument.3.0");

//    xmlDoc.createNode(1, root, "");
//    return xmlDoc;

    return xmlDoc.createNode(1, root, "");
}

/*******************************************************************************
 *
 * Miscellaneous functions
 *
 ******************************************************************************/

/**
 * Echos text to the command line or a prompt depending on how the program is
 * run.
 */
function alert(msg) {
    WScript.Echo(msg);
}

/**
 * Logs the specified event type and description in the Windows event log.
 */
function log(type, description) {
    WshShell = WScript.CreateObject("WScript.Shell");
    WshShell.logEvent(type, description);
}

/**
 * Logs or presents an error message depending on interactivity.
 */
function error(message) {
    if (quiet) {
        log(1, message);
    } else {
        alert(message);
    }
}

/**
 * Logs or presents an info message depending on interactivity.
 */
function info(message) {
    if (quiet) {
        log(4, message);
    } else {
        alert(message);
    }
}

/**
 * Executes a shell command and blocks until it is completed, returns the
 * program's exit code. Command times out and is terminated after the
 * specified number of seconds.
 */
function exec(cmd, timeout) {

    if (dryrun) {
        return 0;
    }

    try {
        var shell = new ActiveXObject("WScript.Shell");
        
        // timeout after an hour by default
        if (timeout == 0) {
            timeout = 3600;
        }
        
        var shellExec = shell.exec(cmd);
        
        var count = 0;
        while (shellExec.status == 0) {
            WScript.sleep(1000);
            count++;
            
            if (count >= timeout) {
                return -1;
            }
        }
        
        WScript.sleep(1000);
        
        return shellExec.exitCode;
    } catch (e) {
        throw new Error(0, "Command \"" + cmd
            + "\" was not successful. " + e.description);
    }
}

/**
 * Notifies the user/computer with a pop up message.
 */
function notify(message) {
    if (!nonotify) {
	var cmd = "";
        cmd += "%SystemRoot%\\System32\\NET.EXE SEND ";
        cmd += host;
        cmd += " \"" + message + "\"";
        try {
    	    exec(cmd, 0);
        } catch (e) {
    	    throw new Error(0, "Notification failed. " + e.description);
        }
    } else {
	info("User notification suppressed.");
    }
}

/**
 * Notifies the user/computer with a pop up message.

function notify(message) {
    var cmd = "";
    cmd += "%SystemRoot%\\System32\\NET.EXE SEND ";
    cmd += host;
    cmd += " \"" + message + "\"";
    try {
        exec(cmd, 0);
    } catch (e) {
        throw new Error(0, "Notification failed. " + e.description);
    }
}
 */
/**
 * Reboots the system.
  */
function reboot() {
    if (!noreboot ) {
	var wmi = GetObject("winmgmts:{(Shutdown)}//./root/cimv2");
	var win = wmi.ExecQuery("select * from Win32_OperatingSystem where Primary=true");
	var e = new Enumerator(win);

	info("System reboot in progress!");

	for (; !e.atEnd(); e.moveNext()) {
	    var x = e.item();
	    x.win32Shutdown(6);
	}
/**    } else if (pretend) {
	info("REBOOT");
*/
    } else {
	info("System reboot was initiated but overridden.");
    }

    exit(0);
}

/**
 * Ends program execution with the specified exit code.
 */
function exit(exitCode) {
    WScript.Quit(exitCode);
}
/**
 * Show the user a list of packages that can be updated.
 */
function queryUpgradablePackages() {
    // retrieve currently installed and installable nodes
    var installedNodes = settings.selectNodes("package");
    var availableNodes = packages.selectNodes("package");

    // create a string to append package descriptions to
    var message = new String();

    for (var i = 0; i < installedNodes.length; i++) {
        var installedNode       = installedNodes(i);
        var instPackageId       = installedNode.getAttribute("id");
        var instPackageRevision = installedNode.getAttribute("revision");
        for (var j = 0; j < availableNodes.length; j++) {
            var availableNode        = availableNodes(j);
            var availPackageId       = availableNode.getAttribute("id");
            var availPackageRevision = availableNode.getAttribute("revision");
            if (instPackageId == availPackageId) {
                if (instPackageRevision < availPackageRevision) {
                    message += availableNode.getAttribute("name") + "\n";
                    message += "    ID:           " + instPackageId + "\n";
                    message += "    Old Revision: " + instPackageRevision + "\n";
                    message += "    New Revision: " + availableNode.getAttribute("revision") + "\n";
                    message += "    Status:       updateable\n";
                    message += "\n";
                }
            }
        }
    }
    info(message);
}

/**
 * Show the user information about a specific package.
 */
function queryPackage(pack) {
    // retrieve packages
    var settingsNodes = settings.selectNodes("package");
    var packagesNodes = packages.selectNodes("package");

    // concatinate both lists
    var packageNodes = concatinateList(settingsNodes, packagesNodes);
    var packageNodes = uniqueAttributeNodes(packageNodes, "id");

    // create a string to append package descriptions to
    var message = new String();

    for (var i = 0; i < packageNodes.length; i++) {
        var packageNode     = packageNodes[i];
        var packageReboot   = packageNode.getAttribute("reboot");
        var packageName     = packageNode.getAttribute("name");
        var packageId       = packageNode.getAttribute("id");
        if (packageReboot != "true") {
            packageReboot = "false";
        }
        if (packageName == pack || packageId == pack) {
            message += packageName + "\n";
            message += "    ID:         " + packageId + "\n";
            message += "    Revision:   " + packageNode.getAttribute("revision") + "\n";
            message += "    Reboot:     " + packageReboot + "\n";
            if (searchList(settingsNodes, packageNode)) {
                message += "    Status:     Installed\n";
            } else {
                message += "    Status:     Not Installed\n";
            }
            message += "\n";
        }
    }
    info(message);
}

