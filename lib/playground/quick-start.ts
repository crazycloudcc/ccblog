import { templates } from "@/lib/playground/templates";
import type { PlaygroundLanguage } from "@/lib/playground/types";

const examples = [
  {
    language: "c" as PlaygroundLanguage,
    label: "hello.c",
    title: "C · Hello World",
    description: "用 printf 输出一行文字，不需要输入。Print a line with printf; no input needed.",
    expectedOutput: "Hello, World\n",
  },
  {
    language: "c" as PlaygroundLanguage,
    label: "a+b.c",
    title: "C · scanf 输入求和",
    description: "用 scanf 读取两个整数，再输出它们的和。Read two integers from stdin and print their sum.",
    expectedOutput: "7\n",
  },
  {
    language: "cpp" as PlaygroundLanguage,
    label: "sort.cpp",
    title: "C++ · std::sort 排序",
    description: "先输入个数，再输入整数序列，按升序输出。Read a count and its integers, then sort them in ascending order.",
    expectedOutput: "1 2 3 4 5 \n",
  },
];

// The gallery and editor share the exact same source and sample input.
export const quickStartExamples = examples.map((example) => {
  const template = templates[example.language].find(({ label }) => label === example.label);
  if (!template) throw new Error(`Missing quick-start template: ${example.label}`);
  return { ...example, source: template.source, stdin: template.sampleStdin ?? "" };
});
