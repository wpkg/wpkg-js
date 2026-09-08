/*
 * Test harness for wpkg.js.
 *
 * wpkg.js is a Windows Script Host (JScript) program: every function lives in
 * the global scope and the script bootstraps itself by calling main() while it
 * is being evaluated. To unit test single functions on any platform the
 * harness evaluates the script inside a Node.js vm context with the bootstrap
 * call removed and with stubs for the WSH globals (WScript, ActiveXObject,
 * GetObject, Enumerator).
 *
 * Because wpkg.js functions are plain global declarations, a test may replace
 * any of them on the returned context (for example getRegistryValue) and the
 * production code will call the replacement.
 */

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const WPKG_PATH = path.join(__dirname, "..", "wpkg.js");

// The self-executing block at the end of the declarations section of wpkg.js.
// It has to be removed, otherwise loading the script would run the whole
// program instead of just declaring its functions.
// wpkg.js is stored with CRLF line endings, so the pattern has to tolerate the
// carriage returns.
const BOOTSTRAP_PATTERN = /\r?\ntry \{\r?\n\tmain\(\);\r?\n\} catch \(e\) \{[\s\S]*?\r?\n\}\r?\n/;

/**
 * Minimal replacement for the JScript Enumerator object. It only has to walk
 * over the plain arrays returned by the WMI stubs.
 */
class EnumeratorStub {
	constructor(collection) {
		this.items = collection === null || collection === undefined ? [] : Array.from(collection);
		this.index = 0;
	}

	atEnd() {
		return this.index >= this.items.length;
	}

	item() {
		return this.items[this.index];
	}

	moveNext() {
		this.index++;
	}
}

/**
 * Reads wpkg.js, strips the bootstrap call and evaluates the remaining
 * declarations in a fresh context.
 *
 * @param {object} [options]
 * @param {function} [options.getObject] replacement for the WSH GetObject
 *        function, receives the moniker string.
 * @param {function} [options.activeXObject] factory called with the ProgID
 *        whenever the script does "new ActiveXObject(...)".
 * @returns {object} the vm context. It carries every wpkg.js global plus a
 *        "logMessages" array collecting everything the script logged.
 */
function loadWpkg(options) {
	const opts = options || {};

	const source = fs.readFileSync(WPKG_PATH, "utf8");
	if (!BOOTSTRAP_PATTERN.test(source)) {
		throw new Error(
			"Bootstrap block of wpkg.js not found. The harness has to be " +
			"adjusted before the script can be loaded without running main()."
		);
	}
	const declarations = source.replace(BOOTSTRAP_PATTERN, "\n// bootstrap removed by tests/harness.js\n");

	const logMessages = [];

	const context = {
		logMessages: logMessages,
		Enumerator: EnumeratorStub,
		GetObject: opts.getObject || function (moniker) {
			throw new Error("Unexpected GetObject call: " + moniker);
		},
		ActiveXObject: function (progID) {
			if (opts.activeXObject) {
				return opts.activeXObject(progID);
			}
			throw new Error("Unexpected ActiveXObject: " + progID);
		},
		WScript: {
			Echo: function (message) {
				logMessages.push(String(message));
			},
			Quit: function (code) {
				throw new Error("WScript.Quit(" + code + ")");
			},
			Arguments: [],
			ScriptFullName: "C:\\wpkg\\wpkg.js",
			Interactive: false,
		},
	};

	vm.createContext(context);
	vm.runInContext(declarations, context, { filename: "wpkg.js" });

	// Logging is not the subject of these tests and the real implementation
	// needs a filesystem plus an event log, so collect the messages instead.
	context.log = function (level, message) {
		logMessages.push(level + ": " + message);
	};

	return context;
}

module.exports = { loadWpkg, EnumeratorStub };
