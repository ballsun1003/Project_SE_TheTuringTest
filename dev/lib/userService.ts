
import { supabase } from "./supabaseClient";
import { verifyTurnstile } from "./captchaService";
import bcrypt from "bcryptjs";
import { User, mapDBUser } from "./entities/User";

export const ROOT_USER_ID =
  "00000000-0000-0000-0000-000000000001";

//
// 1. 회원가입
//
export async function signUpUser(
  username: string,
  password: string,
  captchaToken: string
): Promise<{ user?: User; error?: string }> {

  // 1) Turnstile 검증
  const ok = await verifyTurnstile(captchaToken);
  if (!ok) return { error: "Captcha verification failed." };

  // 2) username 중복 검사
  const { data: existingUser } = await supabase
    .from("users")
    .select("*")
    .eq("username", username)
    .maybeSingle();

  if (existingUser) return { error: "Username already exists." };

  // 3) bcrypt 해싱
  const hash = await bcrypt.hash(password, 10);

  // 4) 유저 생성
  const { data, error } = await supabase
    .from("users")
    .insert([
      {
        username,
        password_hash: hash,
        last_login: null, // 새 유저는 마지막 로그인 없음
      },
    ])
    .select()
    .single();

  if (error || !data) return { error: "Signup failed." };

  // 5) User 객체 변환
  const user = mapDBUser(data);
  return { user };
}


//
// 2. 로그인
//
export async function loginUser(
  username: string,
  password: string,
  captchaToken: string
): Promise<{ user?: User; accessToken?: string; error?: string }> {

  // 1) Turnstile 검증
  const ok = await verifyTurnstile(captchaToken);
  if (!ok) return { error: "Captcha verification failed." };

  // 2) username으로 유저 가져오기
  const { data: row, error } = await supabase
    .from("users")
    .select("*")
    .eq("username", username)
    .single();

  if (error || !row) return { error: "User not found." };

  // 3) 비밀번호 비교
  const valid = await bcrypt.compare(password, row.password_hash);
  if (!valid) return { error: "Invalid password." };

  // 4) 마지막 로그인 갱신
  const now = new Date().toISOString();

  await supabase
    .from("users")
    .update({ last_login: now })
    .eq("id", row.id);

  // 5) Fake Session Token = user.id
  const token = row.id;

  // 6) User 객체 (last_login 포함 최신 값으로 매핑)
  const user = mapDBUser({
    ...row,
    last_login: now,
  });

  return { user, accessToken: token };
}


//
// 3. 현재 로그인 유저 가져오기
//
export async function getCurrentUser(
  token: string
): Promise<{ user?: User; error?: string }> {

  if (!token) return { error: "No token provided." };

  const { data: row, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", token)
    .single();

  if (error || !row) return { error: "User not found." };

  const user = mapDBUser(row);
  return { user };
}

export async function getUserStats(userId: string) {
  // 유저의 posts 가져오기
  const { data, error } = await supabase
    .from("posts")
    .select("like_count, dislike_count")
    .eq("author_id", userId)
    .eq("is_deleted", false);

  if (error || !data) return { error: "Failed to load stats" };

  const postCount = data.length;
  const totalLikes = data.reduce((sum, p) => sum + p.like_count, 0);
  const totalDislikes = data.reduce((sum, p) => sum + p.dislike_count, 0);

  return { postCount, totalLikes, totalDislikes };
}


//
// 4. 회원 정보 수정
//
export async function updateUserInfo(
  userId: string,
  newUsername: string,
  currentPassword?: string | null,
  newPassword?: string | null
): Promise<{ error?: string }> {
  
  // 루트 계정 보호
  if (userId === ROOT_USER_ID) {
    return { error: "Root user cannot be modified." };
  }

  // 사용자 조회
  const { data: row, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();

  if (error || !row) return { error: "User not found." };

  // username 중복 체크 (자기 자신 제외)
  const { data: duplicate } = await supabase
    .from("users")
    .select("id")
    .eq("username", newUsername)
    .neq("id", userId)
    .maybeSingle();

  if (duplicate) return { error: "Username already exists." };

  const updates: any = { username: newUsername };

  // 비밀번호 변경 요청이 있는 경우
  if (newPassword) {
    if (!currentPassword) {
      return { error: "Current password is required." };
    }

    const validPw = await bcrypt.compare(currentPassword, row.password_hash);
    if (!validPw) {
      return { error: "Current password is incorrect." };
    }

    const hash = await bcrypt.hash(newPassword, 10);
    updates.password_hash = hash;
  }

  // 업데이트 실행
  const { error: errUpdate } = await supabase
    .from("users")
    .update(updates)
    .eq("id", userId);

  if (errUpdate) return { error: "Update failed." };

  return {};
}

//
// 5. 회원 탈퇴: 전체 데이터 삭제
//
export async function deleteUserAndData(userId: string): 
Promise<{ error?: string }> {

  if (userId === ROOT_USER_ID) {
    return { error: "Root user cannot be deleted." };
  }

  try {
    // 댓글 삭제
    await supabase.from("comments").delete().eq("author_id", userId);

    // 좋아요/싫어요 삭제
    await supabase.from("reactions").delete().eq("user_id", userId);

    // 알림 삭제
    await supabase.from("notifications").delete().eq("to_user_id", userId);
    await supabase.from("notifications").delete().eq("from_user_id", userId);

    // 게시글 삭제 (is_deleted true 로 처리 or 완전 삭제)
    await supabase.from("posts").delete().eq("author_id", userId);

    // 유저 삭제
    const { error } = await supabase
      .from("users")
      .delete()
      .eq("id", userId);

    if (error) return { error: "Account delete failed." };

    return {};

  } catch (e) {
    console.error(e);
    return { error: "Database error occurred." };
  }
}
