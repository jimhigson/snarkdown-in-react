import {
  type FunctionComponent,
  type ReactElement,
  Fragment,
  Children,
  useMemo,
  PropsWithChildren,
} from "react";

/** Outdent a string based on the first indented line's leading whitespace
 *	@private
 */
function outdent(str: string) {
  return str.replace(RegExp("^" + (str.match(/^(\t| )+/) || "")[0], "gm"), "");
}

const isBlockLevel = (node: ReactLikeElement | string | undefined) => {
  return (
    node &&
    typeof node !== "string" &&
    ["div", "ul", "ol", "pre", "h1", "h2", "h3", "h4", "h5", "h6"].includes(
      node.type as string
    )
  );
};

/**
 * because react elements (created with React.createElement) are immutable, use
 * a different representation that we can modify in-place. Converted to real
 * react elements at the end.
 */
export type ReactLikeElement = {
  type: string | FunctionComponent<PropsWithChildren<object>>;
  children: Children;
  props: Record<string, string>;
};
type Children = (ReactLikeElement | string)[];
const createReactLikeElement = (
  type: string | FunctionComponent<PropsWithChildren<object>>,
  children: Children | ReactLikeElement | string = [],
  props: Record<string, string> = {}
): ReactLikeElement => {
  return {
    type,
    children: Array.isArray(children) ? children : [children],
    props,
  };
};

export const parseImpl = (md: string): ReactLikeElement => {
  // original snarkdown unreadable regex :-)
  let tokenizer =
    /((?:^|\n+)(?:\n---+|\* \*(?: \*)+)\n)|(?:^``` *(\w*)\n([\s\S]*?)\n```$)|((?:(?:^|\n+)(?:\t|  {2,}).+)+\n*)|((?:(?:^|\n)([>*+-]|\d+\.)\s+.*)+)|(?:!\[([^\]]*?)\]\(([^)]+?)\))|(\[)|(\](?:\(([^)]+?)\))?)|(?:(?:^|\n+)([^\s].*)\n(-{3,}|={3,})(?:\n+|$))|(?:(?:^|\n+)(#{1,6})\s*(.+)(?:\n+|$))|(?:`([^`].*?)`)|(  \n\n*|\n{2,}|__|\*\*|[_*]|~~)/gm;

  let last = 0;

  const rootNode = createReactLikeElement("");
  let currentNode = rootNode;
  // all nodes on the path from the root down to the current node:
  let contextPath: ReactLikeElement[] = [currentNode];
  let token: RegExpMatchArray | null;

  const pushNode = (
    node: ReactLikeElement,
    /** if keep open, the next tokens will be added to the node we just pushed */
    keepOpen: boolean = true
  ) => {
    if (keepOpen) contextPath.push(node);

    currentNode.children.push(node);

    if (keepOpen) currentNode = node;

    return node;
  };

  const closeNode = (Component: string | FunctionComponent) => {
    const closesIndex = contextPath.findIndex(
      (node) => node.type === Component
    );
    contextPath = contextPath.slice(0, closesIndex);
    currentNode = contextPath.at(-1)!;
  };

  while ((token = tokenizer.exec(md))) {
    // everything from the end of teh last token to the start of this one
    const prev = md.substring(last, token.index);
    last = tokenizer.lastIndex;

    if (prev !== "") currentNode.children.push(prev);

    if (prev.match(/[^\\](\\\\)*\\$/)) {
      // escaped
    }
    // Code/Indent blocks:
    // token[2] is language given after backticks like ```this
    // token[3] is the content inside the backticks ```
    // token[4] is the content of block indented with \t, including the \t
    else if (token[3] || token[4]) {
      pushNode(
        createReactLikeElement(
          "pre",
          token[4]
            ? outdent(token[4])
            : createReactLikeElement(
                "code",
                outdent(token[3]),
                token[2]
                  ? { language: `language-${token[2].toLowerCase()}` }
                  : {}
              )
        ),
        false
      );
    }
    // > Blockquotes, -* lists:
    // token[5] is all the (multi-line) bullets and text like: '* text 1\n* text 2'
    // token[6] is the bullet like '*', '-', '+', '1.'
    else if (token[6]) {
      const bullet = token[6] as "*" | "-" | "+" | ">" | `${number}.`;
      const isList = bullet !== ">";
      const isNumbered = !!bullet.match(/\./);
      const listTag = isList ? (isNumbered ? "ol" : "ul") : "blockquote";

      const lines = token[5]
        .split("\n")
        // remove bullets
        .map((l) => l.replace(/^(\*|-|\+|>|\d+\.)\s+/, ""));
      // note that ul/ol can only be direct children of the root node:
      const listEle = createReactLikeElement(
        listTag,
        isList
          ? lines.map((mdLine) =>
              createReactLikeElement("li", parseImpl(mdLine).children)
            )
          : // blockquotes can have lists inside them, so parse again with the > removed, as a single string:
            parseImpl(lines.join("\n")).children,
        {}
      );
      rootNode.children.push(listEle);
      contextPath = [rootNode, listEle];
      currentNode = rootNode;
    }
    // Images:
    // token[8] is src
    // token[7] is alt text
    else if (token[8]) {
      pushNode(
        createReactLikeElement("img", [], { src: token[8], alt: token[7] }),
        false
      );
    }
    // Closing Links:
    // token[10] is '](url)'
    // token[11] is the url
    else if (token[10]) {
      const linkEle = contextPath.find((node) => node.type === "a") as
        | ReactElement<{ href: string }>
        | undefined;
      if (linkEle) {
        linkEle.props.href = token[11];
      }
    }
    // Opening links:
    // token[9] is opening of the link '['
    else if (token[9]) {
      pushNode(createReactLikeElement("a"));
    }
    // # Headings/titles:
    // token[14] is #,##,### etc from the heading
    // token[15] is the text of the heading after '#' etc
    // token[12] is the text of the heading on the line before '==='
    // token[13] is '===' (on the line below the text)
    else if (token[14]) {
      const tagName = "h" + token[14].length;
      pushNode(
        createReactLikeElement(tagName, parseImpl(token[15]).children),
        false
      );
    } else if (token[13]) {
      pushNode(
        createReactLikeElement("h1", parseImpl(token[12]).children),
        false
      );
    }
    // `inline code`:
    // token[16] is the text inside the backticks
    else if (token[16]) {
      // no need to encode
      pushNode(createReactLikeElement("code", token[16]), false);
    }
    // Inline formatting: *em*, **strong** & friends
    // token[17] is the inline formatting character '*', '**', '_', '__' etc
    //		OR a paragarph break: '\n\n" or ' \n'
    else if (token[17] === "\n\n" || token[17] === "  \n") {
      // paragraphs can only occur at index 1 of the context path:
      const hasParagraphOpen: boolean = contextPath[1]?.type === "div";
      if (!hasParagraphOpen) {
        const rootChildren = rootNode.children;
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
        if (lastBlockLevelIndex !== rootNode.children.length - 1) {
          const scoopedUpPreviousContent = rootNode.children.splice(
            lastBlockLevelIndex + 1
          );
          rootNode.children.push(
            createReactLikeElement("div", scoopedUpPreviousContent, {
              className: "paragraph",
            })
          );
        }
      }

      const openingPara = createReactLikeElement("div", [], {
        className: "paragraph",
      });
      rootNode.children.push(openingPara);
      contextPath = [rootNode, openingPara];
      currentNode = openingPara;
    }
    // token[1] is horizontal rule \n\n---\n
    else if (token[1]) {
      pushNode(createReactLikeElement("hr"), false);
    } else if (token[17]) {
      const components = {
        "**": "strong",
        __: "strong",
        "*": "em",
        _: "em",
      };
      const Component = components[token[17] as keyof typeof components];
      const closesIndex = contextPath.findIndex(
        (node) => node.type === Component
      );
      if (closesIndex === -1) {
        pushNode(createReactLikeElement(Component));
      } else {
        closeNode(Component);
      }
    }
  }

  // push the text after all token - either to the root node or the last paragraph:
  const lastChildOfRoot = rootNode.children.at(-1);
  (
    (lastChildOfRoot?.type === "div"
      ? lastChildOfRoot
      : rootNode) as ReactLikeElement
  ).children.push(md.substring(last));

  // filter out empty paragraphs (when creating a paragraph, there's no way to know if it will
  // get content or not
  rootNode.children = rootNode.children.filter(
    (child) =>
      typeof child === "string" ||
      child.type !== "div" ||
      child.children?.length > 0
  );

  // convert our mutable react elements
  return rootNode;
};

export const parse = (md: string): ReactElement => {
  const convert = (rl: ReactLikeElement, i: number = 0): ReactElement => {
    const Component = rl.type === "" ? Fragment : rl.type;
    return (
      <Component {...rl.props} key={i}>
        {rl.children.map((c, i) => (typeof c === "string" ? c : convert(c, i)))}
      </Component>
    );
  };

  return convert(parseImpl(md));
};

// the component version:
export const SnarkdownInReact = ({ markdown }: { markdown: string }) => {
  return useMemo(() => parse(markdown), [markdown]);
};
