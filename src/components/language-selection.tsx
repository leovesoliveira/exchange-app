import { languages } from "@/i18n/languages";
import { GlobeIcon, LanguagesIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

export const LanguageSelection = () => {
  const { t, i18n } = useTranslation();

  return (
    <div className="flex px-4 gap-4 justify-between items-center">
      <Label htmlFor="language-selection">
        <GlobeIcon width={20} height={20} />
        {t("language.selection.label")}
      </Label>

      <Select
        defaultValue={i18n.language}
        onValueChange={(value) => i18n.changeLanguage(value)}
      >
        <SelectTrigger
          id="language-selection"
          className="w-full truncate max-w-52"
        >
          <SelectValue placeholder={t("language.selection.placeholder")} />
        </SelectTrigger>

        <SelectContent>
          {languages.map((language) => (
            <SelectItem key={language.code} value={language.code}>
              <LanguagesIcon />
              {language.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
