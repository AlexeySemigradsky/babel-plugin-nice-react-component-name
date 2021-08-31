import { transform } from "@babel/core";
import plugin from "../src";

function run(source: string) {
  const { code } = transform(source, {
    filename: "test.ts",
    plugins: [plugin],
    configFile: false,
  })!;
  return code;
}

describe("NiceReactComponentName", () => {
  test("React.memo", () => {
    const sourceCode = `
      const MyComponent = React.memo(() => null);
    `;
    const transformedCode = run(sourceCode);
    expect(transformedCode).toMatchInlineSnapshot(`
      "const MyComponent = React.memo(function MyComponent() {
        return null;
      });"
    `);
  });

  test("memo", () => {
    const sourceCode = `
      const MyComponent = memo(() => null);
    `;
    const transformedCode = run(sourceCode);
    expect(transformedCode).toMatchInlineSnapshot(`
      "const MyComponent = memo(function MyComponent() {
        return null;
      });"
    `);
  });

  test("observer", () => {
    const sourceCode = `
      const MyComponent = observer(() => null);
    `;
    const transformedCode = run(sourceCode);
    expect(transformedCode).toMatchInlineSnapshot(`
      "const MyComponent = observer(function MyComponent() {
        return null;
      });"
    `);
  });

  test("camelCase", () => {
    const sourceCode = `
      const myComponent = observer(() => null);
    `;
    const transformedCode = run(sourceCode);
    expect(transformedCode).toMatchInlineSnapshot(
      `"const myComponent = observer(() => null);"`
    );
  });

  test("block declaration", () => {
    const sourceCode = `
      const MyComponent = observer(() => {
        return null;
      });
    `;
    const transformedCode = run(sourceCode);
    expect(transformedCode).toMatchInlineSnapshot(`
      "const MyComponent = observer(function MyComponent() {
        return null;
      });"
    `);
  });
});
