export type PostFrontmatter = {
  title: string;
  date: string;
  excerpt?: string;
  coverImage?: string;
  tags?: string[];
  draft?: boolean;
  updatedDate?: string;
  category?: string;
};

export type PostData = {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  coverImage?: string;
  tags?: string[];
  updatedDate?: string;
  category?: string;
  readingTime: number;
  contentHtml?: string;
};

export type ParsedPostFile = {
  slug: string;
  frontmatter: PostFrontmatter;
  content: string;
};
