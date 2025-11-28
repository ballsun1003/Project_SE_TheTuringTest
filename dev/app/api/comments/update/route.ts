import { NextResponse } from "next/server";
import { getCommentById, updateCommentContent } from "@/lib/commentService";
import { updateAIContent } from "@/lib/aiService";

export async function POST(req: Request) {
  try {
    const { commentId, authorId, updatedPrompt } = await req.json();

    if (!commentId || !authorId || !updatedPrompt) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const { comment, error } = await getCommentById(commentId);
    if (error || !comment) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }

    // 작성자 본인만 수정 가능
    if (comment.getAuthorId() !== authorId) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    const oldContent = comment.getContent();
    const newContent = await updateAIContent(oldContent, updatedPrompt);

    const updated = await updateCommentContent(
      commentId,
      newContent,
      updatedPrompt
    );

    if (updated.error || !updated.comment) {
      return NextResponse.json({ error: "Failed to update comment" }, { status: 500 });
    }

    return NextResponse.json({ comment: updated.comment });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
