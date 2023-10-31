import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Separator } from "./ui/separator";

const currency = {
  mask: (value) => {
    return value
      .replace(/\D/g, "")
      .padStart(3, "0")
      .replace(/(\d)(\d{2})$/, "$1,$2")
      .replace(/(?=(\d{3})+(\D))\B/g, ".")
      .replace(/^0+(?=\d)/, "");
  },
  unmask: (value) => {
    return value.replace(/\D/g, "").replace(",", "").replace(".", "");
  },
};

export default function App() {
  const [value, setValue] = useState(
    currency.mask(localStorage.getItem("value") ?? "")
  );
  const [tax, setTax] = useState(
    currency.mask(localStorage.getItem("tax") ?? "")
  );
  const [tip, setTip] = useState(
    currency.mask(localStorage.getItem("tip") ?? "")
  );

  const [rateCadToUsd, setRateCadToUsd] = useState(
    currency.mask(localStorage.getItem("rateCadToUsd") ?? "072")
  );
  const [rateUsdToBrl, setRateUsdToBrl] = useState(
    currency.mask(localStorage.getItem("rateUsdToBrl") ?? "498")
  );

  const [exchanges, setExchanges] = useState(
    JSON.parse(localStorage.getItem("exchanges")) ?? []
  );

  useEffect(() => {
    localStorage.setItem("value", currency.unmask(value));
  }, [value]);

  useEffect(() => {
    localStorage.setItem("tax", currency.unmask(tax));
  }, [tax]);

  useEffect(() => {
    localStorage.setItem("tip", currency.unmask(tip));
  }, [tip]);

  useEffect(() => {
    localStorage.setItem("rateCadToUsd", currency.unmask(rateCadToUsd));
  }, [rateCadToUsd]);

  useEffect(() => {
    localStorage.setItem("rateUsdToBrl", currency.unmask(rateUsdToBrl));
  }, [rateUsdToBrl]);

  useEffect(() => {
    localStorage.setItem("exchanges", JSON.stringify(exchanges));
  }, [exchanges]);

  const onExchange = () => {
    if (!parseInt(currency.unmask(value))) return;
    const valueInt = value ? parseInt(currency.unmask(value)) : 0;
    const taxInt = tax ? parseInt(currency.unmask(tax)) : 0;
    const tipInt = tip ? parseInt(currency.unmask(tip)) : 0;
    const rateCadToUsdInt = rateCadToUsd
      ? parseInt(currency.unmask(rateCadToUsd))
      : 0;
    const rateUsdToBrlInt = rateUsdToBrl
      ? parseInt(currency.unmask(rateUsdToBrl))
      : 0;

    const exchangedValueUsdInt = parseInt((valueInt * rateCadToUsdInt) / 100);
    const exchangedValueBrlInt = parseInt(
      (exchangedValueUsdInt * rateUsdToBrlInt) / 100
    );

    let totalTaxInt = 0;
    if (taxInt) totalTaxInt = parseInt(valueInt * (taxInt / 100 / 100));
    const exchangedTaxUsdInt = parseInt((totalTaxInt * rateCadToUsdInt) / 100);
    const exchangedTaxBrlInt = parseInt(
      (exchangedTaxUsdInt * rateUsdToBrlInt) / 100
    );

    let totalTipInt = 0;
    if (tipInt) totalTipInt = parseInt(valueInt * (tipInt / 100 / 100));
    const exchangedTipUsdInt = parseInt((totalTipInt * rateCadToUsdInt) / 100);
    const exchangedTipBrlInt = parseInt(
      (exchangedTipUsdInt * rateUsdToBrlInt) / 100
    );

    const exchange = {
      cad: {
        value: currency.mask(valueInt.toString()),
        tax: currency.mask(totalTaxInt.toString()),
        tip: currency.mask(totalTipInt.toString()),
        total: currency.mask((valueInt + totalTaxInt + totalTipInt).toString()),
      },
      usd: {
        value: currency.mask(exchangedValueUsdInt.toString()),
        tax: currency.mask(exchangedTaxUsdInt.toString()),
        tip: currency.mask(exchangedTipUsdInt.toString()),
        total: currency.mask(
          (
            exchangedValueUsdInt +
            exchangedTaxUsdInt +
            exchangedTipUsdInt
          ).toString()
        ),
      },
      brl: {
        value: currency.mask(exchangedValueBrlInt.toString()),
        tax: currency.mask(exchangedTaxBrlInt.toString()),
        tip: currency.mask(exchangedTipBrlInt.toString()),
        total: currency.mask(
          (
            exchangedValueBrlInt +
            exchangedTaxBrlInt +
            exchangedTipBrlInt
          ).toString()
        ),
      },
    };

    if (
      !exchanges.length ||
      (parseInt(currency.unmask(exchanges[0].usd.total)) !==
        parseInt(currency.unmask(exchange.usd.total)) &&
        parseInt(currency.unmask(exchanges[0].brl.total)) !==
          parseInt(currency.unmask(exchange.brl.total)))
    ) {
      setExchanges((prev) => [exchange, ...prev]);
    }
  };

  const sendCursorToEnd = (event) => {
    event.currentTarget.setSelectionRange(
      event.currentTarget.value.length,
      event.currentTarget.value.length
    );
  };

  return (
    <div className="max-w-md mx-auto">
      <div
        className={`fixed bottom-0 left-0 right-0 bg-white pb-12 drop-shadow-2xl z-50`}
      >
        <div className="container max-w-md">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-center my-4 tracking-tighter text-slate-800 italic">
              exchange app
            </h1>

            <Sheet>
              <SheetTrigger className="mt-3 p-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    fillRule="evenodd"
                    d="M11.828 2.25c-.916 0-1.699.663-1.85 1.567l-.091.549a.798.798 0 01-.517.608 7.45 7.45 0 00-.478.198.798.798 0 01-.796-.064l-.453-.324a1.875 1.875 0 00-2.416.2l-.243.243a1.875 1.875 0 00-.2 2.416l.324.453a.798.798 0 01.064.796 7.448 7.448 0 00-.198.478.798.798 0 01-.608.517l-.55.092a1.875 1.875 0 00-1.566 1.849v.344c0 .916.663 1.699 1.567 1.85l.549.091c.281.047.508.25.608.517.06.162.127.321.198.478a.798.798 0 01-.064.796l-.324.453a1.875 1.875 0 00.2 2.416l.243.243c.648.648 1.67.733 2.416.2l.453-.324a.798.798 0 01.796-.064c.157.071.316.137.478.198.267.1.47.327.517.608l.092.55c.15.903.932 1.566 1.849 1.566h.344c.916 0 1.699-.663 1.85-1.567l.091-.549a.798.798 0 01.517-.608 7.52 7.52 0 00.478-.198.798.798 0 01.796.064l.453.324a1.875 1.875 0 002.416-.2l.243-.243c.648-.648.733-1.67.2-2.416l-.324-.453a.798.798 0 01-.064-.796c.071-.157.137-.316.198-.478.1-.267.327-.47.608-.517l.55-.091a1.875 1.875 0 001.566-1.85v-.344c0-.916-.663-1.699-1.567-1.85l-.549-.091a.798.798 0 01-.608-.517 7.507 7.507 0 00-.198-.478.798.798 0 01.064-.796l.324-.453a1.875 1.875 0 00-.2-2.416l-.243-.243a1.875 1.875 0 00-2.416-.2l-.453.324a.798.798 0 01-.796.064 7.462 7.462 0 00-.478-.198.798.798 0 01-.517-.608l-.091-.55a1.875 1.875 0 00-1.85-1.566h-.344zM12 15.75a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5z"
                    clipRule="evenodd"
                  />
                </svg>
              </SheetTrigger>

              <SheetContent>
                <h2 className="text-xl italic font-bold mb-4">options</h2>

                <Separator />

                <div className="w-full flex flex-col my-4">
                  <Label htmlFor="cadToUsd" className="text-left mb-2">
                    rate CAD to USD
                  </Label>

                  <div className="relative flex items-center">
                    <span className="left-2 absolute text-right text-lg font-bold">
                      USD
                    </span>

                    <Input
                      id="cadToUsd"
                      placeholder="0,00"
                      value={rateCadToUsd}
                      onInput={(event) =>
                        setRateCadToUsd(currency.mask(event.target.value))
                      }
                      onFocus={sendCursorToEnd}
                      onClick={sendCursorToEnd}
                      inputMode="numeric"
                      className="text-right text-lg font-bold"
                    />
                  </div>
                </div>

                <Separator />

                <div className="w-full flex flex-col my-4">
                  <Label htmlFor="cadToUsd" className="text-left mb-2">
                    rate USD to BRL
                  </Label>

                  <div className="relative flex items-center">
                    <span className="left-2 absolute text-right text-lg font-bold">
                      BRL
                    </span>

                    <Input
                      id="cadToUsd"
                      placeholder="0,00"
                      value={rateUsdToBrl}
                      onInput={(event) =>
                        setRateUsdToBrl(currency.mask(event.target.value))
                      }
                      onFocus={sendCursorToEnd}
                      onClick={sendCursorToEnd}
                      inputMode="numeric"
                      className="text-right text-lg font-bold"
                    />
                  </div>
                </div>

                <Separator />

                <Button
                  className="mt-4 w-full"
                  onClick={() => setExchanges([])}
                >
                  clean exchanges
                </Button>
              </SheetContent>
            </Sheet>
          </div>

          <div className="flex flex-wrap gap-2">
            <div className="w-full">
              <Label htmlFor="value">value</Label>

              <div className="relative flex items-center">
                <span className="left-2 absolute text-right text-lg font-bold">
                  CAD
                </span>

                <Input
                  id="value"
                  placeholder="0,00"
                  value={value}
                  onInput={(event) =>
                    setValue(currency.mask(event.target.value))
                  }
                  onFocus={sendCursorToEnd}
                  onClick={sendCursorToEnd}
                  inputMode="numeric"
                  className="text-right text-lg font-bold"
                />
              </div>
            </div>

            <div className="flex-1">
              <Label htmlFor="tax">tax</Label>

              <div className="relative flex items-center">
                <span className="left-2 absolute text-right text-lg font-bold">
                  %
                </span>

                <Input
                  id="tax"
                  placeholder="0,00"
                  value={tax}
                  onChange={(event) =>
                    setTax(currency.mask(event.target.value))
                  }
                  onFocus={sendCursorToEnd}
                  onClick={sendCursorToEnd}
                  inputMode="numeric"
                  className="text-right text-lg font-bold"
                />
              </div>
            </div>

            <div className="flex-1">
              <Label htmlFor="tip">tip</Label>

              <div className="relative flex items-center">
                <span className="left-2 absolute text-right text-lg font-bold">
                  %
                </span>

                <Input
                  id="tip"
                  placeholder="0,00"
                  value={tip}
                  onChange={(event) =>
                    setTip(currency.mask(event.target.value))
                  }
                  onFocus={sendCursorToEnd}
                  onClick={sendCursorToEnd}
                  inputMode="numeric"
                  className="text-right text-lg font-bold"
                />
              </div>
            </div>
          </div>

          <Button className="mt-4 w-full" onClick={onExchange}>
            exchange
          </Button>
        </div>
      </div>

      <div className="mb-[19.25rem] flex flex-col gap-3 pb-3 relative [&>*:nth-child(2)]:mt-[7.5rem]">
        {exchanges.length ? (
          exchanges.map((exchange, index) => (
            <div
              key={index}
              className="flex flex-col opacity-50 first:opacity-100 first:fixed first:z-50 first:w-full first:max-w-md"
            >
              <div className="flex justify-between gap-4 pl-2 items-center bg-white drop-shadow">
                <p className="flex flex-col w-[30%]">
                  <span className="leading-none text-xs font-bold">value</span>
                  <span className="text-left leading-none text-sm">
                    {exchange?.cad?.value}
                  </span>
                </p>

                <p className="flex flex-col w-[30%]">
                  <span className="leading-none text-xs font-bold">tax</span>
                  <span className="text-left leading-none text-sm">
                    {exchange?.cad?.tax}
                  </span>
                </p>

                <p className="flex flex-col w-[30%]">
                  <span className="leading-none text-xs font-bold">tip</span>
                  <span className="text-left leading-none text-sm">
                    {exchange?.cad?.tip}
                  </span>
                </p>

                <p className="flex justify-between py-1 px-2 bg-slate-100 min-w-[8rem] flex-shrink-0">
                  <span className="text-lg font-bold text-[rgba(227,6,22,0.5)]">
                    CAD
                  </span>

                  <span className="text-left text-lg font-bold text-[rgba(227,6,22,1)]">
                    {exchange?.cad?.total}
                  </span>
                </p>
              </div>

              <div className="flex justify-between gap-4 pl-2 items-center bg-white drop-shadow">
                <p className="flex flex-col w-[30%]">
                  <span className="leading-none text-xs font-bold">value</span>
                  <span className="text-left leading-none text-sm">
                    {exchange?.usd?.value}
                  </span>
                </p>

                <p className="flex flex-col w-[30%]">
                  <span className="leading-none text-xs font-bold">tax</span>
                  <span className="text-left leading-none text-sm">
                    {exchange?.usd?.tax}
                  </span>
                </p>

                <p className="flex flex-col w-[30%]">
                  <span className="leading-none text-xs font-bold">tip</span>
                  <span className="text-left leading-none text-sm">
                    {exchange?.usd?.tip}
                  </span>
                </p>

                <p className="flex justify-between py-1 px-2 bg-slate-100 min-w-[8rem] flex-shrink-0">
                  <span className="text-lg font-bold text-[rgba(1,42,123,0.5)]">
                    USD
                  </span>

                  <span className="text-left text-lg font-bold text-[rgba(1,42,123,1)]">
                    {exchange?.usd?.total}
                  </span>
                </p>
              </div>

              <div className="flex justify-between gap-4 pl-2 items-center bg-white drop-shadow">
                <p className="flex flex-col w-[30%]">
                  <span className="leading-none text-xs font-bold">value</span>
                  <span className="text-left leading-none text-sm">
                    {exchange?.brl?.value}
                  </span>
                </p>

                <p className="flex flex-col w-[30%]">
                  <span className="leading-none text-xs font-bold">tax</span>
                  <span className="text-left leading-none text-sm">
                    {exchange?.brl?.tax}
                  </span>
                </p>

                <p className="flex flex-col w-[30%]">
                  <span className="leading-none text-xs font-bold">tip</span>
                  <span className="text-left leading-none text-sm">
                    {exchange?.brl?.tip}
                  </span>
                </p>

                <p className="flex justify-between py-1 px-2 bg-slate-100 min-w-[8rem] flex-shrink-0">
                  <span className="text-lg font-bold text-[rgba(0,151,57,0.5)]">
                    BRL
                  </span>

                  <span className="text-left text-lg font-bold text-[rgba(0,151,57,1)]">
                    {exchange?.brl?.total}
                  </span>
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center mt-8 text-xl text-slate-400 italic">
            without exchanges!
          </p>
        )}
      </div>
    </div>
  );
}
