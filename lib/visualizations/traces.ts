export type BinaryState = {
  lo: number;
  hi: number;
  mid: number | null;
  message: string;
  status: "compare" | "found" | "missing" | "stalled";
};

export type LisState = {
  tails: number[];
  position: number | null;
  value: number | null;
  message: string;
};

export type ParsedValues = { values: number[]; error?: string };

/** Parse complete decimal integers; keep the visual lesson small and readable. */
export function parseValues(raw: string): ParsedValues {
  const fail = (error: string): ParsedValues => ({ values: [], error });
  const trimmed = raw.trim();
  if (!trimmed) return fail("请输入至少一个整数。");
  const groups = trimmed.split(/[,，]/);
  if (groups.some((group) => !group.trim())) {
    return fail("逗号之间不能留空，请输入完整整数。");
  }
  const tokens = groups.flatMap((group) => group.trim().split(/\s+/));
  if (tokens.length > 12) return fail("最多输入 12 个整数，方便逐步观察。");
  if (tokens.some((token) => !/^[+-]?\d+$/.test(token))) {
    return fail("只接受完整整数，请用空格或逗号分隔。");
  }
  const values = tokens.map(Number);
  if (values.some((value) => !Number.isFinite(value) || Math.abs(value) > 999)) {
    return fail("每个整数必须在 -999 到 999 之间。");
  }
  return { values };
}

/** Closed-interval search. The caller supplies ascending, finite values. */
export function binaryTrace(values: number[], target: number, broken = false): BinaryState[] {
  const states: BinaryState[] = [];
  let lo = 0;
  let hi = values.length - 1;
  while (lo <= hi) {
    const mid = lo + Math.floor((hi - lo) / 2);
    const value = values[mid];
    if (value === target) {
      states.push({ lo, hi, mid, status: "found", message: `a[${mid}] = ${value}，等于目标 ${target}；命中并返回下标 ${mid}。` });
      return states;
    }
    const moveRight = value < target;
    const nextLo = moveRight ? mid + (broken ? 0 : 1) : lo;
    const nextHi = moveRight ? hi : mid - (broken ? 0 : 1);
    const update = moveRight
      ? `lo = mid${broken ? "" : " + 1"} = ${nextLo}`
      : `hi = mid${broken ? "" : " - 1"} = ${nextHi}`;
    states.push({
      lo, hi, mid, status: "compare",
      message: `a[${mid}] = ${value} ${moveRight ? "<" : ">"} ${target}；下一步 ${update}。${broken ? "错误更新仍保留已比较的 mid。" : "跳过已比较的 mid，窗口严格缩小。"}`,
    });
    if (nextLo === lo && nextHi === hi) {
      states.push({ lo, hi, mid, status: "stalled", message: `窗口仍是 [${lo}, ${hi}]，mid 仍是 ${mid}：同一次比较将无限重复。演示已安全停止；正确更新必须跳过 mid。` });
      return states;
    }
    lo = nextLo;
    hi = nextHi;
  }
  states.push({ lo, hi, mid: null, status: "missing", message: `lo = ${lo} > hi = ${hi}，区间已空；目标 ${target} 不在数组中，返回 -1。` });
  return states;
}

/** Each snapshot owns its tails array. Tails encodes minimum endings, not a subsequence. */
export function lisTrace(values: number[], nondecreasing = false): LisState[] {
  const kind = nondecreasing ? "非下降子序列" : "严格递增子序列";
  const relation = nondecreasing ? ">" : ">=";
  const states: LisState[] = [{ tails: [], position: null, value: null, message: `还未读取输入，tails 为空，${kind}长度为 0。tails 存最小结尾，不保证是一条真实子序列。` }];
  const tails: number[] = [];
  for (const value of values) {
    let lo = 0;
    let hi = tails.length;
    while (lo < hi) {
      const mid = lo + Math.floor((hi - lo) / 2);
      if (nondecreasing ? tails[mid] <= value : tails[mid] < value) lo = mid + 1;
      else hi = mid;
    }
    const previous = tails[lo];
    const append = lo === tails.length;
    tails[lo] = value;
    states.push({
      tails: [...tails], position: lo, value,
      message: append
        ? `读到 ${value}：找不到 ${relation} ${value} 的结尾，追加到 tails[${lo}]；${kind}长度变为 ${tails.length}。`
        : `读到 ${value}：第一个 ${relation} ${value} 的位置是 ${lo}，用 ${value} 替换 ${previous}；${kind}长度仍是 ${tails.length}。`,
    });
  }
  return states;
}
