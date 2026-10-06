/** Accept only the public article URL supplied by the server, never browser state. */
export function buildAiReadingPrompt(articleUrl: string, markdownUrl: string): string {
  return `请先阅读这篇公开教程：${articleUrl}\n可用的同源 Markdown：${markdownUrl}\n\n请根据原文解释这个浏览器 C/C++ Playground 的编译过程、stdin / EOF 行为、输出与退出状态，以及运行限制。给出一个适合初学者的练习。\n请在关键结论旁引用原文链接；区分原文事实与你的建议。无法读取来源或原文没有说明的部分，请明确说不知道，不要补造功能、隐私保证或性能结论。`;
}

/** Clipboard-only operation; callers display the result and retain a manual fallback. */
export async function copyAiReadingPrompt(prompt: string, write: (text: string) => Promise<void>): Promise<string> {
  try {
    await write(prompt);
    return "已复制，可自行粘贴到你选择的 AI 工具";
  } catch {
    return "复制未成功，请展开提示词并手动选择复制";
  }
}
