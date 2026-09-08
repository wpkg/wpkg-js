/*
 * Behaviour of the small helpers wpkg.js is built from.
 *
 * None of them touches Windows, but they carry assumptions the rest of the
 * script relies on: host attributes are trimmed before they are matched,
 * package lists are deduplicated before they are applied and the variable
 * dictionaries are merged with a defined precedence.
 */

const test = require("node:test");
const assert = require("node:assert/strict");

const { loadWpkg, argumentVector, DictionaryStub } = require("./harness.js");

const wpkg = loadWpkg();

test("trim() removes leading and trailing whitespace", function () {
	assert.equal(wpkg.trim("  1.0  "), "1.0");
	assert.equal(wpkg.trim("1.0  "), "1.0");
	assert.equal(wpkg.trim("  1.0"), "1.0");
	assert.equal(wpkg.trim("1.0"), "1.0");
});

test("trim() keeps the whitespace inside the string", function () {
	// WMI reports the model as "LENOVO, ThinkPad T480   ", the host
	// definitions match it including its inner spaces.
	assert.equal(wpkg.trim("  LENOVO, ThinkPad T480   "), "LENOVO, ThinkPad T480");
});

test("trim() passes a missing value through", function () {
	assert.equal(wpkg.trim(null), null);
});

test("trimLeadingZeroes() normalizes an LCID", function () {
	// The locale identifiers are compared as strings, "0407" and "407" have
	// to end up as the same value.
	assert.equal(wpkg.trimLeadingZeroes("0407"), "407");
	assert.equal(wpkg.trimLeadingZeroes("407"), "407");
	assert.equal(wpkg.trimLeadingZeroes("000"), "");
	assert.equal(wpkg.trimLeadingZeroes(null), null);
});

test("trimLeadingZeroes() keeps zeroes which are not leading", function () {
	assert.equal(wpkg.trimLeadingZeroes("100"), "100");
	assert.equal(wpkg.trimLeadingZeroes("0100"), "100");
});

test("uniqueArray() keeps the first occurrence of every element", function () {
	assert.deepEqual(
		Array.from(wpkg.uniqueArray(["firefox", "thunderbird", "firefox", "java"])),
		["firefox", "thunderbird", "java"]
	);
	assert.deepEqual(Array.from(wpkg.uniqueArray([])), []);
});

test("searchArray() reports whether an element is contained", function () {
	assert.equal(wpkg.searchArray(["firefox", "java"], "java"), true);
	assert.equal(wpkg.searchArray(["firefox", "java"], "openoffice"), false);
	assert.equal(wpkg.searchArray([], "firefox"), false);
});

test("concatenateList() appends the second list to the first one", function () {
	assert.deepEqual(
		Array.from(wpkg.concatenateList(["firefox"], ["java", "openoffice"])),
		["firefox", "java", "openoffice"]
	);
});

test("concatenateList() does not modify the lists passed in", function () {
	const first = ["firefox"];
	const second = ["java"];
	wpkg.concatenateList(first, second);

	assert.deepEqual(first, ["firefox"]);
	assert.deepEqual(second, ["java"]);
});

test("concatenateDictionary() lets the second dictionary win", function () {
	// Variables are merged package first, then profile, then host: the later
	// definition has to override the earlier one.
	const packageVariables = new DictionaryStub();
	packageVariables.Add("PKG_VERSION", "5.0");
	packageVariables.Add("SOFTWARE", "\\\\server\\software");

	const hostVariables = new DictionaryStub();
	hostVariables.Add("SOFTWARE", "\\\\branch-server\\software");

	const merged = wpkg.concatenateDictionary(packageVariables, hostVariables);

	assert.deepEqual(merged.keys().toArray(), ["PKG_VERSION", "SOFTWARE"]);
	assert.equal(merged.Item("PKG_VERSION"), "5.0");
	assert.equal(merged.Item("SOFTWARE"), "\\\\branch-server\\software");
});

test("concatenateDictionary() does not modify the dictionaries passed in", function () {
	const first = new DictionaryStub();
	first.Add("SOFTWARE", "\\\\server\\software");
	const second = new DictionaryStub();
	second.Add("SOFTWARE", "\\\\branch-server\\software");

	wpkg.concatenateDictionary(first, second);

	assert.equal(first.Item("SOFTWARE"), "\\\\server\\software");
	assert.equal(second.Item("SOFTWARE"), "\\\\branch-server\\software");
});

test("isArgSet() finds a switch within the argument vector", function () {
	const argv = argumentVector(["/synchronize", "/quiet"]);

	assert.equal(wpkg.isArgSet(argv, "/synchronize"), true);
	assert.equal(wpkg.isArgSet(argv, "/quiet"), true);
	assert.equal(wpkg.isArgSet(argv, "/debug"), false);
	assert.equal(wpkg.isArgSet(argumentVector([]), "/synchronize"), false);
});

test("hex() formats an error number the way the log expects it", function () {
	assert.equal(wpkg.hex(0), "0");
	assert.equal(wpkg.hex(255), "ff");
	assert.equal(wpkg.hex(3010), "bc2");
});

test("hex() formats the negative error numbers reported by WSH", function () {
	// JScript reports COM errors as signed 32 bit values, they have to be
	// printed as the unsigned HRESULT everybody looks up.
	assert.equal(wpkg.hex(-2147217406), "80041002");
	assert.equal(wpkg.hex(-1), "ffffffff");
});
