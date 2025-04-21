import { Theme } from "@/stores/interface/interface-state";
import { useInterfaceStore } from "@/stores/interface/interface-store";
import {
  LaptopMinimalIcon,
  MoonIcon,
  SunIcon,
  SunMoonIcon,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

export const ThemeSelection = () => {
  const { t } = useTranslation();
  const { theme, setTheme } = useInterfaceStore();

  return (
    <div className="flex px-4 gap-4 justify-between items-center">
      <Label htmlFor="theme-selection">
        <SunMoonIcon width={20} height={20} />
        {t("theme.selection.label")}
      </Label>

      <Select
        defaultValue={theme}
        onValueChange={(value: Theme) => setTheme(value)}
      >
        <SelectTrigger
          id="theme-selection"
          className="w-full truncate max-w-52"
        >
          <SelectValue placeholder={t("theme.selection.placeholder")} />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="system" className="flex items-center">
            <LaptopMinimalIcon />
            {t("theme.selection.system")}
          </SelectItem>

          <SelectItem value="light">
            <SunIcon />
            {t("theme.selection.light")}
          </SelectItem>

          <SelectItem value="dark">
            <MoonIcon />
            {t("theme.selection.dark")}
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
