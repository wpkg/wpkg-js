![WPKG Logo](https://wpkg.org/wpkg.png)

# WPKG.js

This utility executes commands for installing/update/remove of
programs on remote Windows stations and a collection of WPKG
configuration files in XML format.

# Some links

* Main the WPKG website - https://wpkg.org/
* WPKG documentation page - https://wpkg.org/Documentation
* Article on Wikipedia - https://en.wikipedia.org/wiki/WPKG_(software)

# Tests

`wpkg.js` runs under Windows Script Host, but its functions can be checked on
any platform. The harness in `tests/harness.js` loads the script into a Node.js
VM context with stubs for `WScript`, `ActiveXObject`, `GetObject` and
`Enumerator`, so single functions can be called with a fake registry and a fake
WMI service.

Run the suite with Node.js 18 or newer, no dependencies are required:

```
node --test "tests/*.test.js"
```
