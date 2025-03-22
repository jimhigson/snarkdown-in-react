import { describe, it, expect, test } from "vitest";
import { ASTNode, parse as snarkdown } from "./snarkdown-in-react";
import { PropsWithChildren, ReactElement, ReactNode } from "react";

describe("text formatting", () => {
  it("parses bold with **", () => {
    expect(snarkdown("I **like** tiny libraries")).toMatchInlineSnapshot(`
      <React.Fragment>
        <p>
          I 
          <strong>
            like
          </strong>
           tiny libraries
        </p>
      </React.Fragment>
    `);
  });

  it("parses bold with __", () => {
    expect(snarkdown("I __like__ tiny libraries")).to.toMatchInlineSnapshot(`
      <React.Fragment>
        <p>
          I 
          <strong>
            like
          </strong>
           tiny libraries
        </p>
      </React.Fragment>
    `);
  });

  it("parses italics with *", () => {
    expect(snarkdown("I *like* tiny libraries")).to.toMatchInlineSnapshot(`
      <React.Fragment>
        <p>
          I 
          <em>
            like
          </em>
           tiny libraries
        </p>
      </React.Fragment>
    `);
  });

  it("parses two italics on a line", () => {
    expect(snarkdown("I *like* really *tiny* libraries")).to
      .toMatchInlineSnapshot(`
        <React.Fragment>
          <p>
            I 
            <em>
              like
            </em>
             really 
            <em>
              tiny
            </em>
             libraries
          </p>
        </React.Fragment>
      `);
  });

  it("parses italics with _", () => {
    expect(snarkdown("I _like_ tiny libraries")).to.toMatchInlineSnapshot(`
      <React.Fragment>
        <p>
          I 
          <em>
            like
          </em>
           tiny libraries
        </p>
      </React.Fragment>
    `);
  });

  it("can use custom elements for em", () => {
    expect(
      snarkdown("I _like_ __tiny__ libraries", {
        em: function customEm({ children }) {
          return <span className="em">{children}</span>;
        },
        strong: function customStrong({ children }) {
          return <span className="strong">{children}</span>;
        },
      }),
    ).to.toMatchInlineSnapshot(`
      <React.Fragment>
        <p>
          I 
          <customEm>
            like
          </customEm>
           
          <customStrong>
            tiny
          </customStrong>
           libraries
        </p>
      </React.Fragment>
    `);
  });

  it("parses strong as bold with custom tag names", () => {
    expect(
      snarkdown(
        "The cure for *boredom* is **curiosity**. There is **no** cure for *curiosity*.",
        {
          strong: "b",
          em: "i",
        },
      ),
    ).toMatchInlineSnapshot(`
      <React.Fragment>
        <p>
          The cure for 
          <i>
            boredom
          </i>
           is 
          <b>
            curiosity
          </b>
          . There is 
          <b>
            no
          </b>
           cure for 
          <i>
            curiosity
          </i>
          .
        </p>
      </React.Fragment>
    `);
  });
});

describe("titles", () => {
  it("parses H1 titles", () => {
    expect(snarkdown("# I like tiny libraries")).toMatchInlineSnapshot(`
      <React.Fragment>
        <h1>
          I like tiny libraries
        </h1>
      </React.Fragment>
    `);
  });

  it("parses H1 titles with text after them", () => {
    expect(snarkdown("# I like tiny libraries\ntiny means small"))
      .toMatchInlineSnapshot(`
        <React.Fragment>
          <h1>
            I like tiny libraries
          </h1>
          <p>
            tiny means small
          </p>
        </React.Fragment>
      `);
  });

  it("parses several headed texts", () => {
    expect(
      snarkdown(`# Features

we can parse

# Pros

the library is small`),
    ).toMatchInlineSnapshot(`
  <React.Fragment>
    <h1>
      Features
    </h1>
    <p>
      we can parse
    </p>
    <h1>
      Pros
    </h1>
    <p>
      the library is small
    </p>
  </React.Fragment>
`);
  });

  it("parses H1 titles with em in them", () => {
    expect(snarkdown("# I like *tiny* libraries\ntiny means small"))
      .toMatchInlineSnapshot(`
        <React.Fragment>
          <h1>
            I like 
            <em>
              tiny
            </em>
             libraries
          </h1>
          <p>
            tiny means small
          </p>
        </React.Fragment>
      `);
  });

  it("parses underlined H1 titles", () => {
    expect(snarkdown("I like tiny libraries\n===")).toMatchInlineSnapshot(`
      <React.Fragment>
        <h1>
          I like tiny libraries
        </h1>
      </React.Fragment>
    `);
  });

  it("parses underlined H1 titles with em", () => {
    expect(snarkdown("I like *tiny* libraries\n===")).toMatchInlineSnapshot(`
      <React.Fragment>
        <h1>
          I like 
          <em>
            tiny
          </em>
           libraries
        </h1>
      </React.Fragment>
    `);
  });

  it("parses H2 titles", () => {
    expect(snarkdown("## I like tiny libraries")).toMatchInlineSnapshot(`
      <React.Fragment>
        <h2>
          I like tiny libraries
        </h2>
      </React.Fragment>
    `);
  });

  it("parses H3 titles", () => {
    expect(snarkdown("### I like tiny libraries")).toMatchInlineSnapshot(`
      <React.Fragment>
        <h3>
          I like tiny libraries
        </h3>
      </React.Fragment>
    `);
  });

  it("parses H3 titles with custom elements", () => {
    expect(
      snarkdown("### I like tiny libraries", {
        h3: function customH3({ children }) {
          return <div>{children}</div>;
        },
      }),
    ).toMatchInlineSnapshot(`
      <React.Fragment>
        <customH3>
          I like tiny libraries
        </customH3>
      </React.Fragment>
    `);
  });

  it("parses H3 titles with custom tag names", () => {
    expect(
      snarkdown("### I like tiny libraries", {
        h3: "heading",
      }),
    ).toMatchInlineSnapshot(`
      <React.Fragment>
        <heading>
          I like tiny libraries
        </heading>
      </React.Fragment>
    `);
  });

  it.skip("parses titles with reference links", () => {
    expect(
      snarkdown(
        "# I like [tiny libraries]\n\n[tiny libraries]: https://github.com/developit/snarkdown",
      ),
    ).to.equal(
      '<h1>I like <a href="https://github.com/developit/snarkdown">tiny libraries</a></h1>',
    );
  });
});

describe("links & images", () => {
  it("parses links", () => {
    expect(snarkdown("[Snarkdown](http://github.com/developit/snarkdown)"))
      .toMatchInlineSnapshot(`
        <React.Fragment>
          <p>
            <a
              href="http://github.com/developit/snarkdown"
            >
              Snarkdown
            </a>
          </p>
        </React.Fragment>
      `);
  });

  it("parses anchor links", () => {
    expect(snarkdown("[Example](#example)")).toMatchInlineSnapshot(`
      <React.Fragment>
        <p>
          <a
            href="#example"
          >
            Example
          </a>
        </p>
      </React.Fragment>
    `);
  });

  it("parses images with a title to img inside p", () => {
    expect(snarkdown("![title](foo.png)")).toMatchInlineSnapshot(`
      <React.Fragment>
        <p>
          <img
            alt="title"
            src="foo.png"
          />
        </p>
      </React.Fragment>
    `);
  });
  it("parses images with no title", () => {
    expect(snarkdown("![](foo.png)")).toMatchInlineSnapshot(`
      <React.Fragment>
        <p>
          <img
            src="foo.png"
          />
        </p>
      </React.Fragment>
    `);
  });

  it("parses images after a heading as inside a p", () => {
    expect(
      snarkdown(
        "#gallery\n![painting](painting1.png)A nice walk in the gallery![painting](painting2.png)",
      ),
    ).toMatchInlineSnapshot(`
      <React.Fragment>
        <h1>
          gallery
        </h1>
        <p>
          <img
            alt="painting"
            src="painting1.png"
          />
          A nice walk in the gallery
          <img
            alt="painting"
            src="painting2.png"
          />
        </p>
      </React.Fragment>
    `);
  });

  it("parses images within links", () => {
    expect(snarkdown("[![](toc.png)](#toc)")).toMatchInlineSnapshot(`
      <React.Fragment>
        <p>
          <a
            href="#toc"
          >
            <img
              src="toc.png"
            />
          </a>
        </p>
      </React.Fragment>
    `);
  });

  it.skip("parses reference links", () => {
    expect(snarkdown("\nhello [World]!\n[world]: http://world.com")).to.equal(
      'hello <a href="http://world.com">World</a>!',
    );
  });

  it.skip("parses reference links without creating excessive linebreaks", () => {
    expect(snarkdown("\nhello [World]!\n\n[world]: http://world.com")).to.equal(
      'hello <a href="http://world.com">World</a>!',
    );
  });

  it('parses links with other text after them', () => {
    const markdown = `However, It is **highly recommended** to **install the game** as a [P.W.A.](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps) for best experience.

----
## Install using Chrome / Chromium`;
    expect(snarkdown(markdown)).toMatchInlineSnapshot(`
      <React.Fragment>
        <p>
          However, It is 
          <strong>
            highly recommended
          </strong>
           to 
          <strong>
            install the game
          </strong>
           as a 
          <a
            href="https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps"
          >
            P.W.A.
          </a>
          for best experience.
          </p>
        <hr />
        <h2>
          Install using Chrome / Chromium
        </h2>
      </React.Fragment>
    `);
  });
});

describe("lists", () => {
  it("parses an unordered list with *", () => {
    expect(snarkdown("* One\n* Two")).toMatchInlineSnapshot(`
				<React.Fragment>
				  <ul>
				    <li>
				      One
				    </li>
				    <li>
				      Two
				    </li>
				  </ul>
				</React.Fragment>
			`);
  });

  it("parses an unordered list with -", () => {
    expect(snarkdown("- One\n- Two")).toMatchInlineSnapshot(`
				<React.Fragment>
				  <ul>
				    <li>
				      One
				    </li>
				    <li>
				      Two
				    </li>
				  </ul>
				</React.Fragment>
			`);
  });

  it("parses an unordered list with +", () => {
    expect(snarkdown("+ One\n+ Two")).toMatchInlineSnapshot(`
				<React.Fragment>
				  <ul>
				    <li>
				      One
				    </li>
				    <li>
				      Two
				    </li>
				  </ul>
				</React.Fragment>
			`);
  });

  it("parses an unordered list with mixed bullet point styles", () => {
    expect(snarkdown("+ One\n* Two\n- Three")).toMatchInlineSnapshot(`
				<React.Fragment>
				  <ul>
				    <li>
				      One
				    </li>
				    <li>
				      Two
				    </li>
				    <li>
				      Three
				    </li>
				  </ul>
				</React.Fragment>
			`);
  });

  it("parses an ordered list", () => {
    expect(snarkdown("1. Ordered\n2. Lists\n4. Numbers are ignored"))
      .toMatchInlineSnapshot(`
				<React.Fragment>
				  <ol>
				    <li>
				      Ordered
				    </li>
				    <li>
				      Lists
				    </li>
				    <li>
				      Numbers are ignored
				    </li>
				  </ol>
				</React.Fragment>
			`);
  });

  it("detects ul after a paragraph with a line gap", () => {
    expect(snarkdown(`please:

* email me
* call me
* write to me`)).toMatchInlineSnapshot(`
  <React.Fragment>
    <p>
      please:
    </p>
    <ul>
      <li>
        email me
      </li>
      <li>
        call me
      </li>
      <li>
        write to me
      </li>
    </ul>
  </React.Fragment>
`);
  });

  it("detects ul after a paragraph without a line gap", () => {
    expect(snarkdown(`please:
* email me
* call me
* write to me`)).toMatchInlineSnapshot(`
  <React.Fragment>
    <p>
      please:
    </p>
    <ul>
      <li>
        email me
      </li>
      <li>
        call me
      </li>
      <li>
        write to me
      </li>
    </ul>
  </React.Fragment>
`);
  });
});

describe("line breaks", () => {
  it("parses two new lines as paragraph breaks", () => {
    expect(snarkdown("Something with\n\na line break")).toMatchInlineSnapshot(`
      <React.Fragment>
        <p>
          Something with
        </p>
        <p>
          a line break
        </p>
      </React.Fragment>
    `);
  });

  it("parses three new lines as a single paragraph breaks", () => {
    expect(snarkdown("Something with\n\n\na line break"))
      .toMatchInlineSnapshot(`
        <React.Fragment>
          <p>
            Something with
          </p>
          <p>
            a line break
          </p>
        </React.Fragment>
      `);
  });

  it("parses huge gap in the text as a single paragraph breaks", () => {
    expect(snarkdown("Something with a BIG\n\n\n\n\n\n\n\nline break"))
      .toMatchInlineSnapshot(`
        <React.Fragment>
          <p>
            Something with a BIG
          </p>
          <p>
            line break
          </p>
        </React.Fragment>
      `);
  });

  it("does not take a line break at the end of a file too seriously", () => {
    expect(snarkdown("Why\n\nso\n\nserious?\n")).toMatchInlineSnapshot(`
      <React.Fragment>
        <p>
          Why
        </p>
        <p>
          so
        </p>
        <p>
          serious? 
        </p>
      </React.Fragment>
    `);
  });
  it("does not take double line breaks at the end of a file too seriously", () => {
    expect(snarkdown("Some text before the end of the doc\n\n"))
      .toMatchInlineSnapshot(`
        <React.Fragment>
          <p>
            Some text before the end of the doc
          </p>
        </React.Fragment>
      `);
  });

  it("parses strong and em inside paragraphs", () => {
    expect(snarkdown("Something *with*\n\na **line** break"))
      .toMatchInlineSnapshot(`
        <React.Fragment>
          <p>
            Something 
            <em>
              with
            </em>
          </p>
          <p>
            a 
            <strong>
              line
            </strong>
             break
          </p>
        </React.Fragment>
      `);
  });

  it("parses two spaces as a line break", () => {
    expect(snarkdown("Something with  \na line break")).toMatchInlineSnapshot(`
      <React.Fragment>
        <p>
          Something with
        </p>
        <p>
          a line break
        </p>
      </React.Fragment>
    `);
  });

  it("parses two line breaks between lists", () => {
    expect(
      snarkdown(
        `* a
* b

* a
* b`,
      ),
    ).toMatchInlineSnapshot(`
  <React.Fragment>
    <ul>
      <li>
        a
      </li>
      <li>
        b
      </li>
    </ul>
    <ul>
      <li>
        a
      </li>
      <li>
        b
      </li>
    </ul>
  </React.Fragment>
`);
  });
  it("parses two paragraphs between lists", () => {
    expect(
      snarkdown(
        `* a
* b

one line

another line

* a
* b`,
      ),
    ).toMatchInlineSnapshot(`
      <React.Fragment>
        <ul>
          <li>
            a
          </li>
          <li>
            b
          </li>
        </ul>
        <p>
          one line
        </p>
        <p>
          another line
        </p>
        <ul>
          <li>
            a
          </li>
          <li>
            b
          </li>
        </ul>
      </React.Fragment>
    `);
  });
});

describe("code & quotes", () => {
  it("parses inline code", () => {
    expect(snarkdown("Here is some code `var a = 1`.")).toMatchInlineSnapshot(`
      <React.Fragment>
        <p>
          Here is some code 
          <code>
            var a = 1
          </code>
          .
        </p>
      </React.Fragment>
    `);
  });

  //it('escapes inline code', () => {
  // this test does not apply - snarkdown needed this for html output no need to escape in react virtual dom nodes
  // however, vitest will render the inline snapshot as using &gt;
  it("does not escape inline code", () => {
    type ReactElementWithChildren = ReactElement<{
      children: Array<ReactElementWithChildren>;
    }>;

    const result = snarkdown(
      "Here is some code `if( a > 1 )`",
    ) as ReactElementWithChildren;
    expect(result).toMatchInlineSnapshot(`
      <React.Fragment>
        <p>
          Here is some code 
          <code>
            if( a &gt; 1 )
          </code>
        </p>
      </React.Fragment>
    `);
    // see, it really isn't escaped!
    expect(result.props.children[0].props.children[1].props.children[0]).toBe(
      "if( a > 1 )",
    );
  });

  it("parses three backticks (```) as a code block", () => {
    expect(
      snarkdown(
        '```\nfunction codeBlocks() {\n\treturn "Can be inserted";\n}\n```',
      ),
    ).toMatchInlineSnapshot(`
      <React.Fragment>
        <pre>
          <code>
            function codeBlocks() {
      	return "Can be inserted";
      }
          </code>
        </pre>
      </React.Fragment>
    `);
  });
  it("parses three backticks with language (```js) as a code block", () => {
    expect(
      snarkdown(
        '```js\nfunction codeBlocks() {\n\treturn "Can be inserted";\n}\n```',
      ),
    ).toMatchInlineSnapshot(`
      <React.Fragment>
        <pre>
          <code
            language="language-js"
          >
            function codeBlocks() {
      	return "Can be inserted";
      }
          </code>
        </pre>
      </React.Fragment>
    `);
  });

  it("parses tabs as a code poetry block", () => {
    expect(snarkdown("\tvar a = 1")).toMatchInlineSnapshot(`
      <React.Fragment>
        <pre>
          var a = 1
        </pre>
      </React.Fragment>
    `);
  });

  /*
  escaping not needed for react virtual dom:
  it('escapes code/quote blocks', () => {
    expect(snarkdown('```\n<foo>\n```')).to.equal('<pre class="code "><code>&lt;foo&gt;</code></pre>');
    expect(snarkdown('\t<foo>')).to.equal('<pre class="code poetry"><code>&lt;foo&gt;</code></pre>');
  });
  */

  it("parses a block quote", () => {
    expect(snarkdown("> To be or not to be")).toMatchInlineSnapshot(`
				<React.Fragment>
				  <blockquote>
				    To be or not to be
				  </blockquote>
				</React.Fragment>
			`);
  });

  it("parses a multi-line block quote", () => {
    expect(snarkdown("> To be or not to be\n> well, it's a question innit?"))
      .toMatchInlineSnapshot(`
        <React.Fragment>
          <blockquote>
            To be or not to be
        well, it's a question innit?
          </blockquote>
        </React.Fragment>
      `);
  });

  it("parses lists within block quotes", () => {
    expect(snarkdown("> - one\n> - two\n> - **three**\nhello"))
      .toMatchInlineSnapshot(`
        <React.Fragment>
          <blockquote>
            <ul>
              <li>
                one
              </li>
              <li>
                two
              </li>
              <li>
                <strong>
                  three
                </strong>
              </li>
            </ul>
          </blockquote>
          <p>
             hello
          </p>
        </React.Fragment>
      `);
  });

  it("parses em within blockquotes", () => {
    // emphasis mine (for the test)
    expect(
      snarkdown(
        "> Not *everything* that is faced can be changed, but *nothing* can be changed until it is faced.",
      ),
    ).toMatchInlineSnapshot(`
      <React.Fragment>
        <blockquote>
          Not 
          <em>
            everything
          </em>
           that is faced can be changed, but 
          <em>
            nothing
          </em>
           can be changed until it is faced.
        </blockquote>
      </React.Fragment>
    `);
  });
});

describe("horizontal rules", () => {
  it("should parse --- as a <hr/>", () => {
    expect(snarkdown("foo\n\n---\nbar")).toMatchInlineSnapshot(`
      <React.Fragment>
        <p>
          foo
          <hr />
          bar
        </p>
      </React.Fragment>
    `);
    expect(snarkdown("> foo\n\n---\nbar")).toMatchInlineSnapshot(`
      <React.Fragment>
        <blockquote>
          foo
        </blockquote>
        <hr />
        <p>
          bar
        </p>
      </React.Fragment>
    `);
  });

  it("should parse * * * as a <hr/>", () => {
    expect(snarkdown("foo\n* * *\nbar")).toMatchInlineSnapshot(`
      <React.Fragment>
        <p>
          foo
          <hr />
          bar
        </p>
      </React.Fragment>
    `);
    expect(snarkdown("foo\n* * * *\nbar"), "* * * *").toMatchInlineSnapshot(`
      <React.Fragment>
        <p>
          foo
          <hr />
          bar
        </p>
      </React.Fragment>
    `);
    expect(snarkdown("> foo\n\n* * *\nbar")).toMatchInlineSnapshot(`
      <React.Fragment>
        <blockquote>
          foo
        </blockquote>
        <hr />
        <p>
          bar
        </p>
      </React.Fragment>
    `);
  });
});

describe("edge cases", () => {
  it("should close unclosed tags", () => {
    // original snarkdown had the foo inside the em. I think either is fine.
    expect(snarkdown("*foo")).toMatchInlineSnapshot(`
      <React.Fragment>
        <p>
          <em />
          foo
        </p>
      </React.Fragment>
    `);
    expect(snarkdown("foo**")).toMatchInlineSnapshot(`
      <React.Fragment>
        <p>
          foo
          <strong />
        </p>
      </React.Fragment>
    `);
    expect(snarkdown("[some **bold text](#winning)")).toMatchInlineSnapshot(`
      <React.Fragment>
        <p>
          <a
            href="#winning"
          >
            some 
            <strong>
              bold text
            </strong>
          </a>
        </p>
      </React.Fragment>
    `);
    // isn't closing this one (unlike snarkdown.js), but I actually think this is better - either is fine IMO
    expect(snarkdown("`foo")).toMatchInlineSnapshot(`
      <React.Fragment>
        <p>
          \`foo
        </p>
      </React.Fragment>
    `);
  });

  it("should not choke on single characters", () => {
    expect(snarkdown("*")).toMatchInlineSnapshot(`
      <React.Fragment>
        <p>
          <em />
        </p>
      </React.Fragment>
    `);
    expect(snarkdown("_")).toMatchInlineSnapshot(`
      <React.Fragment>
        <p>
          <em />
        </p>
      </React.Fragment>
    `);
    expect(snarkdown("**")).toMatchInlineSnapshot(`
      <React.Fragment>
        <p>
          <strong />
        </p>
      </React.Fragment>
    `);
    expect(snarkdown(">")).toMatchInlineSnapshot(`
      <React.Fragment>
        <p>
          &gt;
        </p>
      </React.Fragment>
    `);
    expect(snarkdown("`")).toMatchInlineSnapshot(`
      <React.Fragment>
        <p>
          \`
        </p>
      </React.Fragment>
    `);
  });
});
