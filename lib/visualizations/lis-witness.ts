import { lisTrace, type LisState } from "./traces";

export type LisWitnessState = LisState & {
  processed: number;
  action: "initial" | "append" | "replace";
  previousTail: number | null;
  /** Original input indices, one per minimum ending. They need not be ordered. */
  tailIndices: number[];
  /** A genuine maximum-length subsequence of the processed prefix. */
  witnessIndices: number[];
};

/** Capture each predecessor before later input replaces its tails slot. */
export function lisWitnessTrace(values: number[], nondecreasing = false): LisWitnessState[] {
  const trace = lisTrace(values, nondecreasing);
  const tailIndices: number[] = [];
  const predecessors: number[] = [];
  return trace.map((state, processed) => {
    const position = state.position;
    if (position === null) {
      return { ...state, processed, action: "initial", previousTail: null, tailIndices: [], witnessIndices: [] };
    }
    const index = processed - 1;
    const before = trace[processed - 1];
    const append = position === before.tails.length;
    predecessors[index] = position > 0 ? tailIndices[position - 1] : -1;
    tailIndices[position] = index;
    const witnessIndices: number[] = [];
    for (let cursor = tailIndices[tailIndices.length - 1]; cursor !== -1; cursor = predecessors[cursor]) {
      witnessIndices.push(cursor);
    }
    witnessIndices.reverse();
    return {
      ...state, processed, action: append ? "append" : "replace",
      previousTail: append ? null : before.tails[position],
      tailIndices: [...tailIndices], witnessIndices,
    };
  });
}
