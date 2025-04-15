import { parseEnum } from "@helpers/parse-enum";

enum Color {
  Red = "red",
  Blue = "blue",
  Green = "green",
}

enum Status {
  Active = 1,
  Inactive = 0,
}

describe("parseEnum", () => {
  it("should return the value if it exists in a string enum", () => {
    expect(parseEnum(Color, "red")).toBe("red");
    expect(parseEnum(Color, "blue")).toBe("blue");
    expect(parseEnum(Color, "green")).toBe("green");
  });

  it("should return the value if it exists in a number enum", () => {
    expect(parseEnum(Status, 1)).toBe(1);
    expect(parseEnum(Status, 0)).toBe(0);
  });

  it("should throw an error if the value is not in the string enum", () => {
    expect(() => parseEnum(Color, "yellow")).toThrow(
      "'yellow' value is invalid",
    );
  });

  it("should throw an error if the value is not in the number enum", () => {
    expect(() => parseEnum(Status, 2)).toThrow("'2' value is invalid");
  });

  it("should handle value being undefined or null", () => {
    expect(() => parseEnum(Color, undefined)).toThrow(
      "'undefined' value is invalid",
    );
    expect(() => parseEnum(Status, null)).toThrow("'null' value is invalid");
  });
});
