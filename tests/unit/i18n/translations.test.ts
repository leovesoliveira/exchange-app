import de from "@/i18n/translations/de";
import en from "@/i18n/translations/en";
import es from "@/i18n/translations/es";
import fr from "@/i18n/translations/fr";
import it from "@/i18n/translations/it";
import pt from "@/i18n/translations/pt";
import { describe, expect, it as test } from "vitest";

// `en` is the reference: every other language must expose exactly the same keys.
const referenceKeys = Object.keys(en).sort();

const languages = {
  pt,
  es,
  fr,
  de,
  it,
};

describe("translation key parity", () => {
  for (const [code, translation] of Object.entries(languages)) {
    test(`'${code}' has the same keys as 'en'`, () => {
      const keys = Object.keys(translation).sort();

      const missing = referenceKeys.filter((key) => !keys.includes(key));
      const extra = keys.filter((key) => !referenceKeys.includes(key));

      expect(missing, `'${code}' is missing keys`).toEqual([]);
      expect(extra, `'${code}' has extra keys`).toEqual([]);
    });
  }
});
