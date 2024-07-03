import { useEffect } from "react";

export const useOutsideClickClose = (
  ref: React.RefObject<HTMLDivElement>,
  handleClickOutsideCallback: () => void
) => {
  useEffect(() => {
    const handleKeyEscClose = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleClickOutsideCallback();
        event.preventDefault();
      }
    };

    const handleClickOutsideClose = (e: MouseEvent) => {
      if (ref!.current && !ref!.current!.contains(e.target as Node)) {
        handleClickOutsideCallback();
      }
    };

    document.addEventListener("mousedown", handleClickOutsideClose);
    document.addEventListener("keydown", handleKeyEscClose);
    return () => {
      document.removeEventListener("mousedown", handleClickOutsideClose);
      document.removeEventListener("keydown", handleKeyEscClose);
    };
  }, []);
};
