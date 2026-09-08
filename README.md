![WPKG Logo](https://wpkg.org/wpkg.png)

# WPKG.js

[![Tests](https://github.com/wpkg/wpkg-js/actions/workflows/tests.yml/badge.svg)](https://github.com/wpkg/wpkg-js/actions/workflows/tests.yml)
[![Release](https://img.shields.io/github/v/release/wpkg/wpkg-js?label=release)](https://github.com/wpkg/wpkg-js/releases)
[![License](https://img.shields.io/badge/license-GPL--2.0--or--later-blue.svg)](LICENSE)
[![Platform](https://img.shields.io/badge/platform-Windows%20Script%20Host-0078D6.svg)](https://learn.microsoft.com/en-us/previous-versions/windows/internet-explorer/ie-developer/windows-scripting/9bbdkx3k(v=vs.84))
[![Tested on](https://img.shields.io/badge/tests%20on-Node.js%2020%2B-5FA04E.svg)](https://nodejs.org/)

WPKG installs, upgrades and removes software on Windows workstations without
anybody touching them. The software to deploy is described in XML on a central
share, every workstation runs `wpkg.js` and brings itself into the state its
profile prescribes.

This repository holds `wpkg.js` itself, the XML schemas of its configuration
files, a set of sample and example definitions and the test suite.

## How it works

Four configuration files describe a deployment, they live next to `wpkg.js` on
the server:

- `packages.xml` lists the software: how a package is installed, upgraded and
  removed, and the checks which tell whether it is present;
- `profiles.xml` groups packages into profiles, a profile can depend on other
  profiles;
- `hosts.xml` assigns a profile to a machine, by name or by any other host
  attribute;
- `config.xml` holds the settings of WPKG itself, its defaults suit most
  installations.

A workstation runs `cscript wpkg.js /synchronize`, which reads the files,
determines the profile of the host, and installs, upgrades or removes packages
until the machine matches its profile. What is installed locally is recorded
in `%SystemRoot%\system32\wpkg.xml`, the local package database.

Running WPKG at boot time is the job of the
[WPKG Client](https://wpkg.org/WPKG_Client), which is a separate program.

## Repository layout

| Path | Contents |
| --- | --- |
| `wpkg.js` | The program, a single JScript file executed by the Windows Script Host |
| `config.xml`, `packages.xml`, `profiles.xml`, `hosts.xml` | Sample configuration, commented in detail |
| `packages/`, `profiles/`, `hosts/` | Sample definitions split into several files |
| `packages/Templates/` | Package templates for MSI, NSIS, Inno Setup and plain copy installations |
| `examples/` | Worked examples of package, profile and host definitions, see [examples/README.md](examples/README.md) |
| `xsd/` | XML schemas of all configuration files |
| `tools/` | Helper scripts shipped alongside WPKG (elevation, 64 bit wrapper, downloader) |
| `documents/` | Upstream README, changelog, contributors and the license |
| `tests/` | Test suite, runs on any platform with Node.js |

## Getting started

1. Copy `wpkg.js`, the four XML files and the `tools/` directory to a share
   every workstation can read, for example `\\server\wpkg`.
2. Describe your software in `packages.xml`, take a template from
   `packages/Templates/` or an example from `examples/packages/`.
3. Group the packages into profiles in `profiles.xml` and assign the profiles
   to the machines in `hosts.xml`.
4. Try the result on one workstation without changing anything on it:

```
cscript \\server\wpkg\wpkg.js /synchronize /dryrun /debug
```

5. Once it does what you expect, drop the `/dryrun` and let the WPKG Client
   run the same command at boot time.

The configuration files are validated by the schemas in `xsd/`, which catches
a misspelled attribute before it reaches a workstation:

```bash
xmllint --noout --schema xsd/packages.xsd packages/*.xml
```

## Command line

Full usage, including every optional switch, is printed by:

```
cscript wpkg.js /help
```

The switches used most often:

| Switch | Meaning |
| --- | --- |
| `/synchronize` | Bring the machine into the state its profile prescribes |
| `/install:<package>` | Install the named packages, comma separated |
| `/upgrade:<package>` | Upgrade the named packages |
| `/remove:<package>` | Remove the named packages |
| `/show:<package>` | Print a summary of one package and its state |
| `/query:<option>` | List packages, `m` shows what a synchronization would change, `i` what is installed, `l` the host attributes of the machine |
| `/dryrun` | Execute nothing, print what would happen, implies `/debug` |
| `/base:<path>` | Read the configuration from this path instead of the script directory |
| `/quiet` | Report to the event log, for unattended runs |
| `/noreboot` | Never reboot, whatever a package asks for |
| `/logLevel:<0-31>` | Bitmask of the severities written to the log file |

Command line switches override the values from `config.xml`. Prefer changing
`config.xml` on the server, it is one file instead of every client.

## Examples

The [`examples/`](examples/) directory shows the parts which are hard to guess
from the schema alone:

- [an MSI package](examples/packages/msi-with-exit-codes.xml) with checks,
  exit codes and reboot handling;
- [a check which runs a downloaded script](examples/packages/execute-check-with-download.xml)
  and decides by its exit code;
- [one package definition for different machines](examples/packages/conditional-commands.xml),
  adapting to architecture, locale, hardware and network;
- [host definitions](examples/hosts/host-matching.xml) matching by name,
  model, serial number, MAC address, IP address, domain, group and
  environment;
- [profiles built from other profiles](examples/profiles/profile-inheritance.xml).

## Tests

`wpkg.js` runs under the Windows Script Host, but its functions can be checked
on any platform. The harness in `tests/harness.js` loads the script into a
Node.js VM context with stubs for `WScript`, `ActiveXObject`, `GetObject` and
`Enumerator`, so single functions can be called with a fake registry, a fake
WMI service and a fake environment. XML nodes are built by `tests/xmlstub.js`
instead of being parsed.

Run the suite with Node.js 20 or newer, no dependencies are required:

```bash
node --test
```

or, equivalently:

```bash
npm test
```

Covered so far: version comparison, date parsing, host attribute matching,
conditional node filtering, package and command accessors, checks of type
registry, execute, host and logical, the network adapter queries and the small
string and list helpers.

Two limits are worth knowing before adding a test. Functions which use
JScript-only syntax, such as `setEnv()` with its `procEnv(key) = value`
assignment, cannot run under Node.js and have to be stubbed. And arrays
created inside the VM context are not equal to arrays created by the test, so
copy them with `Array.from()` before comparing.

## Documentation

- [WPKG website](https://wpkg.org/)
- [Documentation](https://wpkg.org/Documentation)
- [Regular expression support](https://wpkg.org/Regular_expression_support)
- [Article on Wikipedia](https://en.wikipedia.org/wiki/WPKG_(software))
- Changelog: [documents/CHANGES](documents/CHANGES)
- Contributors: [documents/CONTRIBUTORS](documents/CONTRIBUTORS)

## License

GNU General Public License, version 2 or later. See [LICENSE](LICENSE) and the
copyright notice in [documents/LICENSE](documents/LICENSE).
