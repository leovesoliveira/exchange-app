import { useMediaQuery } from "@/hooks/use-media-query";
import { Currency } from "@/value-objects/currency";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import { CircleDollarSignIcon, CircleOffIcon } from "lucide-react";
import { ComponentProps, useState } from "react";
import { useTranslation } from "react-i18next";
import { CountryFlag } from "./country-flag";
import { Button } from "./ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./ui/drawer";

export type CurrencySelectProps = {
  id?: string;
  currency: Currency | null;
  setCurrency: (currency: Currency | null) => void;
};

export const CurrencySelect = ({
  id = "",
  currency,
  setCurrency,
}: CurrencySelectProps) => {
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger className="w-full truncate" id={id} asChild>
          <ButtonTrigger currency={currency} />
        </PopoverTrigger>

        <PopoverContent className="z-[1100] w-full p-0" align="start">
          <CurrencyList setOpen={setOpen} setSelected={setCurrency} />
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen} autoFocus={open}>
      <DrawerTrigger className="w-full truncate" id={id} asChild>
        <ButtonTrigger currency={currency} />
      </DrawerTrigger>

      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{t("currency.select.list.title")}</DrawerTitle>

          <DrawerDescription>
            {t("currency.select.list.description")}
          </DrawerDescription>
        </DrawerHeader>

        <div className="border-t">
          <CurrencyList setOpen={setOpen} setSelected={setCurrency} />
        </div>
      </DrawerContent>
    </Drawer>
  );
};

const CurrencyLabel = ({ currency }: { currency: Currency }) => {
  const { t } = useTranslation();

  return (
    <div className="flex w-full items-center gap-2 truncate">
      <span className="font-mono text-lg font-normal">{currency}</span>

      <CountryFlag currency={currency} />

      <span className="w-full truncate text-left font-normal">
        {t(`currency.name.${currency}`)}
      </span>
    </div>
  );
};

const ButtonTrigger = ({
  currency,
  ...rest
}: { currency: Currency | null } & ComponentProps<"button">) => {
  const { t } = useTranslation();

  return (
    <Button variant="outline" className="w-full" {...rest}>
      {currency ? (
        <CurrencyLabel currency={currency} />
      ) : (
        <div className="flex w-full items-center gap-2">
          <CircleDollarSignIcon width={24} height={24} />
          <span className="w-full truncate text-left font-normal">
            {t("currency.select.empty")}
          </span>
        </div>
      )}
    </Button>
  );
};

const CurrencyList = ({
  setOpen,
  setSelected,
}: {
  setOpen: (open: boolean) => void;
  setSelected: (currency: Currency | null) => void;
}) => {
  const { t } = useTranslation();

  return (
    <Command className="border-secondary border shadow-lg">
      <CommandInput placeholder={t("currency.select.list.placeholder")} />
      <CommandList>
        <CommandEmpty className="flex flex-col items-center justify-center gap-2 py-8">
          <CircleOffIcon className="text-muted-foreground h-8 w-8" />
          <span className="text-muted-foreground text-sm">
            {t("currency.select.list.empty")}
          </span>
        </CommandEmpty>

        <CommandGroup>
          {Object.values(Currency).map((currency) => (
            <CommandItem
              key={currency}
              value={currency}
              onSelect={(value) => {
                setSelected((value as Currency) || null);
                setOpen(false);
              }}
            >
              <CurrencyLabel currency={currency} />
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
};
