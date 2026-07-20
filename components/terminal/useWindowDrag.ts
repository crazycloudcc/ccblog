"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type WindowRect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type DragMode = "move" | "resize-e" | "resize-s" | "resize-se" | null;

const MIN_WIDTH = 480;
const MIN_HEIGHT = 320;
const EDGE_ZONE = 8;

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function detectEdge(
  clientX: number,
  clientY: number,
  rect: DOMRect,
): DragMode {
  const nearRight = clientX >= rect.right - EDGE_ZONE;
  const nearBottom = clientY >= rect.bottom - EDGE_ZONE;

  if (nearRight && nearBottom) return "resize-se";
  if (nearRight) return "resize-e";
  if (nearBottom) return "resize-s";

  return null;
}

export function useWindowDrag() {
  const windowRef = useRef<HTMLDivElement | null>(null);
  const titleBarRef = useRef<HTMLDivElement | null>(null);

  const [rect, setRect] = useState<WindowRect | null>(null);
  const [resizeCursor, setResizeCursor] = useState<string>("");

  const modeRef = useRef<DragMode>(null);
  const startMouseRef = useRef({ x: 0, y: 0 });
  const startRectRef = useRef<WindowRect>({ x: 0, y: 0, width: 0, height: 0 });

  const initRect = useCallback(() => {
    if (!windowRef.current) return;
    const parent = windowRef.current.parentElement;
    if (!parent) return;

    const parentRect = parent.getBoundingClientRect();
    const windowRect = windowRef.current.getBoundingClientRect();

    setRect({
      x: windowRect.left - parentRect.left,
      y: windowRect.top - parentRect.top,
      width: windowRect.width,
      height: windowRect.height,
    });
  }, []);

  useEffect(() => {
    if (rect) return;

    const frame = requestAnimationFrame(initRect);
    return () => cancelAnimationFrame(frame);
  }, [rect, initRect]);

  const onPointerDown = useCallback(
    (event: PointerEvent) => {
      if (!windowRef.current || !rect) return;
      if (event.button !== 0) return;

      const domRect = windowRef.current.getBoundingClientRect();
      const edge = detectEdge(event.clientX, event.clientY, domRect);

      if (edge) {
        modeRef.current = edge;
      } else if (
        titleBarRef.current &&
        titleBarRef.current.contains(event.target as Node)
      ) {
        const target = event.target as HTMLElement;
        if (target.closest("button, a, [role=button]")) return;
        modeRef.current = "move";
      } else {
        return;
      }

      startMouseRef.current = { x: event.clientX, y: event.clientY };
      startRectRef.current = { ...rect };
      event.preventDefault();
      (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
    },
    [rect],
  );

  const onPointerMove = useCallback(
    (event: PointerEvent) => {
      if (!windowRef.current || !rect) return;

      const mode = modeRef.current;

      if (!mode) {
        const domRect = windowRef.current.getBoundingClientRect();
        const edge = detectEdge(event.clientX, event.clientY, domRect);
        if (edge === "resize-se") setResizeCursor("cursor-nwse-resize");
        else if (edge === "resize-e") setResizeCursor("cursor-ew-resize");
        else if (edge === "resize-s") setResizeCursor("cursor-ns-resize");
        else setResizeCursor("");
        return;
      }

      const dx = event.clientX - startMouseRef.current.x;
      const dy = event.clientY - startMouseRef.current.y;
      const start = startRectRef.current;
      const parent = windowRef.current.parentElement;
      if (!parent) return;
      const parentRect = parent.getBoundingClientRect();

      if (mode === "move") {
        setRect({
          ...start,
          x: clamp(start.x + dx, -start.width + 100, parentRect.width - 100),
          y: clamp(start.y + dy, 0, parentRect.height - 40),
        });
      } else {
        const next = { ...start };

        if (mode === "resize-e" || mode === "resize-se") {
          next.width = clamp(start.width + dx, MIN_WIDTH, parentRect.width - start.x);
        }

        if (mode === "resize-s" || mode === "resize-se") {
          next.height = clamp(start.height + dy, MIN_HEIGHT, parentRect.height - start.y);
        }

        setRect(next);
      }
    },
    [rect],
  );

  const onPointerUp = useCallback(() => {
    modeRef.current = null;
  }, []);

  const resetPosition = useCallback(() => {
    setRect(null);
  }, []);

  const style: React.CSSProperties | undefined = rect
    ? {
        position: "absolute",
        left: rect.x,
        top: rect.y,
        width: rect.width,
        height: rect.height,
        margin: 0,
        maxWidth: "none",
      }
    : undefined;

  return {
    windowRef,
    titleBarRef,
    style,
    resizeCursor,
    positioned: rect !== null,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    resetPosition,
  };
}
