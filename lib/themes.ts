export type ThemeMode = "light" | "dark";

export type ThemeTokens = {
  ink: string;
  slate: string;
  fog: string;
  mist: string;
  paper: string;
  terminalBg: string;
  terminalDesk: string;
  border: string;
  codePlum: string;
  codeCobalt: string;
  codeTeal: string;
  codeRust: string;
  gridLine: string;
  shadow: string;
};

export type ThemeScheme = {
  id: string;
  name: string;
  description: string;
  traits: string[];
  light: ThemeTokens;
  dark: ThemeTokens;
};

export const themeSchemes: ThemeScheme[] = [
  {
    id: "a",
    name: "Lavender Terminal",
    description:
      "当前站点风格的延伸。浅色是靛紫文字 + 薰衣草底，深色是午夜靛蓝底 + 柔和紫灰文字，语法色保持克制。",
    traits: ["延续现有", "靛紫主调", "双模式均衡"],
    light: {
      ink: "#303055",
      slate: "#403f53",
      fog: "#767682",
      mist: "#a8a8b0",
      paper: "#ffffff",
      terminalBg: "#fafaff",
      terminalDesk: "#ececf4",
      border: "#e8e8f2",
      codePlum: "#8844ae",
      codeCobalt: "#3b61b0",
      codeTeal: "#096e72",
      codeRust: "#984e4d",
      gridLine: "rgba(48, 48, 85, 0.05)",
      shadow: "0 16px 48px rgba(48, 48, 85, 0.1)",
    },
    dark: {
      ink: "#e8e8f2",
      slate: "#c4c4d0",
      fog: "#9494a8",
      mist: "#6b6b80",
      paper: "#16162a",
      terminalBg: "#1e1e36",
      terminalDesk: "#12121f",
      border: "#2e2e4a",
      codePlum: "#c084ea",
      codeCobalt: "#7aa2f7",
      codeTeal: "#4fd6be",
      codeRust: "#f7768e",
      gridLine: "rgba(232, 232, 242, 0.04)",
      shadow: "0 16px 48px rgba(0, 0, 0, 0.45)",
    },
  },
  {
    id: "b",
    name: "Phosphor Green",
    description:
      "经典终端荧光感。浅色像旧式纸张终端，深色是真·黑底绿字，光标与提示符带轻微磷光感，极客味最浓。",
    traits: ["荧光绿", "复古终端", "高辨识度"],
    light: {
      ink: "#1a3b2a",
      slate: "#3d5c4a",
      fog: "#5f7a6a",
      mist: "#8aa897",
      paper: "#f6fff8",
      terminalBg: "#f0faf2",
      terminalDesk: "#e3f2e7",
      border: "#cfe6d6",
      codePlum: "#2f855a",
      codeCobalt: "#2b6cb0",
      codeTeal: "#0d9488",
      codeRust: "#c05621",
      gridLine: "rgba(26, 59, 42, 0.06)",
      shadow: "0 16px 40px rgba(26, 59, 42, 0.12)",
    },
    dark: {
      ink: "#9ef0b0",
      slate: "#7fd99a",
      fog: "#5db87a",
      mist: "#3f8f5a",
      paper: "#0a120c",
      terminalBg: "#0d1610",
      terminalDesk: "#060a08",
      border: "#1f3d2a",
      codePlum: "#b3f0c0",
      codeCobalt: "#7ec8e3",
      codeTeal: "#56d7a8",
      codeRust: "#f0a870",
      gridLine: "rgba(158, 240, 176, 0.05)",
      shadow: "0 16px 48px rgba(0, 0, 0, 0.55)",
    },
  },
  {
    id: "c",
    name: "Midnight IDE",
    description:
      "现代 IDE 风格。浅色干净偏冷白，深色接近 VS Code / GitHub Dark，钴蓝与青绿语法色，开发者最熟悉。",
    traits: ["IDE 风格", "钴蓝强调", "熟悉感强"],
    light: {
      ink: "#1f2937",
      slate: "#4b5563",
      fog: "#6b7280",
      mist: "#9ca3af",
      paper: "#ffffff",
      terminalBg: "#f8fafc",
      terminalDesk: "#eef2f7",
      border: "#e2e8f0",
      codePlum: "#7c3aed",
      codeCobalt: "#2563eb",
      codeTeal: "#0891b2",
      codeRust: "#dc2626",
      gridLine: "rgba(31, 41, 55, 0.05)",
      shadow: "0 16px 40px rgba(15, 23, 42, 0.1)",
    },
    dark: {
      ink: "#e6edf3",
      slate: "#b6c2cf",
      fog: "#8b9cb3",
      mist: "#6e7681",
      paper: "#0d1117",
      terminalBg: "#161b22",
      terminalDesk: "#010409",
      border: "#30363d",
      codePlum: "#d2a8ff",
      codeCobalt: "#79c0ff",
      codeTeal: "#56d4dd",
      codeRust: "#ff7b72",
      gridLine: "rgba(230, 237, 243, 0.04)",
      shadow: "0 16px 48px rgba(0, 0, 0, 0.5)",
    },
  },
  {
    id: "d",
    name: "Warm Manuscript",
    description:
      "暖色手稿感。浅色是米白纸张 + 深褐文字，深色是炭灰底 + 暖灰字，锈红作点缀，阅读氛围更柔和。",
    traits: ["暖色纸感", "阅读友好", "低刺激"],
    light: {
      ink: "#3d2f2a",
      slate: "#5c4d47",
      fog: "#8a7a73",
      mist: "#b0a49e",
      paper: "#fffef9",
      terminalBg: "#faf8f2",
      terminalDesk: "#f0ebe3",
      border: "#e8dfd4",
      codePlum: "#8b5e3c",
      codeCobalt: "#4a6fa5",
      codeTeal: "#3a7d6f",
      codeRust: "#b45309",
      gridLine: "rgba(61, 47, 42, 0.05)",
      shadow: "0 16px 40px rgba(61, 47, 42, 0.1)",
    },
    dark: {
      ink: "#f0e8df",
      slate: "#cfc3b8",
      fog: "#a6978c",
      mist: "#7d6f66",
      paper: "#1f1b18",
      terminalBg: "#292420",
      terminalDesk: "#14110f",
      border: "#3f3832",
      codePlum: "#e0a96d",
      codeCobalt: "#8cb4e0",
      codeTeal: "#7ec8b0",
      codeRust: "#f0906c",
      gridLine: "rgba(240, 232, 223, 0.04)",
      shadow: "0 16px 48px rgba(0, 0, 0, 0.48)",
    },
  },
  {
    id: "e",
    name: "Binary Contrast",
    description:
      "极简高对比。浅色近乎纯黑白，深色纯黑底白字，仅保留一种强调色（钴蓝），信息层级靠字重和间距区分。",
    traits: ["极简", "高对比", "单强调色"],
    light: {
      ink: "#111111",
      slate: "#444444",
      fog: "#777777",
      mist: "#aaaaaa",
      paper: "#ffffff",
      terminalBg: "#ffffff",
      terminalDesk: "#f3f3f3",
      border: "#e5e5e5",
      codePlum: "#111111",
      codeCobalt: "#2563eb",
      codeTeal: "#111111",
      codeRust: "#111111",
      gridLine: "rgba(0, 0, 0, 0.06)",
      shadow: "0 12px 32px rgba(0, 0, 0, 0.08)",
    },
    dark: {
      ink: "#f2f2f2",
      slate: "#c8c8c8",
      fog: "#9a9a9a",
      mist: "#6b6b6b",
      paper: "#000000",
      terminalBg: "#0a0a0a",
      terminalDesk: "#000000",
      border: "#2a2a2a",
      codePlum: "#f2f2f2",
      codeCobalt: "#5b9cff",
      codeTeal: "#f2f2f2",
      codeRust: "#f2f2f2",
      gridLine: "rgba(255, 255, 255, 0.05)",
      shadow: "0 16px 48px rgba(0, 0, 0, 0.65)",
    },
  },
];

export function getThemeScheme(id: string): ThemeScheme | undefined {
  return themeSchemes.find((scheme) => scheme.id === id);
}
