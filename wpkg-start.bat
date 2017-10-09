:: This is a recommended way of starting WPKG.

:: Use WPKGROOT variable to define where wpkg.js script is.

:: Use PACKAGES variable to define where all your software/installers are.
:: You can later use the PACKAGES variable (and all other variables) in your xml files.

set WPKGROOT=\\server\wpkg
set SOFTWARE=%WPKGROOT%\software
%WPKGROOT%\wpkg.js /synchronize /quiet /nonotify
