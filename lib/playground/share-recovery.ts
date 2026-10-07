export type ShareState = {
  busy: boolean;
  url: string | null;
  message: string | null;
};

// Each editor snapshot owns a session. Disposing it invalidates compression,
// clipboard completions and timers without transmitting the payload anywhere.
export function createShareSession(
  build: () => Promise<string>,
  copy: (url: string) => Promise<void>,
  schedule = (callback: () => void) => setTimeout(callback, 2000),
  cancel = (timer: ReturnType<typeof setTimeout>) => clearTimeout(timer),
) {
  let state: ShareState = { busy: false, url: null, message: null };
  let version = 0;
  let timer: ReturnType<typeof setTimeout> | undefined;
  const listeners = new Set<() => void>();
  const publish = (next: ShareState) => {
    state = next;
    listeners.forEach((listener) => listener());
  };
  const invalidate = () => {
    version++;
    if (timer !== undefined) cancel(timer);
    timer = undefined;
  };

  return {
    getSnapshot: () => state,
    subscribe(listener: () => void) {
      listeners.add(listener);
      return () => { listeners.delete(listener); };
    },
    dispose: invalidate,
    close() {
      invalidate();
      publish({ busy: false, url: null, message: null });
    },
    async share() {
      if (state.busy) return;
      invalidate();
      const attempt = version;
      let url = state.url;
      publish({ busy: true, url, message: null });
      try {
        url ??= await build();
        if (attempt !== version) return;
        await copy(url);
        if (attempt !== version) return;
        publish({ busy: false, url: null, message: "link copied" });
        timer = schedule(() => {
          if (attempt === version) publish({ busy: false, url: null, message: null });
        });
        return true;
      } catch (error) {
        if (attempt !== version) return;
        publish({
          busy: false,
          url,
          message: url
            ? "Automatic copy unavailable. Select and copy the link below."
            : error instanceof Error && error.message === "Share link is too long. Try shortening your code or stdin."
              ? "Share link is too long. Try shortening your code or stdin."
              : "Could not create a share link. Try again.",
        });
      }
    },
  };
}
