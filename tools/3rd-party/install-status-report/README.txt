
OVERVIEW

This is a simple reporting script for wpkg.

This script reads workstation data provided by their wpkg.xml file and compairs the versions of packages that should be assigned to the to a workstations, with the versions that are present.

REQUIREMENTS

I have only tested this script on a linux server that is hosting the wpkg share though SAMBA

INSTALLATION

1. Copy the report.pl script to your wpkg share

2. Create a directory called status, and make sure it is writable by everyone

3. Create a new package that will run on ALL of your workstations:
	<?xml version="1.0" encoding="UTF-8"?>

	<packages>

	<package
	    id="wpkg-xml"
	    name="wpkg.xml files from workstations"
	    revision="1"
	    priority="0"
	    execute="always">

	<install timeout="15" cmd='cmd /C copy %SYSTEMROOT%\system32\wpkg.xml \\wpkgserver\wpkg\status\%COMPUTERNAME%.xml /Y' />

	</package>

	</packages>

Make sure you change wpkgserver to the name of your server that has the wpkg share. This package will copy the local wpkg.xml file (which contains the database of what is installed on the workstation) to your wpkg share every time the wpkg service is launched.

4. Run the report.pl file by typing "perl report.pl" from the directory that contains your wpkg installation. The script will check each xml file listed in your 'status' directory and compair the installed packages version numbers against the package version numbers that are available in the wpkg share. If all of your workstations are up to date, then it doesn't print anything. The program will print one line for every difference it finds.

Sample output:
WORKSTATION1: office2003 DBv: 20032 PCv: 20031

The above example shows that the computer WORKSTATION1 has an installed version of the package 'office2003' of '20031', but there is a newer version on the wpkg share of '20032'

KNOWN LIMITATIONS

- This script requires that all of your host xml file locations be in a folder called 'hosts' in your wpkg share, and end with the xml extension
- This script requires that all of your profile xml file locations be in a folder called 'profiles' in your wpkg share, and end with the xml extension
- This script requires that all of your package xml file locations be in a folder called 'packages' in your wpkg share, and end with the xml extension


TECHNICAL DETAILS

Coming soon...

LICENSE

This software is licensed under the GNU Public License version 2
