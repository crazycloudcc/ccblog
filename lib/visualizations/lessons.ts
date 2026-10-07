export const lessons = {
  "binary-search": {
    title: "二分查找：窗口怎样缩小",
    description: "逐步观察 lo、hi、mid，比较正确更新与窗口停滞，区分未命中和死循环。",
    goals: ["认出闭区间 [lo, hi] 与本轮中点", "解释为什么比较后必须跳过 mid", "区分窗口停滞与整数溢出"],
    summary: "有序数组 [1, 3, 5, 7, 9] 查找 9：窗口依次为 [0, 4]、[3, 4]、[4, 4]，最后返回下标 4。每次未命中都排除已经比较过的 mid。",
    invariant: "目标若存在，就仍在闭区间 [lo, hi] 中。正确更新为 lo = mid + 1 或 hi = mid - 1；lo > hi 时返回 -1。",
    question: "[1, 3] 查找 3，第一次 mid = 0。若写 lo = mid，下一轮窗口是什么？",
    answer: "仍是 [0, 1]，中点也仍是 0。窗口没有缩小。改成 lo = mid + 1 后窗口变为 [1, 1]，下一轮命中。",
  },
  "longest-increasing-subsequence": {
    title: "LIS：替换结尾，还是延长",
    description: "一步一格观察 tails，切换严格递增与非下降，理解相等元素为何不能延长严格 LIS。",
    goals: ["理解 tails 每格对应的最小结尾", "对比 lower_bound 与 upper_bound", "解释 tails 不一定是一条真实子序列"],
    summary: "输入 [2, 2, 2]：严格递增时，每个 2 都落到第一个大于等于它的位置，tails 始终为 [2]，长度为 1；允许相等时，每个 2 都追加，非下降长度为 3。",
    invariant: "tails[i] 是已读前缀中，长度 i + 1 的递增子序列的最小结尾。它的长度是答案，但这些结尾未必来自同一条子序列。",
    question: "输入 [3, 5, 7, 1, 2, 8]，最终 tails = [1, 2, 7, 8]。它是一条原数组子序列吗？",
    answer: "不是。7 在 1、2 之前，不能按这个顺序取出。长度 4 仍然正确，例如原数组里的 [3, 5, 7, 8]。tails 保存的是各个长度的最小结尾。",
  },
} as const;
export type LessonSlug = keyof typeof lessons;
export function getLesson(slug: string) {
  return Object.prototype.hasOwnProperty.call(lessons, slug) ? lessons[slug as LessonSlug] : undefined;
}
