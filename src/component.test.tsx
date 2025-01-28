import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { SnarkdownInReact } from "./snarkdown-in-react";

/**
 * @vitest-environment jsdom
 */
test("loads and displays greeting", async () => {
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
