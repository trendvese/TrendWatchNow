/**
 * Simple Markdown Parser for Blog Content
 * Converts markdown syntax to HTML
 */

export function parseMarkdown(content: string): string {
  let html = content;

  // Escape HTML entities first (but preserve our markdown)
  html = html
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Restore blockquotes (we need > to work)
  html = html.replace(/^&gt;\s?(.*)$/gm, '<blockquote>$1</blockquote>');

  // Code blocks (```)
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, code) => {
    return `<pre class="code-block" data-lang="${lang}"><code>${code.trim()}</code></pre>`;
  });

  // Inline code (`)
  html = html.replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>');

  // Images ![alt](url)
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="content-image" loading="lazy" />');

  // Links [text](url)
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="content-link">$1</a>');

  // Headers (must be at start of line)
  html = html.replace(/^#### (.+)$/gm, '<h4 class="content-h4">$1</h4>');
  html = html.replace(/^### (.+)$/gm, '<h3 class="content-h3">$1</h3>');
  html = html.replace(/^## (.+)$/gm, '<h2 class="content-h2">$1</h2>');
  html = html.replace(/^# (.+)$/gm, '<h1 class="content-h1">$1</h1>');

  // Horizontal rule
  html = html.replace(/^---$/gm, '<hr class="content-hr" />');
  html = html.replace(/^\*\*\*$/gm, '<hr class="content-hr" />');

  // Bold and Italic (order matters!)
  // Bold + Italic (***text*** or ___text___)
  html = html.replace(/\*\*\*([^*]+)\*\*\*/g, '<strong><em>$1</em></strong>');
  html = html.replace(/___([^_]+)___/g, '<strong><em>$1</em></strong>');

  // Bold (**text** or __text__)
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong class="content-bold">$1</strong>');
  html = html.replace(/__([^_]+)__/g, '<strong class="content-bold">$1</strong>');

  // Italic (*text* or _text_)
  html = html.replace(/\*([^*]+)\*/g, '<em class="content-italic">$1</em>');
  html = html.replace(/_([^_]+)_/g, '<em class="content-italic">$1</em>');

  // Strikethrough (~~text~~)
  html = html.replace(/~~([^~]+)~~/g, '<del class="content-strikethrough">$1</del>');

  // Unordered lists (- item or * item)
  html = html.replace(/^[\-\*]\s+(.+)$/gm, '<li class="content-li">$1</li>');
  html = html.replace(/(<li class="content-li">.*<\/li>\n?)+/g, (match) => {
    return `<ul class="content-ul">${match}</ul>`;
  });

  // Ordered lists (1. item)
  html = html.replace(/^\d+\.\s+(.+)$/gm, '<li class="content-li-ordered">$1</li>');
  html = html.replace(/(<li class="content-li-ordered">.*<\/li>\n?)+/g, (match) => {
    return `<ol class="content-ol">${match}</ol>`;
  });

  // Merge consecutive blockquotes
  html = html.replace(/<\/blockquote>\n<blockquote>/g, '\n');

  // Tables (basic support)
  const tableRegex = /\|(.+)\|\n\|[-:\s|]+\|\n((?:\|.+\|\n?)+)/g;
  html = html.replace(tableRegex, (_, headerRow, bodyRows) => {
    const headers = headerRow.split('|').filter((h: string) => h.trim());
    const rows = bodyRows.trim().split('\n').map((row: string) => 
      row.split('|').filter((c: string) => c.trim())
    );
    
    let table = '<table class="content-table"><thead><tr>';
    headers.forEach((h: string) => {
      table += `<th>${h.trim()}</th>`;
    });
    table += '</tr></thead><tbody>';
    
    rows.forEach((row: string[]) => {
      table += '<tr>';
      row.forEach((cell: string) => {
        table += `<td>${cell.trim()}</td>`;
      });
      table += '</tr>';
    });
    
    table += '</tbody></table>';
    return table;
  });

  // Paragraphs - wrap loose text in <p> tags
  // Split by double newlines for paragraphs
  const blocks = html.split(/\n\n+/);
  html = blocks.map(block => {
    const trimmed = block.trim();
    // Don't wrap if already wrapped in a block element
    if (
      trimmed.startsWith('<h1') ||
      trimmed.startsWith('<h2') ||
      trimmed.startsWith('<h3') ||
      trimmed.startsWith('<h4') ||
      trimmed.startsWith('<ul') ||
      trimmed.startsWith('<ol') ||
      trimmed.startsWith('<blockquote') ||
      trimmed.startsWith('<pre') ||
      trimmed.startsWith('<table') ||
      trimmed.startsWith('<hr') ||
      trimmed.startsWith('<img') ||
      trimmed === ''
    ) {
      return trimmed;
    }
    // Replace single newlines with <br> within paragraphs
    const withBreaks = trimmed.replace(/\n/g, '<br />');
    return `<p class="content-p">${withBreaks}</p>`;
  }).join('\n\n');

  return html;
}
