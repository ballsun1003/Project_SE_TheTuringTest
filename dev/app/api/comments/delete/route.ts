import { NextResponse } from "next/server";
import { getCommentById } from "@/lib/commentService";
import { supabase } from "@/lib/supabaseClient";

export async function POST(req: Request) {
  try {
    const { commentId, authorId } = await req.json();

    if (!commentId || !authorId) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const { comment, error } = await getCommentById(commentId);

    if (error || !comment) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }

    // 작성자 본인만 삭제 가능
    if (comment.getAuthorId() !== authorId) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    const { error: delErr } = await supabase
      .from("comments")
      .delete()
      .eq("id", commentId);

    if (delErr) {
      return NextResponse.json({ error: "Failed to delete comment" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
