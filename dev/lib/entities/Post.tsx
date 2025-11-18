// models/Post.ts

export interface PostProps {
  id: string;
  title: string;
  content: string;
  authorId: string;
  modelName: string;
  likeCount: number;
  dislikeCount: number;
  viewCount: number;
  createdAt: String;
  updatedAt: String;
  isDeleted: boolean;
}

export class Post {
  private id: string;
  private title: string;
  private content: string;
  private authorId: string;
  private modelName: string;
  private likeCount: number;
  private dislikeCount: number;
  private viewCount: number;
  private createdAt: String;
  private updatedAt: String;
  private deleted: boolean;

  constructor(props: PostProps) {
    this.id = props.id;
    this.title = props.title;
    this.content = props.content;
    this.authorId = props.authorId;
    this.modelName = props.modelName;
    this.likeCount = props.likeCount;
    this.dislikeCount = props.dislikeCount;
    this.viewCount = props.viewCount;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
    this.deleted = props.isDeleted;
  }

  // getId : 식별자 조회
  getId(): string {
    return this.id;
  }

  // getTitle : 제목 조회
  getTitle(): string {
    return this.title;
  }

  // setTitle : 제목 변경
  setTitle(newTitle: string): void {
    this.title = newTitle;
    this.touchUpdatedAt();
  }

  // getContent : 본문 조회
  getContent(): string {
    return this.content;
  }

  // setContent : 본문 변경
  setContent(newContent: string): void {
    this.content = newContent;
    this.touchUpdatedAt();
  }

  // getAuthorId : 작성자 조회
  getAuthorId(): string {
    return this.authorId;
  }

  // getModelName : 모델명 조회
  getModelName(): string {
    return this.modelName;
  }

  // setModelName : 모델명 변경
  setModelName(newModelName: string): void {
    this.modelName = newModelName;
    this.touchUpdatedAt();
  }

  // getLikeCount : 좋아요 수 조회
  getLikeCount(): number {
    return this.likeCount;
  }

  // getDislikeCount : 싫어요 수 조회
  getDislikeCount(): number {
    return this.dislikeCount;
  }

  // like : 좋아요 1 증가
  like(): void {
    this.likeCount += 1;
    this.touchUpdatedAt();
  }

  // dislike : 싫어요 1 증가
  dislike(): void {
    this.dislikeCount += 1;
    this.touchUpdatedAt();
  }

  // incrementView : 조회수 1 증가
  incrementView(): void {
    this.viewCount += 1;
  }

  // (옵션) 조회수 조회
  getViewCount(): number {
    return this.viewCount;
  }

  // softDelete : 논리 삭제 처리
  softDelete(): void {
    this.deleted = true;
    this.touchUpdatedAt();
  }

  // (옵션) 삭제 여부 조회
  isDeleted(): boolean {
    return this.deleted;
  }

  // 생성일 / 수정일 조회
  getCreatedAt(): String {
    return this.createdAt;
  }

  getUpdatedAt(): String {
    return this.updatedAt;
  }

  // 내부에서 updatedAt 갱신용
  private touchUpdatedAt() {
    this.updatedAt = new Date().toISOString(); // ✅ string으로 저장
  }
}
