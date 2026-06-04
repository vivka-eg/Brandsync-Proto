import { useEffect } from "react";

/** Lottie used in place of the info icon for builder loading toasts (`public/animations/Arrange-Front.json`). */
const AD_BUILDER_TOAST_LOTTIE = "/animations/Arrange-Front.json";

/** Rotating copy while the builder waits on initial logo / asset data (full-page loader). */
const SETUP_TOAST_MESSAGES = [
  "Loading templates…",
  "Loading logos…",
  "Loading palettes…",
  "Loading images…",
  "Setting things up…",
];

export default function useLoadingToasts({ isLoading, isDetailLoading, prefersReducedMotion, setToast }) {
  /** Initial fetch keeps `isLoading` true; cleanup closes the setup toast when data is ready. */
  useEffect(() => {
    if (!isLoading) return;

    if (prefersReducedMotion) {
      setToast({
        open: true,
        type: "info",
        message: "Setting things up…",
        duration: null,
        lottiePath: AD_BUILDER_TOAST_LOTTIE,
        showCloseButton: false,
      });
      return () => setToast((prev) => ({ ...prev, open: false }));
    }

    let step = 0;
    const tick = () => {
      setToast({
        open: true,
        type: "info",
        message: SETUP_TOAST_MESSAGES[step % SETUP_TOAST_MESSAGES.length],
        duration: null,
        lottiePath: AD_BUILDER_TOAST_LOTTIE,
        showCloseButton: false,
      });
      step += 1;
    };
    tick();
    const intervalId = window.setInterval(tick, 1400);
    return () => {
      window.clearInterval(intervalId);
      setToast((prev) => ({ ...prev, open: false }));
    };
  }, [isLoading, prefersReducedMotion, setToast]);

  useEffect(() => {
    if (isDetailLoading && !isLoading) {
      setToast({
        open: true,
        type: "info",
        message: "Loading product logo…",
        duration: 6000,
        lottiePath: AD_BUILDER_TOAST_LOTTIE,
        showCloseButton: false,
      });
    }
  }, [isDetailLoading, isLoading, setToast]);
}