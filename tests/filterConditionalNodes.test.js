/*
 * Behaviour of filterConditionalNodes().
 *
 * This is the gate every host, profile, package, command, check and variable
 * node passes before it is applied: a node without host attributes always
 * applies, a node carrying host attributes applies only if all of them match
 * the current host, and a <condition> sub-node can additionally require a set
 * of checks to succeed.
 */

const test = require("node:test");
const assert = require("node:assert/strict");

const { loadWpkg, DictionaryStub } = require("./harness.js");
const { xml } = require("./xmlstub.js");

const WORKSTATION = {
	hostname: "ws-042",
	architecture: "x64",
	os: "Microsoft Windows 10 Pro",
	makemodel: "LENOVO, ThinkPad T480",
	serial: "PF1A2B3C",
	macaddresses: ["00:1A:2B:3C:4D:5E"],
	ipaddresses: ["10.0.1.42"],
	domainname: "example.local",
	groups: ["Workstations"],
	lcid: "407",
	lcidOS: "409",
};

/**
 * Loads wpkg.js for a host described by the given attributes.
 */
function fakeHost(attributes) {
	const wpkg = loadWpkg();

	const hostInformation = new DictionaryStub();
	const hostAttributes = attributes || WORKSTATION;
	Object.keys(hostAttributes).forEach(function (name) {
		hostInformation.Add(name, hostAttributes[name]);
	});
	wpkg.getHostInformation = function () {
		return hostInformation;
	};

	return wpkg;
}

/**
 * Returns the id attribute of the nodes which passed the filter. The result
 * array is created inside the vm realm and has to be copied first.
 */
function idsOf(nodes) {
	return Array.from(nodes, function (node) {
		return node.getAttribute("id");
	});
}

test("filterConditionalNodes() keeps nodes without host attributes", function () {
	const wpkg = fakeHost();
	const nodes = [
		xml("package", { id: "firefox", "package-id": "firefox" }),
		xml("package", { id: "java", "package-id": "java" }),
	];

	assert.deepEqual(idsOf(wpkg.filterConditionalNodes(nodes, true)), ["firefox", "java"]);
});

test("filterConditionalNodes() keeps a node whose host attributes match", function () {
	const wpkg = fakeHost();
	const nodes = [
		xml("host", { id: "branch", ipaddresses: "10\\.0\\.1\\..+" }),
		xml("host", { id: "head-office", ipaddresses: "10\\.0\\.9\\..+" }),
	];

	assert.deepEqual(idsOf(wpkg.filterConditionalNodes(nodes, true)), ["branch"]);
});

test("filterConditionalNodes() requires every host attribute of a node to match", function () {
	const wpkg = fakeHost();
	const nodes = [
		xml("host", { id: "both", os: "Microsoft Windows 10.+", architecture: "x64" }),
		xml("host", { id: "wrong-architecture", os: "Microsoft Windows 10.+", architecture: "x86" }),
	];

	assert.deepEqual(idsOf(wpkg.filterConditionalNodes(nodes, true)), ["both"]);
});

test("filterConditionalNodes() ignores attributes which are not host attributes", function () {
	const wpkg = fakeHost();
	// "package-id", "revision" and "cmd" carry no host information, they must
	// not take part in the match.
	const nodes = [xml("package", { id: "firefox", "package-id": "firefox", revision: "115.2" })];

	assert.deepEqual(idsOf(wpkg.filterConditionalNodes(nodes, true)), ["firefox"]);
});

test("filterConditionalNodes() can stop at the first matching node", function () {
	const wpkg = fakeHost();
	const nodes = [
		xml("host", { id: "specific", hostname: "ws-042" }),
		xml("host", { id: "catch-all", hostname: ".+" }),
	];

	assert.deepEqual(idsOf(wpkg.filterConditionalNodes(nodes, false)), ["specific"]);
	assert.deepEqual(idsOf(wpkg.filterConditionalNodes(nodes, true)), ["specific", "catch-all"]);
});

test("filterConditionalNodes() returns all matches if the mode is not specified", function () {
	const wpkg = fakeHost();
	const nodes = [
		xml("host", { id: "specific", hostname: "ws-042" }),
		xml("host", { id: "catch-all", hostname: ".+" }),
	];

	assert.deepEqual(idsOf(wpkg.filterConditionalNodes(nodes)), ["specific", "catch-all"]);
});

test("filterConditionalNodes() accepts an empty node list", function () {
	const wpkg = fakeHost();

	assert.deepEqual(idsOf(wpkg.filterConditionalNodes([], true)), []);
	assert.deepEqual(idsOf(wpkg.filterConditionalNodes(null, true)), []);
});

test("filterConditionalNodes() drops a node whose condition does not match", function () {
	const wpkg = fakeHost();
	// The checks themselves are covered by the check tests, here only their
	// verdict matters.
	wpkg.checkAll = function (checkNodes) {
		return checkNodes.length > 0 && checkNodes[0].getAttribute("path") === "%SystemRoot%\\present.txt";
	};

	const nodes = [
		xml("package", { id: "matching" }, [
			xml("condition", {}, [
				xml("check", { type: "logical", condition: "exists", path: "%SystemRoot%\\present.txt" }),
			]),
		]),
		xml("package", { id: "not-matching" }, [
			xml("condition", {}, [
				xml("check", { type: "logical", condition: "exists", path: "%SystemRoot%\\missing.txt" }),
			]),
		]),
	];

	assert.deepEqual(idsOf(wpkg.filterConditionalNodes(nodes, true)), ["matching"]);
});

test("filterConditionalNodes() requires every condition of a node to match", function () {
	const wpkg = fakeHost();
	const evaluated = [];
	wpkg.checkAll = function (checkNodes) {
		const path = checkNodes[0].getAttribute("path");
		evaluated.push(path);
		return path === "first";
	};

	const nodes = [
		xml("package", { id: "two-conditions" }, [
			xml("condition", {}, [xml("check", { path: "first" })]),
			xml("condition", {}, [xml("check", { path: "second" })]),
		]),
	];

	assert.deepEqual(idsOf(wpkg.filterConditionalNodes(nodes, true)), []);
	assert.deepEqual(evaluated, ["first", "second"]);
});
