# Examples

Configuration examples which go a step further than the sample files in the
root of the repository. Every file validates against the schemas in `xsd/`, so
they can be copied into a real installation and edited from there.

| File | Shows |
| --- | --- |
| [packages/msi-with-exit-codes.xml](packages/msi-with-exit-codes.xml) | An MSI package with checks, exit codes and reboot handling |
| [packages/execute-check-with-download.xml](packages/execute-check-with-download.xml) | A check which runs a downloaded script and evaluates its exit code |
| [packages/conditional-commands.xml](packages/conditional-commands.xml) | One package definition adapting to architecture, locale, hardware and network |
| [hosts/host-matching.xml](hosts/host-matching.xml) | Assigning profiles by name, model, serial, MAC, address, domain, group and environment |
| [profiles/profile-inheritance.xml](profiles/profile-inheritance.xml) | Profiles built from other profiles, with conditional package assignments |

## Trying them out

Point WPKG at a directory holding the four configuration files and run it with
`/dryrun`, which executes no command and prints what would happen:

```
cscript wpkg.js /synchronize /dryrun /debug /base:\\server\wpkg
```

The host attributes a machine reports, which is what the host definitions
match against, are printed by:

```
cscript wpkg.js /query:l
```

The packages which would be installed, upgraded, downgraded or removed during
the next synchronization are printed by:

```
cscript wpkg.js /query:m
```

## Validating a configuration

The schemas catch a typo in an attribute name before it reaches a workstation.
On a machine with `xmllint` installed:

```bash
xmllint --noout --schema xsd/packages.xsd packages/*.xml
```

Most XML editors validate against the schema on their own once the
`xsi:schemaLocation` attribute of the file points at it, as it does in every
example here.
