import MarkdownIt, { type Token } from "markdown-it";
import { createElement, type ReactNode } from "react";

// Parse inline syntax only: the existing block parser owns custom directives,
// fenced code, images, and layout. Never turn author-supplied HTML into DOM.
const markdown = new MarkdownIt({ html: false, linkify: false });
const validateLink = markdown.validateLink;
markdown.validateLink = (href) =>
  validateLink(href) &&
  !/[\u0000-\u0020\u007f]|%(?:0[0-9a-f]|1[0-9a-f]|7f)/i.test(href) &&
  (!/^[a-z][a-z\d+.-]*:/i.test(href) || /^(https?:|mailto:)/i.test(href));

function renderTokens(tokens: Token[]): ReactNode[] {
  let cursor = 0;

  function renderChildren(): ReactNode[] {
    const children: ReactNode[] = [];
    while (cursor < tokens.length) {
      const key = cursor;
      const token = tokens[cursor++];
      if (token.nesting === -1) break;

      if (token.nesting === 1) {
        const nested = renderChildren();
        if (token.type === "link_open") {
          const href = token.attrGet("href");
          const title = token.attrGet("title");
          children.push(
            typeof href === "string" && markdown.validateLink(href)
              ? (
                  <a
                    key={key}
                    href={href}
                    title={typeof title === "string" ? title : undefined}
                    className="text-code-teal underline underline-offset-4 hover:text-ink"
                  >
                    {nested}
                  </a>
                )
              : nested,
          );
        } else if (["em", "strong", "s"].includes(token.tag)) {
          children.push(createElement(token.tag, { key }, nested));
        } else {
          children.push(nested);
        }
      } else if (token.type === "code_inline") {
        children.push(
          <code key={key} className="rounded bg-lavender-mist/40 px-1 py-0.5 font-mono text-[0.9em] text-ink">
            {token.content}
          </code>,
        );
      } else if (token.type === "hardbreak") {
        children.push(<br key={key} />);
      } else if (token.type === "softbreak") {
        children.push("\n");
      } else {
        children.push(token.content);
      }
    }
    return children;
  }

  return renderChildren();
}

export function InlineMarkdown({ text }: { text: string }) {
  return renderTokens(markdown.parseInline(text, {})[0]?.children ?? []);
}
