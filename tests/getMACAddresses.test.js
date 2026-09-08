/*
 * Behaviour of getMACAddresses().
 *
 * The macaddresses host attribute lets host definitions select a machine by
 * its hardware instead of by a name or an address. Windows reports a lot of
 * virtual adapters (tunnels, loopback, VPN clients), which are neither stable
 * nor unique, so only physical adapters may be reported.
 */

const test = require("node:test");
const assert = require("node:assert/strict");

const { loadWpkg } = require("./harness.js");

/**
 * Builds a machine with the given network adapters.
 *
 * Every adapter is described by:
 *   name     - display name, only used for readable failure messages
 *   mac      - MAC address as reported by WMI, "" for adapters without one
 *   physical - value of the PhysicalAdapter property
 *
 * @returns {object} the loaded wpkg.js context, extended by a wmiQueries
 *        array which records the queries the script sent.
 */
function fakeMachine(adapters) {
	const queries = [];

	const context = loadWpkg({
		getObject: function () {
			return {
				ExecQuery: function (query) {
					queries.push(query);
					return adapters.map(function (adapter) {
						return {
							Name: adapter.name,
							MACAddress: adapter.mac,
							PhysicalAdapter: adapter.physical,
						};
					});
				},
			};
		},
	});

	context.wmiQueries = queries;
	return context;
}

/**
 * Copies the addresses out of the script context, arrays of the vm realm are
 * never deep-strict-equal to an array built by the test.
 */
function addressesOf(wpkg) {
	return Array.from(wpkg.getMACAddresses());
}

test("getMACAddresses() reports the addresses of the physical adapters", function () {
	const wpkg = fakeMachine([
		{ name: "Ethernet", mac: "00:1A:2B:3C:4D:5E", physical: true },
		{ name: "Wireless", mac: "00:1A:2B:3C:4D:5F", physical: true },
	]);

	assert.deepEqual(addressesOf(wpkg), ["00:1A:2B:3C:4D:5E", "00:1A:2B:3C:4D:5F"]);
});

test("getMACAddresses() skips virtual adapters", function () {
	const wpkg = fakeMachine([
		{ name: "Ethernet", mac: "00:1A:2B:3C:4D:5E", physical: true },
		{ name: "VPN client", mac: "00:FF:FF:FF:FF:01", physical: false },
		{ name: "Teredo tunnel", mac: "00:FF:FF:FF:FF:02", physical: false },
	]);

	assert.deepEqual(addressesOf(wpkg), ["00:1A:2B:3C:4D:5E"]);
});

test("getMACAddresses() skips adapters without an address", function () {
	const wpkg = fakeMachine([
		{ name: "Ethernet", mac: "00:1A:2B:3C:4D:5E", physical: true },
		{ name: "Disabled adapter", mac: "", physical: true },
		{ name: "Adapter without address", mac: null, physical: true },
	]);

	assert.deepEqual(addressesOf(wpkg), ["00:1A:2B:3C:4D:5E"]);
});

test("getMACAddresses() reports an empty list if there is no physical adapter", function () {
	const wpkg = fakeMachine([{ name: "Teredo tunnel", mac: "00:FF:FF:FF:FF:02", physical: false }]);

	assert.deepEqual(addressesOf(wpkg), []);
});

test("getMACAddresses() caches its result until the host information cache is reset", function () {
	const wpkg = fakeMachine([{ name: "Ethernet", mac: "00:1A:2B:3C:4D:5E", physical: true }]);

	assert.deepEqual(addressesOf(wpkg), ["00:1A:2B:3C:4D:5E"]);
	assert.equal(wpkg.wmiQueries.length, 1);

	wpkg.getMACAddresses();
	assert.equal(wpkg.wmiQueries.length, 1, "cached result must not query WMI again");

	wpkg.resetHostInformationCache();
	wpkg.getMACAddresses();
	assert.equal(wpkg.wmiQueries.length, 2, "reset cache has to re-read the adapters");
});
