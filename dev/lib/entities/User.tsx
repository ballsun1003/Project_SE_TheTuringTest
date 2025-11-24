// models/User.ts

export interface UserProps {
  id: string;          // uuid
  username: string;    // 유저 아이디
  createdAt: string;   // 가입일(timestamp)
  lastLogin: string | null;  // 마지막 로그인 시간
}

export class User {
  private id: string;
  private username: string;
  private createdAt: string;
  private lastLogin: string | null;

  constructor(props: UserProps) {
    this.id = props.id;
    this.username = props.username;
    this.createdAt = props.createdAt;
    this.lastLogin = props.lastLogin;
  }

  // getters
  getId() {
    return this.id;
  }

  getUsername() {
    return this.username;
  }

  getCreatedAt() {
    return this.createdAt;
  }

  // setters (필요하면)
  setUsername(username: string) {
    this.username = username;
  }

  setLastLogin(date: string) {
    this.lastLogin = date;
  }
}

// Supabase row → User
export function mapDBUser(row: any): User {
  return new User({
    id: row.id,
    username: row.username,
    createdAt: row.created_at,
    lastLogin: row.last_login ?? null,
  });
}
