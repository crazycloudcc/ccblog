import Link from "next/link";
import { SchemeAlternating } from "@/components/blog/layouts/SchemeAlternating";
import { SchemeBento } from "@/components/blog/layouts/SchemeBento";
import { SchemeEditorial } from "@/components/blog/layouts/SchemeEditorial";
import { SchemeHorizontal } from "@/components/blog/layouts/SchemeHorizontal";
import { SchemeSection } from "@/components/blog/layouts/SchemeSection";
import { SchemeTerminal } from "@/components/blog/layouts/SchemeTerminal";
import { getPosts } from "@/lib/posts";

const schemes = [
  { id: "a", label: "方案 A" },
  { id: "b", label: "方案 B" },
  { id: "c", label: "方案 C" },
  { id: "d", label: "方案 D" },
  { id: "e", label: "方案 E" },
];

export const metadata = {
  title: "Blog Layouts — crazycloudcc's blog",
  description: "Choose a blog layout scheme",
};

export default function BlogLayoutsPage() {
  const posts = getPosts().slice(0, 6);

  return (
    <div className="mx-auto max-w-[1080px] px-6 py-16 lg:px-8">
      <div className="mb-12 max-w-3xl">
        <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.056em] text-mist">
          Layout Lab
        </p>
        <h1 className="mt-2 font-sans text-[48px] font-medium leading-[1.1] tracking-[-0.021em] text-ink">
          选择博客排版方案
        </h1>
        <p className="mt-4 font-sans text-lg leading-[1.65] text-slate">
          下面是 5 种不同风格的图文时间线布局。浏览后告诉我你喜欢哪一个（A–E），我会把它应用到正式
          `/blog` 页面。
        </p>

        <nav className="mt-8 flex flex-wrap gap-2">
          {schemes.map((scheme) => (
            <a
              key={scheme.id}
              href={`#${scheme.id}`}
              className="rounded-[4px] border border-lavender-mist px-3 py-1.5 font-mono text-sm text-ink transition-colors hover:bg-lavender-mist/50"
            >
              {scheme.label}
            </a>
          ))}
          <Link
            href="/blog"
            className="rounded-[4px] border border-lavender-mist px-3 py-1.5 font-mono text-sm text-fog transition-colors hover:text-ink"
          >
            当前版本
          </Link>
        </nav>
      </div>

      <div className="space-y-24">
        <SchemeSection
          id="a"
          badge="Scheme A"
          title="中轴交替 · 杂志叙事"
          description="时间线居中，图文左右交替排列。适合讲故事、强调每篇文章的「节点感」，视觉节奏最强。"
          traits={["中轴时间线", "左右交替", "大图叙事"]}
        >
          <SchemeAlternating posts={posts} />
        </SchemeSection>

        <SchemeSection
          id="b"
          badge="Scheme B"
          title="横向胶片 · 时间明信片"
          description="按月日戳做封面角标，卡片横向滑动浏览。偏轻快、年轻，适合短文章和频繁更新。"
          traits={["横向滚动", "日期角标", "卡片微倾斜"]}
        >
          <SchemeHorizontal posts={posts} />
        </SchemeSection>

        <SchemeSection
          id="c"
          badge="Scheme C"
          title="社论索引 · 日期即设计"
          description="左侧年份索引 + 右侧超大日期排版。几乎无图，靠字体层级营造高级感，阅读效率最高。"
          traits={["年份侧栏", "超大日期", "纯文字主导"]}
        >
          <SchemeEditorial posts={posts} />
        </SchemeSection>

        <SchemeSection
          id="d"
          badge="Scheme D"
          title="Bento 拼贴 · 头版+网格"
          description="最新一篇做 Featured 头版，其余用不规则网格拼贴。有门户首页感，适合突出精选内容。"
          traits={["Featured 头版", "不规则网格", "图文并重"]}
        >
          <SchemeBento posts={posts} />
        </SchemeSection>

        <SchemeSection
          id="e"
          badge="Scheme E"
          title="终端日志 · 开发者时间线"
          description="把博客伪装成 tail -f 的日志流，日期是时间戳，封面是缩略条。最符合站点气质，辨识度最高。"
          traits={["终端窗口", "时间戳", "开发者风格"]}
        >
          <SchemeTerminal posts={posts} />
        </SchemeSection>
      </div>
    </div>
  );
}
