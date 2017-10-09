This is a folder for other tools that WPKG use.


One tool that WPKG can use is psshutdown.exe from Sysinternals.

When "/rebootcmd:special" is used, WPKG looks if it can
find tools\psshutdown.exe (from Sysinternals) and uses a special loop for
notifying users.


You could also put some other 3rd party tools here.

For example, if you put wget (a tool for downloading files) here, WPKG could
first download packages off the web, and then, install them:

<install cmd='\\path\to\tools\wget -O %TEMP%\file.exe "http://some.server/file.exe"' />

or even better:

<install cmd='%WPKG_TOOLS%\wget -O %TEMP%\file.exe "http://some.server/file.exe"' />

where WPKG_TOOLS is defined by WPKG client before wpkg.js invocation and holds
the path to the tools folder within the value
(e.g. "\\server\share\wpkg\tools").

Then add a command which is using the file downloaded:

<install cmd='%TEMP%\file.exe /silent' />

Please note that WPKG currently already supports a download feature itself.
