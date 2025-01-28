import { AnchorHTMLAttributes, ElementType, Fragment, FunctionComponent, JSX, PropsWithChildren, type ReactElement } from 'react';

const Components = {
	'': 'em',
	_: 'strong',
	'*': 'strong',
	'~': 's',
	'\n': 'br',
	' ': 'br',
	'-': 'hr'
} as const;

/** Outdent a string based on the first indented line's leading whitespace
 *	@private
 */
function outdent(str: string) {
	return str.replace(RegExp('^' + (str.match(/^(\t| )+/) || '')[0], 'gm'), '');
}

/** Encode special attribute characters to HTML entities in a String.
 *	@private
 */
function encodeAttr(str: string) {
	return (str + '').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

const isBlockLevel = (node: ReactElement | string | undefined) => {
	return node && typeof node !== 'string' && ['div', 'ul', 'ol', 'pre'].includes(node.type as string);
}

type Children = (ReactElement | string)[];
type ReactElementWithChildren = ReactElement<{ children: Children }>;
const makeReactElement = (Component: string | FunctionComponent, children: Children = [], props: object = {}) => {
	return {
		$$typeof: Symbol.for('react.element'),
		type: Component,
		props: { ...props, children },
		key: null
	} as ReactElementWithChildren;
}

/** Parse Markdown into an HTML String. */
export default function parse(md: string, prevLinks: Record<string, string> = {}): ReactElementWithChildren {
	let tokenizer = /((?:^|\n+)(?:\n---+|\* \*(?: \*)+)\n)|(?:^``` *(\w*)\n([\s\S]*?)\n```$)|((?:(?:^|\n+)(?:\t|  {2,}).+)+\n*)|((?:(?:^|\n)([>*+-]|\d+\.)\s+.*)+)|(?:!\[([^\]]*?)\]\(([^)]+?)\))|(\[)|(\](?:\(([^)]+?)\))?)|(?:(?:^|\n+)([^\s].*)\n(-{3,}|={3,})(?:\n+|$))|(?:(?:^|\n+)(#{1,6})\s*(.+)(?:\n+|$))|(?:`([^`].*?)`)|(  \n\n*|\n{2,}|__|\*\*|[_*]|~~)/gm;

	let links: Record<string, string> = { ...prevLinks };

	md = md.replace(/^\[(.+?)\]:\s*(.+)$/gm, (s, name, url) => {
		links[name.toLowerCase()] = url;
		return '';
	}).replace(/^\n+|\n+$/g, '');

	let last = 0;

	const rootNode = makeReactElement(Fragment);
	let currentNode = rootNode;
	let context: ReactElementWithChildren[] = [currentNode];
	let token: RegExpMatchArray | null;

	const pushNode = (
		Component: string | FunctionComponent,
		children: Children = [],
		props: object = {},
		/** if keep open, the next tokens will be added to the node we just pushed */
		keepOpen: boolean = true) => {
		const newNode = makeReactElement(Component, children, props);
		if (keepOpen) context.push(newNode);
		currentNode.props.children = (currentNode.props.children || []).concat(newNode);
		if (keepOpen) currentNode = newNode;

		return newNode;
	}
	const closeNode = (Component: string | FunctionComponent) => {
		const closesIndex = context.findIndex((node) => node.type === Component);
		context = context.slice(0, closesIndex + 1);
		currentNode = context[context.length - 1];
	}

	while ((token = tokenizer.exec(md))) {
		// everything from the end of teh last token to the start of this one
		const prev = md.substring(last, token.index);
		last = tokenizer.lastIndex;
		let t: string;

		if (prev !== '')
			currentNode.props.children.push(prev);

		if (prev.match(/[^\\](\\\\)*\\$/)) {
			// escaped
		}
		// Code/Indent blocks:
		else if (t = (token[3] || token[4])) {
			chunk = '<pre class="code ' + (token[4] ? 'poetry' : token[2].toLowerCase()) + '"><code' + (token[2] ? ` class="language-${token[2].toLowerCase()}"` : '') + '>' + outdent(encodeAttr(t).replace(/^\n+|\n+$/g, '')) + '</code></pre>';
		}
		// > Quotes, -* lists:
		// token[5] is all the (multi-line) bullets and text like: '* text 1\n* text 2'
		// token[6] is the bullet like '*', '-', '+', '1.'
		else if (token[6]) {
			const bullet = token[6] as '*' | '-' | '+' | `${number}.`;
			const isNumbered = !!bullet.match(/\./);
			const listTag = isNumbered ? 'ol' : 'ul';

			// note that ul/ol can only be direct children of the root node:
			const listEle = makeReactElement(
				listTag,
				token[5]
					.split('\n')
					// remove bullets
					.map(l => l.replace(/^(\*|-|\+|\d+\.)\s+/, ''))
					.map(mdLine => makeReactElement('li', parse(mdLine).props.children)),
				{}
			);
			rootNode.props.children.push(listEle);
			context = [rootNode, listEle];
			currentNode = rootNode;
		}
		// Images:
		// token[8] is src
		// token[7] is alt text
		else if (token[8]) {
			pushNode('img', [], { src: token[8], alt: token[7] }, false);
		}
		// Closing Links:
		// token[10] is '](url)'
		// token[11] is the url
		else if (token[10]) {
			const linkEle = context.find((node) => node.type === 'a') as ReactElement<{ href: string }> | undefined;
			if (linkEle) {
				linkEle.props.href = token[11];
			}
		}
		// Opening links:
		// token[9] is opening of the link '['
		else if (token[9]) {
			pushNode('a');
		}
		// # Headings/titles:
		// token[14] is #,##,### etc from the heading
		// token[15] is the text of the heading after '#' etc
		// token[12] is the text of the heading on the line before '==='
		// token[13] is '===' (on the line below the text)
		else if (token[14]) {
			const tagName = 'h' + token[14].length;
			pushNode(tagName, parse(token[15]).props.children, {}, false);
		}
		else if (token[13]) {
			pushNode('h1', parse(token[12]).props.children, {}, false);
		}
		// `code`:
		else if (token[16]) {
			chunk = '<code>' + encodeAttr(token[16]) + '</code>';
		}
		// Inline formatting: *em*, **strong** & friends
		// token[17] is the inline formatting character '*', '**', '_', '__' etc
		//		OR a paragarph break: '\n\n" or ' \n'
		else if (token[17] === '\n\n' || token[17] === '  \n') {
			// paragraphs can only occur at index 1 of the context path:
			const hasParagraphOpen: boolean = context[1]?.type === 'div';
			if (!hasParagraphOpen) {

				const rootChildren = rootNode.props.children;
				let lastBlockLevelIndex;
				for (lastBlockLevelIndex = rootChildren.length - 1; lastBlockLevelIndex >= 0; lastBlockLevelIndex--) {
					if (isBlockLevel(rootChildren[lastBlockLevelIndex])) {
						break;
					}
				}

				// if there are contents before the \n\n that aren't already block level, put them
				// into a div:
				if (lastBlockLevelIndex !== rootNode.props.children.length - 1) {
					const scoopedUpPreviousContent = rootNode.props.children.splice(lastBlockLevelIndex + 1)
					rootNode.props.children.push(makeReactElement('div', scoopedUpPreviousContent, { className: 'paragraph' }));
				}
			}

			const openingPara = makeReactElement('div', [], { className: 'paragraph' });
			rootNode.props.children.push(openingPara);
			context = [rootNode, openingPara];
			currentNode = openingPara;
		}
		else if (token[17]) {
			const components = {
				'**': 'strong',
				'__': 'strong',
				'*': 'em',
				'_': 'em'
			}
			const Component = components[(token[17]) as keyof typeof components];
			const closesIndex = context.findIndex((node) => node.type === Component);
			if (closesIndex === -1) {
				pushNode(Component);
			} else {
				closeNode(Component);
			}
		}
	}

	// push the text after all token - either to the root node or the current paragraph:
	(currentNode.type === 'div' ? currentNode : rootNode).props.children.push(md.substring(last));

	return rootNode;
}
