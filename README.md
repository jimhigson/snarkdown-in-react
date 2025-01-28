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

Forked primarily to handle the online manual in my game [Head over Heels Online](https://blockstack.ing)

# Use case:
* You want to show some markdown in your react app
* You trust the source of the markdown
* You don't need MDX (react components inline in the markdown)
* You don't want to inflate your bundle size

# Like Snarkdown:

* a dead simple **1kb** [Markdown] parser.
* It's designed to be as minimal as possible, for constrained use-cases where a full Markdown parser would be inappropriate.
* Does not provide any xss protection whatsoever. Use when markdown is coming from a source you trust (like your own repo)
* passes all tests from snarkdown

# Unlike upstream Snarkdown:

* returns jsx that it creates directly (never creates a html string)
* assumes you have a modern (circa 2025) workflow
* is in typescript
* doesn't bother building to cjs or javascript. Use via the npm package repository, and typescript+es only
* in fact, doesn't have any build whatsoever. The typescript file is the main. If you're not using typescript and want to add a build to js, feel free to raise a PR
* tests are in vitest (not mocha/chai)

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


