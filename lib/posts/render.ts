import { remark } from "remark";
import html from "remark-html";

export async function renderMarkdownToHtml(markdown: string) {
  const processedContent = await remark().use(html).process(markdown);
  return processedContent.toString();
}
