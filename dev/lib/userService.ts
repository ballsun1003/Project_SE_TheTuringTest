
import { supabase } from "./supabaseClient";
import { verifyTurnstile } from "./captchaService";
import bcrypt from "bcryptjs";
import { User, mapDBUser } from "./entities/User";

/**
 * ================================================
 * 🧩 User Service (userService.ts)
 * ================================================
 * 본 서비스 모듈은 사용자 인증 및 계정 관리를 위한
 * 핵심 비즈니스 로직을 포함한다.
 *
 * 주요 기능:
 * 1️⃣ 회원가입 (signUpUser)
 *  - Turnstile 캡차 검증을 통해 봇 가입 방지
 *  - 사용자명 중복 확인
 *  - bcrypt 기반 비밀번호 해싱
 *  - Supabase users 테이블에 신규 사용자 등록
 *
 * 2️⃣ 로그인 (loginUser)
 *  - Turnstile 검증
 *  - 사용자명으로 DB에서 사용자 조회
 *  - bcrypt 해싱값과 비교하여 비밀번호 인증
 *  - 로그인 성공 시 마지막 로그인 시간 갱신
 *  - 결과로 사용자 데이터 및 Access Token(유저 ID 기반) 반환
 *
 * 3️⃣ 현재 로그인 유저 조회 (getCurrentUser)
 *  - Access Token(유저 ID)을 기반으로 사용자 정보 반환
 *
 * 4️⃣ 사용자 통계 조회 (getUserStats)
 *  - 유저가 작성한 게시글 기반으로
 *    총 게시글 수, 총 좋아요 수, 총 싫어요 수 계산
 *
 * 5️⃣ 사용자 계정 정보 수정 (updateUserInfo)
 *  - 루트 계정 수정 방지
 *  - 사용자명 중복 검사 (본인 제외)
 *  - 비밀번호 변경 시 기존 비밀번호 검증 필수
 *  - Supabase users 테이블 업데이트
 *
 * 6️⃣ 회원 탈퇴 및 모든 관련 데이터 삭제 (deleteUserAndData)
 *  - 루트 계정 삭제 방지
 *  - 사용자 게시글/댓글/반응/알림 등 모든 데이터 삭제
 *  - 마지막으로 사용자 데이터 삭제
 *
 * 보안/정책 사항:
 * - 루트 계정 보호(수정 및 삭제 금지)
 * - 비밀번호는 평문 저장 금지 → bcrypt 해싱 필수
 * - 캡차 검증 필수 적용(회원가입 및 로그인)
 *
 * 관련 테이블:
 * - users
 * - posts
 * - comments
 * - post_reactions
 * - notifications
 *
 * 이 모듈은 UI 계층, 라우터 계층에서 재사용 가능하도록
 * 데이터베이스 접근과 인증 로직을 캡슐화한다.
 * ================================================
 */

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
