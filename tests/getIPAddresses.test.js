/*
 * Behaviour of getIPAddresses().
 *
 * WPKG assigns profiles by matching the addresses of the host against the
 * host definitions. Windows keeps the last address of a network adapter in
 * the registry even after the adapter has been disconnected, so the addresses
 * read from the registry have to be restricted to the adapters which are
 * currently connected.
 */

const test = require("node:test");
const assert = require("node:assert/strict");

const { loadWpkg } = require("./harness.js");

const NET_CARDS = "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\NetworkCards\\";
const NET_INTERFACES = "HKLM\\SYSTEM\\CurrentControlSet\\Services\\Tcpip\\Parameters\\Interfaces\\";

/**
 * Emulates a SAFEARRAY as returned by WScript.Shell.RegRead for REG_MULTI_SZ
 * values.
 */
function multiString(values) {
	return {
		toArray: function () {
			return values;
		},
	};
}

/**
 * Builds a fake machine.
 *
 * Every adapter is described by:
 *   name       - display name, only used for readable failure messages
 *   guid       - interface GUID as reported by WMI, "null" for adapters not
 *                exposing the property (Windows XP / 2003)
 *   registered - GUID as written to the registry, defaults to "guid"
 *   connected  - true if the adapter currently has a link
 *   dhcp       - address leased via DHCP, implies EnableDHCP = 1
 *   fixed      - array of statically configured addresses
 *
 * @param {object} [options]
 * @param {boolean} [options.wmiAvailable] set to false to simulate a machine
 *        where the adapter state cannot be queried.
 * @returns {object} the loaded wpkg.js context, ready to be called.
 */
function fakeMachine(adapters, options) {
	const opts = options || {};
	const wmiAvailable = opts.wmiAvailable !== false;
	const queries = [];

	const registry = {};
	adapters.forEach(function (adapter, index) {
		const registered = adapter.registered || adapter.guid;
		registry[NET_CARDS + (index + 1) + "\\ServiceName"] = registered;

		const regBase = NET_INTERFACES + registered + "\\";
		// A readable key returns an empty string instead of null.
		registry[regBase] = "";
		if (adapter.dhcp !== undefined) {
			registry[regBase + "EnableDHCP"] = 1;
			registry[regBase + "DhcpIPAddress"] = adapter.dhcp;
		} else {
			registry[regBase + "EnableDHCP"] = 0;
			registry[regBase + "IPAddress"] = multiString(adapter.fixed || []);
		}
	});

	const context = loadWpkg({
		getObject: function (moniker) {
			if (!wmiAvailable) {
				throw new Error("WMI is not available on this machine: " + moniker);
			}
			return {
				ExecQuery: function (query) {
					queries.push(query);
					const wantsConnected = /NetConnectionStatus\s*=\s*2/i.test(query);
					return adapters
						.filter(function (adapter) {
							return !wantsConnected || adapter.connected;
						})
						.map(function (adapter) {
							return {
								Name: adapter.name,
								NetConnectionStatus: adapter.connected ? 2 : 0,
								get GUID() {
									if (adapter.guid === null) {
										// Property is missing on old Windows
										// releases, WMI raises an error.
										throw new Error("Not supported: GUID");
									}
									return adapter.guid;
								},
							};
						});
				},
			};
		},
	});

	context.getRegistrySubkeys = function () {
		return adapters.map(function (adapter, index) {
			return String(index + 1);
		});
	};
	context.getRegistryValue = function (registryPath) {
		const value = registry[registryPath];
		return value === undefined ? null : value;
	};

	context.wmiQueries = queries;
	return context;
}

/**
 * Copies the addresses out of the script context. Arrays created inside the vm
 * realm have a different prototype and would never be deep-strict-equal to an
 * array created by the test itself.
 */
function addressesOf(wpkg) {
	return Array.from(wpkg.getIPAddresses());
}

test("getIPAddresses() ignores addresses cached for disconnected adapters", function () {
	const wpkg = fakeMachine([
		{ name: "Ethernet", guid: "{LAN}", connected: true, dhcp: "10.0.1.15" },
		{ name: "Wireless", guid: "{WIFI}", connected: false, dhcp: "192.168.50.20" },
	]);

	assert.deepEqual(addressesOf(wpkg), ["10.0.1.15"]);
});

test("getIPAddresses() returns the address of every connected adapter", function () {
	const wpkg = fakeMachine([
		{ name: "Ethernet", guid: "{LAN}", connected: true, dhcp: "10.0.1.15" },
		{ name: "Wireless", guid: "{WIFI}", connected: true, dhcp: "10.0.2.30" },
	]);

	assert.deepEqual(addressesOf(wpkg), ["10.0.1.15", "10.0.2.30"]);
});

test("getIPAddresses() matches the interface GUID regardless of its case", function () {
	const wpkg = fakeMachine([
		{ name: "Ethernet", guid: "{a1b2c3}", registered: "{A1B2C3}", connected: true, dhcp: "10.0.1.15" },
	]);

	assert.deepEqual(addressesOf(wpkg), ["10.0.1.15"]);
});

test("getIPAddresses() ignores the placeholder address of an adapter without lease", function () {
	const wpkg = fakeMachine([
		{ name: "Ethernet", guid: "{LAN}", connected: true, dhcp: "10.0.1.15" },
		{ name: "Wireless", guid: "{WIFI}", connected: true, dhcp: "0.0.0.0" },
	]);

	assert.deepEqual(addressesOf(wpkg), ["10.0.1.15"]);
});

test("getIPAddresses() returns the static addresses of connected adapters", function () {
	const wpkg = fakeMachine([
		{ name: "Ethernet", guid: "{LAN}", connected: true, fixed: ["10.0.1.15", "10.0.1.16", "0.0.0.0"] },
		{ name: "Wireless", guid: "{WIFI}", connected: false, fixed: ["192.168.50.20"] },
	]);

	assert.deepEqual(addressesOf(wpkg), ["10.0.1.15", "10.0.1.16"]);
});

test("getIPAddresses() returns no address if no adapter is connected", function () {
	const wpkg = fakeMachine([
		{ name: "Wireless", guid: "{WIFI}", connected: false, dhcp: "192.168.50.20" },
	]);

	assert.deepEqual(addressesOf(wpkg), []);
});

test("getIPAddresses() asks WMI only for connected adapters", function () {
	const wpkg = fakeMachine([
		{ name: "Ethernet", guid: "{LAN}", connected: true, dhcp: "10.0.1.15" },
	]);
	wpkg.getIPAddresses();

	assert.equal(wpkg.wmiQueries.length, 1);
	assert.match(wpkg.wmiQueries[0], /Win32_NetworkAdapter/i);
	assert.match(wpkg.wmiQueries[0], /NetConnectionStatus\s*=\s*2/i);
});

test("getIPAddresses() keeps every configured address if WMI cannot be queried", function () {
	const wpkg = fakeMachine(
		[
			{ name: "Ethernet", guid: "{LAN}", connected: true, dhcp: "10.0.1.15" },
			{ name: "Wireless", guid: "{WIFI}", connected: false, dhcp: "192.168.50.20" },
		],
		{ wmiAvailable: false }
	);

	assert.deepEqual(addressesOf(wpkg), ["10.0.1.15", "192.168.50.20"]);
});

test("getIPAddresses() keeps every configured address if adapters expose no GUID", function () {
	const wpkg = fakeMachine([
		{ name: "Ethernet", guid: null, registered: "{LAN}", connected: true, dhcp: "10.0.1.15" },
		{ name: "Wireless", guid: null, registered: "{WIFI}", connected: false, dhcp: "192.168.50.20" },
	]);

	assert.deepEqual(addressesOf(wpkg), ["10.0.1.15", "192.168.50.20"]);
});

test("getIPAddresses() caches its result until the host information cache is reset", function () {
	const wpkg = fakeMachine([
		{ name: "Ethernet", guid: "{LAN}", connected: true, dhcp: "10.0.1.15" },
	]);

	assert.deepEqual(addressesOf(wpkg), ["10.0.1.15"]);
	assert.equal(wpkg.wmiQueries.length, 1);

	wpkg.getIPAddresses();
	assert.equal(wpkg.wmiQueries.length, 1, "cached result must not query WMI again");

	wpkg.resetHostInformationCache();
	wpkg.getIPAddresses();
	assert.equal(wpkg.wmiQueries.length, 2, "reset cache has to re-read the adapter state");
});
