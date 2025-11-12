// app/layout.tsx
import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
  title: "게시판 데모",
  description: "Next.js App Router 기본 레이아웃",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="min-h-dvh bg-gray-50 text-gray-900 antialiased">
        <header className="border-b bg-white">
          <div className="mx-auto max-w-4xl px-4 py-4">
            <h1 className="text-xl font-semibold">게시판 데모</h1>
          </div>
        </header>

        <main className="mx-auto max-w-4xl px-4 py-8">
          {children}
        </main>

        <footer className="mt-12 border-t bg-white">
          <div className="mx-auto max-w-4xl px-4 py-4 text-sm text-gray-500">
            © {new Date().getFullYear()} MyBoard
          </div>
        </footer>
      </body>
    </html>
  );
}
