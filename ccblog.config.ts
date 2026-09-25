import type { CcblogConfig } from "@/lib/types/config";

/**
 * ccblog site configuration.
 *
 * This is the ONLY file you need to edit to rebrand the site after a fork:
 * change the identity, social links, and feature flags below, then deploy.
 *
 * Everything works with zero environment variables on `npm run dev`. In
 * production set NEXT_PUBLIC_SITE_URL (and optionally NEXT_PUBLIC_CCBLOG_BRANCH).
 */
const config: CcblogConfig = {
  name: "crazycloudcc",
  author: "crazycloudcc",
  handle: "crazycloudcc",
  initials: "cc",
  logo: "/logo.png",
  description: "在浏览器里用 clang 编译运行 C++ 的中文笔记，不用安装编译器。",
  tagline: "浏览器 C++ · 笔记",
  ogTagline: "浏览器里编译运行 C++，不用安装。",
  topics: ["cpp", "wasm", "notes"],
  url: "https://crazycloud.cc",
  locale: "zh-CN",
  lang: "zh-CN",
  branch: "main",
  social: [
    {
      label: "Email",
      handle: "crazycloudcc@gmail.com",
      href: "mailto:crazycloudcc@gmail.com",
      icon: "email",
    },
    {
      label: "GitHub",
      handle: "github.com/crazycloudcc",
      href: "https://github.com/crazycloudcc/ccblog",
      icon: "github",
    },
    {
      label: "X",
      handle: "x.com/crazycloudccc",
      href: "https://x.com/crazycloudccc",
      icon: "x",
    },
  ],
  features: {
    blog: true,
    apps: true,
    playground: true,
    about: true,
  },
  apps: {
    developerId: 495069166,
    taglines: {
      "Final Ticket Plan": "Trade Up to the Final",
      "Weather Trace": "Local weather forecast",
      "LocalBeats": "Ad-Free · No Internet",
      "Cheer Loop": "Cheer Text & Doodle",
      "Travel Speaker": "Voice Translator for Travel",
      "IdeaMic": "Private Voice Idea Notes",
      "PDF Tools Pro": "Scan, Edit, Merge, Encrypt",
      "Noise Mixer": "Sleep & Focus Sounds",
      "cYBerScRipts": "Protocol: The Idle Netrunner",
      "EndlessBattle": "Puzzle",
    },
  },
  playground: {
    githubRepo: "crazycloudcc/ccblog",
  },
  source: {
    label: "ccblog",
    href: "https://github.com/crazycloudcc/ccblog",
    enabled: true,
  },
};

export default config;
