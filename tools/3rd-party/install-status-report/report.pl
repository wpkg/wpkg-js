#!/usr/bin/perl

use XML::Simple;
use Data::Dumper;
use strict;

my @files; #list of files to read from
my %hosts; #Key value pair of host regexp to profiles
my %profiles;
my %packages;
my %hosttmp; # Temparary host hash that will be merged into %hosts
my %xmlfile; # XML file to be parsed

# Build Hosts Array
@files = <hosts/*.xml>;
foreach my $file (@files) {
	my $xmlfile = XMLin("$file", ForceArray => 1) || die ("can't open $file host file");
	foreach my $host (keys %{$xmlfile->{'host'}}) {
		$hosts{$host} = $xmlfile->{'host'}->{$host}->{'profile-id'};
	}
}

# Build Profile Array
@files = <profiles/*.xml>;
foreach my $file (@files) {
	my $xmlfile = XMLin("$file", ForceArray => 1) || die ("can't open $file profile");
	foreach my $profile (keys %{$xmlfile->{'profile'}}) {
		foreach my $package (@{$xmlfile->{'profile'}->{$profile}->{'package'}}) {
			push (@{%profiles->{$profile}->{'package'}}, $package->{'package-id'});
		}
		foreach my $depends (@{$xmlfile->{'profile'}->{$profile}->{'depends'}}) {
			push (@{%profiles->{$profile}->{'depends'}}, $depends->{'profile-id'})
		}
	}
}

# Build package arary
@files = <packages/*.xml>;
foreach my $file (@files) {
	my $xmlfile = XMLin("$file", ForceArray => 1);
	#print Dumper($xmlfile);
	foreach my $package (keys %{$xmlfile->{'package'}}) {
		$packages{$xmlfile->{'package'}->{$package}->{'id'}} = $xmlfile->{'package'}->{$package}->{'revision'};
	}
}

# Output List Header
my $separator = "-------------------------------------------------------------------------------------------";
printf "%-20s %-30s %10s %10s\n", "Hostname", "Package", "Available", "Installed";
printf "%.20s-%.30s-%.10s-%.10s\n", $separator, $separator, $separator, $separator;

# Start checking host xmlfiles
@files = <status/*.xml>;
foreach my $file (@files) {
	my %testpackages; # Packages that we will be testing against
	my %checkpackages; # Packages in the status xml we will be testing
	my $xmlfile = XMLin("$file", ForceArray => 1);
	my $hostname = $file;
	$hostname =~ s/.+\///;
	$hostname =~ s/\..+//;
	foreach my $profiletest (keys %hosts) {
		# Match the Hostname
		if ($hostname =~ /$profiletest/i) {
			# print "Match! $hostname matches $profiletest using profile: $hosts{$profiletest}\n";
			# Now we populate %testpackages with all of the packages in main and dependent profiles
			foreach my $package (@{%profiles->{$hosts{$profiletest}}->{'package'}}) {
				$testpackages{$package} = $packages{$package};
			}
			foreach my $depend (@{%profiles->{$hosts{$profiletest}}->{'depends'}}) {
				foreach my $package (@{%profiles->{$depend}->{'package'}}) {
					$testpackages{$package} = $packages{$package};
				}	
			}
			# Now lets make a hash for the host we are testing!
			foreach my $package (keys %{$xmlfile->{'package'}}) {
				$checkpackages{$xmlfile->{'package'}{$package}{'id'}} = $xmlfile->{'package'}{$package}{'revision'};
			}
			# Now we have our %testpackages and %checkpackages hashes made, lets test!
			foreach my $package (keys %testpackages) {				
				# In the below line, package is the key, which returns the value of 'revision'
				if ( $testpackages{$package} != $checkpackages{$package} ) {
					printf "%-20s %-30s %10s %10s\n", $hostname, $package, $testpackages{$package}, $checkpackages{$package};
				}
			}
		}
	}
}
