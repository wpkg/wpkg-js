/*
 * Behaviour of checkHostAttribute().
 *
 * Every extended host attribute of a host, profile or package node ends up
 * here: <host os="..." makemodel="..." serial="..." /> and friends. The value
 * of the attribute is a regular expression, except for the "lcid" attributes,
 * which take a comma separated list, and for "environment", which takes
 * name=value pairs joined by a pipe.
 */

const test = require("node:test");
const assert = require("node:assert/strict");

const { loadWpkg, DictionaryStub } = require("./harness.js");

/**
 * Builds a host with the given attributes.
 *
 * @param {object} attributes host information as getHostInformation() would
 *        report it, arrays for the multi-valued attributes.
 * @param {object} [environment] environment variables of the host.
 * @returns {object} the loaded wpkg.js context.
 */
function fakeHost(attributes, environment) {
	const wpkg = loadWpkg({ environment: environment || {} });

	const hostInformation = new DictionaryStub();
	Object.keys(attributes).forEach(function (name) {
		hostInformation.Add(name, attributes[name]);
	});

	wpkg.getHostInformation = function () {
		return hostInformation;
	};

	return wpkg;
}

const WORKSTATION = {
	hostname: "ws-042",
	architecture: "x64",
	os: "Microsoft Windows 10 Pro, 10.0.19045",
	makemodel: "LENOVO, ThinkPad T480",
	serial: "PF1A2B3C",
	macaddresses: ["00:1A:2B:3C:4D:5E", "00:1A:2B:3C:4D:5F"],
	ipaddresses: ["10.0.1.42", "192.168.56.1"],
	domainname: "example.local",
	groups: ["Domain Computers", "Workstations"],
	lcid: "407",
	lcidOS: "409",
};

test("checkHostAttribute() matches a single valued attribute as a regular expression", function () {
	const wpkg = fakeHost(WORKSTATION);

	assert.equal(wpkg.checkHostAttribute("hostname", "ws-0[0-9]{2}"), true);
	assert.equal(wpkg.checkHostAttribute("hostname", "srv-.+"), false);
});

test("checkHostAttribute() matches without regard to case", function () {
	const wpkg = fakeHost(WORKSTATION);

	assert.equal(wpkg.checkHostAttribute("hostname", "WS-042"), true);
	assert.equal(wpkg.checkHostAttribute("makemodel", "lenovo, thinkpad t4.+"), true);
});

test("checkHostAttribute() matches the make and model reported by the BIOS", function () {
	const wpkg = fakeHost(WORKSTATION);

	assert.equal(wpkg.checkHostAttribute("makemodel", "LENOVO, ThinkPad T480"), true);
	assert.equal(wpkg.checkHostAttribute("makemodel", "^LENOVO, ThinkPad T480$"), true);
	assert.equal(wpkg.checkHostAttribute("makemodel", "Dell Inc\\., .+"), false);
});

test("checkHostAttribute() matches the serial number reported by the BIOS", function () {
	const wpkg = fakeHost(WORKSTATION);

	assert.equal(wpkg.checkHostAttribute("serial", "^PF1A2B3C$"), true);
	assert.equal(wpkg.checkHostAttribute("serial", "^PF1A2B3D$"), false);
});

test("checkHostAttribute() matches if any value of a multi valued attribute matches", function () {
	const wpkg = fakeHost(WORKSTATION);

	assert.equal(wpkg.checkHostAttribute("ipaddresses", "10\\.0\\.1\\..+"), true);
	assert.equal(wpkg.checkHostAttribute("ipaddresses", "192\\.168\\.56\\.1"), true);
	assert.equal(wpkg.checkHostAttribute("ipaddresses", "172\\.16\\..+"), false);

	assert.equal(wpkg.checkHostAttribute("macaddresses", "^00:1A:2B:3C:4D:5F$"), true);
	assert.equal(wpkg.checkHostAttribute("macaddresses", "^AA:BB:.+"), false);

	assert.equal(wpkg.checkHostAttribute("groups", "^Workstations$"), true);
	assert.equal(wpkg.checkHostAttribute("groups", "^Servers$"), false);
});

test("checkHostAttribute() does not match an attribute the host does not report", function () {
	const wpkg = fakeHost({ hostname: "ws-042", serial: null, macaddresses: [] });

	assert.equal(wpkg.checkHostAttribute("serial", ".+"), false);
	assert.equal(wpkg.checkHostAttribute("macaddresses", ".+"), false);
	assert.equal(wpkg.checkHostAttribute("domainname", ".+"), false);
});

test("checkHostAttribute() refuses an incomplete match definition", function () {
	const wpkg = fakeHost(WORKSTATION);

	assert.equal(wpkg.checkHostAttribute(null, "ws-042"), false);
	assert.equal(wpkg.checkHostAttribute("hostname", null), false);
});

test("checkHostAttribute() expands environment variables within the expression", function () {
	const wpkg = fakeHost(WORKSTATION, { SITE: "ws-042" });

	assert.equal(wpkg.checkHostAttribute("hostname", "%SITE%"), true);
	assert.equal(wpkg.checkHostAttribute("hostname", "%UNDEFINED_SITE%"), false);
});

test("checkHostAttribute() accepts a list of locale identifiers", function () {
	const wpkg = fakeHost(WORKSTATION);

	assert.equal(wpkg.checkHostAttribute("lcid", "407"), true);
	assert.equal(wpkg.checkHostAttribute("lcid", "409,407,c07"), true);
	assert.equal(wpkg.checkHostAttribute("lcid", "409,c07"), false);

	assert.equal(wpkg.checkHostAttribute("lcidOS", "409"), true);
	assert.equal(wpkg.checkHostAttribute("lcidOS", "407"), false);
});

test("checkHostAttribute() normalizes the locale identifiers of the list", function () {
	const wpkg = fakeHost(WORKSTATION);

	// Leading zeroes and spaces around the entries are not significant.
	assert.equal(wpkg.checkHostAttribute("lcid", "0407"), true);
	assert.equal(wpkg.checkHostAttribute("lcid", "409, 0407"), true);
});

test("checkHostAttribute() matches an environment variable against its value", function () {
	const wpkg = fakeHost(WORKSTATION, { WPKG_SITE: "branch-office", PROCESSOR_LEVEL: "6" });

	assert.equal(wpkg.checkHostAttribute("environment", "WPKG_SITE=branch-office"), true);
	assert.equal(wpkg.checkHostAttribute("environment", "WPKG_SITE=branch-.+"), true);
	assert.equal(wpkg.checkHostAttribute("environment", "WPKG_SITE=head-office"), false);
});

test("checkHostAttribute() requires every environment condition to match", function () {
	const wpkg = fakeHost(WORKSTATION, { WPKG_SITE: "branch-office", PROCESSOR_LEVEL: "6" });

	assert.equal(wpkg.checkHostAttribute("environment", "WPKG_SITE=branch-office|PROCESSOR_LEVEL=6"), true);
	assert.equal(wpkg.checkHostAttribute("environment", "WPKG_SITE=branch-office|PROCESSOR_LEVEL=9"), false);
});

test("checkHostAttribute() compares an undefined environment variable to an empty value", function () {
	const wpkg = fakeHost(WORKSTATION, {});

	// The variable is not defined, so only an expression which also matches
	// the empty string can succeed.
	assert.equal(wpkg.checkHostAttribute("environment", "WPKG_SITE=^$"), true);
	assert.equal(wpkg.checkHostAttribute("environment", "WPKG_SITE=branch-office"), false);
});
