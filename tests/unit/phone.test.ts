import { describe, expect, it } from "vitest";
import {
  formatGeorgianMobile,
  isValidGeorgianMobile,
  normalizeGeorgianMobile,
  toE164,
} from "@/lib/phone";

describe("Georgian mobile numbers", () => {
  it("accepts 9 digits starting with 5", () => {
    expect(isValidGeorgianMobile("574077779")).toBe(true);
    expect(isValidGeorgianMobile("574 07 77 79")).toBe(true);
    expect(isValidGeorgianMobile("+995 574 07 77 79")).toBe(true);
  });

  it("rejects landlines, short numbers and other prefixes", () => {
    expect(isValidGeorgianMobile("322000000")).toBe(false);
    expect(isValidGeorgianMobile("57407")).toBe(false);
    expect(isValidGeorgianMobile("")).toBe(false);
  });

  it("groups as 5XX XX XX XX and caps at 9 digits", () => {
    expect(formatGeorgianMobile("5740777791234")).toBe("574 07 77 79");
    expect(normalizeGeorgianMobile("995574077779")).toBe("574077779");
  });

  it("returns E.164", () => {
    expect(toE164("574 07 77 79")).toBe("+995574077779");
    expect(toE164("123")).toBeNull();
  });
});
