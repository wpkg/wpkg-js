GENERAL
=======
Author : Rainer Meier <skybeam (at) users.sourceforge.net>
Version: 1.0
License: GPLv2

 
DESCRIPTION
===========
This script allows execution of another script (given by parameter) in
elevated privileges mode on Windows Vista with UAC activated.

This is required as there seems to be no possibility to run a batch/cmd
script on Windows Vista with elevated rights. Even if you right-click a
cmd script and select to run it as Administrator it does not get elevated
rights.


USAGE
=====
This script here just allows you to call any script (batch, cscript ...)
with elevated rights.

NOTE: To run WPKG in elevated mode you can either write a batch file which
is calling 'cscript \\path\to\wpkg.js ...' or run cscript directly by this
script.
Running batch file:
<script> \\path\to\<batch-name.cmd> [optional arguments]
Running cscript:
<script> cscript \\path\to\wpkg.js <argument1> [argument2 [argument3 [...]]]

NOTE: Running cscript directly does not allow you to set custom environment
variables like the common SOFTWARE variable! Running this script here from a
batch script which is setting the variables will not work as the environment
of the child process which is run in elevated mode is reset to the windows
defaults.
So the following execution chain won't work (wpkg.js will not see the
exported SOFTWARE variable):
<set SOFTWARE variable> => execute-elevated.js => (elevated) wpkg.js
Only the following will work:
execute-elevated.js => (elevated) <batch to set SOFTWARE> => wpkg.js
This also works with the exisiting wrapper:
execute-elevated.js => (elevated) <batch to set SOFTWARE> => wrapper.js

Here is some sample code you can use for your own batch file. I use this one
to install all software which belongs to a specific profile to the current
machine. No matter what its name is - I always use the same profile. This is
useful for example if you need to upgrade your default bunch of software on
a customer machine.

@echo off
echo Running WPKG
set WPKG_PATH=\\software\RemInst\wpkg\wrapper.js
set SOFTWARE=\\software\RemInst\software
set SETTINGS=\\software\RemInst\settings
set PROFILE=autosetup
 *
start /wait "wpkg" cscript "%WPKG_PATH%" /synchronize /profile:%PROFILE%


ADDITIONAL NOTES
================
Please note that using this script here is not required when launching
WPKG from WPKG client (as a system service) as the system service does
not require to elevate its privileges. This script is only required if you
want to MANUALLY invoke wpkg.js/wrapper.js on a Windows Vista system with
UAC enabled.

Also note that the paths to the scripts specified should be UNC paths as
elevated programs cannot access network drives which are eventually
available when launching this script. So don't use something like
Z:\wpkg\wpkg.js but use \\server\share\wpkg\wpkg.js instead.
