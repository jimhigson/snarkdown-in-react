import { describe, it, expect } from 'vitest'
import snarkdown from './snarkdown-in-react';

describe('snarkdown()', () => {
	describe.only('text formatting', () => {
		it('parses bold with **', () => {
			expect(snarkdown('I **like** tiny libraries')).toMatchInlineSnapshot(`
				<React.Fragment>
				  I 
				  <strong>
				    like
				  </strong>
				   tiny libraries
				</React.Fragment>
			`);
		});

		it('parses bold with __', () => {
			expect(snarkdown('I __like__ tiny libraries')).to.toMatchInlineSnapshot(`
				<React.Fragment>
				  I 
				  <strong>
				    like
				  </strong>
				   tiny libraries
				</React.Fragment>
			`);
		});

		it('parses italics with *', () => {
			expect(snarkdown('I *like* tiny libraries')).to.toMatchInlineSnapshot(`
				<React.Fragment>
				  I 
				  <em>
				    like
				  </em>
				   tiny libraries
				</React.Fragment>
			`);
		});

		it('parses italics with _', () => {
			expect(snarkdown('I _like_ tiny libraries')).to.toMatchInlineSnapshot(`
				<React.Fragment>
				  I 
				  <em>
				    like
				  </em>
				   tiny libraries
				</React.Fragment>
			`);
		});
	});

	describe.only('titles', () => {
		it('parses H1 titles', () => {
			expect(snarkdown('# I like tiny libraries')).toMatchInlineSnapshot(`
				<React.Fragment>
				  <h1>
				    I like tiny libraries
				  </h1>
				</React.Fragment>
			`);
		});

		it('parses H1 titles with text after them', () => {
			expect(snarkdown('# I like tiny libraries\ntiny means small')).toMatchInlineSnapshot(`
				<React.Fragment>
				  <h1>
				    I like tiny libraries
				  </h1>
				  tiny means small
				</React.Fragment>
			`);
		});

		it('parses H1 titles with em in them', () => {
			expect(snarkdown('# I like *tiny* libraries\ntiny means small')).toMatchInlineSnapshot(`
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

		it('parses underlined H1 titles', () => {
			expect(snarkdown('I like tiny libraries\n===')).toMatchInlineSnapshot(`
				<React.Fragment>
				  <h1>
				    I like tiny libraries
				  </h1>
				</React.Fragment>
			`);
		});

		it('parses underlined H1 titles with em', () => {
			expect(snarkdown('I like *tiny* libraries\n===')).toMatchInlineSnapshot(`
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

		it('parses H2 titles', () => {
			expect(snarkdown('## I like tiny libraries')).toMatchInlineSnapshot(`
				<React.Fragment>
				  <h2>
				    I like tiny libraries
				  </h2>
				</React.Fragment>
			`);
		});

		it('parses H3 titles', () => {
			expect(snarkdown('### I like tiny libraries')).toMatchInlineSnapshot(`
				<React.Fragment>
				  <h3>
				    I like tiny libraries
				  </h3>
				</React.Fragment>
			`);
		});

		it.skip('parses titles with reference links', () => {
			expect(
				snarkdown('# I like [tiny libraries]\n\n[tiny libraries]: https://github.com/developit/snarkdown')
			).to.equal('<h1>I like <a href="https://github.com/developit/snarkdown">tiny libraries</a></h1>');
		});
	});

	describe('links & images', () => {
		it.only('parses links', () => {
			expect(snarkdown('[Snarkdown](http://github.com/developit/snarkdown)')).toMatchInlineSnapshot(`
				<React.Fragment>
				  <a
				    href="http://github.com/developit/snarkdown"
				  >
				    Snarkdown
				  </a>
				</React.Fragment>
			`);
		});

		it.only('parses anchor links', () => {
			expect(snarkdown('[Example](#example)')).toMatchInlineSnapshot(`
				<React.Fragment>
				  <a
				    href="#example"
				  >
				    Example
				  </a>
				</React.Fragment>
			`);
		});

		it.only('parses images with a title', () => {
			expect(snarkdown('![title](foo.png)')).toMatchInlineSnapshot(`
				<React.Fragment>
				  <img
				    alt="title"
				    src="foo.png"
				  />
				</React.Fragment>
			`);
		});
		it.only('parses images with no title', () => {
			expect(snarkdown('![](foo.png)')).toMatchInlineSnapshot(`
				<React.Fragment>
				  <img
				    alt=""
				    src="foo.png"
				  />
				</React.Fragment>
			`);
		});

		it.only('parses images within links', () => {
			expect(snarkdown('[![](toc.png)](#toc)')).toMatchInlineSnapshot(`
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
			expect(snarkdown('[![a](a.png)](#a) [![b](b.png)](#b)')).toMatchInlineSnapshot(`
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

		it.skip('parses reference links', () => {
			expect(snarkdown('\nhello [World]!\n[world]: http://world.com')).to.equal('hello <a href="http://world.com">World</a>!');
		});

		it.skip('parses reference links without creating excessive linebreaks', () => {
			expect(snarkdown('\nhello [World]!\n\n[world]: http://world.com')).to.equal('hello <a href="http://world.com">World</a>!');
		});
	});

	describe('lists', () => {
		it.only('parses an unordered list with *', () => {
			expect(snarkdown('* One\n* Two')).toMatchInlineSnapshot(`
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

		it.only('parses an unordered list with -', () => {
			expect(snarkdown('- One\n- Two')).toMatchInlineSnapshot(`
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

		it.only('parses an unordered list with +', () => {
			expect(snarkdown('+ One\n+ Two')).toMatchInlineSnapshot(`
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

		it.only('parses an unordered list with mixed bullet point styles', () => {
			expect(snarkdown('+ One\n* Two\n- Three')).toMatchInlineSnapshot(`
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

		it.only('parses an ordered list', () => {
			expect(snarkdown('1. Ordered\n2. Lists\n4. Numbers are ignored')).toMatchInlineSnapshot(`
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

	describe('line breaks', () => {
		it.only('parses two new lines as line breaks', () => {
			expect(snarkdown('Something with\n\na line break')).toMatchInlineSnapshot(`
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

		it.only('parses two spaces as a line break', () => {
			expect(snarkdown('Something with  \na line break')).toMatchInlineSnapshot(`
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

		it.only('parses two line breaks between lists', () => {
			expect(snarkdown(
				`* a
* b

* a
* b`)).toMatchInlineSnapshot(`
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
    />
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
		it.only('parses two paragraphs between lists', () => {
			expect(snarkdown(
				`* a
* b

one line

another line

* a
* b`)).toMatchInlineSnapshot(`
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
    <div
      className="paragraph"
    />
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

	describe('code & quotes', () => {
		it('parses inline code', () => {
			expect(snarkdown('Here is some code `var a = 1`.')).to.equal('Here is some code <code>var a = 1</code>.');
		});

		it('escapes inline code', () => {
			expect(snarkdown('a `<">` b')).to.equal('a <code>&lt;&quot;&gt;</code> b');
		});

		it('parses three backtricks (```) as a code block', () => {
			expect(snarkdown('```\nfunction codeBlocks() {\n\treturn "Can be inserted";\n}\n```')).to.equal('<pre class="code "><code>function codeBlocks() {\n\treturn &quot;Can be inserted&quot;;\n}</code></pre>');

			expect(snarkdown('```js\nfunction codeBlocks() {\n\treturn "Can be inserted";\n}\n```')).to.equal('<pre class="code js"><code class="language-js">function codeBlocks() {\n\treturn &quot;Can be inserted&quot;;\n}</code></pre>');
		});

		it('parses tabs as a code poetry block', () => {
			expect(snarkdown('\tvar a = 1')).to.equal('<pre class="code poetry"><code>var a = 1</code></pre>');
		});

		it('escapes code/quote blocks', () => {
			expect(snarkdown('```\n<foo>\n```')).to.equal('<pre class="code "><code>&lt;foo&gt;</code></pre>');
			expect(snarkdown('\t<foo>')).to.equal('<pre class="code poetry"><code>&lt;foo&gt;</code></pre>');
		});

		it('parses a block quote', () => {
			expect(snarkdown('> To be or not to be')).to.equal('<blockquote>To be or not to be</blockquote>');
		});

		it('parses lists within block quotes', () => {
			expect(snarkdown('> - one\n> - two\n> - **three**\nhello')).to.equal('<blockquote><ul><li>one</li><li>two</li><li><strong>three</strong></li></ul></blockquote>\nhello');
		});
	});

	describe('horizontal rules', () => {
		it('should parse ---', () => {
			expect(snarkdown('foo\n\n---\nbar')).to.equal('foo<hr />bar');
			expect(snarkdown('foo\n\n----\nbar'), '----').to.equal('foo<hr />bar');
			expect(snarkdown('> foo\n\n---\nbar')).to.equal('<blockquote>foo</blockquote><hr />bar');
		});

		it('should parse * * *', () => {
			expect(snarkdown('foo\n* * *\nbar')).to.equal('foo<hr />bar');
			expect(snarkdown('foo\n* * * *\nbar'), '* * * *').to.equal('foo<hr />bar');
			expect(snarkdown('> foo\n\n* * *\nbar')).to.equal('<blockquote>foo</blockquote><hr />bar');
		});
	});

	describe('edge cases', () => {
		it('should close unclosed tags', () => {
			expect(snarkdown('*foo')).to.equal('<em>foo</em>');
			expect(snarkdown('foo**')).to.equal('foo<strong></strong>');
			expect(snarkdown('[some **bold text](#winning)')).to.equal('<a href="#winning">some <strong>bold text</strong></a>');
			expect(snarkdown('`foo')).to.equal('`foo');
		});

		it('should not choke on single characters', () => {
			expect(snarkdown('*')).to.equal('<em></em>');
			expect(snarkdown('_')).to.equal('<em></em>');
			expect(snarkdown('**')).to.equal('<strong></strong>');
			expect(snarkdown('>')).to.equal('>');
			expect(snarkdown('`')).to.equal('`');
		});
	});
});
