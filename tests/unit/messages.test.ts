import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const load = (locale: string) =>
  JSON.parse(
    readFileSync(new URL(`../../messages/${locale}.json`, import.meta.url), "utf8"),
  ) as Tree;
const en = load("en");
const ka = load("ka");

type Tree = { [key: string]: string | Tree };

function keys(tree: Tree, prefix = ""): string[] {
  return Object.entries(tree).flatMap(([key, value]) =>
    typeof value === "string" ? [`${prefix}${key}`] : keys(value, `${prefix}${key}.`),
  );
}

describe("message catalogues", () => {
  it("ka and en define exactly the same keys", () => {
    expect(keys(ka).sort()).toEqual(keys(en).sort());
  });

  it("has no empty strings", () => {
    const empty = (tree: Tree) =>
      keys(tree).filter(
        (k) => k.split(".").reduce<Tree | string>((n, p) => (n as Tree)[p]!, tree) === "",
      );
    expect(empty(ka)).toEqual([]);
    expect(empty(en)).toEqual([]);
  });
});
