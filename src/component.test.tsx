import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { SnarkdownInReact } from "./snarkdown-in-react";

/**
 * @vitest-environment jsdom
 */
test("loads and displays markdown", async () => {
  const markdown = `## Guide to using this component
  
1. Pass it the markdown prop
2. Hopefully, that's *it*!`;

  render(<SnarkdownInReact markdown={markdown} />);

  // simple test that the component ends up on the screen:
  expect(await screen.findByText("it")).toMatchInlineSnapshot(`
    <em>
      it
    </em>
  `);
});

test("loads and displays markdown with custom renderers", async () => {
  const markdown = `# Guide to using this component
  
1. Pass it the markdown prop
2. Hopefully, that's *it*!`;

  render(
    <SnarkdownInReact
      markdown={markdown}
      customComponents={{
        h1: ({ children }) => (
          <h1 data-testid="heading" className="text-2xl">
            Heading: <span>{children}</span>
          </h1>
        ),
      }}
    />,
  );

  // simple test that the component ends up on the screen:
  expect(await screen.findByTestId("heading")).toMatchInlineSnapshot(`
    <h1
      class="text-2xl"
      data-testid="heading"
    >
      Heading: 
      <span>
        Guide to using this component
      </span>
    </h1>
  `);
});
