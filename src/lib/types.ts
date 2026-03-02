export type Post = {
  id: string;
  title: string;
  category: string;
  tags: string[];
  creditsCost: number;
  publishedAt: string; // ISO
  excerpt: string;
  content: string;
};

