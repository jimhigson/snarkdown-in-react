import {
  type FunctionComponent,
  type ReactElement,
  Fragment,
  Children,
  PropsWithChildren,
} from "react";

const defaultComponents = {
  "": Fragment,
  pre: "pre" as
    | string
    | FunctionComponent<PropsWithChildren<Record<any, never>>>,
  code: "code" as string | FunctionComponent<{ language: string }>,
  ol: "ol" as string | FunctionComponent<PropsWithChildren<Record<any, never>>>,
  ul: "ul" as string | FunctionComponent<PropsWithChildren<Record<any, never>>>,
  hr: "hr" as string | FunctionComponent<PropsWithChildren<Record<any, never>>>,
  blockquote: "blockquote" as
    | string
    | FunctionComponent<PropsWithChildren<Record<any, never>>>,
  li: "li" as string | FunctionComponent<PropsWithChildren<Record<any, never>>>,
  a: "a" as string | FunctionComponent<PropsWithChildren<{ href: string }>>,
  img: "img" as string | FunctionComponent<{ src: string; alt: string }>,
  h1: "h1" as string | FunctionComponent<PropsWithChildren<Record<any, never>>>,
  h2: "h2" as string | FunctionComponent<PropsWithChildren<Record<any, never>>>,
  h3: "h3" as string | FunctionComponent<PropsWithChildren<Record<any, never>>>,
  h4: "h4" as string | FunctionComponent<PropsWithChildren<Record<any, never>>>,
  h5: "h5" as string | FunctionComponent<PropsWithChildren<Record<any, never>>>,
  h6: "h6" as string | FunctionComponent<PropsWithChildren<Record<any, never>>>,
  p: "p" as string | FunctionComponent<PropsWithChildren<Record<any, never>>>,
  em: "em" as string | FunctionComponent<PropsWithChildren<Record<any, never>>>,
  strong: "strong" as
    | string
    | FunctionComponent<PropsWithChildren<Record<any, never>>>,
} as const;

export type CustomComponentsOption = Partial<typeof defaultComponents>;

/** Outdent a string based on the first indented line's leading whitespace
 *	@private
 */
const outdent = (str: string) => {
  return str.replace(RegExp("^" + (str.match(/^(\t| )+/) || "")[0], "gm"), "");
};

const isBlockLevel = (node: ASTNode | string | undefined) => {
  return (
    node &&
    typeof node !== "string" &&
    ["div", "ul", "ol", "pre", "h1", "h2", "h3", "h4", "h5", "h6"].includes(
      node.t as string,
    )
  );
};

/** 
 * trims string s, but if there is whitespace at the start or end, leave a single 
 * space in place of multiple whitespace chars
 */
const trimReduce = (s: string) => {

  return s.replace(/^\s+|\s+$/g, ' ');
};

/**
 * because react elements (created with React.createElement) are immutable, use
 * a different representation that we can modify in-place. Converted to real
 * react elements at the end.
 */
export type ASTNode = {
  /** type */
  t: keyof typeof defaultComponents;
  /** children */
  c: Children;
  /** props */
  p: Record<string, string>;
};
type Children = (ASTNode | string)[];
const createAstNode = (
  type: keyof typeof defaultComponents,
  children: Children | ASTNode | string = [],
  props: Record<string, string> = {},
): ASTNode => {
  return {
    t: type,
    c: Array.isArray(children) ? children : [children],
    p: props,
  };
};

export const parseImpl = (md: string, isTopLevel = false): ASTNode => {
  // original snarkdown unreadable regex :-)
  let tokenizer =
    /((?:^|\n+)(?:\n---+|\* \*(?: \*)+)\n)|(?:^``` *(\w*)\n([\s\S]*?)\n```$)|((?:(?:^|\n+)(?:\t|  {2,}).+)+\n*)|((?:(?:^|\n)([>*+-]|\d+\.)\s+.*)+)|(?:!\[([^\]]*?)\]\(([^)]+?)\))|(\[)|(\](?:\(([^)]+?)\))?)|(?:(?:^|\n+)([^\s].*)\n(-{3,}|={3,})(?:\n+|$))|(?:(?:^|\n+)(#{1,6})\s*(.+)(?:\n+|$))|(?:`([^`].*?)`)|(  \n\n*|\n{2,}|__|\*\*|[_*]|~~)/gm;

  let last = 0;

  const rootNode = createAstNode("");

  let currentNode: ASTNode;
  let contextPath: ASTNode[];
  if (isTopLevel) {
    currentNode = createAstNode("p");
    contextPath = [rootNode, currentNode];
    rootNode.c.push(currentNode);
  } else {
    currentNode = rootNode;
    contextPath = [rootNode];
  }
  // all nodes on the path from the root down to the current node:

  let token: RegExpMatchArray | null;

  const pushNode = (
    node: ASTNode,
    /** if keep open, the next tokens will be added to the node we just pushed */
    keepOpen: boolean = true,
  ) => {
    if (keepOpen) contextPath.push(node);

    currentNode.c.push(node);

    if (keepOpen) currentNode = node;

    return node;
  };

  const closeNode = (Component: string | FunctionComponent) => {
    const closesIndex = contextPath.findIndex((node) => node.t === Component);
    contextPath = contextPath.slice(0, closesIndex);
    currentNode = contextPath.at(-1)!;
  };

  while ((token = tokenizer.exec(md))) {
    // everything from the end of teh last token to the start of this one
    const prev = md.substring(last, token.index);
    last = tokenizer.lastIndex;

    if (prev !== "") {
      if (currentNode === rootNode && isTopLevel) {
        // if we're at the root node, we can't add text directly to it, so create a paragraph:
        const p = createAstNode("p", trimReduce(prev));
        rootNode.c.push(p);
        contextPath = [rootNode, p];
        currentNode = p;
      } else {
        currentNode.c.push(trimReduce(prev));
      }
    }

    if (prev.match(/[^\\](\\\\)*\\$/)) {
      // escaped
    }
    // Code/Indent blocks:
    // token[2] is language given after backticks like ```this
    // token[3] is the content inside the backticks ```
    // token[4] is the content of block indented with \t, including the \t
    else if (token[3] || token[4]) {
      const preNode = createAstNode(
        "pre",
        token[4] ?
          outdent(token[4])
          : createAstNode(
            "code",
            outdent(token[3]),
            token[2] ? { language: `language-${token[2].toLowerCase()}` } : {},
          ),
      );
      rootNode.c.push(preNode);
      contextPath = [rootNode];
      currentNode = rootNode;
    }
    // > Blockquotes, -* lists:
    // token[5] is all the (multi-line) bullets and text like: '* text 1\n* text 2'
    // token[6] is the bullet like '*', '-', '+', '1.'
    else if (token[6]) {
      const bullet = token[6] as "*" | "-" | "+" | ">" | `${number}.`;
      const isList = bullet !== ">";
      const isNumbered = !!bullet.match(/\./);
      const listTag =
        isList ?
          isNumbered ? "ol"
            : "ul"
          : "blockquote";

      const lines = token[5]
        .split("\n")
        // remove bullets
        .map((l) => l.replace(/^(\*|-|\+|>|\d+\.)\s+/, ""));
      // note that ul/ol can only be direct children of the root node:
      const listEle = createAstNode(
        listTag,
        isList ?
          lines.map((mdLine) => createAstNode("li", parseImpl(mdLine).c))
          // blockquotes can have lists inside them, so parse again with the > removed, as a single string:
          : parseImpl(lines.join("\n")).c,
      );
      rootNode.c.push(listEle);
      contextPath = [rootNode, listEle];
      currentNode = rootNode;
    }
    // Images:
    // token[8] is src
    // token[7] is alt text
    else if (token[8]) {
      const imgNode = createAstNode("img", [], {
        src: token[8],
        ...(token[7] ? { alt: token[7] } : {}),
      });

      if (isTopLevel && currentNode === rootNode) {
        const pNode = createAstNode("p", imgNode);
        rootNode.c.push(pNode);
        currentNode = pNode;
        contextPath = [rootNode, pNode];
      } else {
        pushNode(imgNode, false);
      }
    }
    // Closing Links:
    // token[10] is '](url)'
    // token[11] is the url
    else if (token[10]) {
      const linkEle = contextPath.find((node) => node.t === "a");
      if (linkEle) {
        linkEle.p.href = token[11];
      }
    }
    // Opening links:
    // token[9] is opening of the link '['
    else if (token[9]) {
      pushNode(createAstNode("a"));
    }
    // # Headings/titles:
    // token[14] is #,##,### etc from the heading
    // token[15] is the text of the heading after '#' etc
    // token[12] is the text of the heading on the line before '==='
    // token[13] is '===' (on the line below the text)
    else if (token[14]) {
      const tagName = ("h" + token[14].length) as `h${1 | 2 | 3 | 4 | 5 | 6}`;
      rootNode.c.push(createAstNode(tagName, parseImpl(token[15]).c));
      contextPath = [rootNode];
      currentNode = rootNode;
    } else if (token[13]) {
      rootNode.c.push(createAstNode("h1", parseImpl(token[12]).c));
      contextPath = [rootNode];
      currentNode = rootNode;
    }
    // `inline code`:
    // token[16] is the text inside the backticks
    else if (token[16]) {
      // no need to encode
      pushNode(createAstNode("code", token[16]), false);
    }
    // Inline formatting: *em*, **strong** & friends
    // token[17] is the inline formatting character '*', '**', '_', '__' etc
    //		OR a paragarph break: '\n\n" or ' \n'
    else if (token[17]?.[0] === "\n" || token[17] === "  \n") {
      // paragraphs can only occur at index 1 of the context path:
      const hasParagraphOpen: boolean = contextPath[1]?.t === "p";
      if (!hasParagraphOpen) {
        const rootChildren = rootNode.c;
        let lastBlockLevelIndex;
        for (
          lastBlockLevelIndex = rootChildren.length - 1;
          lastBlockLevelIndex >= 0;
          lastBlockLevelIndex--
        ) {
          if (isBlockLevel(rootChildren[lastBlockLevelIndex])) {
            break;
          }
        }

        // if there are contents before the \n\n that aren't already block level, put them
        // into a div:
        if (lastBlockLevelIndex !== rootNode.c.length - 1) {
          const scoopedUpPreviousContent = rootNode.c.splice(
            lastBlockLevelIndex + 1,
          );
          rootNode.c.push(createAstNode("p", scoopedUpPreviousContent));
        }
      }

      const openingPara = createAstNode("p");
      rootNode.c.push(openingPara);
      contextPath = [rootNode, openingPara];
      currentNode = openingPara;
    }
    // token[1] is horizontal rule \n\n---\n
    else if (token[1]) {
      pushNode(createAstNode("hr"), false);
    } else if (token[17]) {
      /** token[17] is *, **, _, __ for strong/em */
      const tag = token[17].length === 2 ? "strong" : "em";
      const closesIndex = contextPath.findIndex((node) => node.t === tag);
      if (closesIndex === -1) {
        pushNode(createAstNode(tag));
      } else {
        closeNode(tag);
      }
    }
  }

  // push the text after all token - either to the root node or the last paragraph:
  // v- if there is any more text left to push:
  const remaining = trimReduce(md.substring(last));
  if (remaining.length) {
    const lastChildOfRoot = rootNode.c.at(-1);
    let insertTo: ASTNode;
    if ((lastChildOfRoot as ASTNode | undefined)?.t === "p") {
      insertTo = lastChildOfRoot as ASTNode;
    } else if (isTopLevel) {
      insertTo = createAstNode("p");
      rootNode.c.push(insertTo);
    } else {
      insertTo = rootNode;
    }

    insertTo.c.push(remaining);
  }

  // filter out empty paragraphs (when creating a paragraph, there's no way to know if it will
  // get content or not
  rootNode.c = rootNode.c.filter(
    (child) =>
      typeof child === "string" || child.t !== "p" || child.c?.length > 0,
  );

  // convert our mutable react elements
  return rootNode;
};

export const parse = (
  md: string,
  customComponents: CustomComponentsOption = {},
): ReactElement => {
  const components = { ...defaultComponents, ...customComponents };

  const convert = (n: ASTNode, i: number = 0): ReactElement => {
    const Component = (
      n.t === "" ?
        Fragment
        : components[n.t]) as FunctionComponent<PropsWithChildren<any>>;

    return (
      <Component {...n.p} key={i}>
        {n.c.length === 0 ?
          undefined
          : n.c.map((c, i) => (typeof c === "string" ? c : convert(c, i)))}
      </Component>
    );
  };

  return convert(parseImpl(md, true));
};

// the component version:
export const SnarkdownInReact = ({
  markdown,
  customComponents,
}: {
  markdown: string;
  customComponents?: CustomComponentsOption;
}): ReactElement => {
  return parse(markdown, customComponents);
};
