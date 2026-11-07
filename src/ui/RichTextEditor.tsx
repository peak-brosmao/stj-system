"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  CheckSquare,
  Heading1,
  Heading2,
  Heading3,
  Quote,
  Code,
  Table,
  Minus,
  Info,
  Link as LinkIcon,
  Image as ImageIcon,
  Video,
  Palette,
  Highlighter,
  Type,
  Undo2,
  Redo2,
  Eraser,
  UploadCloud,
  FileText,
  Film,
  FileArchive,
  ExternalLink,
  Trash2,
  Plus,
  Cloud,
  Eye,
  Edit3,
  FileCode,
  Sigma,
  Globe,
  Lock,
  QrCode,
  Copy,
  Check,
  Share2,
  X,
} from "lucide-react";
import { Button } from "@/ui/Button";
import { Badge } from "@/ui/Badge";
import type { CourseAttachment } from "@/lib/richContent";

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  attachments: CourseAttachment[];
  onAttachmentsChange: (items: CourseAttachment[]) => void;
  courseCode?: string;
  placeholder?: string;
  minHeightClass?: string;
  hideInlineAttachments?: boolean;
}

const TEXT_COLORS = [
  { label: "Default", color: "#e2e8f0" },
  { label: "Blue", color: "#3b82f6" },
  { label: "Cyan", color: "#06b6d4" },
  { label: "Emerald", color: "#10b981" },
  { label: "Amber", color: "#f59e0b" },
  { label: "Orange", color: "#f97316" },
  { label: "Red", color: "#ef4444" },
  { label: "Purple", color: "#a855f7" },
  { label: "Pink", color: "#ec4899" },
  { label: "Slate", color: "#64748b" },
];

const HIGHLIGHT_COLORS = [
  { label: "None", color: "transparent" },
  { label: "Yellow", color: "rgba(234, 179, 8, 0.28)" },
  { label: "Green", color: "rgba(16, 185, 129, 0.28)" },
  { label: "Blue", color: "rgba(59, 130, 246, 0.28)" },
  { label: "Purple", color: "rgba(168, 85, 247, 0.28)" },
  { label: "Red", color: "rgba(239, 68, 68, 0.28)" },
  { label: "Cyan", color: "rgba(6, 182, 212, 0.28)" },
];

const MATH_PRESETS = [
  { label: "ប្រភាគ a/b", latex: "\\frac{a}{b}" },
  { label: "ឫសការ៉េ √", latex: "\\sqrt{x^2 + y^2}" },
  { label: "សមីការដឺក្រេទី២", latex: "x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}" },
  { label: "អាំងតេក្រាល ∫", latex: "\\int_{a}^{b} f(x)\\,dx = F(b) - F(a)" },
  { label: "ផលបូក ∑", latex: "\\sum_{i=1}^{n} i = \\frac{n(n+1)}{2}" },
  { label: "លីមីត lim", latex: "\\lim_{x \\to 0} \\frac{\\sin(x)}{x} = 1" },
  { label: "ដេរីវេ dy/dx", latex: "\\frac{df}{dx} = \\lim_{h \\to 0} \\frac{f(x+h) - f(x)}{h}" },
  { label: "ម៉ាទ្រីស 2×2", latex: "\\begin{pmatrix} a_{11} & a_{12} \\\\ a_{21} & a_{22} \\end{pmatrix}" },
];

const PHYSICS_CHEM_PRESETS = [
  { label: "ច្បាប់ទី២ ញូតុន", latex: "\\vec{F}_{\\text{net}} = m \\cdot \\vec{a}" },
  { label: "ថាមពល E=mc²", latex: "E = m c^2" },
  { label: "ទំនាញសកល", latex: "F = G \\frac{m_1 m_2}{r^2}" },
  { label: "ចលនាស្មើ", latex: "x = x_0 + v_0 t + \\frac{1}{2} a t^2" },
  { label: "ច្បាប់អូម & អគ្គិសនី", latex: "V = I \\cdot R \\quad , \\quad P = V \\cdot I" },
  { label: "រលក & កង់ទិច", latex: "E = h f = \\frac{h c}{\\lambda}" },
  { label: "ឧស្ម័នបរិសុទ្ធ", latex: "P V = n R T" },
  { label: "គីមីវិទ្យា ΔG & pH", latex: "\\Delta G = \\Delta H - T \\Delta S \\quad , \\quad \\text{pH} = -\\log[\\text{H}^+]" },
];

const GREEK_SYMBOLS = [
  { sym: "α", tex: "\\alpha" },
  { sym: "β", tex: "\\beta" },
  { sym: "γ", tex: "\\gamma" },
  { sym: "θ", tex: "\\theta" },
  { sym: "λ", tex: "\\lambda" },
  { sym: "μ", tex: "\\mu" },
  { sym: "π", tex: "\\pi" },
  { sym: "ω", tex: "\\omega" },
  { sym: "Δ", tex: "\\Delta" },
  { sym: "Ω", tex: "\\Omega" },
  { sym: "∞", tex: "\\infty" },
  { sym: "±", tex: "\\pm" },
  { sym: "≈", tex: "\\approx" },
  { sym: "≠", tex: "\\neq" },
  { sym: "≤", tex: "\\leq" },
  { sym: "≥", tex: "\\geq" },
  { sym: "→", tex: "\\rightarrow" },
  { sym: "⇌", tex: "\\rightleftharpoons" },
];

export function detectAttachmentType(
  fileNameOrUrl: string,
  mimeType?: string
): "pdf" | "video" | "document" | "link" {
  const lower = fileNameOrUrl.toLowerCase();
  const mime = (mimeType || "").toLowerCase();
  if (mime.includes("pdf") || lower.endsWith(".pdf")) return "pdf";
  if (
    mime.startsWith("video/") ||
    /\.(mp4|webm|mov|mkv|avi|m4v)(\?|$)/.test(lower) ||
    lower.includes("youtube.com") ||
    lower.includes("youtu.be")
  ) {
    return "video";
  }
  if (/\.(doc|docx|ppt|pptx|xls|xlsx|zip|rar|txt|csv)(\?|$)/.test(lower)) {
    return "document";
  }
  return mime ? "document" : "link";
}

export function formatFileSize(bytes?: number): string {
  if (!bytes || bytes <= 0) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

/**
 * Converts a LaTeX math/physics expression into crisp mathematical HTML
 * (stacked fractions, square root vinculum, integral/sum limits, vectors, matrices, Greek symbols).
 */
export function renderLatexToMathHtml(rawLatex: string, displayMode = false): string {
  if (!rawLatex || !rawLatex.trim()) return "";
  let s = rawLatex
    .trim()
    .replace(/^\$\$|\$\$$/g, "")
    .replace(/^\$|\$$/g, "")
    .replace(/^\\\[|\\\]$/g, "")
    .replace(/^\\\(|\\\)$/g, "")
    .trim();

  // Escape HTML special chars before transforming LaTeX commands
  s = s
    .replace(/&/g, "__AMP__")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // Matrices: \begin{pmatrix} a & b \\ c & d \end{pmatrix}
  s = s.replace(
    /\\begin\{(p|b|v)?matrix\}([\s\S]*?)\\end\{\1?matrix\}/g,
    (_m, bracketType: string, inner: string) => {
      const rows = inner
        .trim()
        .split(/\\\\/)
        .map((r) => r.trim())
        .filter(Boolean);
      const tableRows = rows
        .map((r) => {
          const cells = r
            .split("__AMP__")
            .map(
              (c) =>
                `<td style="padding:2px 8px;text-align:center;">${renderLatexToMathHtml(
                  c.trim(),
                  false
                )}</td>`
            )
            .join("");
          return `<tr>${cells}</tr>`;
        })
        .join("");
      const leftBr = bracketType === "b" ? "[" : bracketType === "v" ? "|" : "(";
      const rightBr = bracketType === "b" ? "]" : bracketType === "v" ? "|" : ")";
      return `<span style="display:inline-flex;align-items:center;vertical-align:middle;margin:0 4px;"><span style="font-size:1.6em;font-weight:300;line-height:1;">${leftBr}</span><table style="border-collapse:collapse;display:inline-table;vertical-align:middle;"><tbody>${tableRows}</tbody></table><span style="font-size:1.6em;font-weight:300;line-height:1;">${rightBr}</span></span>`;
    }
  );
  s = s.replace(/__AMP__/g, "&amp;");

  // Text command: \text{...}
  s = s.replace(/\\text\{([^{}]*)\}/g, '<span style="font-style:normal;font-family:sans-serif;">$1</span>');

  // Vector arrow: \vec{F}
  s = s.replace(
    /\\vec\{([^{}]+)\}/g,
    '<span style="display:inline-block;position:relative;padding-top:0.15em;"><span style="position:absolute;top:-0.45em;left:0;right:0;text-align:center;font-size:0.7em;">→</span><span>$1</span></span>'
  );

  // Square root: \sqrt{...}
  for (let i = 0; i < 3; i++) {
    s = s.replace(
      /\\sqrt\{([^{}]+)\}/g,
      '<span style="display:inline-flex;align-items:baseline;white-space:nowrap;"><span style="font-size:1.15em;line-height:1;margin-right:1px;">√</span><span style="border-top:1.5px solid currentColor;padding:0 3px;">$1</span></span>'
    );
  }

  // Integrals, Sums, Limits with lower & upper bounds: \int_{a}^{b}, \sum_{i=1}^{n}, \lim_{x \to 0}
  s = s.replace(
    /\\(int|sum|prod)_\{([^{}]+)\}\^\{([^{}]+)\}/g,
    (_m, op: string, sub: string, sup: string) => {
      const symbol = op === "int" ? "∫" : op === "sum" ? "∑" : "∏";
      return `<span style="display:inline-flex;flex-direction:column;align-items:center;vertical-align:middle;margin:0 4px;line-height:1.05;"><span style="font-size:0.68em;">${sup}</span><span style="font-size:1.35em;">${symbol}</span><span style="font-size:0.68em;">${sub}</span></span>`;
    }
  );

  s = s.replace(
    /\\lim_\{([^{}]+)\}/g,
    '<span style="display:inline-flex;flex-direction:column;align-items:center;vertical-align:middle;margin:0 4px;line-height:1.05;"><span style="font-style:normal;font-weight:600;">lim</span><span style="font-size:0.68em;">$1</span></span>'
  );

  // Fractions (nested support up to 3 levels): \frac{num}{den}
  for (let i = 0; i < 3; i++) {
    s = s.replace(
      /\\frac\{([^{}]+)\}\{([^{}]+)\}/g,
      '<span style="display:inline-flex;flex-direction:column;align-items:center;vertical-align:middle;margin:0 4px;line-height:1.15;"><span style="border-bottom:1.5px solid currentColor;padding:0 5px 2px;text-align:center;">$1</span><span style="padding:2px 5px 0;text-align:center;">$2</span></span>'
    );
  }

  // Subscripts and Superscripts: _{...}, ^{...}, _x, ^2
  s = s.replace(/\^\{([^{}]+)\}/g, '<sup style="font-size:0.75em;">$1</sup>');
  s = s.replace(/_\{([^{}]+)\}/g, '<sub style="font-size:0.75em;">$1</sub>');
  s = s.replace(/\^([0-9a-zA-Z+-])/g, '<sup style="font-size:0.75em;">$1</sup>');
  s = s.replace(/_([0-9a-zA-Z+-])/g, '<sub style="font-size:0.75em;">$1</sub>');

  // Greek letters & math operators
  const replacements: Array<[RegExp, string]> = [
    [/\\alpha\b/g, "α"],
    [/\\beta\b/g, "β"],
    [/\\gamma\b/g, "γ"],
    [/\\delta\b/g, "δ"],
    [/\\epsilon\b/g, "ε"],
    [/\\theta\b/g, "θ"],
    [/\\lambda\b/g, "λ"],
    [/\\mu\b/g, "μ"],
    [/\\nu\b/g, "ν"],
    [/\\pi\b/g, "π"],
    [/\\rho\b/g, "ρ"],
    [/\\sigma\b/g, "σ"],
    [/\\tau\b/g, "τ"],
    [/\\phi\b/g, "φ"],
    [/\\omega\b/g, "ω"],
    [/\\Delta\b/g, "Δ"],
    [/\\Sigma\b/g, "∑"],
    [/\\Omega\b/g, "Ω"],
    [/\\Pi\b/g, "Π"],
    [/\\infty\b/g, "∞"],
    [/\\pm\b/g, "±"],
    [/\\mp\b/g, "∓"],
    [/\\times\b/g, "×"],
    [/\\cdot\b/g, "·"],
    [/\\div\b/g, "÷"],
    [/\\approx\b/g, "≈"],
    [/\\neq\b/g, "≠"],
    [/\\leq\b/g, "≤"],
    [/\\geq\b/g, "≥"],
    [/\\to\b/g, "→"],
    [/\\rightarrow\b/g, "→"],
    [/\\leftarrow\b/g, "←"],
    [/\\Rightarrow\b/g, "⇒"],
    [/\\Leftrightarrow\b/g, "⇔"],
    [/\\rightleftharpoons\b/g, "⇌"],
    [/\\partial\b/g, "∂"],
    [/\\nabla\b/g, "∇"],
    [/\\int\b/g, "∫"],
    [/\\sum\b/g, "∑"],
    [/\\quad\b/g, "&nbsp;&nbsp;&nbsp;&nbsp;"],
    [/\\,/g, "&nbsp;"],
    [/\\(sin|cos|tan|log|ln|exp|max|min)\b/g, '<span style="font-style:normal;">$1</span>'],
  ];

  for (const [regex, rep] of replacements) {
    s = s.replace(regex, rep);
  }

  if (displayMode) {
    return `<div class="stj-latex-rendered" style="margin:14px 0;padding:14px 18px;border-radius:12px;background:rgba(59,130,246,0.06);border:1px solid rgba(59,130,246,0.22);text-align:center;font-family:'Cambria Math','Times New Roman',serif;font-size:1.12rem;color:#e2e8f0;overflow-x:auto;">${s}</div>`;
  }
  return `<span class="stj-latex-rendered" style="font-family:'Cambria Math','Times New Roman',serif;font-size:1.05em;padding:0 3px;color:#93c5fd;">${s}</span>`;
}

/**
 * VS Code Dark+ Syntax Highlighter for C, C++, Python, JavaScript, TypeScript, SQL, HTML, etc.
 */
export function highlightCodeToVSCodeWindow(rawCode: string, langHint = "C / C++"): string {
  // Strip any existing HTML tags inside <pre> so we highlight pure source code cleanly
  const decoded = rawCode
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/^\n+|\n+$/g, "");

  if (!decoded.trim()) return "";

  // Auto-detect language if not explicitly specified
  let lang = langHint;
  if (/^\s*#include\b|\bprintf\s*\(|\bscanf\s*\(|\bint\s+main\s*\(/.test(decoded)) {
    lang = "C / C++";
  } else if (/\bdef\s+\w+\s*\(|\bimport\s+\w+|\bprint\s*\(/.test(decoded) && !decoded.includes(";")) {
    lang = "Python";
  } else if (/\b(const|let|function|console\.log|=>)\b/.test(decoded)) {
    lang = "JavaScript / TS";
  } else if (/\b(SELECT|FROM|WHERE|INSERT\s+INTO|CREATE\s+TABLE)\b/i.test(decoded)) {
    lang = "SQL";
  }

  const highlightLine = (line: string): string => {
    // 1. Escape HTML
    const escaped = line
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    // Check full-line comment
    if (/^\s*(\/\/|#(?!(include|define|ifdef|ifndef|endif|pragma)))/.test(escaped)) {
      return `<span style="color:#6a9955;font-style:italic;">${escaped}</span>`;
    }

    // Check C preprocessor directive (#include <stdio.h>)
    const preprocMatch = escaped.match(/^(\s*#\s*(?:include|define|ifdef|ifndef|endif|pragma)\b)(.*)$/);
    if (preprocMatch) {
      const directive = `<span style="color:#c586c0;font-weight:600;">${preprocMatch[1]}</span>`;
      const rest = preprocMatch[2].replace(
        /(&lt;[^&]+&gt;|"[^"]*")/g,
        '<span style="color:#ce9178;">$1</span>'
      );
      return directive + rest;
    }

    // Tokenize strings and comments first using placeholders
    const tokens: string[] = [];
    const saveToken = (html: string) => {
      const idx = tokens.length;
      tokens.push(html);
      return `@@STJ_TOK_${idx}@@`;
    };

    let work = escaped;

    // Trailing // comment
    work = work.replace(/(\/\/.*)$/, (m) =>
      saveToken(`<span style="color:#6a9955;font-style:italic;">${m}</span>`)
    );

    // Double & single quoted strings (with format specifiers & escapes highlighted inside)
    work = work.replace(/("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')/g, (str) => {
      const coloredStr = str.replace(
        /(\\[nrt0\\"']|%[-+0 #]*\d*(?:\.\d+)?[dfscxXulLfegp])/g,
        '<span style="color:#d7ba7d;font-weight:600;">$1</span>'
      );
      return saveToken(`<span style="color:#ce9178;">${coloredStr}</span>`);
    });

    // Control flow keywords (VS Code Purple #c586c0)
    work = work.replace(
      /\b(return|if|else|elif|for|while|do|switch|case|break|continue|default|goto|try|catch|finally|throw|import|from|export|async|await|yield|in|pass)\b/g,
      (kw) => saveToken(`<span style="color:#c586c0;font-weight:600;">${kw}</span>`)
    );

    // Type & storage keywords (VS Code Blue #569cd6)
    work = work.replace(
      /\b(int|float|double|char|void|long|short|unsigned|signed|bool|boolean|string|struct|union|enum|typedef|const|static|extern|let|var|function|def|class|interface|type|public|private|protected|new|this|self|true|false|null|NULL|None|True|False|SELECT|FROM|WHERE|JOIN|LEFT|INNER|GROUP|ORDER|BY|INSERT|INTO|VALUES|UPDATE|SET|DELETE|CREATE|TABLE)\b/g,
      (kw) => saveToken(`<span style="color:#569cd6;font-weight:600;">${kw}</span>`)
    );

    // Function calls (VS Code Yellow #dcdcaa)
    work = work.replace(
      /\b([a-zA-Z_]\w*)(?=\s*\()/g,
      (fn) => saveToken(`<span style="color:#dcdcaa;">${fn}</span>`)
    );

    // Numbers (VS Code Light Green #b5cea8)
    work = work.replace(
      /\b(\d+(?:\.\d+)?(?:f|L|u|UL)?|0x[0-9a-fA-F]+)\b/g,
      (num) => saveToken(`<span style="color:#b5cea8;">${num}</span>`)
    );

    // Restore tokens
    work = work.replace(/@@STJ_TOK_(\d+)@@/g, (_m, idx) => tokens[Number(idx)] || "");
    return work;
  };

  const lines = decoded.split("\n");
  const rowsHtml = lines
    .map((line, i) => {
      const lineNum = i + 1;
      const highlighted = highlightLine(line) || "&nbsp;";
      return `<div style="display:flex;align-items:baseline;line-height:1.65;"><span style="user-select:none;width:2.5rem;padding-right:0.85rem;text-align:right;color:#6e7681;font-size:11px;flex-shrink:0;">${lineNum}</span><span style="flex:1;white-space:pre;color:#d4d4d4;">${highlighted}</span></div>`;
    })
    .join("");

  return `<div class="stj-vscode-block" style="margin:16px 0;border-radius:12px;overflow:hidden;border:1px solid #2d2d30;background:#1e1e1e;box-shadow:0 8px 24px rgba(0,0,0,0.28);font-family:'JetBrains Mono','Fira Code','Cascadia Code',Consolas,monospace;"><div style="display:flex;align-items:center;justify-content:space-between;padding:8px 14px;background:#252526;border-bottom:1px solid #333337;"><div style="display:flex;align-items:center;gap:7px;"><span style="width:11px;height:11px;border-radius:999px;background:#ff5f56;display:inline-block;"></span><span style="width:11px;height:11px;border-radius:999px;background:#ffbd2e;display:inline-block;"></span><span style="width:11px;height:11px;border-radius:999px;background:#27c93f;display:inline-block;"></span><span style="margin-left:8px;font-size:11px;font-weight:600;color:#9cdcfe;">${lang}</span></div><span style="font-size:10px;color:#858585;letter-spacing:0.04em;">VS Code Dark+</span></div><div style="padding:12px 14px;overflow-x:auto;font-size:12.5px;">${rowsHtml}</div></div>`;
}

/**
 * Converts YouTube watch/short URLs, Google Drive links, or raw <iframe> strings into
 * a safe, responsive 16:9 embed HTML snippet.
 */
export function buildResponsiveEmbedHtml(rawInput: string, customTitle?: string): string {
  const trimmed = rawInput.trim();
  if (!trimmed) return "";

  if (/^<iframe[\s\S]*<\/iframe>$/i.test(trimmed)) {
    const srcMatch = trimmed.match(/src=["']([^"']+)["']/i);
    const titleMatch = trimmed.match(/title=["']([^"']+)["']/i);
    const src = srcMatch?.[1] || "";
    const title = customTitle || titleMatch?.[1] || "Embedded Media";
    if (src) {
      return `<div class="stj-embed-wrapper" style="position:relative;width:100%;padding-bottom:56.25%;height:0;overflow:hidden;border-radius:12px;margin:14px 0;border:1px solid rgba(148,163,184,0.25);background:#0f172a;"><iframe src="${src}" title="${title}" style="position:absolute;top:0;left:0;width:100%;height:100%;border:0;" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe></div><p><br/></p>`;
    }
  }

  const ytMatch = trimmed.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{6,})/i
  );
  if (ytMatch?.[1]) {
    const videoId = ytMatch[1];
    const embedSrc = `https://www.youtube.com/embed/${videoId}`;
    const title = customTitle || "YouTube Video Lesson";
    return `<div class="stj-embed-wrapper" style="position:relative;width:100%;padding-bottom:56.25%;height:0;overflow:hidden;border-radius:12px;margin:14px 0;border:1px solid rgba(148,163,184,0.25);background:#0f172a;"><iframe src="${embedSrc}" title="${title}" style="position:absolute;top:0;left:0;width:100%;height:100%;border:0;" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe></div><p><br/></p>`;
  }

  if (/\.(mp4|webm|mov)(\?|$)/i.test(trimmed)) {
    return `<div style="margin:14px 0;"><video src="${trimmed}" controls preload="metadata" style="width:100%;max-height:460px;border-radius:12px;background:#000;"></video></div><p><br/></p>`;
  }

  let finalUrl = trimmed;
  const gdriveMatch = trimmed.match(/drive\.google\.com\/file\/d\/([^/]+)/i);
  if (gdriveMatch?.[1]) {
    finalUrl = `https://drive.google.com/file/d/${gdriveMatch[1]}/preview`;
  }
  const title = customTitle || "Embedded Resource";
  return `<div class="stj-embed-wrapper" style="position:relative;width:100%;padding-bottom:56.25%;height:0;overflow:hidden;border-radius:12px;margin:14px 0;border:1px solid rgba(148,163,184,0.25);background:#0f172a;"><iframe src="${finalUrl}" title="${title}" style="position:absolute;top:0;left:0;width:100%;height:100%;border:0;" allowfullscreen></iframe></div><p><br/></p>`;
}

/**
 * Normalizes Rich HTML for viewing:
 * 1. Unescapes any `&lt;iframe ...&gt;&lt;/iframe&gt;`
 * 2. Renders `$$ ... $$` and `$ ... $` LaTeX math/physics formulas
 * 3. Renders `<pre>...</pre>` blocks as VS Code Dark+ syntax-highlighted windows
 */
export function normalizeRichHtml(html?: string | null, forViewer = false): string {
  if (!html) return "";
  let out = html.replace(
    /&lt;iframe\b([\s\S]*?)&gt;([\s\S]*?)&lt;\/iframe&gt;/gi,
    (_full, attrsRaw: string) => {
      const unescapedAttrs = attrsRaw
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&amp;/g, "&");
      const rawIframe = `<iframe ${unescapedAttrs}></iframe>`;
      return buildResponsiveEmbedHtml(rawIframe);
    }
  );

  if (forViewer) {
    // Transform <pre>...</pre> into VS Code Dark+ highlighted windows
    out = out.replace(/<pre\b([^>]*)>([\s\S]*?)<\/pre>/gi, (_full, attrs: string, inner: string) => {
      const langMatch = attrs.match(/data-lang=["']([^"']+)["']/i);
      return highlightCodeToVSCodeWindow(inner, langMatch?.[1] || "C / C++");
    });

    // Render block LaTeX $$ ... $$ or \[ ... \]
    out = out.replace(/\$\$([\s\S]+?)\$\$/g, (_m, tex: string) =>
      renderLatexToMathHtml(tex.replace(/<[^>]+>/g, ""), true)
    );
    out = out.replace(/\\\[([\s\S]+?)\\\]/g, (_m, tex: string) =>
      renderLatexToMathHtml(tex.replace(/<[^>]+>/g, ""), true)
    );

    // Render inline LaTeX $ ... $ (avoiding currency like $100) or \( ... \)
    out = out.replace(/\\\(([\s\S]+?)\\\)/g, (_m, tex: string) =>
      renderLatexToMathHtml(tex.replace(/<[^>]+>/g, ""), false)
    );
    out = out.replace(/\$([^\n$<>]{2,120})\$/g, (full, tex: string) => {
      if (/^\d+(\.\d+)?$/.test(tex.trim())) return full;
      return renderLatexToMathHtml(tex, false);
    });
  }

  return out;
}

/**
 * Shared helper to upload a single File to Cloudflare R2 (with graceful fallback for images).
 */
export async function uploadSingleFileToR2(
  file: File,
  courseCode = "STJ"
): Promise<{
  url: string;
  key?: string;
  name: string;
  size: number;
  mimeType: string;
  type: "pdf" | "video" | "document" | "link";
}> {
  const fileType = file.type || "application/octet-stream";
  let uploadedUrl = "";
  let uploadedKey = "";

  try {
    const presignRes = await fetch("/api/storage/r2", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "presign",
        fileName: file.name,
        fileType,
        fileSize: file.size,
        courseCode,
      }),
    });

    const presignData = await presignRes.json().catch(() => null);
    let directSuccess = false;

    if (presignRes.ok && presignData?.uploadUrl) {
      try {
        const putRes = await fetch(presignData.uploadUrl, {
          method: "PUT",
          body: file,
        });
        if (putRes.ok) {
          directSuccess = true;
          uploadedUrl = presignData.publicUrl;
          uploadedKey = presignData.key;
        }
      } catch {
        directSuccess = false;
      }
    }

    if (!directSuccess) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("courseCode", courseCode);

      const directRes = await fetch("/api/storage/r2", {
        method: "POST",
        body: formData,
      });
      const directData = await directRes.json().catch(() => null);
      if (directRes.ok && directData?.publicUrl) {
        uploadedUrl = directData.publicUrl;
        uploadedKey = directData.key;
      } else if (fileType.startsWith("image/") && file.size <= 4 * 1024 * 1024) {
        uploadedUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(String(reader.result || ""));
          reader.onerror = () => reject(new Error("មិនអាចអានរូបភាពបានទេ"));
          reader.readAsDataURL(file);
        });
      } else {
        throw new Error(
          directData?.error ||
            presignData?.error ||
            "បរាជ័យក្នុងការបង្ហោះឯកសារទៅកាន់ Cloudflare R2"
        );
      }
    }
  } catch (err) {
    if (fileType.startsWith("image/") && file.size <= 4 * 1024 * 1024) {
      uploadedUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result || ""));
        reader.onerror = () => reject(err);
        reader.readAsDataURL(file);
      });
    } else {
      throw err;
    }
  }

  return {
    url: uploadedUrl,
    key: uploadedKey,
    name: file.name,
    size: file.size,
    mimeType: fileType,
    type: detectAttachmentType(file.name, fileType),
  };
}

/**
 * Reusable Share Link & QR Code Panel/Modal for Public Lessons & Blog Posts
 */
export function LessonBlogSharePanel({
  url,
  shareUrl,
  title,
  visibility,
  onVisibilityChange,
  onClose,
}: {
  url?: string;
  shareUrl?: string;
  title: string;
  visibility: "PRIVATE" | "PUBLIC";
  onVisibilityChange?: (v: "PRIVATE" | "PUBLIC") => void;
  onClose?: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const effectiveUrl = shareUrl || url || "";

  const handleCopy = () => {
    navigator.clipboard.writeText(effectiveUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-5 rounded-2xl border border-primary/30 bg-card shadow-lg space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary">
            <QrCode className="w-4 h-4" />
            <span>ចែករំលែកមេរៀន / អត្ថបទ និង QR Code (Share Lesson &amp; QR)</span>
          </div>
          <h3 className="text-sm font-bold text-foreground mt-0.5">{title}</h3>
          <p className="text-[11px] text-muted-foreground">
            {visibility === "PUBLIC"
              ? "🌍 បើកជាសាធារណៈ (Public)៖ សិស្សប្អូនអាចស្កេន QR Code ឬចុចតំណភ្ជាប់នេះដើម្បីចូលអានមេរៀនដោយមិនបាច់មានគណនី។"
              : "🔒 ឯកជន (Private)៖ មានតែសមាជិកក្នុងក្រុម STJ ដែលបានចូលគណនីប៉ុណ្ណោះទើបអាចមើលមេរៀននេះបាន។"}
          </p>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {onVisibilityChange && (
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            type="button"
            onClick={() => onVisibilityChange("PRIVATE")}
            className={`px-3 py-2 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
              visibility === "PRIVATE"
                ? "border-amber-500 bg-amber-500/15 text-amber-500"
                : "border-border bg-muted/20 text-muted-foreground hover:text-foreground"
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>🔒 Private (សមាជិកក្រុម)</span>
          </button>
          <button
            type="button"
            onClick={() => onVisibilityChange("PUBLIC")}
            className={`px-3 py-2 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
              visibility === "PUBLIC"
                ? "border-emerald-500 bg-emerald-500/15 text-emerald-500"
                : "border-border bg-muted/20 text-muted-foreground hover:text-foreground"
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>🌍 Public (សិស្សប្អូនមើលបាន)</span>
          </button>
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-center gap-5 pt-2 border-t border-border/60">
        <div className="p-3 bg-white rounded-2xl border border-border shadow-xs shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(
              effectiveUrl
            )}`}
            alt={`QR Code for ${title}`}
            className="w-36 h-36"
          />
        </div>

        <div className="flex-1 w-full space-y-3 text-xs">
          <div>
            <label className="block text-[11px] font-semibold text-muted-foreground mb-1">
              តំណភ្ជាប់សម្រាប់មេរៀននេះតែមួយ (Single-Lesson Direct Link)៖
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={effectiveUrl}
                className="w-full px-3 py-2 rounded-xl border border-input bg-muted/40 font-mono text-xs text-foreground"
              />
              <Button
                type="button"
                size="sm"
                onClick={handleCopy}
                className="h-9 px-3.5 text-xs space-x-1.5 shrink-0"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>បានចម្លង!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>ចម្លង Link</span>
                  </>
                )}
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <a
              href={effectiveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 font-semibold text-xs"
            >
              <span>បើកមើលទំព័រមេរៀនផ្ទាល់</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <Badge variant={visibility === "PUBLIC" ? "success" : "warning"}>
              {visibility === "PUBLIC" ? "🌍 សាធារណៈ (Public)" : "🔒 ឯកជន (Private - សមាជិកក្រុម)"}
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Reusable Thumbnail, OpenGraph & Public/Private Visibility Configurator
 */
export function ThumbnailAndVisibilityCard({
  visibility,
  onVisibilityChange,
  thumbnailUrl,
  onThumbnailUrlChange,
  onThumbnailChange,
  title,
  titlePreview,
  courseCode = "STJ",
}: {
  visibility: "PRIVATE" | "PUBLIC";
  onVisibilityChange: (v: "PRIVATE" | "PUBLIC") => void;
  thumbnailUrl: string;
  onThumbnailUrlChange?: (url: string) => void;
  onThumbnailChange?: (url: string) => void;
  title?: string;
  titlePreview?: string;
  courseCode?: string;
}) {
  const thumbInputRef = useRef<HTMLInputElement>(null);
  const [uploadingThumb, setUploadingThumb] = useState(false);
  const [thumbError, setThumbError] = useState<string | null>(null);
  const updateThumbnail = (url: string) => {
    if (onThumbnailChange) onThumbnailChange(url);
    if (onThumbnailUrlChange) onThumbnailUrlChange(url);
  };
  const effectiveTitle = titlePreview || title || "";

  const handleThumbUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingThumb(true);
    setThumbError(null);
    try {
      const uploaded = await uploadSingleFileToR2(file, courseCode);
      updateThumbnail(uploaded.url);
    } catch (err: unknown) {
      setThumbError(err instanceof Error ? err.message : "បរាជ័យក្នុងការបង្ហោះរូបភាព Thumbnail");
    } finally {
      setUploadingThumb(false);
      if (thumbInputRef.current) thumbInputRef.current.value = "";
    }
  };

  return (
    <div className="p-5 rounded-2xl border border-border bg-card space-y-4 shadow-sm">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Left: Public vs Private Access Control */}
        <div className="space-y-2.5">
          <label className="block text-xs font-bold text-foreground">
            កំណត់សិទ្ធិចូលមើលមេរៀន / អត្ថបទ (Visibility: Public or Private)
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => onVisibilityChange("PRIVATE")}
              className={`p-3 rounded-xl border text-left transition-all space-y-1 ${
                visibility === "PRIVATE"
                  ? "border-amber-500 bg-amber-500/10 ring-2 ring-amber-500/20"
                  : "border-border bg-muted/20 hover:border-border/80"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-foreground">
                  <Lock className="w-3.5 h-3.5 text-amber-500" />
                  <span>ឯកជន (Private)</span>
                </span>
                {visibility === "PRIVATE" && <Badge variant="warning">កំពុងជ្រើសរើស</Badge>}
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                សម្រាប់តែសមាជិកក្នុងក្រុម STJ ទើបអាចចូលមើលបាននៅក្នុង Portal។
              </p>
            </button>

            <button
              type="button"
              onClick={() => onVisibilityChange("PUBLIC")}
              className={`p-3 rounded-xl border text-left transition-all space-y-1 ${
                visibility === "PUBLIC"
                  ? "border-emerald-500 bg-emerald-500/10 ring-2 ring-emerald-500/20"
                  : "border-border bg-muted/20 hover:border-border/80"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-foreground">
                  <Globe className="w-3.5 h-3.5 text-emerald-500" />
                  <span>សាធារណៈ (Public)</span>
                </span>
                {visibility === "PUBLIC" && <Badge variant="success">កំពុងជ្រើសរើស</Badge>}
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                មាន Link &amp; QR Code សម្រាប់សិស្សប្អូនចូលមើល និងបង្ហាញលើទំព័រដើម (Blog)។
              </p>
            </button>
          </div>
        </div>

        {/* Right: Thumbnail & OpenGraph Image */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold text-foreground">
              រូបភាពក្របមុខ (Thumbnail &amp; OpenGraph Social Preview)
            </label>
            <input
              ref={thumbInputRef}
              type="file"
              accept="image/*"
              onChange={handleThumbUpload}
              className="hidden"
            />
            <Button
              type="button"
              size="sm"
              variant="outline"
              disabled={uploadingThumb}
              onClick={() => thumbInputRef.current?.click()}
              className="h-7 text-[11px] space-x-1 border-primary/40 text-primary"
            >
              <UploadCloud className="w-3.5 h-3.5" />
              <span>
                {uploadingThumb ? "កំពុងបង្ហោះទៅ R2..." : "បង្ហោះរូបភាព Thumbnail (R2)"}
              </span>
            </Button>
          </div>

          <div className="flex items-center gap-2.5">
            <input
              type="url"
              value={thumbnailUrl}
              onChange={(e) => updateThumbnail(e.target.value)}
              placeholder="បញ្ចូល URL រូបភាព Thumbnail ឬចុចប៊ូតុងបង្ហោះទៅ Cloudflare R2..."
              className="w-full px-3 py-2 text-xs rounded-xl border border-input bg-background"
            />
            {thumbnailUrl && (
              <button
                type="button"
                onClick={() => updateThumbnail("")}
                className="p-2 rounded-lg text-destructive hover:bg-destructive/10 shrink-0"
                title="លុបរូបភាព Thumbnail"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {thumbError && <p className="text-[11px] text-destructive">{thumbError}</p>}

          {thumbnailUrl && (
            <div className="flex items-center gap-3 p-2.5 rounded-xl border border-border bg-muted/20">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={thumbnailUrl}
                alt={effectiveTitle || "Thumbnail preview"}
                className="w-24 h-14 object-cover rounded-lg border border-border shrink-0"
              />
              <div className="min-w-0 flex-1 text-xs">
                <p className="font-semibold text-foreground truncate">
                  {effectiveTitle || "គំរូបង្ហាញ OpenGraph & Blog Card"}
                </p>
                <p className="text-[10px] text-muted-foreground truncate">
                  itcstudent.space • OpenGraph Thumbnail Ready
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function CloudflareR2AttachmentManager({
  attachments,
  onAttachmentsChange,
  courseCode = "STJ",
}: {
  attachments: CourseAttachment[];
  onAttachmentsChange: (items: CourseAttachment[]) => void;
  courseCode?: string;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [r2Status, setR2Status] = useState<{
    configured: boolean;
    bucketName?: string;
    missingKeys?: string[];
  } | null>(null);

  const [showUrlForm, setShowUrlForm] = useState(false);
  const [externalName, setExternalName] = useState("");
  const [externalUrl, setExternalUrl] = useState("");
  const [externalType, setExternalType] = useState<"pdf" | "video" | "document" | "link">("pdf");

  useEffect(() => {
    fetch("/api/storage/r2")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d) {
          setR2Status({
            configured: Boolean(d.configured),
            bucketName: d.bucketName,
            missingKeys: d.missingKeys,
          });
        }
      })
      .catch(() => {});
  }, []);

  const processFiles = async (files: FileList | File[]) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    setUploadError(null);

    const newAttachments: CourseAttachment[] = [...attachments];
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const uploaded = await uploadSingleFileToR2(file, courseCode);
        newAttachments.push({
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          name: uploaded.name,
          url: uploaded.url,
          key: uploaded.key,
          type: uploaded.type,
          size: uploaded.size,
          mimeType: uploaded.mimeType,
          uploadedAt: new Date().toISOString(),
        });
      }
      onAttachmentsChange(newAttachments);
    } catch (err: unknown) {
      setUploadError(
        err instanceof Error ? err.message : "បរាជ័យក្នុងការបង្ហោះឯកសារ"
      );
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      await processFiles(e.target.files);
    }
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await processFiles(e.dataTransfer.files);
    }
  };

  const handleAddExternalLink = () => {
    const cleanUrl = externalUrl.trim();
    if (!cleanUrl) return;
    const cleanName =
      externalName.trim() ||
      cleanUrl.split("/").pop()?.split("?")[0] ||
      "ឯកសារមេរៀន (Course Material)";

    const item: CourseAttachment = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name: cleanName,
      url: cleanUrl,
      type: externalType || detectAttachmentType(cleanUrl),
      uploadedAt: new Date().toISOString(),
    };

    onAttachmentsChange([...attachments, item]);
    setExternalName("");
    setExternalUrl("");
    setShowUrlForm(false);
  };

  const removeAttachment = (id: string) => {
    onAttachmentsChange(attachments.filter((a) => a.id !== id));
  };

  return (
    <div className="p-4 rounded-2xl border border-border bg-card space-y-3.5 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <Cloud className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-bold text-foreground">
              ឯកសារមេរៀន PDF, Video &amp; ស្លាយ (Cloudflare R2 Dropzone)
            </p>
            <p className="text-[11px] text-muted-foreground">
              អូសទម្លាក់ឯកសារ (Drag &amp; Drop) ឬចុចជ្រើសរើសដើម្បីផ្ទុកលើ Cloudflare R2
            </p>
          </div>
        </div>
        <Badge variant={r2Status?.configured ? "success" : "info"} className="text-[10px] shrink-0">
          {r2Status?.configured ? "R2 Connected" : "R2 Cloud / URL"}
        </Badge>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".pdf,.mp4,.webm,.mov,.png,.jpg,.jpeg,.webp,.gif,.ppt,.pptx,.doc,.docx,.xls,.xlsx,.zip"
        onChange={handleFileUpload}
        className="hidden"
      />
      <div
        onClick={() => !uploading && fileInputRef.current?.click()}
        onDragEnter={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsDraggingOver(true);
        }}
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsDraggingOver(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsDraggingOver(false);
        }}
        onDrop={handleDrop}
        className={`border-2 border-dashed transition-all rounded-xl p-4 text-center cursor-pointer space-y-1.5 ${
          isDraggingOver
            ? "border-primary bg-primary/15 scale-[1.01]"
            : "border-primary/30 hover:border-primary/60 bg-primary/5 hover:bg-primary/10"
        }`}
      >
        <UploadCloud className="w-6 h-6 text-primary mx-auto" />
        <p className="text-xs font-semibold text-foreground">
          {uploading
            ? "កំពុងបង្ហោះឯកសារទៅកាន់ Cloudflare R2..."
            : isDraggingOver
              ? "ទម្លាក់ឯកសារទីនេះដើម្បីបង្ហោះទៅ Cloudflare R2!"
              : "អូសទម្លាក់ឯកសារ (Drop File) ឬចុចជ្រើសរើស PDF, Video, រូបភាព, ស្លាយ"}
        </p>
        <p className="text-[10px] text-muted-foreground">
          គាំទ្រ PDF, MP4, WebM, PNG/JPG, PPTX, DOCX, XLSX, ZIP (Cloudflare R2 Storage)
        </p>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-[11px] font-medium text-muted-foreground">
          ឯកសារភ្ជាប់សរុប៖ <strong className="text-foreground">{attachments.length}</strong>
        </span>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => setShowUrlForm((v) => !v)}
          className="h-7 text-xs space-x-1"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>បន្ថែម Link R2 / PDF / Video</span>
        </Button>
      </div>

      {uploadError && (
        <div className="p-2.5 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-xs">
          {uploadError}
        </div>
      )}

      {showUrlForm && (
        <div className="p-3.5 rounded-xl border border-border bg-muted/20 space-y-2.5 text-xs">
          <div>
            <label className="block text-[11px] font-medium text-foreground mb-1">
              ឈ្មោះឯកសារ (ឧ. C Programming Chapter 1.pdf)
            </label>
            <input
              type="text"
              value={externalName}
              onChange={(e) => setExternalName(e.target.value)}
              placeholder="បញ្ចូលឈ្មោះឯកសារ..."
              className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-input bg-background"
            />
          </div>
          <div>
            <label className="block text-[11px] font-medium text-foreground mb-1">
              តំណភ្ជាប់ URL (Cloudflare R2 / Google Drive / YouTube / PDF Link)
            </label>
            <input
              type="url"
              value={externalUrl}
              onChange={(e) => setExternalUrl(e.target.value)}
              placeholder="https://pub-xxx.r2.dev/courses/PROG101/lesson1.pdf"
              className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-input bg-background"
            />
          </div>
          <div className="flex items-center justify-between gap-2 pt-1">
            <select
              value={externalType}
              onChange={(e) =>
                setExternalType(e.target.value as "pdf" | "video" | "document" | "link")
              }
              className="px-2.5 py-1.5 text-xs rounded-lg border border-input bg-background"
            >
              <option value="pdf">ឯកសារ PDF</option>
              <option value="video">វីដេអូមេរៀន (Video)</option>
              <option value="document">ឯកសារផ្សេងៗ (Slide / Doc)</option>
              <option value="link">តំណភ្ជាប់ (External Link)</option>
            </select>
            <Button
              type="button"
              size="sm"
              onClick={handleAddExternalLink}
              className="h-8 text-xs"
            >
              ភ្ជាប់ឯកសារនេះ
            </Button>
          </div>
        </div>
      )}

      {attachments.length > 0 && (
        <div className="space-y-2 pt-1">
          {attachments.map((att) => (
            <div
              key={att.id}
              className="flex items-center justify-between gap-2 p-2.5 rounded-xl border border-border bg-muted/20 text-xs"
            >
              <div className="flex items-center gap-2 min-w-0">
                {att.type === "pdf" ? (
                  <FileText className="w-4 h-4 text-red-500 shrink-0" />
                ) : att.type === "video" ? (
                  <Film className="w-4 h-4 text-blue-500 shrink-0" />
                ) : (
                  <FileArchive className="w-4 h-4 text-emerald-500 shrink-0" />
                )}
                <div className="truncate">
                  <p className="font-medium text-foreground truncate">{att.name}</p>
                  {att.size ? (
                    <span className="text-[10px] text-muted-foreground">
                      {formatFileSize(att.size)}
                    </span>
                  ) : null}
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <Badge variant="outline" className="text-[9px] uppercase">
                  {att.type}
                </Badge>
                <a
                  href={att.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 text-primary hover:bg-primary/10 rounded-lg"
                  title="បើកមើលឯកសារ"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
                <button
                  type="button"
                  onClick={() => removeAttachment(att.id)}
                  className="p-1.5 text-destructive hover:bg-destructive/10 rounded-lg"
                  title="លុបឯកសារ"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function RichTextEditor({
  value,
  onChange,
  attachments,
  onAttachmentsChange,
  courseCode = "STJ",
  placeholder = "សរសេរមាតិកាមេរៀន កូដគំរូ (VS Code) រូបមន្តគណិតវិទ្យា/រូបវិទ្យា (LaTeX) ឬអូសទម្លាក់រូបភាព/PDF/វីដេអូ (Drop files to Cloudflare R2)...",
  minHeightClass = "min-h-[420px]",
  hideInlineAttachments = false,
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const inlineImageInputRef = useRef<HTMLInputElement>(null);
  const inlineFileDropInputRef = useRef<HTMLInputElement>(null);
  const isInternalChange = useRef(false);

  const [mode, setMode] = useState<"write" | "html" | "preview">("write");
  const [activePanel, setActivePanel] = useState<
    null | "color" | "highlight" | "iframe" | "image" | "link" | "code" | "math"
  >(null);

  // Inline tool states
  const [embedInput, setEmbedInput] = useState("");
  const [embedTitle, setEmbedTitle] = useState("");
  const [imageUrlInput, setImageUrlInput] = useState("");
  const [imageAltInput, setImageAltInput] = useState("");
  const [imageWidth, setImageWidth] = useState<"100%" | "75%" | "50%">("100%");
  const [linkUrlInput, setLinkUrlInput] = useState("");
  const [linkTextInput, setLinkTextInput] = useState("");

  // VS Code Snippet Builder states
  const [codeLang, setCodeLang] = useState("C / C++");
  const [codeSnippet, setCodeSnippet] = useState(
    `#include <stdio.h>\n\nint main() {\n    printf("សួស្តីពិភពលោក! សូមស្វាគមន៍មកកាន់ការសិក្សា C Programming!\\n");\n    return 0;\n}`
  );

  // Math / Physics / LaTeX Studio states
  const [latexInput, setLatexInput] = useState(
    "x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}"
  );
  const [latexDisplayMode, setLatexDisplayMode] = useState<"block" | "inline">("block");

  // Drag & drop / upload state inside editor
  const [isDraggingOnEditor, setIsDraggingOnEditor] = useState(false);
  const [editorUploading, setEditorUploading] = useState(false);
  const [editorUploadMsg, setEditorUploadMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!editorRef.current || mode !== "write") return;
    if (isInternalChange.current) {
      isInternalChange.current = false;
      return;
    }
    const normalized = normalizeRichHtml(value || "", false);
    if (editorRef.current.innerHTML !== normalized) {
      editorRef.current.innerHTML = normalized;
    }
  }, [value, mode]);

  const syncEditorValue = () => {
    if (!editorRef.current) return;
    isInternalChange.current = true;
    const normalized = normalizeRichHtml(editorRef.current.innerHTML, false);
    if (normalized !== editorRef.current.innerHTML) {
      editorRef.current.innerHTML = normalized;
    }
    onChange(normalized);
  };

  const exec = (command: string, arg?: string) => {
    if (!editorRef.current || mode !== "write") return;
    editorRef.current.focus();
    document.execCommand(command, false, arg);
    syncEditorValue();
  };

  const insertHtmlSnippet = (html: string) => {
    if (mode === "html") {
      onChange((value || "") + "\n" + html);
      return;
    }
    if (!editorRef.current) return;
    editorRef.current.focus();
    const inserted = document.execCommand("insertHTML", false, html);
    if (!inserted) {
      editorRef.current.innerHTML += html;
    }
    syncEditorValue();
  };

  const handleFontSize = (sizeValue: string) => {
    if (!sizeValue) return;
    exec("fontSize", sizeValue);
  };

  const handleInsertEmbed = () => {
    const html = buildResponsiveEmbedHtml(embedInput, embedTitle);
    if (!html) return;
    insertHtmlSnippet(html);
    setEmbedInput("");
    setEmbedTitle("");
    setActivePanel(null);
  };

  const handleInsertImageByUrl = () => {
    const cleanUrl = imageUrlInput.trim();
    if (!cleanUrl) return;
    const alt = imageAltInput.trim() || "Lesson Image";
    insertHtmlSnippet(
      `<figure style="margin:14px 0;text-align:center;"><img src="${cleanUrl}" alt="${alt}" style="max-width:${imageWidth};height:auto;border-radius:12px;border:1px solid rgba(148,163,184,0.25);display:inline-block;" />${
        imageAltInput.trim()
          ? `<figcaption style="font-size:11px;color:#94a3b8;margin-top:6px;">${imageAltInput.trim()}</figcaption>`
          : ""
      }</figure><p><br/></p>`
    );
    setImageUrlInput("");
    setImageAltInput("");
    setActivePanel(null);
  };

  const handleInsertLinkConfirm = () => {
    const cleanUrl = linkUrlInput.trim();
    if (!cleanUrl) return;
    const text = linkTextInput.trim() || cleanUrl;
    insertHtmlSnippet(
      `<a href="${cleanUrl}" target="_blank" rel="noopener noreferrer" style="color:#3b82f6;text-decoration:underline;font-weight:600;">${text}</a>&nbsp;`
    );
    setLinkUrlInput("");
    setLinkTextInput("");
    setActivePanel(null);
  };

  const handleInsertVSCodeSnippet = () => {
    if (!codeSnippet.trim()) return;
    const escaped = codeSnippet
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
    insertHtmlSnippet(
      `<pre data-lang="${codeLang}" style="background:#1e1e1e;color:#d4d4d4;padding:14px 16px;border-radius:12px;font-family:monospace;font-size:12.5px;overflow-x:auto;border:1px solid #2d2d30;margin:14px 0;"><code>${escaped}</code></pre><p><br/></p>`
    );
    setActivePanel(null);
  };

  const handleInsertLatexFormula = () => {
    const clean = latexInput.trim();
    if (!clean) return;
    if (latexDisplayMode === "block") {
      insertHtmlSnippet(`<p>$$${clean}$$</p><p><br/></p>`);
    } else {
      insertHtmlSnippet(`<span>$${clean}$</span>&nbsp;`);
    }
    setActivePanel(null);
  };

  const handleFilesIntoEditor = async (files: FileList | File[]) => {
    if (!files || files.length === 0) return;
    setEditorUploading(true);
    setEditorUploadMsg("កំពុងបង្ហោះឯកសារទៅកាន់ Cloudflare R2...");

    const updatedAttachments: CourseAttachment[] = [...attachments];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const isImage =
          file.type.startsWith("image/") || /\.(png|jpe?g|webp|gif|svg)$/i.test(file.name);
        const uploaded = await uploadSingleFileToR2(file, courseCode);

        if (isImage) {
          insertHtmlSnippet(
            `<figure style="margin:14px 0;text-align:center;"><img src="${uploaded.url}" alt="${uploaded.name}" style="max-width:${imageWidth};height:auto;border-radius:12px;border:1px solid rgba(148,163,184,0.25);display:inline-block;" /><figcaption style="font-size:11px;color:#94a3b8;margin-top:6px;">${uploaded.name}</figcaption></figure><p><br/></p>`
          );
        } else {
          updatedAttachments.push({
            id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            name: uploaded.name,
            url: uploaded.url,
            key: uploaded.key,
            type: uploaded.type,
            size: uploaded.size,
            mimeType: uploaded.mimeType,
            uploadedAt: new Date().toISOString(),
          });

          if (uploaded.type === "video") {
            insertHtmlSnippet(
              `<div style="margin:14px 0;"><video src="${uploaded.url}" controls preload="metadata" style="width:100%;max-height:440px;border-radius:12px;background:#000;"></video><p style="font-size:11px;color:#94a3b8;margin-top:4px;">🎬 ${uploaded.name}</p></div><p><br/></p>`
            );
          } else if (uploaded.type === "pdf") {
            insertHtmlSnippet(
              `<div style="margin:14px 0;padding:12px 16px;border-radius:12px;border:1px solid rgba(59,130,246,0.35);background:rgba(59,130,246,0.08);display:flex;align-items:center;justify-content:space-between;gap:12px;"><span>📄 <strong>${uploaded.name}</strong> (${formatFileSize(uploaded.size)})</span><a href="${uploaded.url}" target="_blank" rel="noopener noreferrer" style="color:#3b82f6;font-weight:700;text-decoration:underline;">បើកមើល / ទាញយក PDF ↗</a></div><p><br/></p>`
            );
          } else {
            insertHtmlSnippet(
              `<div style="margin:14px 0;padding:12px 16px;border-radius:12px;border:1px solid rgba(16,185,129,0.35);background:rgba(16,185,129,0.08);display:flex;align-items:center;justify-content:space-between;gap:12px;"><span>📎 <strong>${uploaded.name}</strong> (${formatFileSize(uploaded.size)})</span><a href="${uploaded.url}" target="_blank" rel="noopener noreferrer" style="color:#10b981;font-weight:700;text-decoration:underline;">ទាញយកឯកសារ ↗</a></div><p><br/></p>`
            );
          }
        }
      }

      if (updatedAttachments.length !== attachments.length) {
        onAttachmentsChange(updatedAttachments);
      }
      setEditorUploadMsg("បានបង្ហោះ និងដាក់បញ្ចូលក្នុងមេរៀនរួចរាល់!");
      setTimeout(() => setEditorUploadMsg(null), 3000);
      setActivePanel(null);
    } catch (err: unknown) {
      setEditorUploadMsg(
        err instanceof Error ? err.message : "បរាជ័យក្នុងការបង្ហោះឯកសារទៅកាន់ R2"
      );
      setTimeout(() => setEditorUploadMsg(null), 5000);
    } finally {
      setEditorUploading(false);
    }
  };

  const handleEditorPaste = async (e: React.ClipboardEvent<HTMLDivElement>) => {
    const clipboardFiles = e.clipboardData?.files;
    if (clipboardFiles && clipboardFiles.length > 0) {
      e.preventDefault();
      await handleFilesIntoEditor(clipboardFiles);
      return;
    }

    const pastedText = e.clipboardData?.getData("text/plain")?.trim() || "";
    if (!pastedText) return;

    const isIframeCode = /^<iframe[\s\S]*<\/iframe>$/i.test(pastedText);
    const isYoutubeUrl =
      /^https?:\/\/(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)[A-Za-z0-9_-]{6,}/i.test(
        pastedText
      );

    if (isIframeCode || isYoutubeUrl) {
      e.preventDefault();
      const embedHtml = buildResponsiveEmbedHtml(pastedText);
      if (embedHtml) {
        insertHtmlSnippet(embedHtml);
      }
    }
  };

  const handleEditorDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOnEditor(false);
    if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
      await handleFilesIntoEditor(e.dataTransfer.files);
    }
  };

  const handleInsertTable = () => {
    insertHtmlSnippet(
      `<table style="width:100%; border-collapse:collapse; margin:12px 0;">
        <thead>
          <tr style="background:rgba(59,130,246,0.12);">
            <th style="border:1px solid #334155; padding:8px; text-align:left;">ប្រធានបទ (Topic)</th>
            <th style="border:1px solid #334155; padding:8px; text-align:left;">ខ្លឹមសារសំខាន់ (Details)</th>
            <th style="border:1px solid #334155; padding:8px; text-align:left;">កំណត់សម្គាល់ (Notes)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="border:1px solid #334155; padding:8px;">ផ្នែកទី ១</td>
            <td style="border:1px solid #334155; padding:8px;">សេចក្តីផ្តើម</td>
            <td style="border:1px solid #334155; padding:8px;">-</td>
          </tr>
          <tr>
            <td style="border:1px solid #334155; padding:8px;">ផ្នែកទី ២</td>
            <td style="border:1px solid #334155; padding:8px;">ការអនុវត្តលំហាត់</td>
            <td style="border:1px solid #334155; padding:8px;">-</td>
          </tr>
        </tbody>
      </table><p><br/></p>`
    );
  };

  const handleInsertCallout = () => {
    insertHtmlSnippet(
      `<blockquote style="border-left:4px solid #3b82f6;background:rgba(59,130,246,0.08);padding:12px 16px;border-radius:0 12px 12px 0;margin:12px 0;"><strong>💡 ចំណុចសំខាន់ (Key Takeaway)៖</strong> សរសេរសេចក្តីសង្ខេប ឬចំណាំសំខាន់សម្រាប់សមាជិកនៅទីនេះ...</blockquote><p><br/></p>`
    );
  };

  const handleInsertChecklist = () => {
    insertHtmlSnippet(
      `<ul style="list-style:none;padding-left:4px;margin:10px 0;">
        <li>☑️ គោលបំណងមេរៀនទី ១</li>
        <li>☑️ គោលបំណងមេរៀនទី ២</li>
        <li>⬜ លំហាត់អនុវត្តបន្ថែម</li>
      </ul><p><br/></p>`
    );
  };

  const plainText = (value || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  const wordCount = plainText ? plainText.split(" ").length : 0;
  const charCount = plainText.length;

  return (
    <div className="space-y-4">
      <input
        ref={inlineImageInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={(e) => e.target.files && handleFilesIntoEditor(e.target.files)}
        className="hidden"
      />
      <input
        ref={inlineFileDropInputRef}
        type="file"
        accept=".pdf,.mp4,.webm,.mov,.png,.jpg,.jpeg,.webp,.gif,.ppt,.pptx,.doc,.docx,.xls,.xlsx,.zip"
        multiple
        onChange={(e) => e.target.files && handleFilesIntoEditor(e.target.files)}
        className="hidden"
      />

      <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
        {/* Top Professional Formatting Ribbon */}
        <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 border-b border-border bg-muted/40">
          <div className="flex flex-wrap items-center gap-1">
            <button
              type="button"
              onClick={() => exec("formatBlock", "H1")}
              className="px-2 py-1.5 rounded-lg hover:bg-muted text-foreground text-xs font-bold inline-flex items-center gap-1"
              title="ចំណងជើងធំ (Heading 1)"
            >
              <Heading1 className="w-3.5 h-3.5" />
              <span className="text-[11px]">H1</span>
            </button>
            <button
              type="button"
              onClick={() => exec("formatBlock", "H2")}
              className="px-2 py-1.5 rounded-lg hover:bg-muted text-foreground text-xs font-bold inline-flex items-center gap-1"
              title="ចំណងជើងរង (Heading 2)"
            >
              <Heading2 className="w-3.5 h-3.5" />
              <span className="text-[11px]">H2</span>
            </button>
            <button
              type="button"
              onClick={() => exec("formatBlock", "H3")}
              className="px-2 py-1.5 rounded-lg hover:bg-muted text-foreground text-xs font-bold inline-flex items-center gap-1"
              title="ចំណងជើងតូច (Heading 3)"
            >
              <Heading3 className="w-3.5 h-3.5" />
              <span className="text-[11px]">H3</span>
            </button>

            <div className="inline-flex items-center px-1">
              <Type className="w-3.5 h-3.5 text-muted-foreground mr-1" />
              <select
                defaultValue="3"
                onChange={(e) => handleFontSize(e.target.value)}
                className="h-7 px-1.5 rounded-md border border-border bg-background text-[11px] text-foreground focus:outline-none"
                title="ទំហំអក្សរ (Font Size)"
              >
                <option value="2">តូច (Small)</option>
                <option value="3">ធម្មតា (Normal)</option>
                <option value="4">មធ្យម (Medium)</option>
                <option value="5">ធំ (Large)</option>
                <option value="6">ធំខ្លាំង (XL)</option>
              </select>
            </div>

            <span className="w-px h-4 bg-border mx-1" />

            <button
              type="button"
              onClick={() => exec("bold")}
              className="p-1.5 rounded-lg hover:bg-muted text-foreground"
              title="អក្សរដិត (Bold)"
            >
              <Bold className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => exec("italic")}
              className="p-1.5 rounded-lg hover:bg-muted text-foreground"
              title="អក្សរទ្រេត (Italic)"
            >
              <Italic className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => exec("underline")}
              className="p-1.5 rounded-lg hover:bg-muted text-foreground"
              title="គូសបន្ទាត់ពីក្រោម (Underline)"
            >
              <Underline className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => exec("strikeThrough")}
              className="p-1.5 rounded-lg hover:bg-muted text-foreground"
              title="គូសឆូត (Strikethrough)"
            >
              <Strikethrough className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={() => setActivePanel((p) => (p === "color" ? null : "color"))}
              className={`px-2 py-1.5 rounded-lg text-xs font-medium inline-flex items-center gap-1 ${
                activePanel === "color"
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted text-foreground"
              }`}
              title="ពណ៌អក្សរ (Text Color)"
            >
              <Palette className="w-3.5 h-3.5 text-primary" />
              <span className="hidden md:inline text-[11px]">ពណ៌អក្សរ</span>
            </button>
            <button
              type="button"
              onClick={() => setActivePanel((p) => (p === "highlight" ? null : "highlight"))}
              className={`px-2 py-1.5 rounded-lg text-xs font-medium inline-flex items-center gap-1 ${
                activePanel === "highlight"
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted text-foreground"
              }`}
              title="ពណ៌ផ្ទៃអក្សរ (Highlight Color)"
            >
              <Highlighter className="w-3.5 h-3.5 text-amber-500" />
              <span className="hidden md:inline text-[11px]">Highlight</span>
            </button>

            <span className="w-px h-4 bg-border mx-1" />

            <button
              type="button"
              onClick={() => exec("justifyLeft")}
              className="p-1.5 rounded-lg hover:bg-muted text-foreground"
              title="តម្រឹមឆ្វេង (Align Left)"
            >
              <AlignLeft className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => exec("justifyCenter")}
              className="p-1.5 rounded-lg hover:bg-muted text-foreground"
              title="តម្រឹមកណ្តាល (Align Center)"
            >
              <AlignCenter className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => exec("justifyRight")}
              className="p-1.5 rounded-lg hover:bg-muted text-foreground"
              title="តម្រឹមស្តាំ (Align Right)"
            >
              <AlignRight className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => exec("justifyFull")}
              className="p-1.5 rounded-lg hover:bg-muted text-foreground"
              title="តម្រឹមពេញ (Justify)"
            >
              <AlignJustify className="w-3.5 h-3.5" />
            </button>

            <span className="w-px h-4 bg-border mx-1" />

            <button
              type="button"
              onClick={() => exec("insertUnorderedList")}
              className="p-1.5 rounded-lg hover:bg-muted text-foreground"
              title="បញ្ជីចំណុច (Bullet List)"
            >
              <List className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => exec("insertOrderedList")}
              className="p-1.5 rounded-lg hover:bg-muted text-foreground"
              title="បញ្ជីលេខរៀង (Numbered List)"
            >
              <ListOrdered className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={handleInsertChecklist}
              className="p-1.5 rounded-lg hover:bg-muted text-foreground"
              title="បញ្ជីធីក (Checklist)"
            >
              <CheckSquare className="w-3.5 h-3.5" />
            </button>

            <span className="w-px h-4 bg-border mx-1" />

            {/* Media, VS Code, LaTeX Math/Physics & R2 Tools */}
            <button
              type="button"
              onClick={() => setActivePanel((p) => (p === "code" ? null : "code"))}
              className={`px-2 py-1.5 rounded-lg text-xs font-semibold inline-flex items-center gap-1 ${
                activePanel === "code"
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted text-cyan-400"
              }`}
              title="បញ្ចូលកូដពណ៌ដូច VS Code (VS Code Syntax Block)"
            >
              <Code className="w-3.5 h-3.5" />
              <span className="text-[11px]">VS Code</span>
            </button>

            <button
              type="button"
              onClick={() => setActivePanel((p) => (p === "math" ? null : "math"))}
              className={`px-2 py-1.5 rounded-lg text-xs font-semibold inline-flex items-center gap-1 ${
                activePanel === "math"
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted text-purple-400"
              }`}
              title="បញ្ចូលរូបមន្តគណិតវិទ្យា រូបវិទ្យា និង LaTeX (Math / Physics / LaTeX)"
            >
              <Sigma className="w-3.5 h-3.5" />
              <span className="text-[11px]">Math / LaTeX</span>
            </button>

            <button
              type="button"
              onClick={() => setActivePanel((p) => (p === "image" ? null : "image"))}
              className={`px-2 py-1.5 rounded-lg text-xs font-medium inline-flex items-center gap-1 ${
                activePanel === "image"
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted text-emerald-500"
              }`}
              title="បញ្ចូលរូបភាព ឬបង្ហោះទៅ Cloudflare R2 (Insert / Upload Image)"
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span className="text-[11px]">រូបភាព</span>
            </button>

            <button
              type="button"
              onClick={() => setActivePanel((p) => (p === "iframe" ? null : "iframe"))}
              className={`px-2 py-1.5 rounded-lg text-xs font-medium inline-flex items-center gap-1 ${
                activePanel === "iframe"
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted text-red-500"
              }`}
              title="បញ្ចូលវីដេអូ YouTube ឬកូដ Iframe (Embed Video / Iframe)"
            >
              <Video className="w-3.5 h-3.5" />
              <span className="text-[11px]">Iframe / YouTube</span>
            </button>

            <button
              type="button"
              onClick={() => inlineFileDropInputRef.current?.click()}
              disabled={editorUploading}
              className="px-2 py-1.5 rounded-lg hover:bg-primary/10 text-primary text-xs font-semibold inline-flex items-center gap-1 border border-primary/30"
              title="បង្ហោះឯកសារ PDF/Video/Image ទៅ Cloudflare R2 រួចដាក់ចូលមេរៀនភ្លាម (Upload to R2 & Insert)"
            >
              <UploadCloud className="w-3.5 h-3.5" />
              <span className="text-[11px]">Drop File (R2)</span>
            </button>

            <button
              type="button"
              onClick={() => setActivePanel((p) => (p === "link" ? null : "link"))}
              className={`p-1.5 rounded-lg ${
                activePanel === "link"
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted text-foreground"
              }`}
              title="បញ្ចូលតំណភ្ជាប់ (Insert Link)"
            >
              <LinkIcon className="w-3.5 h-3.5" />
            </button>

            <span className="w-px h-4 bg-border mx-1" />

            <button
              type="button"
              onClick={handleInsertCallout}
              className="px-2 py-1.5 rounded-lg hover:bg-muted text-primary text-xs font-medium inline-flex items-center gap-1"
              title="បញ្ចូលប្រអប់ចំណាំសំខាន់ (Callout Box)"
            >
              <Info className="w-3.5 h-3.5" />
              <span className="hidden sm:inline text-[11px]">ប្រអប់ចំណាំ</span>
            </button>
            <button
              type="button"
              onClick={handleInsertTable}
              className="px-2 py-1.5 rounded-lg hover:bg-muted text-foreground text-xs font-medium inline-flex items-center gap-1"
              title="បញ្ចូលតារាង (Insert Table)"
            >
              <Table className="w-3.5 h-3.5" />
              <span className="hidden sm:inline text-[11px]">តារាង</span>
            </button>
            <button
              type="button"
              onClick={() => exec("formatBlock", "BLOCKQUOTE")}
              className="p-1.5 rounded-lg hover:bg-muted text-foreground"
              title="សម្រង់សម្តី (Quote)"
            >
              <Quote className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => exec("insertHorizontalRule")}
              className="p-1.5 rounded-lg hover:bg-muted text-foreground"
              title="បន្ទាត់ខណ្ឌចែក (Divider)"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>

            <span className="w-px h-4 bg-border mx-1" />

            <button
              type="button"
              onClick={() => exec("undo")}
              className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground"
              title="ត្រឡប់ក្រោយ (Undo)"
            >
              <Undo2 className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => exec("redo")}
              className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground"
              title="ទៅមុខវិញ (Redo)"
            >
              <Redo2 className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => {
                exec("removeFormat");
                exec("formatBlock", "P");
              }}
              className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground"
              title="សម្អាតទម្រង់អក្សរ (Clear Formatting)"
            >
              <Eraser className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mode Switcher: Visual Write | HTML Source | Live Preview */}
          <div className="flex items-center rounded-lg border border-border bg-background p-0.5">
            <button
              type="button"
              onClick={() => setMode("write")}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium inline-flex items-center gap-1 transition-colors ${
                mode === "write"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Edit3 className="w-3 h-3" />
              <span>សរសេរ (Write)</span>
            </button>
            <button
              type="button"
              onClick={() => setMode("html")}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium inline-flex items-center gap-1 transition-colors ${
                mode === "html"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              title="កែប្រែកូដ HTML / Iframe ផ្ទាល់"
            >
              <FileCode className="w-3 h-3" />
              <span>HTML</span>
            </button>
            <button
              type="button"
              onClick={() => setMode("preview")}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium inline-flex items-center gap-1 transition-colors ${
                mode === "preview"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Eye className="w-3 h-3" />
              <span>មើលគំរូ (Preview)</span>
            </button>
          </div>
        </div>

        {/* Inline Action Panels */}
        {activePanel === "color" && (
          <div className="px-4 py-2.5 border-b border-border bg-muted/30 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-semibold text-foreground">ជ្រើសរើសពណ៌អក្សរ (Text Color)៖</span>
              {TEXT_COLORS.map((c) => (
                <button
                  key={c.label}
                  type="button"
                  onClick={() => {
                    exec("foreColor", c.color);
                    setActivePanel(null);
                  }}
                  className="w-6 h-6 rounded-full border border-border shadow-sm hover:scale-110 transition-transform"
                  style={{ backgroundColor: c.color }}
                  title={c.label}
                />
              ))}
              <label className="inline-flex items-center gap-1.5 ml-2 cursor-pointer text-[11px] text-muted-foreground hover:text-foreground">
                <span>ពណ៌ផ្សេងទៀត៖</span>
                <input
                  type="color"
                  defaultValue="#3b82f6"
                  onChange={(e) => exec("foreColor", e.target.value)}
                  className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent"
                />
              </label>
            </div>
            <button
              type="button"
              onClick={() => setActivePanel(null)}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {activePanel === "highlight" && (
          <div className="px-4 py-2.5 border-b border-border bg-muted/30 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-semibold text-foreground">ពណ៌ផ្ទៃអក្សរ (Highlight Color)៖</span>
              {HIGHLIGHT_COLORS.map((c) => (
                <button
                  key={c.label}
                  type="button"
                  onClick={() => {
                    exec("hiliteColor", c.color);
                    setActivePanel(null);
                  }}
                  className="px-2.5 py-1 rounded-md border border-border text-[11px] font-medium hover:scale-105 transition-transform"
                  style={{ backgroundColor: c.color }}
                >
                  {c.label}
                </button>
              ))}
              <label className="inline-flex items-center gap-1.5 ml-2 cursor-pointer text-[11px] text-muted-foreground hover:text-foreground">
                <span>ជ្រើសរើសផ្ទាល់៖</span>
                <input
                  type="color"
                  defaultValue="#fef08a"
                  onChange={(e) => exec("hiliteColor", e.target.value)}
                  className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent"
                />
              </label>
            </div>
            <button
              type="button"
              onClick={() => setActivePanel(null)}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* VS Code Snippet Builder Panel */}
        {activePanel === "code" && (
          <div className="p-4 border-b border-border bg-slate-950/90 space-y-3 text-xs">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Code className="w-4 h-4 text-cyan-400" />
                <span className="font-bold text-foreground">
                  បញ្ចូលកូដពណ៌ដូច VS Code (VS Code Dark+ Syntax Highlighting)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={codeLang}
                  onChange={(e) => setCodeLang(e.target.value)}
                  className="px-2.5 py-1 rounded-lg border border-border bg-background text-xs font-mono"
                >
                  <option value="C / C++">C / C++</option>
                  <option value="Python">Python</option>
                  <option value="JavaScript / TS">JavaScript / TypeScript</option>
                  <option value="SQL">SQL Database</option>
                  <option value="Java">Java</option>
                  <option value="HTML / CSS">HTML / CSS</option>
                </select>
                <Button
                  type="button"
                  size="sm"
                  onClick={handleInsertVSCodeSnippet}
                  className="h-7 text-xs"
                >
                  ដាក់បញ្ចូលកូដ (Insert VS Code)
                </Button>
                <button
                  type="button"
                  onClick={() => setActivePanel(null)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              <textarea
                rows={6}
                value={codeSnippet}
                onChange={(e) => setCodeSnippet(e.target.value)}
                placeholder="សរសេរ ឬបិទភ្ជាប់កូដ C, C++, Python, JS នៅទីនេះ..."
                className="w-full p-3 rounded-xl border border-slate-800 bg-[#1e1e1e] text-slate-200 font-mono text-xs leading-relaxed focus:outline-none"
              />
              <div className="max-h-52 overflow-y-auto">
                <div
                  dangerouslySetInnerHTML={{
                    __html: highlightCodeToVSCodeWindow(codeSnippet, codeLang),
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Math, Physics & LaTeX Formula Studio Panel */}
        {activePanel === "math" && (
          <div className="p-4 border-b border-border bg-muted/30 space-y-3 text-xs">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Sigma className="w-4 h-4 text-purple-400" />
                <span className="font-bold text-foreground">
                  សរសេររូបមន្តគណិតវិទ្យា រូបវិទ្យា គីមីវិទ្យា និង LaTeX (Math / Physics / LaTeX Studio)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center rounded-lg border border-border bg-background p-0.5">
                  <button
                    type="button"
                    onClick={() => setLatexDisplayMode("block")}
                    className={`px-2 py-1 rounded text-[11px] font-medium ${
                      latexDisplayMode === "block"
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground"
                    }`}
                  >
                    សមីការពេញបន្ទាត់ ($$...$$)
                  </button>
                  <button
                    type="button"
                    onClick={() => setLatexDisplayMode("inline")}
                    className={`px-2 py-1 rounded text-[11px] font-medium ${
                      latexDisplayMode === "inline"
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground"
                    }`}
                  >
                    ក្នុងអត្ថបទ ($...$)
                  </button>
                </div>
                <Button
                  type="button"
                  size="sm"
                  onClick={handleInsertLatexFormula}
                  className="h-7 text-xs"
                >
                  ដាក់បញ្ចូលរូបមន្ត
                </Button>
                <button
                  type="button"
                  onClick={() => setActivePanel(null)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[11px] font-semibold text-primary mr-1">គណិតវិទ្យា៖</span>
                {MATH_PRESETS.map((p) => (
                  <button
                    key={p.label}
                    type="button"
                    onClick={() => setLatexInput(p.latex)}
                    className="px-2 py-1 rounded-md border border-border bg-background hover:border-primary/50 text-[11px]"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[11px] font-semibold text-emerald-500 mr-1">
                  រូបវិទ្យា &amp; គីមី៖
                </span>
                {PHYSICS_CHEM_PRESETS.map((p) => (
                  <button
                    key={p.label}
                    type="button"
                    onClick={() => setLatexInput(p.latex)}
                    className="px-2 py-1 rounded-md border border-border bg-background hover:border-emerald-500/50 text-[11px]"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap items-center gap-1">
                <span className="text-[11px] text-muted-foreground mr-1">និមិត្តសញ្ញា៖</span>
                {GREEK_SYMBOLS.map((g) => (
                  <button
                    key={g.tex}
                    type="button"
                    onClick={() => setLatexInput((cur) => `${cur} ${g.tex}`)}
                    className="w-7 h-7 rounded border border-border bg-background hover:bg-primary/10 font-serif text-sm"
                    title={g.tex}
                  >
                    {g.sym}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-center">
              <div>
                <label className="block text-[11px] text-muted-foreground mb-1">
                  កូដ LaTeX (អាចសរសេរ `$$...$$` ឬ `$...$` ផ្ទាល់ក្នុងអត្ថបទក៏បាន)៖
                </label>
                <textarea
                  rows={3}
                  value={latexInput}
                  onChange={(e) => setLatexInput(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-input bg-background font-mono text-xs"
                  placeholder="\frac{-b \pm \sqrt{b^2 - 4ac}}{2a}"
                />
              </div>
              <div>
                <span className="block text-[11px] text-muted-foreground mb-1">
                  រូបរាងសមីការ (Live Formula Preview)៖
                </span>
                <div
                  dangerouslySetInnerHTML={{
                    __html: renderLatexToMathHtml(latexInput, true),
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {activePanel === "iframe" && (
          <div className="p-4 border-b border-border bg-muted/30 space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-foreground flex items-center gap-1.5">
                <Video className="w-4 h-4 text-red-500" />
                បញ្ចូលវីដេអូ YouTube, Google Drive ឬកូដ &lt;iframe&gt; (Embed Video / Iframe)
              </span>
              <button
                type="button"
                onClick={() => setActivePanel(null)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
              <div className="md:col-span-2">
                <label className="block text-[11px] text-muted-foreground mb-1">
                  តំណភ្ជាប់ YouTube / Video URL ឬកូដ &lt;iframe ...&gt;&lt;/iframe&gt; *
                </label>
                <input
                  type="text"
                  value={embedInput}
                  onChange={(e) => setEmbedInput(e.target.value)}
                  placeholder='https://www.youtube.com/watch?v=... ឬ <iframe src="https://www.youtube.com/embed/..." ...></iframe>'
                  className="w-full px-3 py-1.5 rounded-lg border border-input bg-background text-xs font-mono"
                />
              </div>
              <div>
                <label className="block text-[11px] text-muted-foreground mb-1">
                  ចំណងជើងវីដេអូ (Optional)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={embedTitle}
                    onChange={(e) => setEmbedTitle(e.target.value)}
                    placeholder="ឧ. មេរៀនទី ១ - C Programming"
                    className="w-full px-3 py-1.5 rounded-lg border border-input bg-background text-xs"
                  />
                  <Button
                    type="button"
                    size="sm"
                    onClick={handleInsertEmbed}
                    className="h-8 text-xs shrink-0"
                  >
                    ដាក់បញ្ចូល
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activePanel === "image" && (
          <div className="p-4 border-b border-border bg-muted/30 space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-foreground flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-emerald-500" />
                បញ្ចូលរូបភាពក្នុងមេរៀន (បង្ហោះទៅ Cloudflare R2 ឬដាក់ Image URL)
              </span>
              <button
                type="button"
                onClick={() => setActivePanel(null)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button
                type="button"
                size="sm"
                onClick={() => inlineImageInputRef.current?.click()}
                disabled={editorUploading}
                className="h-8 text-xs space-x-1.5"
              >
                <UploadCloud className="w-3.5 h-3.5" />
                <span>
                  {editorUploading
                    ? "កំពុងបង្ហោះរូបភាព..."
                    : "ជ្រើសរើសរូបភាពពីកុំព្យូទ័រ (Upload to R2)"}
                </span>
              </Button>
              <div className="flex items-center gap-1.5 text-[11px]">
                <span className="text-muted-foreground">ទំហំរូបភាព៖</span>
                {(["100%", "75%", "50%"] as const).map((w) => (
                  <button
                    key={w}
                    type="button"
                    onClick={() => setImageWidth(w)}
                    className={`px-2 py-1 rounded border text-[11px] font-mono ${
                      imageWidth === w
                        ? "border-primary bg-primary/15 text-primary font-bold"
                        : "border-border bg-background text-muted-foreground"
                    }`}
                  >
                    {w}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 pt-1 border-t border-border/60">
              <div className="md:col-span-2">
                <input
                  type="url"
                  value={imageUrlInput}
                  onChange={(e) => setImageUrlInput(e.target.value)}
                  placeholder="ឬបញ្ចូលតំណភ្ជាប់រូបភាព (https://.../diagram.png)"
                  className="w-full px-3 py-1.5 rounded-lg border border-input bg-background text-xs"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={imageAltInput}
                  onChange={(e) => setImageAltInput(e.target.value)}
                  placeholder="ពិពណ៌នារូបភាព (Caption)"
                  className="w-full px-3 py-1.5 rounded-lg border border-input bg-background text-xs"
                />
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={handleInsertImageByUrl}
                  className="h-8 text-xs shrink-0"
                >
                  ដាក់ URL
                </Button>
              </div>
            </div>
          </div>
        )}

        {activePanel === "link" && (
          <div className="p-4 border-b border-border bg-muted/30 flex flex-wrap items-center justify-between gap-2.5 text-xs">
            <div className="flex flex-wrap items-center gap-2 flex-1">
              <input
                type="text"
                value={linkTextInput}
                onChange={(e) => setLinkTextInput(e.target.value)}
                placeholder="អត្ថបទបង្ហាញ (ឧ. ទាញយកស្លាយមេរៀន)"
                className="px-3 py-1.5 rounded-lg border border-input bg-background text-xs w-full sm:w-56"
              />
              <input
                type="url"
                value={linkUrlInput}
                onChange={(e) => setLinkUrlInput(e.target.value)}
                placeholder="https://..."
                className="px-3 py-1.5 rounded-lg border border-input bg-background text-xs flex-1 min-w-[200px]"
              />
              <Button
                type="button"
                size="sm"
                onClick={handleInsertLinkConfirm}
                className="h-8 text-xs"
              >
                ដាក់តំណភ្ជាប់
              </Button>
            </div>
            <button
              type="button"
              onClick={() => setActivePanel(null)}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {editorUploadMsg && (
          <div className="px-4 py-2 bg-primary/10 border-b border-primary/20 text-primary text-xs font-medium flex items-center justify-between">
            <span>{editorUploadMsg}</span>
            <button type="button" onClick={() => setEditorUploadMsg(null)}>
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Main Editor Canvas / HTML Source / Live Preview */}
        {mode === "preview" ? (
          <div className={`${minHeightClass} p-6 bg-background/50`}>
            {value || attachments.length > 0 ? (
              <RichContentViewer richContent={value} attachments={attachments} />
            ) : (
              <p className="text-xs text-muted-foreground italic">
                មិនទាន់មានខ្លឹមសារសម្រាប់បង្ហាញគំរូនៅឡើយទេ...
              </p>
            )}
          </div>
        ) : mode === "html" ? (
          <textarea
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder="កែប្រែកូដ HTML ឬបិទភ្ជាប់កូដ <iframe ...></iframe> នៅទីនេះ..."
            className={`${minHeightClass} w-full p-5 bg-slate-950 text-emerald-400 font-mono text-xs leading-relaxed focus:outline-none resize-y`}
          />
        ) : (
          <div
            onDragEnter={(e) => {
              e.preventDefault();
              setIsDraggingOnEditor(true);
            }}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDraggingOnEditor(true);
            }}
            onDragLeave={(e) => {
              if (e.currentTarget === e.target) {
                setIsDraggingOnEditor(false);
              }
            }}
            onDrop={handleEditorDrop}
            className="relative"
          >
            {isDraggingOnEditor && (
              <div className="absolute inset-2 z-20 rounded-xl border-2 border-dashed border-primary bg-primary/15 backdrop-blur-xs flex flex-col items-center justify-center gap-2 pointer-events-none">
                <UploadCloud className="w-10 h-10 text-primary animate-bounce" />
                <p className="text-sm font-bold text-foreground">
                  ទម្លាក់ឯកសារទីនេះដើម្បីបង្ហោះទៅ Cloudflare R2 និងដាក់ក្នុងមេរៀន!
                </p>
                <p className="text-xs text-muted-foreground">
                  គាំទ្រ រូបភាព (PNG/JPG), ឯកសារ PDF, វីដេអូ (MP4) និងស្លាយមេរៀន
                </p>
              </div>
            )}
            <div
              ref={editorRef}
              contentEditable
              suppressContentEditableWarning
              onInput={syncEditorValue}
              onBlur={syncEditorValue}
              onPaste={handleEditorPaste}
              data-placeholder={placeholder}
              className={`${minHeightClass} p-5 text-sm text-foreground leading-relaxed focus:outline-none prose prose-sm dark:prose-invert max-w-none empty:before:content-[attr(data-placeholder)] empty:before:text-muted-foreground [&_h1]:text-xl [&_h1]:font-extrabold [&_h1]:mt-3 [&_h1]:mb-2 [&_h2]:text-lg [&_h2]:font-bold [&_h2]:mt-2.5 [&_h2]:mb-1.5 [&_h3]:text-base [&_h3]:font-semibold [&_h3]:mt-2 [&_h3]:mb-1 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_blockquote]:border-l-4 [&_blockquote]:border-primary [&_blockquote]:bg-primary/5 [&_blockquote]:p-3 [&_blockquote]:rounded-r-xl [&_blockquote]:my-2 [&_pre]:bg-[#1e1e1e] [&_pre]:text-[#d4d4d4] [&_pre]:p-3.5 [&_pre]:rounded-xl [&_pre]:font-mono [&_pre]:text-xs [&_pre]:my-2 [&_a]:text-primary [&_a]:underline [&_hr]:my-4 [&_hr]:border-border [&_img]:rounded-xl [&_img]:my-2 [&_iframe]:w-full [&_iframe]:rounded-xl`}
            />
          </div>
        )}

        {/* Editor Status Footer */}
        <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2 border-t border-border bg-muted/20 text-[11px] text-muted-foreground">
          <div className="flex flex-wrap items-center gap-3">
            <span>
              ពាក្យ (Words): <strong className="text-foreground">{wordCount}</strong>
            </span>
            <span>
              តួអក្សរ (Characters): <strong className="text-foreground">{charCount}</strong>
            </span>
            <span>
              ឯកសារ R2: <strong className="text-primary">{attachments.length}</strong>
            </span>
          </div>
          <span>
            VS Code Syntax • Math/Physics LaTeX ($$...$$) • YouTube/Iframe • Cloudflare R2 Drop
          </span>
        </div>
      </div>

      {!hideInlineAttachments && (
        <CloudflareR2AttachmentManager
          attachments={attachments}
          onAttachmentsChange={onAttachmentsChange}
          courseCode={courseCode}
        />
      )}
    </div>
  );
}

/**
 * Safe HTML, VS Code Dark+ Code Blocks, LaTeX Math/Physics & Cloudflare R2 Attachments Viewer
 */
export function RichContentViewer({
  richContent,
  notes,
  attachments = [],
}: {
  richContent?: string;
  notes?: string;
  attachments?: CourseAttachment[];
}) {
  const [previewPdfUrl, setPreviewPdfUrl] = useState<string | null>(null);

  const normalizedRich = normalizeRichHtml(richContent, true);
  const hasRich = Boolean(normalizedRich && normalizedRich.trim());
  const hasNotes = Boolean(notes && notes.trim());
  const hasAttachments = Array.isArray(attachments) && attachments.length > 0;

  if (!hasRich && !hasNotes && !hasAttachments) {
    return null;
  }

  return (
    <div className="space-y-3 mt-2">
      {hasRich ? (
        <div
          className="text-xs sm:text-sm text-foreground/90 leading-relaxed space-y-2 [&_h1]:text-lg [&_h1]:font-extrabold [&_h1]:text-foreground [&_h1]:mt-3 [&_h2]:text-base [&_h2]:font-bold [&_h2]:text-foreground [&_h2]:mt-2 [&_h3]:text-sm [&_h3]:font-semibold [&_h3]:text-foreground [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_blockquote]:border-l-4 [&_blockquote]:border-primary [&_blockquote]:bg-primary/5 [&_blockquote]:p-3 [&_blockquote]:rounded-r-xl [&_blockquote]:text-foreground [&_a]:text-primary [&_a]:underline [&_hr]:my-3 [&_hr]:border-border [&_img]:rounded-xl [&_img]:max-w-full [&_iframe]:w-full [&_iframe]:rounded-xl"
          dangerouslySetInnerHTML={{ __html: normalizedRich }}
        />
      ) : hasNotes ? (
        <p className="text-xs sm:text-sm text-muted-foreground whitespace-pre-line">
          {notes}
        </p>
      ) : null}

      {hasAttachments && (
        <div className="space-y-2 pt-1">
          <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
            ឯកសារភ្ជាប់ និងវីដេអូមេរៀន (Course Materials • Cloudflare R2)
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {attachments.map((att) => (
              <div
                key={att.id || att.url}
                className="flex flex-col justify-between p-2.5 rounded-xl border border-border bg-muted/20 hover:border-primary/40 transition-colors gap-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    {att.type === "pdf" ? (
                      <FileText className="w-4 h-4 text-red-500 shrink-0" />
                    ) : att.type === "video" ? (
                      <Film className="w-4 h-4 text-blue-500 shrink-0" />
                    ) : (
                      <FileArchive className="w-4 h-4 text-emerald-500 shrink-0" />
                    )}
                    <span className="text-xs font-medium text-foreground truncate">
                      {att.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    {att.type === "pdf" && (
                      <button
                        type="button"
                        onClick={() =>
                          setPreviewPdfUrl((cur) => (cur === att.url ? null : att.url))
                        }
                        className="px-2 py-1 rounded-md bg-primary/10 text-primary hover:bg-primary/20 text-[11px] font-medium"
                      >
                        {previewPdfUrl === att.url ? "បិទ PDF" : "មើល PDF"}
                      </button>
                    )}
                    <a
                      href={att.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-muted hover:bg-muted/80 text-foreground text-[11px] font-medium"
                    >
                      <span>ទាញយក / បើក</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                {att.type === "video" &&
                  /\.(mp4|webm|mov)(\?|$)/i.test(att.url) && (
                    <video
                      src={att.url}
                      controls
                      preload="metadata"
                      className="w-full rounded-lg max-h-60 bg-black mt-1"
                    />
                  )}
              </div>
            ))}
          </div>

          {previewPdfUrl && (
            <div className="rounded-xl border border-border overflow-hidden bg-background mt-2">
              <div className="flex items-center justify-between px-3 py-2 bg-muted/40 border-b border-border text-xs">
                <span className="font-semibold text-foreground">
                  ការមើលឯកសារ PDF ផ្ទាល់ (PDF Preview)
                </span>
                <button
                  type="button"
                  onClick={() => setPreviewPdfUrl(null)}
                  className="text-muted-foreground hover:text-foreground text-xs"
                >
                  បិទ (Close)
                </button>
              </div>
              <iframe
                src={previewPdfUrl}
                title="PDF Viewer"
                className="w-full h-[480px] border-0"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
