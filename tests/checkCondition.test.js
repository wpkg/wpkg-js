/*
 * Behaviour of checkCondition().
 *
 * A check decides whether a package counts as installed and whether a
 * conditional node applies. The registry, execute, host and logical check
 * types are covered here, the file and uninstall types need a filesystem and
 * the uninstall registry hive and are therefore left to a Windows machine.
 */

const test = require("node:test");
const assert = require("node:assert/strict");

const { loadWpkg, DictionaryStub } = require("./harness.js");
const { xml } = require("./xmlstub.js");

/**
 * Builds a machine to run checks against.
 *
 * @param {object} [options]
 * @param {object} [options.registry] registry values by path, a missing path
 *        reads as null.
 * @param {object} [options.exitCodes] exit code by command line, commands
 *        which are not listed exit with 0.
 * @param {object} [options.environment] environment variables of the host.
 * @param {object} [options.host] host attributes for the host checks.
 * @param {boolean} [options.downloadResult] result reported by downloadAll().
 * @returns {object} the loaded wpkg.js context. It is extended by the
 *        "executions" and "downloads" arrays recording what the checks did.
 */
function fakeMachine(options) {
	const opts = options || {};
	const wpkg = loadWpkg({ environment: opts.environment || {} });

	const hostInformation = new DictionaryStub();
	const hostAttributes = opts.host || { hostname: "ws-042", architecture: "x64" };
	Object.keys(hostAttributes).forEach(function (name) {
		hostInformation.Add(name, hostAttributes[name]);
	});
	wpkg.getHostInformation = function () {
		return hostInformation;
	};

	const registry = opts.registry || {};
	wpkg.getRegistryValue = function (path) {
		return Object.prototype.hasOwnProperty.call(registry, path) ? registry[path] : null;
	};

	const executions = [];
	const exitCodes = opts.exitCodes || {};
	wpkg.exec = function (cmd, timeout) {
		executions.push({ cmd: cmd, timeout: timeout });
		return Object.prototype.hasOwnProperty.call(exitCodes, cmd) ? exitCodes[cmd] : 0;
	};

	const downloads = [];
	wpkg.downloadAll = function (downloadNodes) {
		Array.from(downloadNodes).forEach(function (node) {
			downloads.push(node.getAttribute("url"));
		});
		return opts.downloadResult !== false;
	};
	wpkg.downloadsClean = function () {
		// Nothing to clean up without a real download.
	};

	// The results are cached in the local settings database, which is not
	// part of these tests.
	wpkg.addSettingsCheckResult = function () {};

	wpkg.executions = executions;
	wpkg.downloads = downloads;
	return wpkg;
}

const UNINSTALL_KEY =
	"HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\Mozilla Firefox\\DisplayVersion";

test("a registry check succeeds if the path exists", function () {
	const wpkg = fakeMachine({ registry: { [UNINSTALL_KEY]: "115.2" } });

	assert.equal(
		wpkg.checkCondition(xml("check", { type: "registry", condition: "exists", path: UNINSTALL_KEY })),
		true
	);
	assert.equal(
		wpkg.checkCondition(
			xml("check", { type: "registry", condition: "exists", path: UNINSTALL_KEY + "-missing" })
		),
		false
	);
});

test("a registry check compares the value stored at the path", function () {
	const wpkg = fakeMachine({ registry: { [UNINSTALL_KEY]: "115.2" } });

	const equals = function (value) {
		return wpkg.checkCondition(
			xml("check", { type: "registry", condition: "equals", path: UNINSTALL_KEY, value: value })
		);
	};

	assert.equal(equals("115.2"), true);
	assert.equal(equals("115.1"), false);
});

test("a registry check expands the environment variables of its path", function () {
	const wpkg = fakeMachine({
		registry: { "HKLM\\SOFTWARE\\example\\ws-042": "installed" },
		environment: { COMPUTERNAME: "ws-042" },
	});

	assert.equal(
		wpkg.checkCondition(
			xml("check", {
				type: "registry",
				condition: "exists",
				path: "HKLM\\SOFTWARE\\example\\%COMPUTERNAME%",
			})
		),
		true
	);
});

test("a registry check needs a condition and a path", function () {
	const wpkg = fakeMachine();

	assert.throws(function () {
		wpkg.checkCondition(xml("check", { type: "registry", condition: "exists" }));
	}, /path is null/);
});

test("an execute check compares the exit code of the command", function () {
	const wpkg = fakeMachine({ exitCodes: { "cscript //nologo verify.js": 3 } });

	const check = function (condition, value) {
		return wpkg.checkCondition(
			xml("check", {
				type: "execute",
				condition: condition,
				path: "cscript //nologo verify.js",
				value: value,
			})
		);
	};

	assert.equal(check("exitcodeequalto", "3"), true);
	assert.equal(check("exitcodeequalto", "0"), false);
	assert.equal(check("exitcodesmallerthan", "4"), true);
	assert.equal(check("exitcodelessorequal", "3"), true);
	assert.equal(check("exitcodegreaterorequal", "3"), true);
	assert.equal(check("exitcodegreaterthan", "3"), false);
});

test("an execute check defaults to exit code 0", function () {
	const wpkg = fakeMachine({ exitCodes: { "verify-fails.cmd": 1 } });

	assert.equal(wpkg.checkCondition(xml("check", { type: "execute", path: "verify-ok.cmd" })), true);
	assert.equal(wpkg.checkCondition(xml("check", { type: "execute", path: "verify-fails.cmd" })), false);
});

test("an execute check runs its command with the timeout it defines", function () {
	const wpkg = fakeMachine();

	wpkg.checkCondition(xml("check", { type: "execute", path: "verify.cmd", timeout: "30" }));
	assert.deepEqual(Array.from(wpkg.executions), [{ cmd: "verify.cmd", timeout: 30 }]);
});

test("an execute check falls back to the configured check timeout", function () {
	const wpkg = fakeMachine();

	wpkg.checkCondition(xml("check", { type: "execute", path: "verify.cmd" }));
	assert.equal(wpkg.executions[0].timeout, wpkg.checkExecuteTimeout);
});

test("an execute check downloads the script it runs", function () {
	const wpkg = fakeMachine();

	wpkg.checkCondition(
		xml("check", { type: "execute", path: "%TEMP%\\verify.cmd" }, [
			xml("download", { url: "http://example.local/wpkg/verify.cmd", target: "verify.cmd" }),
		])
	);

	assert.deepEqual(Array.from(wpkg.downloads), ["http://example.local/wpkg/verify.cmd"]);
});

test("an execute check needs a path", function () {
	const wpkg = fakeMachine();

	assert.throws(function () {
		wpkg.checkCondition(xml("check", { type: "execute", condition: "exitcodeequalto", value: "0" }));
	}, /No path is specified/);
});

test("a host check matches an attribute of the current host", function () {
	const wpkg = fakeMachine({ host: { hostname: "ws-042", architecture: "x64" } });

	assert.equal(
		wpkg.checkCondition(xml("check", { type: "host", condition: "architecture", value: "x64" })),
		true
	);
	assert.equal(
		wpkg.checkCondition(xml("check", { type: "host", condition: "architecture", value: "x86" })),
		false
	);
});

test("a logical check inverts the result of its sub checks", function () {
	const wpkg = fakeMachine({ registry: { [UNINSTALL_KEY]: "115.2" } });

	const not = function (path) {
		return wpkg.checkCondition(
			xml("check", { type: "logical", condition: "not" }, [
				xml("check", { type: "registry", condition: "exists", path: path }),
			])
		);
	};

	assert.equal(not(UNINSTALL_KEY), false);
	assert.equal(not(UNINSTALL_KEY + "-missing"), true);
});

test("a logical check combines its sub checks with and", function () {
	const wpkg = fakeMachine({ registry: { "HKLM\\a": "1", "HKLM\\b": "1" } });

	const and = function (paths) {
		return wpkg.checkCondition(
			xml(
				"check",
				{ type: "logical", condition: "and" },
				paths.map(function (path) {
					return xml("check", { type: "registry", condition: "exists", path: path });
				})
			)
		);
	};

	assert.equal(and(["HKLM\\a", "HKLM\\b"]), true);
	assert.equal(and(["HKLM\\a", "HKLM\\c"]), false);
});

test("a logical check combines its sub checks with or", function () {
	const wpkg = fakeMachine({ registry: { "HKLM\\a": "1" } });

	const or = function (paths) {
		return wpkg.checkCondition(
			xml(
				"check",
				{ type: "logical", condition: "or" },
				paths.map(function (path) {
					return xml("check", { type: "registry", condition: "exists", path: path });
				})
			)
		);
	};

	assert.equal(or(["HKLM\\a", "HKLM\\c"]), true);
	assert.equal(or(["HKLM\\b", "HKLM\\c"]), false);
});

test("a logical check counts how many sub checks succeed", function () {
	const wpkg = fakeMachine({ registry: { "HKLM\\a": "1", "HKLM\\b": "1" } });

	const counted = function (condition, value) {
		return wpkg.checkCondition(
			xml("check", { type: "logical", condition: condition, value: value }, [
				xml("check", { type: "registry", condition: "exists", path: "HKLM\\a" }),
				xml("check", { type: "registry", condition: "exists", path: "HKLM\\b" }),
				xml("check", { type: "registry", condition: "exists", path: "HKLM\\c" }),
			])
		);
	};

	assert.equal(counted("atleast", "2"), true);
	assert.equal(counted("atleast", "3"), false);
	assert.equal(counted("atmost", "2"), true);
	assert.equal(counted("atmost", "1"), false);
});

test("a logical check needs a condition", function () {
	const wpkg = fakeMachine();

	assert.throws(function () {
		wpkg.checkCondition(xml("check", { type: "logical" }));
	}, /Condition is null for a logical check/);
});

test("an unknown check type is refused", function () {
	const wpkg = fakeMachine();

	assert.throws(function () {
		wpkg.checkCondition(xml("check", { type: "magic", condition: "exists", path: "anything" }));
	}, /Check condition type magic unknown/);
});

test("a check without a type is refused", function () {
	const wpkg = fakeMachine();

	assert.throws(function () {
		wpkg.checkCondition(xml("check", { condition: "exists", path: "anything" }));
	}, /Check Type is null/);
});
