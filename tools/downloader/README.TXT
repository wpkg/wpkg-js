Description
===========

This script can be used to perform downloads in normal WPKG package 
commands. Initially it has been requested to perform integrity checks on 
downloaded files like MD5 and/or SHA1 checksum verification. Unfortunately 
with WSH internal functions there seems to be no way to do MD5 or SHA1 
calculation. Implementing the algorithm in WSH will likely perform very 
badly and code would have to be maintained.

Moreover even the download handling possibilities in WSH are very limited. 
Especially in comparison to dedicated tools like wget.

So instead of extending the download capabilities of WPKG it looks like it 
would be much better to just let WPKG call external tools to perform 
download tasks. This is where this script enters the field.

WPKG can call this script during execution like any other install/upgrade/ 
downgrade or remove command. Therefore it allows to download any file with 
external tools.

The downloader script will use dedicated tools like wget and md5sum to 
verify the downloads and terminate with non-zero exit codes in case 
something went wrong.



Preparation
===========

To use this script you need to place the required tools into the 
%TOOLS_PATH% folder. By default this is the same folder in which you placed
downloader.cmd. You can adapt the path by changing it directly within the
script as needed.

Tools you need
--------------

wget.exe: Wget is used to download the files. The easiest way is to get a
pre-compiled native binary as provided here:
<http://users.ugent.be/~bpuype/wget/>
You can get also official pre-compiled binaries from the gnuwin page:
<http://gnuwin32.sourceforge.net/packages/wget.htm>
But for these you will have to add a couple of dependencies as well.

md5sum.exe: This tool is used to verify MD5 checksums. Download it here:
<http://etree.org/md5com.html>

sha1sum.exe: This tool is used to verify SHA1 checksums. I've found a binary
on the gcrypt project FTP:
<ftp://ftp.gnupg.org/gcrypt/binary/>
<ftp://ftp.gnupg.org/gcrypt/binary/sha1sum.exe>

robocopy.exe: This tool is used if your download URL is a valid UNC path (either
a file or a directory). This tool is preinstalled on Windows 7 but needs to be
either deployed to older clients. Download a copy included in the Windows
Server 2003 Resource Kit Tools:
<http://www.microsoft.com/download/en/details.aspx?displaylang=en&id=17657>
The downloader tool will automatically use robocopy.exe if placed in the
%TOOLS_PATH% folder. If no robocopy.exe is found in %TOOLS_PATH% it will try
to run robocopy.exe from the PATH (local installation on client).


Examples
========

In order to use the downloader within your WPKG packages just launch it as a
command.

<package id='firefox' name='Mozilla Firefox' revision='1' reboot='false' >
  <check type='uninstall' condition='exists' path='Mozilla Firefox 6\..*' />
  <install 
  cmd='"%SOFTWARE%\downloader\downloader.cmd" 
  "http://download.mozilla.org/?product=firefox-6.0.2&amp;os=win&amp;lang=en-US"
  "%TEMP%\firefox\firefox-setup.exe" 
  "ba36842c5c50515b0e114b61f5b72f4d" 
  "5d631a8766ada20fc15e014942ffc2861a1f1165" >NUL'
  />
  <install cmd='"%TEMP%\firefox\firefox-setup.exe" -ms -ira' />
  <install cmd='"%COMSPEC%" /c rd /Q /S "%TEMP%\firefox"' />

  <upgrade 
  cmd='"%SOFTWARE%\downloader\downloader.cmd" 
  "http://download.mozilla.org/?product=firefox-6.0.2&amp;os=win&amp;lang=en-US"
  "%TEMP%\firefox\firefox-setup.exe" 
  "ba36842c5c50515b0e114b61f5b72f4d" 
  "5d631a8766ada20fc15e014942ffc2861a1f1165" >NUL'
  />
  <upgrade cmd='"%TEMP%\firefox\firefox-setup.exe" -ms -ira' />
  <upgrade cmd='"%COMSPEC%" /c rd /Q /S "%TEMP%\firefox"' />

  <remove architecture='x86' 
    cmd='"%ProgramFiles%\Mozilla Firefox\uninstall\helper.exe" /S' />
  <remove architecture='x64'
    cmd='"%ProgramFiles(x86)%\Mozilla Firefox\uninstall\helper.exe" /S' />
</package>

This package will use downloader to fetch the file via HTTP. Remember that the
URL needs to be properly encoded as valid XML (note "&amp;").

Downloader will then verify the download using both, MD5 and SHA1 checksum and
terminate with non-zero exit code if verification fails. Since there is no
<exit /> node defined WPKG will terminate the installation/upgrade if downloader
exits with non-zero exit code.
The downloader script will also remove the file downloaded if checksum
verification fails. So following commands will not succeed even if exit codes
would be added.


More examples
--------------

Use MD5 check only, omotting SHA1 check:
downloader.cmd
  "http://download.mozilla.org/?product=firefox-6.0.2&amp;os=win&amp;lang=en-US"
  "%TEMP%\firefox\firefox-setup.exe" 
  "ba36842c5c50515b0e114b61f5b72f4d" 

Copy single file from UNC path:
downloader.cmd
  "\\server\share\file.exe"
  "%TEMP%\firefox\file.exe" 
  "ba36842c5c50515b0e114b61f5b72f4d"
  "5d631a8766ada20fc15e014942ffc2861a1f1165"

Mirror complete directory:
downloader.cmd
  "\\server\share\"
  "%TEMP%\application-x\" 
