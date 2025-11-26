
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
