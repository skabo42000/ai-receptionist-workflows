import type { ReactNode } from "react";
import { tagConsultationLink } from "@/lib/consultation";

// Lightweight, dependency-free Markdown renderer for chat replies (from synq-logic-website,
// restyled). Supports [links](url), bare URLs, **bold**, *italic*, lists and line breaks.
// Builds React elements only (no innerHTML) and only allows http(s) and mailto links.

const INLINE = /\[([^\]]+)\]\(([^)\s]+)\)|\*\*([^*]+?)\*\*|(?<![\w*])\*([^*\s][^*]*?)\*(?!\w)|(https?:\/\/[^\s<]+)/g;

function safeHref(url: string): string | null {
  return /^(https?:\/\/|mailto:)/i.test(url) ? url : null;
}

function Link({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      // Anna's consultation links get the same tracking tags as the page buttons.
      href={tagConsultationLink(href, "chat_anna")}
      target="_blank"
      rel="noopener noreferrer"
      className="font-medium text-brand underline decoration-brand/50 underline-offset-2 transition-colors hover:decoration-brand"
    >
      {children}
    </a>
  );
}

function inline(text: string, keyPrefix: string): ReactNode[] {
  const out: ReactNode[] = [];
  let last = 0;
  let i = 0;
  for (const m of text.matchAll(INLINE)) {
    const start = m.index ?? 0;
    if (start > last) out.push(text.slice(last, start));
    const key = `${keyPrefix}-${i++}`;
    if (m[1] !== undefined) {
      const href = safeHref(m[2]);
      out.push(href ? <Link key={key} href={href}>{m[1]}</Link> : m[0]);
    } else if (m[3] !== undefined) {
      out.push(<strong key={key} className="font-semibold">{inline(m[3], key)}</strong>);
    } else if (m[4] !== undefined) {
      out.push(<em key={key}>{inline(m[4], key)}</em>);
    } else if (m[5] !== undefined) {
      // Keep trailing punctuation out of the link.
      const url = m[5].replace(/[.,;:!?)]+$/, "");
      const trailing = m[5].slice(url.length);
      out.push(<Link key={key} href={url}>{url}</Link>, trailing);
    }
    last = start + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

export function ChatMarkdown({ text }: { text: string }) {
  const lines = text.replace(/\r\n/g, "\n").split("\n");
  const blocks: ReactNode[] = [];
  let para: string[] = [];
  let list: { ordered: boolean; items: string[] } | null = null;

  const flushPara = () => {
    if (!para.length) return;
    const k = `p${blocks.length}`;
    blocks.push(
      <p key={k}>
        {para.map((line, i) => (
          <span key={i}>
            {i > 0 && <br />}
            {inline(line, `${k}-${i}`)}
          </span>
        ))}
      </p>,
    );
    para = [];
  };
  const flushList = () => {
    if (!list) return;
    const k = `l${blocks.length}`;
    const Tag = list.ordered ? "ol" : "ul";
    blocks.push(
      <Tag key={k} className={`ml-5 space-y-1 ${list.ordered ? "list-decimal" : "list-disc"} marker:text-brand`}>
        {list.items.map((it, i) => (
          <li key={i}>{inline(it, `${k}-${i}`)}</li>
        ))}
      </Tag>,
    );
    list = null;
  };

  for (const raw of lines) {
    const bullet = raw.match(/^\s*[*-]\s+(.*)$/);
    const numbered = raw.match(/^\s*\d+[.)]\s+(.*)$/);
    if (bullet || numbered) {
      flushPara();
      const ordered = !!numbered;
      if (list && list.ordered !== ordered) flushList();
      list ??= { ordered, items: [] };
      list.items.push((bullet ?? numbered)![1]);
    } else if (raw.trim() === "") {
      flushPara();
      flushList();
    } else {
      flushList();
      para.push(raw);
    }
  }
  flushPara();
  flushList();

  return <div className="space-y-2">{blocks}</div>;
}
