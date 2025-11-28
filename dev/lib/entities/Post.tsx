// models/Post.ts

export type BoardCategory = "free" | "share" | "qna";

export interface PostProps {
  id: string;
  authorId: string;          // FK → users.id
  title: string;             // 제목 (유저 입력)
  content: string;           // 본문 (AI 생성)
  prompt: string;            // 생성 시 prompt
  updatedPrompt?: string;    // 수정 prompt (AI 수정)
  likeCount: number;
  dislikeCount: number;
  viewCount: number;
  category: BoardCategory;   // free | share | qna
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export class Post {
  private id: string;
  private authorId: string;
  private title: string;
  private content: string;
  private prompt: string;
  private updatedPrompt?: string;
  private likeCount: number;
  private dislikeCount: number;
  private viewCount: number;
  private category: BoardCategory;
  private isDeleted: boolean;
  private createdAt: string;
  private updatedAt: string;

  constructor(props: PostProps) {
    this.id = props.id;
    this.authorId = props.authorId;
    this.title = props.title;
    this.content = props.content;
    this.prompt = props.prompt;
    this.updatedPrompt = props.updatedPrompt;
    this.likeCount = props.likeCount;
    this.dislikeCount = props.dislikeCount;
    this.viewCount = props.viewCount;
    this.category = props.category;
    this.isDeleted = props.isDeleted;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  // getters
  getId() { return this.id; }
  getAuthorId() { return this.authorId; }
  getTitle() { return this.title; }
  getContent() { return this.content; }
  getPrompt() { return this.prompt; }
  getUpdatedPrompt() { return this.updatedPrompt; }
  getLikeCount() { return this.likeCount; }
  getDislikeCount() { return this.dislikeCount; }
  getViewCount() { return this.viewCount; }
  getCategory() { return this.category; }
  getIsDeleted() { return this.isDeleted; }
  getCreatedAt() { return this.createdAt; }
  getUpdatedAt() { return this.updatedAt; }

  // setters
  setContent(newContent: string) { this.content = newContent; }
  setUpdatedPrompt(prompt: string) { this.updatedPrompt = prompt; }
  setCategory(cat: BoardCategory) { this.category = cat; }
  setTitle(newTitle: string) { this.title = newTitle; }
}

// Supabase row → Post 객체 매핑
export function mapDBPost(row: any): Post {
  return new Post({
    id: row.id,
    authorId: row.author_id,
    title: row.title,
    content: row.content,
    prompt: row.prompt,
    updatedPrompt: row.updated_prompt,
    likeCount: row.like_count,
    dislikeCount: row.dislike_count,
    viewCount: row.view_count,
    category: row.category as BoardCategory,
    isDeleted: row.is_deleted,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  });
}
