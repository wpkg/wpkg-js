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
 * Replacement for the "Scripting.Dictionary" automation object. wpkg.js uses
 * it for host attributes and for variable lists, so the stub has to behave
 * like the original one on the points the script relies on:
 *
 *   - Add() raises an error if the key is already present,
 *   - Remove() raises an error if the key is unknown,
 *   - Item() of an unknown key returns undefined (Empty in WSH),
 *   - keys() returns a SAFEARRAY, which is unwrapped by toArray().
 */
class DictionaryStub {
	constructor() {
		this.entries = new Map();
	}

	Add(key, value) {
		if (this.entries.has(key)) {
			throw new Error("This key is already associated with an element of this collection: " + key);
		}
		this.entries.set(key, value);
	}

	Remove(key) {
		if (!this.entries.has(key)) {
			throw new Error("Element not found: " + key);
		}
		this.entries.delete(key);
	}

	Exists(key) {
		return this.entries.has(key);
	}

	Item(key) {
		return this.entries.get(key);
	}

	get Count() {
		return this.entries.size;
	}

	keys() {
		const keys = Array.from(this.entries.keys());
		return { toArray: () => keys };
	}

	items() {
		const values = Array.from(this.entries.values());
		return { toArray: () => values };
	}
}

/**
 * Replacement for the parts of "WScript.Shell" which are used outside of the
 * command execution and registry code: environment expansion.
 *
 * Undefined variables are left untouched, exactly like the original object
 * does, wpkg.js depends on this to detect missing variables.
 *
 * @param {object} environment map of environment variable names to values.
 */
function createShellStub(environment) {
	return {
		environment: environment,
		ExpandEnvironmentStrings: function (value) {
			if (value === null || value === undefined) {
				return value;
			}
			return String(value).replace(/%([^%]+)%/g, function (placeholder, name) {
				const defined = Object.prototype.hasOwnProperty.call(environment, name);
				return defined ? environment[name] : placeholder;
			});
		},
		LogEvent: function () {
			// The event log is not part of any test.
		},
	};
}

/**
 * Creates the automation objects the harness knows about. Returns undefined
 * for every other ProgID so that the caller can decide what to do.
 */
function createDefaultActiveXObject(progID, environment) {
	switch (String(progID)) {
		case "Scripting.Dictionary":
			return new DictionaryStub();
		case "WScript.Shell":
			return createShellStub(environment);
		default:
			return undefined;
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
 *        whenever the script does "new ActiveXObject(...)". Returning
 *        undefined falls back to the objects the harness provides itself
 *        ("Scripting.Dictionary" and "WScript.Shell").
 * @param {object} [options.environment] environment variables visible to
 *        ExpandEnvironmentStrings().
 * @param {Array} [options.arguments] command line arguments, exposed as
 *        WScript.Arguments.
 * @returns {object} the vm context. It carries every wpkg.js global plus a
 *        "logMessages" array collecting everything the script logged.
 */
function loadWpkg(options) {
	const opts = options || {};
	const environment = opts.environment || {};

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
		environment: environment,
		Enumerator: EnumeratorStub,
		GetObject: opts.getObject || function (moniker) {
			throw new Error("Unexpected GetObject call: " + moniker);
		},
		ActiveXObject: function (progID) {
			if (opts.activeXObject) {
				const custom = opts.activeXObject(progID);
				if (custom !== undefined) {
					return custom;
				}
			}
			const builtin = createDefaultActiveXObject(progID, environment);
			if (builtin !== undefined) {
				return builtin;
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
			CreateObject: function (progID) {
				return context.ActiveXObject(progID);
			},
			Arguments: opts.arguments || [],
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

/**
 * Builds an argument vector which behaves like WScript.Arguments: the
 * arguments are read by calling the collection itself, argv(0), and not by
 * indexing it.
 *
 * @param {Array<string>} args
 * @returns {function} callable argument vector with a length property.
 */
function argumentVector(args) {
	const argv = function (index) {
		return args[index];
	};
	// The length of a function is read-only by default, it has to be
	// redefined to report the number of arguments.
	Object.defineProperty(argv, "length", { value: args.length });
	argv.Count = function () {
		return args.length;
	};
	return argv;
}

/**
 * Emulates a SAFEARRAY as returned by WScript.Shell.RegRead for REG_MULTI_SZ
 * values.
 */
function safeArray(values) {
	return {
		toArray: function () {
			return values;
		},
	};
}

module.exports = {
	loadWpkg,
	argumentVector,
	safeArray,
	DictionaryStub,
	EnumeratorStub,
};
