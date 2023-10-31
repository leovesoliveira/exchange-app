import { useCallback, useEffect } from "react";

/**
  React hook to update the CSS custom properties `--viewport-height` and
  `--viewport-width` when the window is resized.

  Alternatively, an object with properties `height` and `width` can be
  used with the CSS custom properties to update can be provided instead.

  @param {object} [props]
  - React hook inputs.
 
  @param {string} props.height
  - CSS custom property name to update when viewport height changes.
 
  @param {string} props.width
  - CSS custom property name to update when viewport width changes.
 
  @returns {{ "height": string, "width": string }}
    CSS custom property names updated when viewport changes.
 */

export function useVisualViewport(
  { height, width } = {
    height: "--viewport-height",
    width: "--viewport-width",
  }
) {
  /**
    Update the CSS custom properties `--viewport-height` and
    `--viewport-width` when the window is resized.

    @returns {void}
   */

  const updateViewport = useCallback(
    function updateViewport() {
      if (
        typeof window !== "undefined" &&
        typeof document !== "undefined" &&
        typeof document.documentElement !== "undefined"
      ) {
        if (typeof window.visualViewport === "undefined") {
          document.documentElement.style.setProperty(
            height,
            `${window.innerHeight}px`
          );

          document.documentElement.style.setProperty(
            width,
            `${window.innerWidth}px`
          );
        } else {
          document.documentElement.style.setProperty(
            height,
            `${window.visualViewport.height}px`
          );

          document.documentElement.style.setProperty(
            width,
            `${window.visualViewport.width}px`
          );
        }
      }
    },
    [height, width]
  );

  useEffect(
    function () {
      if (typeof window !== "undefined") {
        updateViewport();

        if (typeof window.visualViewport === "undefined") {
          window.addEventListener("resize", updateViewport);

          return function () {
            window.removeEventListener("resize", updateViewport);
          };
        }

        window.visualViewport.addEventListener("resize", updateViewport);

        return function () {
          window.visualViewport.removeEventListener("resize", updateViewport);
        };
      }
    },
    [updateViewport]
  );

  return { height, width };
}
