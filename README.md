<p align="center">
  <img src="https://cdn.jsdelivr.net/emojione/assets/svg/1f63c.svg" width="256" height="256" alt="Snarkdown">
</p>
<h1 align="center">
  Snarkdown in React
  <a href="https://www.npmjs.org/package/snarkdown-in-react">
    <img src="https://img.shields.io/npm/v/snarkdown-in-react.svg?style=flat" alt="npm">
  </a>
</h1>

Fork of [snarkdown](https://github.com/developit/snarkdown) that renders to jsx components
(not a html string).

Whereas `snarkdown` is **1kb** minified and gzipped, by working with react and allowing custom rendering, I make the library a bit larger, at **1.4kb**.

Created originally to handle the online manual in my game [Head over Heels Online](https://blockstack.ing)

# Use case:

- You want to show some markdown in your react app
- You don't need MDX (react components inline in the markdown)
- You don't want to inflate your bundle size

# API

```tsx
import { SnarkdownInReact } from "snarkdown-in-react";

const MyComponent = () => {
  return <SnarkdownInReact markdown={myMarkdown} />;
};

const MyComponentWithCustomMarkdownRendering = () => {
  // memoise components list

  return (
    <SnarkdownInReact
      markdown={myMarkdown}
      customComponents={{
        // default rendering for em is <em> - this example overrides it with <span class="em">
        em: ({ children }) => <span className="em">{children}</span>,

        // wrap images in a div with a click handler and some tailwind classes:
        img: ({ children, src, alt }) => (
          <div className="w-full" onClick={() => console.log("click")}>
            <img className="scale-2" src={src} alt={alt} />
          </div>
        ),
      }}
    />
  );
};
```

# Like Snarkdown:

- a dead simple [Markdown] parser.
- has no run-time dependencies (except `react` itself)
- It's designed to be as minimal as possible, for constrained use-cases where a full Markdown parser would be inappropriate.
- passes all tests from snarkdown (well, all that still apply)
- doesn't support tables

# Unlike upstream Snarkdown:

- supports pluggable, custom rendering
- returns jsx that it creates directly (never creates a html string)
- assumes you have a modern (circa 2025) workflow
- is in typescript
- is a little bigger, at 1.4k minified and gzipped
- doesn't bother building to cjs or javascript. Use via the npm package repository, and typescript+es only
- in fact, doesn't have any build whatsoever. The typescript file is the main. If you're not using typescript and want to add a build to js, feel free to raise a PR
- tests are in vitest (not mocha/chai)
- doesn't support reference links - I hardly ever see these being used
- is somewhat xss-safe, since raw html is never concatenated and written out (I don't use `.dangerouslySetInnerHtml`). However, resilience against attacks is not a primary design goal.

double line breaks like this:

```markdown
some text

some other text
```

is parsed to `<div>`s:

```xml
<div className="paragraph">some text</div>
<div className="paragraph">some other text</div>
```

(`<div>` is are chosen over `<p>` because it can contain any child element)

this is unlike snarkdown which uses `<br />`:

```xml
some text<br />some other text
```
