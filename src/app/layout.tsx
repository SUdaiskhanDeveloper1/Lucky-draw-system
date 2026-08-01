import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "@/components/providers/theme-provider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Rs.1 Lucky Draw — Win Big for Just Rs.1",
  description:
    "Join transparent Rs.1 lucky draws and win prizes across Pakistan.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster
            position="top-center"
            toastOptions={{
              style: {
                background: "hsl(240 8% 10%)",
                color: "#fff",
                borderRadius: "10px",
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
