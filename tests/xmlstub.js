/*
 * Minimal replacement for the MSXML DOM nodes wpkg.js works with.
 *
 * wpkg.js reads its package, profile and host definitions through a handful of
 * DOM methods only: getAttribute(), attributes, childNodes plus the two XPath
 * selectors. Instead of pulling in an XML parser the tests build the nodes
 * directly, which keeps the expected structure visible in the test itself.
 *
 * The XPath support is deliberately limited to the expressions used by
 * wpkg.js: a path of element names, each of them optionally carrying an
 * attribute predicate.
 *
 *   "install"                          every <install> child
 *   "exit[@code='3010']"               every <exit> child with code="3010"
 *   "commands/command[@type=\"install\"]"  the command nodes of a package
 */

// "name" or "name[@attribute='value']", both quote styles are accepted.
const XPATH_STEP_PATTERN = /^([\w:.-]+)(?:\[@([\w:.-]+)=(?:'([^']*)'|"([^"]*)")\])?$/;

/**
 * Attribute of an element. MSXML exposes both the DOM names (nodeName and
 * nodeValue) and the shorter ones used by wpkg.js, so the stub does the same.
 */
class AttributeStub {
	constructor(name, value) {
		this.name = name;
		this.value = value;
	}

	get nodeName() {
		return this.name;
	}

	get nodeValue() {
		return this.value;
	}
}

/**
 * Element node.
 *
 * @param {string} nodeName tag name without the namespace prefix, wpkg.js
 *        strips the prefixes while loading the XML files.
 * @param {object} [attributes] attribute names and values.
 * @param {Array<XmlNodeStub>} [children] child elements.
 */
class XmlNodeStub {
	constructor(nodeName, attributes, children) {
		this.nodeName = nodeName;
		this.attributeMap = new Map();
		this.childNodes = [];
		this.parentNode = null;

		const attrs = attributes || {};
		Object.keys(attrs).forEach((name) => {
			this.setAttribute(name, attrs[name]);
		});

		(children || []).forEach((child) => {
			this.appendChild(child);
		});
	}

	/**
	 * MSXML returns null for attributes which are not present, a lot of
	 * wpkg.js depends on that.
	 */
	getAttribute(name) {
		return this.attributeMap.has(name) ? this.attributeMap.get(name) : null;
	}

	setAttribute(name, value) {
		this.attributeMap.set(name, String(value));
	}

	removeAttribute(name) {
		this.attributeMap.delete(name);
	}

	appendChild(child) {
		child.parentNode = this;
		this.childNodes.push(child);
		return child;
	}

	removeChild(child) {
		const index = this.childNodes.indexOf(child);
		if (index >= 0) {
			this.childNodes.splice(index, 1);
			child.parentNode = null;
		}
		return child;
	}

	/**
	 * Attribute list. It is indexable like an array, carries a length and an
	 * item() accessor, which covers every way wpkg.js walks over it.
	 */
	get attributes() {
		const list = [];
		this.attributeMap.forEach((value, name) => {
			list.push(new AttributeStub(name, value));
		});
		list.item = (index) => list[index];
		return list;
	}

	selectNodes(xpath) {
		let selected = [this];

		xpath.split("/").forEach((step) => {
			const match = XPATH_STEP_PATTERN.exec(step);
			if (match === null) {
				throw new Error(
					"tests/xmlstub.js supports \"name\", \"name[@attribute='value']\" " +
					"and paths built from them only, got: " + xpath
				);
			}

			const nodeName = match[1];
			const attributeName = match[2];
			const attributeValue = match[3] !== undefined ? match[3] : match[4];

			const next = [];
			selected.forEach((node) => {
				node.childNodes.forEach((child) => {
					if (child.nodeName !== nodeName) {
						return;
					}
					if (attributeName !== undefined &&
						child.getAttribute(attributeName) !== attributeValue) {
						return;
					}
					next.push(child);
				});
			});
			selected = next;
		});

		return selected;
	}

	selectSingleNode(xpath) {
		const nodes = this.selectNodes(xpath);
		return nodes.length > 0 ? nodes[0] : null;
	}

	get xml() {
		const attributes = Array.from(this.attributeMap.entries())
			.map(([name, value]) => " " + name + "=\"" + value + "\"")
			.join("");
		if (this.childNodes.length === 0) {
			return "<" + this.nodeName + attributes + " />";
		}
		const children = this.childNodes.map((child) => child.xml).join("");
		return "<" + this.nodeName + attributes + ">" + children + "</" + this.nodeName + ">";
	}
}

/**
 * Shorthand for building a node tree.
 *
 *   xml("package", { id: "firefox" }, [xml("install", { cmd: "setup.exe" })])
 */
function xml(nodeName, attributes, children) {
	return new XmlNodeStub(nodeName, attributes, children);
}

module.exports = { xml, XmlNodeStub, AttributeStub };
