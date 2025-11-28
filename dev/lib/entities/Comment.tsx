// models/Comment.ts

export interface CommentProps {
  id: string;
  postId: string;          // FK → posts.id
  authorId: string;        // FK → users.id
  content: string;         // AI 생성
  prompt: string;          // 생성 prompt
  updatedPrompt?: string;  // 수정 prompt
  createdAt: string;
  updatedAt?: string;
}

export class Comment {
  private id: string;
  private postId: string;
  private authorId: string;
  private content: string;
  private prompt: string;
  private updatedPrompt?: string;
  private createdAt: string;
  private updatedAt?: string;

  constructor(props: CommentProps) {
    this.id = props.id;
    this.postId = props.postId;
    this.authorId = props.authorId;
    this.content = props.content;
    this.prompt = props.prompt;
    this.updatedPrompt = props.updatedPrompt;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  getId() { return this.id; }
  getPostId() { return this.postId; }
  getAuthorId() { return this.authorId; }
  getContent() { return this.content; }

  setContent(content: string) {
    this.content = content;
  }
}

export function mapDBComment(row: any): Comment {
  return new Comment({
    id: row.id,
    postId: row.post_id,
    authorId: row.author_id,
    content: row.content,
    prompt: row.prompt,
    updatedPrompt: row.updated_prompt,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  });
}
