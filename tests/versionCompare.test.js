/*
 * Behaviour of versionCompare().
 *
 * The revision of a package decides whether WPKG installs, upgrades or
 * downgrades it, so this comparison is the most safety-relevant piece of pure
 * logic in wpkg.js. The cases below are the ones documented in the function
 * header plus the "volatile" release markers (release candidates, milestones,
 * betas), which have to sort BEFORE the plain release of the same number.
 */

const test = require("node:test");
const assert = require("node:assert/strict");

const { loadWpkg } = require("./harness.js");

const B_NEWER = -1;
const EQUAL = 0;
const A_NEWER = 1;

const wpkg = loadWpkg();

/**
 * Asserts the result of a comparison and, at the same time, that the reverse
 * comparison delivers the opposite result. A comparison which is not
 * symmetric would make the install decision depend on the order of the
 * arguments.
 */
function assertCompare(a, b, expected) {
	assert.equal(
		wpkg.versionCompare(a, b),
		expected,
		"versionCompare(" + JSON.stringify(a) + ", " + JSON.stringify(b) + ")"
	);
	assert.equal(
		wpkg.versionCompare(b, a),
		-expected,
		"versionCompare(" + JSON.stringify(b) + ", " + JSON.stringify(a) + ")"
	);
}

test("versionCompare() compares plain numbers by value, not alphabetically", function () {
	assertCompare("1", "2", B_NEWER);
	assertCompare("9", "10", B_NEWER);
	assertCompare("1", "15", B_NEWER);
	assertCompare("0.9", "1.0", B_NEWER);
});

test("versionCompare() compares the version parts from left to right", function () {
	assertCompare("1.0", "1.2.b", B_NEWER);
	assertCompare("2011.07.03", "2011.07.04", B_NEWER);
	assertCompare("3.0", "3.0.1", B_NEWER);
	assertCompare("1.0.0", "1.0.0.1", B_NEWER);
});

test("versionCompare() treats missing and zero parts as equal", function () {
	assert.equal(wpkg.versionCompare("1", "1.0"), EQUAL);
	assert.equal(wpkg.versionCompare("1", "1.0.00.0000"), EQUAL);
	assert.equal(wpkg.versionCompare("1.35.1", "1.35.1.0"), EQUAL);
	assert.equal(wpkg.versionCompare("1.35-2", "1.35-2.0"), EQUAL);
	assert.equal(wpkg.versionCompare("1.2.3", "1.2.3"), EQUAL);
});

test("versionCompare() ignores leading zeroes within a version part", function () {
	assert.equal(wpkg.versionCompare("1.02", "1.2"), EQUAL);
	assert.equal(wpkg.versionCompare("2011.07.03", "2011.7.3"), EQUAL);
});

test("versionCompare() reads a build suffix as an additional version part", function () {
	assertCompare("1.35", "1.35-2", B_NEWER);
	assertCompare("1.35-2", "1.36", B_NEWER);
	assertCompare("1.35R3", "1.36", B_NEWER);
	assertCompare("1.35R3", "1.36R4", B_NEWER);
});

test("versionCompare() sorts a volatile release before its final release", function () {
	// A release candidate, a milestone or a beta is older than the release
	// carrying the same number.
	assertCompare("1.3RC2", "1.3", B_NEWER);
	assertCompare("1.0beta", "1.0", B_NEWER);
	assertCompare("1.0alpha", "1.0", B_NEWER);
	assertCompare("1.0pre", "1.0", B_NEWER);
	assertCompare("1.5I3656", "1.5", B_NEWER);
	assertCompare("1.5M3656", "1.5", B_NEWER);
});

test("versionCompare() sorts an unknown suffix after the plain release", function () {
	// "u" is not a volatile marker, an update release is newer than the
	// release it updates.
	assertCompare("1.5", "1.5u3656", B_NEWER);
	assertCompare("1.0", "1.0patch1", B_NEWER);
});

test("versionCompare() compares equally named volatile releases by their number", function () {
	assertCompare("1.0alpha1", "1.0alpha2", B_NEWER);
	assertCompare("1.3RC1", "1.3RC2", B_NEWER);
});

test("versionCompare() shortcuts identical version strings", function () {
	assert.equal(wpkg.versionCompare("1.0RC1", "1.0RC1"), EQUAL);
	assert.equal(wpkg.versionCompare("", ""), EQUAL);
});

test("versionCompare() is used to decide about upgrade and downgrade", function () {
	// Sanity check of the contract the callers rely on: a positive value
	// means the installed revision is newer than the one offered by the
	// package database, which triggers a downgrade.
	assert.equal(wpkg.versionCompare("2.0", "1.0"), A_NEWER);
	assert.equal(wpkg.versionCompare("1.0", "2.0"), B_NEWER);
});
