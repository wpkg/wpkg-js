/*
 * Behaviour of the accessors which read a package definition.
 *
 * These functions define what an attribute of <package> and of its command
 * nodes means, including the defaults which apply when the attribute is
 * missing. The XML nodes are built by tests/xmlstub.js instead of being parsed
 * so that every test shows the definition it describes.
 */

const test = require("node:test");
const assert = require("node:assert/strict");

const { loadWpkg, DictionaryStub } = require("./harness.js");
const { xml } = require("./xmlstub.js");

/**
 * Loads wpkg.js with a host which matches every definition. The command
 * selection runs its nodes through filterConditionalNodes(), which needs the
 * host attributes even if no node restricts itself to a host.
 */
function loadForHost(attributes) {
	const wpkg = loadWpkg();

	const hostInformation = new DictionaryStub();
	const hostAttributes = attributes || { hostname: "ws-042", os: "Microsoft Windows 10 Pro" };
	Object.keys(hostAttributes).forEach(function (name) {
		hostInformation.Add(name, hostAttributes[name]);
	});
	wpkg.getHostInformation = function () {
		return hostInformation;
	};

	return wpkg;
}

/**
 * Reads the command lines out of a list of command nodes. The list is created
 * inside the vm realm, so it has to be copied before it can be compared to an
 * array built by the test itself.
 */
function commandsOf(wpkg, commandNodes) {
	return Array.from(commandNodes, function (node) {
		return wpkg.getCommandCmd(node);
	});
}

const wpkg = loadForHost();

test("getPackageID() and getPackageName() read the identity of a package", function () {
	const packageNode = xml("package", { id: "firefox", name: "Mozilla Firefox" });

	assert.equal(wpkg.getPackageID(packageNode), "firefox");
	assert.equal(wpkg.getPackageName(packageNode), "Mozilla Firefox");
});

test("getPackageName() falls back to an empty name", function () {
	assert.equal(wpkg.getPackageName(xml("package", { id: "firefox" })), "");
	assert.equal(wpkg.getPackageName(null), "");
});

test("getPackageRevision() defaults to revision 0", function () {
	assert.equal(wpkg.getPackageRevision(xml("package", { id: "firefox", revision: "115.2" })), "115.2");
	assert.equal(wpkg.getPackageRevision(xml("package", { id: "firefox" })), "0");
});

test("getPackagePriority() defaults to the lowest priority", function () {
	assert.equal(wpkg.getPackagePriority(xml("package", { id: "firefox", priority: "100" })), 100);
	assert.equal(wpkg.getPackagePriority(xml("package", { id: "firefox" })), 0);
});

test("getPackageReboot() accepts an immediate and a postponed reboot only", function () {
	const rebootOf = function (value) {
		const attributes = value === undefined ? {} : { reboot: value };
		return wpkg.getPackageReboot(xml("package", Object.assign({ id: "firefox" }, attributes)));
	};

	assert.equal(rebootOf("true"), "true");
	assert.equal(rebootOf("postponed"), "postponed");
	assert.equal(rebootOf("false"), "false");
	assert.equal(rebootOf(), "false");
	// "delayed" exists on command level only, on package level it is not a
	// valid value and must not schedule anything.
	assert.equal(rebootOf("delayed"), "false");
});

test("getPackageNotify() notifies the logged in user unless it is switched off", function () {
	assert.equal(wpkg.getPackageNotify(xml("package", { id: "firefox" })), true);
	assert.equal(wpkg.getPackageNotify(xml("package", { id: "firefox", notify: "true" })), true);
	assert.equal(wpkg.getPackageNotify(xml("package", { id: "firefox", notify: "false" })), false);
});

test("getPackageExecute() reports the execution policy of a package", function () {
	assert.equal(wpkg.getPackageExecute(xml("package", { id: "firefox", execute: "once" })), "once");
	assert.equal(wpkg.getPackageExecute(xml("package", { id: "firefox" })), "");
});

test("getPackageManualInstallation() marks packages installed from the command line", function () {
	assert.equal(
		wpkg.getPackageManualInstallation(xml("package", { id: "firefox", manualInstall: "true" })),
		true
	);
	assert.equal(
		wpkg.getPackageManualInstallation(xml("package", { id: "firefox", manualInstall: "false" })),
		false
	);
	assert.equal(wpkg.getPackageManualInstallation(xml("package", { id: "firefox" })), false);
});

test("getCommandCmd(), getCommandWorkdir() and getCommandTimeout() read a command node", function () {
	const install = xml("install", {
		cmd: "msiexec /i \"%SOFTWARE%\\firefox\\firefox.msi\" /qn",
		workdir: "%SOFTWARE%\\firefox",
		timeout: "900",
	});

	assert.equal(wpkg.getCommandCmd(install), "msiexec /i \"%SOFTWARE%\\firefox\\firefox.msi\" /qn");
	assert.equal(wpkg.getCommandWorkdir(install), "%SOFTWARE%\\firefox");
	assert.equal(wpkg.getCommandTimeout(install), 900);
});

test("getCommandTimeout() reports 0 if the command does not limit its runtime", function () {
	assert.equal(wpkg.getCommandTimeout(xml("install", { cmd: "setup.exe" })), 0);
});

test("getCommandExitCodeAction() reports success for a listed exit code", function () {
	const install = xml("install", { cmd: "setup.exe" }, [
		xml("exit", { code: "1641" }),
	]);

	assert.equal(wpkg.getCommandExitCodeAction(install, "1641"), "success");
	assert.equal(wpkg.getCommandExitCodeAction(install, "1603"), null);
});

test("getCommandExitCodeAction() reports the reboot requested by an exit code", function () {
	const install = xml("install", { cmd: "setup.exe" }, [
		xml("exit", { code: "3010", reboot: "postponed" }),
		xml("exit", { code: "1641", reboot: "true" }),
		xml("exit", { code: "1618", reboot: "delayed" }),
	]);

	assert.equal(wpkg.getCommandExitCodeAction(install, "3010"), "postponedReboot");
	assert.equal(wpkg.getCommandExitCodeAction(install, "1641"), "reboot");
	assert.equal(wpkg.getCommandExitCodeAction(install, "1618"), "delayedReboot");
});

test("getCommandExitCodeAction() accepts any exit code via a catch all entry", function () {
	const withAny = xml("remove", { cmd: "uninstall.exe" }, [xml("exit", { code: "any" })]);
	const withStar = xml("remove", { cmd: "uninstall.exe" }, [xml("exit", { code: "*" })]);

	assert.equal(wpkg.getCommandExitCodeAction(withAny, "1603"), "success");
	assert.equal(wpkg.getCommandExitCodeAction(withStar, "1603"), "success");
});

test("getCommandExitCodeAction() prefers the exact exit code over the catch all entry", function () {
	const install = xml("install", { cmd: "setup.exe" }, [
		xml("exit", { code: "any" }),
		xml("exit", { code: "3010", reboot: "true" }),
	]);

	assert.equal(wpkg.getCommandExitCodeAction(install, "3010"), "reboot");
	assert.equal(wpkg.getCommandExitCodeAction(install, "0"), "success");
});

test("getPackageCmd() collects the commands of the requested type", function () {
	const packageNode = xml("package", { id: "firefox" }, [
		xml("install", { cmd: "setup.exe /S" }),
		xml("install", { cmd: "firefox-policy.cmd" }),
		xml("remove", { cmd: "uninstall.exe /S" }),
	]);

	assert.deepEqual(
		commandsOf(wpkg, wpkg.getPackageCmdInstall(packageNode, null)),
		["setup.exe /S", "firefox-policy.cmd"]
	);
	assert.deepEqual(
		commandsOf(wpkg, wpkg.getPackageCmdRemove(packageNode, null)),
		["uninstall.exe /S"]
	);
});

test("getPackageCmd() also reads the commands element", function () {
	const packageNode = xml("package", { id: "firefox" }, [
		xml("install", { cmd: "setup.exe /S" }),
		xml("commands", {}, [
			xml("command", { type: "install", cmd: "firefox-policy.cmd" }),
			xml("command", { type: "remove", cmd: "uninstall.exe /S" }),
		]),
	]);

	assert.deepEqual(
		commandsOf(wpkg, wpkg.getPackageCmdInstall(packageNode, null)),
		["setup.exe /S", "firefox-policy.cmd"]
	);
});

test("getPackageCmd() expands a command which includes another command type", function () {
	// The usual way to say "upgrade like install".
	const packageNode = xml("package", { id: "firefox" }, [
		xml("install", { cmd: "setup.exe /S" }),
		xml("upgrade", { include: "install" }),
	]);

	assert.deepEqual(
		commandsOf(wpkg, wpkg.getPackageCmdUpgrade(packageNode, null)),
		["setup.exe /S"]
	);
});

test("getPackageCmd() refuses a recursive inclusion", function () {
	const packageNode = xml("package", { id: "firefox" }, [
		xml("install", { include: "upgrade" }),
		xml("upgrade", { include: "install" }),
	]);

	assert.throws(
		function () {
			wpkg.getPackageCmdInstall(packageNode, null);
		},
		/Recursive inclusion detected/
	);
});

test("getPackageCmd() skips commands which do not apply to the host", function () {
	const wpkgX64 = loadForHost({ hostname: "ws-042", architecture: "x64" });
	const packageNode = xml("package", { id: "firefox" }, [
		xml("install", { cmd: "setup-x64.exe /S", architecture: "x64" }),
		xml("install", { cmd: "setup-x86.exe /S", architecture: "x86" }),
	]);

	assert.deepEqual(
		commandsOf(wpkgX64, wpkgX64.getPackageCmdInstall(packageNode, null)),
		["setup-x64.exe /S"]
	);
});

test("getPackageCmd() needs a package and a command type", function () {
	assert.equal(wpkg.getPackageCmd(null, "install", null), null);
	assert.equal(wpkg.getPackageCmd(xml("package", { id: "firefox" }), null, null), null);
	assert.equal(wpkg.getPackageCmd(xml("package", { id: "firefox" }), "", null), null);
});
