/*
 * Behaviour of parseISODate().
 *
 * Package definitions schedule themselves with install-date and
 * uninstall-date attributes and checks of type "date" compare against one.
 * The attributes may be truncated to any precision, so the parser has to turn
 * "2026-03" into a range: its beginning (ceil = false) and its end
 * (ceil = true). A package installed from "2026-03" therefore starts on the
 * first of March, while one removed at "2026-03" is removed until the first
 * of April.
 */

const test = require("node:test");
const assert = require("node:assert/strict");

const { loadWpkg } = require("./harness.js");

const wpkg = loadWpkg();

/**
 * Local time is the reference: WPKG runs on a workstation and compares the
 * parsed date with its own clock.
 */
function local(year, month, day, hour, minute, second) {
	return new Date(year, month - 1, day, hour || 0, minute || 0, second || 0, 0).getTime();
}

test("parseISODate() reads a full timestamp", function () {
	assert.equal(
		wpkg.parseISODate("2026-03-15T10:30:15", false).getTime(),
		local(2026, 3, 15, 10, 30, 15)
	);
});

test("parseISODate() accepts a date without separators", function () {
	assert.equal(wpkg.parseISODate("20260315", false).getTime(), local(2026, 3, 15));
});

test("parseISODate() reads a truncated date as the beginning of its range", function () {
	assert.equal(wpkg.parseISODate("2026", false).getTime(), local(2026, 1, 1));
	assert.equal(wpkg.parseISODate("2026-03", false).getTime(), local(2026, 3, 1));
	assert.equal(wpkg.parseISODate("2026-03-15", false).getTime(), local(2026, 3, 15));
	assert.equal(wpkg.parseISODate("2026-03-15T10:30", false).getTime(), local(2026, 3, 15, 10, 30));
});

test("parseISODate() reads a truncated date as the end of its range", function () {
	// The end of the range is the beginning of the next one: everything
	// within the range is smaller than the value returned.
	assert.equal(wpkg.parseISODate("2026", true).getTime(), local(2027, 1, 1));
	assert.equal(wpkg.parseISODate("2026-03", true).getTime(), local(2026, 4, 1));
	assert.equal(wpkg.parseISODate("2026-03-15", true).getTime(), local(2026, 3, 16));
	assert.equal(wpkg.parseISODate("2026-03-15T10:30", true).getTime(), local(2026, 3, 15, 10, 31));
});

test("parseISODate() encloses a truncated date between its two readings", function () {
	// This is the way the callers use the two modes, see the example in the
	// function header.
	const beginning = wpkg.parseISODate("2026-03", false).getTime();
	const end = wpkg.parseISODate("2026-03", true).getTime();
	const within = local(2026, 3, 15, 12, 0, 0);

	assert.ok(beginning <= within && within < end);
});

test("parseISODate() converts a timestamp given in UTC", function () {
	assert.equal(
		wpkg.parseISODate("2026-03-15T10:30:15Z", false).getTime(),
		Date.UTC(2026, 2, 15, 10, 30, 15)
	);
});

test("parseISODate() converts a timestamp given with a time zone offset", function () {
	assert.equal(
		wpkg.parseISODate("2026-03-15T10:30:15+02:00", false).getTime(),
		Date.UTC(2026, 2, 15, 8, 30, 15)
	);
	assert.equal(
		wpkg.parseISODate("2026-03-15T10:30:15-05:00", false).getTime(),
		Date.UTC(2026, 2, 15, 15, 30, 15)
	);
});

test("parseISODate() falls back to the current year", function () {
	const currentYear = new Date().getFullYear();

	assert.equal(wpkg.parseISODate(null, false).getTime(), local(currentYear, 1, 1));
});
