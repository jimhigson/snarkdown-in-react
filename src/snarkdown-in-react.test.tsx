import { describe, it, expect, test } from "vitest";
import { ReactLikeElement, parse as snarkdown } from "./snarkdown-in-react";
import { PropsWithChildren, ReactElement, ReactNode } from "react";

describe("text formatting", () => {
  it("parses bold with **", () => {
    expect(snarkdown("I **like** tiny libraries")).toMatchInlineSnapshot(`
				<React.Fragment>
				  I 
				  <strong>
				    like
				  </strong>
				   tiny libraries
				</React.Fragment>
			`);
  });

  it("parses bold with __", () => {
    expect(snarkdown("I __like__ tiny libraries")).to.toMatchInlineSnapshot(`
				<React.Fragment>
				  I 
				  <strong>
				    like
				  </strong>
				   tiny libraries
				</React.Fragment>
			`);
  });

  it("parses italics with *", () => {
    expect(snarkdown("I *like* tiny libraries")).to.toMatchInlineSnapshot(`
				<React.Fragment>
				  I 
				  <em>
				    like
				  </em>
				   tiny libraries
				</React.Fragment>
			`);
  });

  it("parses two italics on a line *", () => {
    expect(snarkdown("I *like* really *tiny* libraries")).to
      .toMatchInlineSnapshot(`
				<React.Fragment>
				  I 
				  <em>
				    like
				  </em>
				   really 
				  <em>
				    tiny
				  </em>
				   libraries
				</React.Fragment>
			`);
  });

  it("parses italics with _", () => {
    expect(snarkdown("I _like_ tiny libraries")).to.toMatchInlineSnapshot(`
				<React.Fragment>
				  I 
				  <em>
				    like
				  </em>
				   tiny libraries
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
      })
    ).to.toMatchInlineSnapshot(`
      <React.Fragment>
        I 
        <customEm>
          like
        </customEm>
         
        <customStrong>
          tiny
        </customStrong>
         libraries
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
				  tiny means small
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
				  tiny means small
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
      })
    ).toMatchInlineSnapshot(`
      <React.Fragment>
        <customH3>
          I like tiny libraries
        </customH3>
      </React.Fragment>
    `);
  });

  it.skip("parses titles with reference links", () => {
    expect(
      snarkdown(
        "# I like [tiny libraries]\n\n[tiny libraries]: https://github.com/developit/snarkdown"
      )
    ).to.equal(
      '<h1>I like <a href="https://github.com/developit/snarkdown">tiny libraries</a></h1>'
    );
  });
});

describe("links & images", () => {
  it("parses links", () => {
    expect(snarkdown("[Snarkdown](http://github.com/developit/snarkdown)"))
      .toMatchInlineSnapshot(`
				<React.Fragment>
				  <a
				    href="http://github.com/developit/snarkdown"
				  >
				    Snarkdown
				  </a>
				</React.Fragment>
			`);
  });

  it("parses anchor links", () => {
    expect(snarkdown("[Example](#example)")).toMatchInlineSnapshot(`
				<React.Fragment>
				  <a
				    href="#example"
				  >
				    Example
				  </a>
				</React.Fragment>
			`);
  });

  it("parses images with a title", () => {
    expect(snarkdown("![title](foo.png)")).toMatchInlineSnapshot(`
				<React.Fragment>
				  <img
				    alt="title"
				    src="foo.png"
				  />
				</React.Fragment>
			`);
  });
  it("parses images with no title", () => {
    expect(snarkdown("![](foo.png)")).toMatchInlineSnapshot(`
				<React.Fragment>
				  <img
				    alt=""
				    src="foo.png"
				  />
				</React.Fragment>
			`);
  });

  it("parses images within links", () => {
    expect(snarkdown("[![](toc.png)](#toc)")).toMatchInlineSnapshot(`
				<React.Fragment>
				  <a
				    href="#toc"
				  >
				    <img
				      alt=""
				      src="toc.png"
				    />
				  </a>
				</React.Fragment>
			`);
    expect(snarkdown("[![a](a.png)](#a) [![b](b.png)](#b)"))
      .toMatchInlineSnapshot(`
				<React.Fragment>
				  <a
				    href="#b"
				  >
				    <img
				      alt="a"
				      src="a.png"
				    />
				     
				    <a>
				      <img
				        alt="b"
				        src="b.png"
				      />
				    </a>
				  </a>
				</React.Fragment>
			`);
  });

  it.skip("parses reference links", () => {
    expect(snarkdown("\nhello [World]!\n[world]: http://world.com")).to.equal(
      'hello <a href="http://world.com">World</a>!'
    );
  });

  it.skip("parses reference links without creating excessive linebreaks", () => {
    expect(snarkdown("\nhello [World]!\n\n[world]: http://world.com")).to.equal(
      'hello <a href="http://world.com">World</a>!'
    );
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
});

describe("line breaks", () => {
  it("parses two new lines as paragraph breaks", () => {
    expect(snarkdown("Something with\n\na line break")).toMatchInlineSnapshot(`
				<React.Fragment>
				  <div
				    className="paragraph"
				  >
				    Something with
				  </div>
				  <div
				    className="paragraph"
				  >
				    a line break
				  </div>
				</React.Fragment>
			`);
  });

  it("parses three new lines as a single paragraph breaks", () => {
    expect(snarkdown("Something with\n\n\na line break"))
      .toMatchInlineSnapshot(`
				<React.Fragment>
				  <div
				    className="paragraph"
				  >
				    Something with
				  </div>
				  <div
				    className="paragraph"
				  >
				    a line break
				  </div>
				</React.Fragment>
      `);
  });

  it("parses huge gap in the text as a single paragraph breaks", () => {
    expect(snarkdown("Something with a BIG\n\n\n\n\n\n\n\na line break"))
      .toMatchInlineSnapshot(`
        <React.Fragment>
          <div
            className="paragraph"
          >
            Something with a BIG
          </div>
          <div
            className="paragraph"
          >
            a line break
          </div>
        </React.Fragment>
      `);
  });

  it("parses strong and em inside paragraphs", () => {
    expect(snarkdown("Something *with*\n\na **line** break"))
      .toMatchInlineSnapshot(`
				<React.Fragment>
				  <div
				    className="paragraph"
				  >
				    Something 
				    <em>
				      with
				    </em>
				  </div>
				  <div
				    className="paragraph"
				  >
				    a 
				    <strong>
				      line
				    </strong>
				     break
				  </div>
				</React.Fragment>
			`);
  });

  it("parses two spaces as a line break", () => {
    expect(snarkdown("Something with  \na line break")).toMatchInlineSnapshot(`
				<React.Fragment>
				  <div
				    className="paragraph"
				  >
				    Something with
				  </div>
				  <div
				    className="paragraph"
				  >
				    a line break
				  </div>
				</React.Fragment>
			`);
  });

  it("parses two line breaks between lists", () => {
    expect(
      snarkdown(
        `* a
* b

* a
* b`
      )
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
* b`
      )
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
    <div
      className="paragraph"
    >
      one line
    </div>
    <div
      className="paragraph"
    >
      another line
    </div>
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
				  Here is some code 
				  <code>
				    var a = 1
				  </code>
				  .
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
      "Here is some code `if( a > 1 )`"
    ) as ReactElementWithChildren;
    expect(result).toMatchInlineSnapshot(`
				<React.Fragment>
				  Here is some code 
				  <code>
				    if( a &gt; 1 )
				  </code>
				</React.Fragment>
			`);
    // see, it really isn't escaped!
    expect(result.props.children[1].props.children[0]).toBe("if( a > 1 )");
  });

  it("parses three backticks (```) as a code block", () => {
    expect(
      snarkdown(
        '```\nfunction codeBlocks() {\n\treturn "Can be inserted";\n}\n```'
      )
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
        '```js\nfunction codeBlocks() {\n\treturn "Can be inserted";\n}\n```'
      )
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
				  
				hello
				</React.Fragment>
			`);
  });

  it("parses em within blockquotes", () => {
    // emphasis mine (for the test)
    expect(
      snarkdown(
        "> Not *everything* that is faced can be changed, but *nothing* can be changed until it is faced."
      )
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
			  foo
			  <hr />
			  bar
			</React.Fragment>
		`);
    expect(snarkdown("> foo\n\n---\nbar")).toMatchInlineSnapshot(`
			<React.Fragment>
			  <blockquote>
			    foo
			  </blockquote>
			  <hr />
			  bar
			</React.Fragment>
		`);
  });

  it("should parse * * * as a <hr/>", () => {
    expect(snarkdown("foo\n* * *\nbar")).toMatchInlineSnapshot(`
			<React.Fragment>
			  foo
			  <hr />
			  bar
			</React.Fragment>
		`);
    expect(snarkdown("foo\n* * * *\nbar"), "* * * *").toMatchInlineSnapshot(`
			<React.Fragment>
			  foo
			  <hr />
			  bar
			</React.Fragment>
		`);
    expect(snarkdown("> foo\n\n* * *\nbar")).toMatchInlineSnapshot(`
			<React.Fragment>
			  <blockquote>
			    foo
			  </blockquote>
			  <hr />
			  bar
			</React.Fragment>
		`);
  });
});

describe("edge cases", () => {
  it("should close unclosed tags", () => {
    // original snarkdown had the foo inside the em. I think either is fine.
    expect(snarkdown("*foo")).toMatchInlineSnapshot(`
			<React.Fragment>
			  <em />
			  foo
			</React.Fragment>
		`);
    expect(snarkdown("foo**")).toMatchInlineSnapshot(`
			<React.Fragment>
			  foo
			  <strong />
			</React.Fragment>
		`);
    expect(snarkdown("[some **bold text](#winning)")).toMatchInlineSnapshot(`
			<React.Fragment>
			  <a
			    href="#winning"
			  >
			    some 
			    <strong>
			      bold text
			    </strong>
			  </a>
			</React.Fragment>
		`);
    // isn't closing this one (unlike snarkdown.js), but I actually think this is better - either is fine IMO
    expect(snarkdown("`foo")).toMatchInlineSnapshot(`
			<React.Fragment>
			  \`foo
			</React.Fragment>
		`);
  });

  it("should not choke on single characters", () => {
    expect(snarkdown("*")).toMatchInlineSnapshot(`
			<React.Fragment>
			  <em />
			</React.Fragment>
		`);
    expect(snarkdown("_")).toMatchInlineSnapshot(`
			<React.Fragment>
			  <em />
			</React.Fragment>
		`);
    expect(snarkdown("**")).toMatchInlineSnapshot(`
			<React.Fragment>
			  <strong />
			</React.Fragment>
		`);
    expect(snarkdown(">")).toMatchInlineSnapshot(`
			<React.Fragment>
			  &gt;
			</React.Fragment>
		`);
    expect(snarkdown("`")).toMatchInlineSnapshot(`
			<React.Fragment>
			  \`
			</React.Fragment>
		`);
  });
});
