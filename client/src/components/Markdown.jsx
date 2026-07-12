import React from "react";

export default function Markdown({ content }) {
  if (!content) return null;

  // Simple HTML escape
  const escapeHtml = (text) => {
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  };

  const parseMarkdown = (rawText) => {
    // 1. Separate code blocks to protect them from inline parsing
    const codeBlocks = [];
    let text = rawText;

    // Regex for fenced code blocks
    const codeBlockRegex = /```(\w*)\n([\s\S]*?)\n```/g;
    text = text.replace(codeBlockRegex, (match, lang, code) => {
      const id = codeBlocks.length;
      codeBlocks.push({ lang, code });
      return `___CODE_BLOCK_${id}___`;
    });

    // Escape text (except our placeholder)
    text = escapeHtml(text);

    // 2. Parse inline formatting
    // Bold: **text**
    text = text.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    // Italics: *text*
    text = text.replace(/\*([^*]+)\*/g, "<em>$1</em>");
    // Inline code: `code`
    text = text.replace(/`([^`]+)`/g, "<code class='inline-code'>$1</code>");
    // Links: [text](url)
    text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, "<a href='$2' target='_blank' rel='noopener noreferrer' class='md-link'>$1</a>");
    // Bullet lists: Lines starting with - or *
    const lines = text.split("\n");
    let inList = false;
    const parsedLines = lines.map(line => {
      const match = line.match(/^\s*[-*]\s+(.+)/);
      if (match) {
        let prefix = "";
        if (!inList) {
          inList = true;
          prefix = "<ul class='md-list'>";
        }
        return prefix + `<li>${match[1]}</li>`;
      } else {
        let suffix = "";
        if (inList) {
          inList = false;
          suffix = "</ul>";
        }
        return suffix + line;
      }
    });
    if (inList) {
      parsedLines[parsedLines.length - 1] += "</ul>";
    }
    text = parsedLines.join("\n");

    // Replace newlines with <br/> except for code block placeholders
    text = text.split("\n").map(line => {
      if (line.includes("___CODE_BLOCK_")) return line;
      return line + "<br/>";
    }).join("");

    // 3. Inject code blocks back with custom HTML structures
    codeBlocks.forEach((block, idx) => {
      const escapedCode = escapeHtml(block.code);
      const htmlBlock = `
        <div class="code-block-container">
          <div class="code-block-header">
            <span class="code-lang">${block.lang || "code"}</span>
            <button class="copy-btn" data-code="${block.code.replace(/"/g, "&quot;")}">Copy</button>
          </div>
          <pre><code>${escapedCode}</code></pre>
        </div>
      `;
      text = text.replace(`___CODE_BLOCK_${idx}___`, htmlBlock);
    });

    return text;
  };

  const handleContainerClick = (e) => {
    if (e.target.classList.contains("copy-btn")) {
      const code = e.target.getAttribute("data-code");
      if (code) {
        navigator.clipboard.writeText(code);
        const originalText = e.target.innerText;
        e.target.innerText = "Copied! ✓";
        e.target.classList.add("copied");
        setTimeout(() => {
          e.target.innerText = originalText;
          e.target.classList.remove("copied");
        }, 2000);
      }
    }
  };

  return (
    <div
      className="markdown-body"
      dangerouslySetInnerHTML={{ __html: parseMarkdown(content) }}
      onClick={handleContainerClick}
    />
  );
}
