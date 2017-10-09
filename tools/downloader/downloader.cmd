@echo off
setlocal EnableExtensions EnableDelayedExpansion

:: :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
:: Title:           WPKG download helper
:: Author:          Rainer Meier <r.meier@wpkg.org>
:: Version:         1.0
:: Description:
:: Please see included README.TXT.
::
:: Usage:
:: downloader.cmd <download-url> <target> [MD5] [SHA1]
::
:: Examples:
:: Download file with MD5 and SHA1 verification.
:: downloader.cmd "http://host/file.exe" "%TEMP%\file.exe" "0123456789abcdef0123456789abcdef" "0123456789abcdef0123456789abcdef01234567"
:: Download file with MD5 verfication only.
:: downloader.cmd "http://host/file.exe" "%TEMP%\file.exe" "0123456789abcdef0123456789abcdef"
:: Download file with SHA1 verification only
:: downloader.cmd "http://host/file.exe" "%TEMP%\file.exe" "" "0123456789abcdef0123456789abcdef01234567"
::
:: Exit codes:
::  0   All OK. File downloaded and verified successfully.
::  1   Error during file download.
::  2   MD5 verfication failed.
::  3   SHA1 verification failed.
:: 98   Incomplete command-line parameters.
:: 99   Pre-condition not met (for example required tool missing).
::
:: Contributors:
:: David Petterson <david@ifm.liu.se>
:: :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::



:: Set location where to find required tools.
set TOOLS_PATH=%~dp0

:: Path to web downloader tool (wget).
set DOWNLOADER_TOOL_WEB=%TOOLS_PATH%wget.exe

:: Path to UNC/file copy tool (robocopy).
:: Default (Client with Robocopy already installed):
set DOWNLOADER_TOOL_UNC=robocopy.exe
if exist "%TOOLS_PATH%robocopy.exe" set DOWNLOADER_TOOL_UNC="%TOOLS_PATH%robocopy.exe"

:: How many download attempts before giving up?
set DOWNLOAD_RETRY=3

:: Additional options to pass to the web downloader application (wget).
:: e.g.
:: set DOWNLOADER_OPTIONS_WEB=--user=username --password=password
set DOWNLOADER_OPTIONS_WEB=

:: Additional options to pass to the UNC downloader application (Robocopy).
set DOWNLOADER_OPTIONS_UNC=

:: :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
:: :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
:: No need to change anything below this line
:: :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
:: :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

:: Enable debugging.
:: Note: This should not be enabled in productive environment as WSH has some
:: issues dealing with commands printing output on console.
:: See <http://wpkg.org/FAQ#My_install_command_just_stalls_and_never_finishes>
set DEBUG_FLAG=1

:: Reset download retry counter.
set RETRY_COUNTER=1

:: Default options passed to web downloader.
:: Disable certificate verification (not recommended)
:: set DOWNLOADER_DEFAULT_OPTIONS_WEB=-q -N --no-check-certificate
:: Default:
set DOWNLOADER_DEFAULT_OPTIONS_WEB=-q -N

:: Default options passed to UNC downloader.
set DOWNLOADER_DEFAULT_OPTIONS_UNC=/LOG:%TEMP%\robocopy.log /NP

:: Set path to MD5 checksumming tool.
set MD5_TOOL=%TOOLS_PATH%md5sum.exe

:: Set path to SHA1 checksumming tool.
set SHA1_TOOL=%TOOLS_PATH%sha1sum.exe

:: Get URL (for web downloads).
set DOWNLOAD_URL=%~1

:: Get download path (for UNC sync).
set DOWNLOAD_SOURCE=%~dp1

:: Get download file (for UNC copy).
set DOWNLOAD_FILE=%~nx1

:: Get target file path.
set TARGET_FILE_PATH=%~dp2

:: Get target file name.
set TARGET_FILE_NAME=%~nx2

:: Get MD5 sum.
set MD5SUM=%~3

:: Get SHA1 sum.
set SHA1SUM=%~4

:: Set exit code.
set EXIT_CODE=0

:: Debug path components read.
if %DEBUG_FLAG% NEQ 0 echo Downloading '%DOWNLOAD_URL%' to '%TARGET_FILE_PATH%\%TARGET_FILE_NAME%'

:: Check required command line parameters.

:: Check download URL.
if "%DOWNLOAD_URL%" == "" (
	goto usage
	set EXIT_CODE=98
	goto end
)

:: Check file path.
if "%TARGET_FILE_PATH%" == "%~dp0" (
	echo Error: Invalid download target specified!
	goto usage
	set EXIT_CODE=98
	goto end
)
if "%TARGET_FILE_PATH%" == "" (
	echo Error: No download target specified!
	goto usage
	set EXIT_CODE=98
	goto end
)

if "%TARGET_FILE_NAME%" == "" (
	echo Warning: No target file name specified. No checksum verficiation will be done!"
)

:: Evaluate downloader tool to be used.
set DOWNLOADER_TOOL=
:: Check and set downloader tool
echo %DOWNLOAD_URL%|findstr /R /I "^http">NUL
if %ERRORLEVEL% EQU 0 (
	set DOWNLOADER_TOOL=WGET
	goto downloaderEvalComplete
)
echo %DOWNLOAD_URL%|findstr /R /I "^ftp">NUL
if %ERRORLEVEL% EQU 0 (
	set DOWNLOADER_TOOL=WGET
	goto downloaderEvalComplete
)
set DOWNLOADER_TOOL=ROBOCOPY
goto downloaderEvalComplete
:downloaderEvalComplete
if %DEBUG_FLAG% NEQ 0 echo Downloader tool: %DOWNLOADER_TOOL%

:: Check if everything is ready to start.
if "%DOWNLOADER_TOOL%" == "WGET" (
	if not exist "%DOWNLOADER_TOOL_WEB%" (
		echo Error: Unable to locate web downloader tool: %DOWNLOADER_TOOL_WEB%
		exit /b 99
	)
)

if "%MD5SUM%" == "" goto skipMD5ToolCheck
if "%TARGET_FILE_NAME%" == "" goto skipMD5ToolCheck
if not exist "%MD5_TOOL%" (
	echo Error: Unable to locate MD5 checksum tool: %MD5_TOOL%
	exit /b 99
)
:skipMD5ToolCheck

if "%SHA1SUM%" == "" goto skipSHA1ToolCheck
if "%TARGET_FILE_NAME%" == "" goto skipSHA1ToolCheck
if not exist "%SHA1_TOOL%" (
	echo Error: Unable to locate SHA1 checksum tool: %SHA1_TOOL%
	exit /b 99
)
:skipSHA1ToolCheck

:: Skip forward to download of files.
goto runDownload

:: Print usage information.
:usage
echo.
echo Usage:
echo.
echo %~nx0 ^<download-url^> ^<target^> [MD5] [SHA1]
echo.
echo While:
echo   ^<download-url^>  URL to file which should be downloaded
echo                     eg. "http://host/installer.exe"
echo                         "\\fileserver\folder\file.exe"
echo   ^<target^>        Target path where the file shall be stored.
echo                     eg. "%%TEMP%%\folder\setup.exe"
echo                     eg. "%%TEMP%%\folder\"
echo   [MD5]             Expected MD5 checksum of file.
echo                     eg. "0123456789abcdef0123456789abcdef"
echo   [SHA1]            Expected SHA1 checksum of file.
echo                     eg. "0123456789abcdef0123456789abcdef01234567"
echo.
echo Examples:
echo Download file with MD5 and SHA1 verification.
echo downloader.cmd "http://host/file.exe" "%%TEMP%%\file.exe" "0123456789abcdef0123456789abcdef" "0123456789abcdef0123456789abcdef01234567"
echo.
echo Download file with MD5 verfication only.
echo downloader.cmd "http://host/file.exe" "%%TEMP%%\file.exe" "0123456789abcdef0123456789abcdef"
echo.
echo Download file with SHA1 verification only
echo downloader.cmd "http://host/file.exe" "%%TEMP%%\file.exe" "" "0123456789abcdef0123456789abcdef01234567"
echo.
echo In order to synchronize folders make sure to your path ends with a backslash '\'
echo downloader.cmd "\\server\folder\" "%%TEMP%%\folder\"

goto :eof

:: :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
:: Everything ready to start.
:runDownload

:: Reset parameters.
set DOWNLOADER_OPTIONS=

:: Assure target path to exist
set FOLDER_CREATED=0
if not exist "%TARGET_FILE_PATH%" (
	set FOLDER_CREATED=1
	mkdir "%TARGET_FILE_PATH%"
)

:: :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
:: Download file.
if "%DOWNLOADER_TOOL%" == "WGET" (
	:: Web download.
	if not "%TARGET_FILE_NAME%" == "" (
		:: Clean eventually incomplete file.
		if exist "%TARGET_FILE_PATH%%TARGET_FILE_NAME%" del /F /Q "%TARGET_FILE_PATH%%TARGET_FILE_NAME%"
		:: For WEB downloads append options
		set DOWNLOADER_OPTIONS=-O "%TARGET_FILE_PATH%%TARGET_FILE_NAME%"
	)
	:: Build command line arguments.
	set DOWNLOADER_OPTIONS=!DOWNLOADER_OPTIONS! %DOWNLOADER_DEFAULT_OPTIONS_WEB% %DOWNLOADER_OPTIONS_WEB% --directory-prefix="%TARGET_FILE_PATH%\." "%DOWNLOAD_URL%"
) else (
	:: UNC download.
	if "%DOWNLOAD_FILE%" == "" (
		:: Copy directory from UNC path.
		set DOWNLOADER_OPTIONS=/E /Z /PURGE /MIR "%DOWNLOAD_URL:~0,-1%" "%TARGET_FILE_PATH:~0,-1%"
	) else (
		:: Copy single file from UNC path.
		set DOWNLOADER_OPTIONS="%DOWNLOAD_SOURCE:~0,-1%" "%TARGET_FILE_PATH:~0,-1%" "%DOWNLOAD_FILE%"
	)
	set DOWNLOADER_OPTIONS=%DOWNLOADER_DEFAULT_OPTIONS_UNC% %DOWNLOADER_OPTIONS_UNC% !DOWNLOADER_OPTIONS!
)

:: :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
:: Perform download

set DOWNLOAD_TOOL_PATH=%DOWNLOADER_TOOL_UNC%
if "%DOWNLOADER_TOOL%" == "WGET" set DOWNLOAD_TOOL_PATH=%DOWNLOADER_TOOL_WEB% 

if %DEBUG_FLAG% NEQ 0 echo Starting download from %DOWNLOAD_URL% using %DOWNLOAD_TOOL_PATH%.
"%DOWNLOAD_TOOL_PATH%" %DOWNLOADER_OPTIONS%
set DOWNLOAD_EXIT_CODE=%ERRORLEVEL%

:: For Robocopy translate exit code 1 to success.
:: 1 means that one or more files were successfully copied.
if "%DOWNLOADER_TOOL%" == "ROBOCOPY" (
	if %DOWNLOAD_EXIT_CODE% EQU 1 set DOWNLOAD_EXIT_CODE=0
	:: Robocopy is unable to rename files. Rename it if target file name is specified.
	if not "%TARGET_FILE_NAME%" == "" (
		ren "%TARGET_FILE_PATH%%DOWNLOAD_FILE%" "%TARGET_FILE_NAME%"
	)
)

if %DOWNLOAD_EXIT_CODE% NEQ 0 (
	echo Failed download command line:
	echo "%DOWNLOAD_TOOL_PATH%" %DOWNLOADER_OPTIONS%
	echo Error downloading %DOWNLOAD_URL%. Exit code %ERRORLEVEL%.
	set EXIT_CODE=1
	goto end
)
if %DEBUG_FLAG% NEQ 0 echo Download successfully finished.

:: Clean robocopy log if not in debug mode
if %DEBUG_FLAG% EQU 0 del /f "%TEMP%\robocopy.log" > NUL

:: :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
:: Verify MD5 sum (if requested)
if "%MD5SUM%" == "" goto skipMD5
:: If no filename was specified we don't know how the downloaded file is named.
if "%TARGET_FILE_NAME%" == "" goto skipMD5
if not exist "%TARGET_FILE_PATH%%TARGET_FILE_NAME%" (
	echo Error: Downloaded file "%TARGET_FILE_PATH%%TARGET_FILE_NAME%" does not exist!
	set EXIT_CODE=1
	goto downloadFinished
)

:: Get MD5 sum.
:: Need to change to target path as md5sum seems to have issues with paths
:: containing spaces.
pushd "%TARGET_FILE_PATH%"
"%MD5_TOOL%" "%TARGET_FILE_NAME%" | findstr /L /I "%MD5SUM%" >NUL
set MD5_VERIFICATION=%ERRORLEVEL%
popd
if %MD5_VERIFICATION% NEQ 0 (
	set EXIT_CODE=2
	echo Error: MD5 verification failed!
	if %FOLDER_CREATED% NEQ 0 (
		rd /s /q "%TARGET_FILE_PATH%"
	) else (
		del /F /Q "%TARGET_FILE_PATH%%TARGET_FILE_NAME%"
	)
	goto downloadFinished
)
if %DEBUG_FLAG% NEQ 0 echo MD5 verfication successfully finished.
:skipMD5

:: :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
:: Verify SHA1 sum (if requested)
if "%SHA1SUM%" == "" goto skipSHA1
:: If no filename was specified we don't know how the downloaded file is named.
if "%TARGET_FILE_NAME%" == "" goto skipSHA1
if not exist "%TARGET_FILE_PATH%%TARGET_FILE_NAME%" (
	echo Error: Downloaded file "%TARGET_FILE_PATH%%TARGET_FILE_NAME%" does not exist!
	set EXIT_CODE=1
	goto end
)

:: Get SHA1 sum.
:: Need to change to target path as md5sum seems to have issues with paths
:: containing spaces.
:: pushd "%TARGET_FILE_PATH%"
"%SHA1_TOOL%" "%TARGET_FILE_PATH%%TARGET_FILE_NAME%" | findstr /L /I "%SHA1SUM%" >NUL
set SHA1_VERIFICATION=%ERRORLEVEL%
if %SHA1_VERIFICATION% NEQ 0 (
	set EXIT_CODE=3
	echo Error: SHA1 verification failed!
	if %FOLDER_CREATED% NEQ 0 (
		rd /s /q "%TARGET_FILE_PATH%"
	) else (
		del /F /Q "%TARGET_FILE_PATH%%TARGET_FILE_NAME%"
	)
	goto downloadFinished
)
if %DEBUG_FLAG% NEQ 0 echo SHA1 verfication successfully finished.
:: popd
:skipSHA1

:downloadFinished
if %EXIT_CODE% NEQ 0 (
	set /A RETRY_COUNTER=%RETRY_COUNTER%+1
	if !RETRY_COUNTER! GTR %DOWNLOAD_RETRY% goto end
	if %DEBUG_FLAG% NEQ 0 echo Attempt number !RETRY_COUNTER!. Trying again.
	goto runDownload
)
goto end


:end
exit /b %EXIT_CODE%
