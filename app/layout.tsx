import "./globals.css";

export const metadata = {
  title: "Emergence at the Edge of Chaos",
  description: "Interactive research exhibit on cellular automata.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="text-slate-100" style={{ backgroundColor: "#192A4F" }}>{children}</body>
    </html>
  );
}
