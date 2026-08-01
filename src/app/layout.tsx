import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "@/components/providers/theme-provider";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Rs.1 Lucky Draw — Win Big for Just Rs.1",
  description:
    "Join transparent Rs.1 lucky draws and win prizes across Pakistan.",
};

export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7fbf9" },
    { media: "(prefers-color-scheme: dark)", color: "#0c1512" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${jakarta.variable} font-sans antialiased`}
      >
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
              duration: 4000,
              className:
                "!rounded-xl !border !border-border !bg-card !text-card-foreground !shadow-lift !text-sm !font-medium",
              success: { iconTheme: { primary: "hsl(var(--success))", secondary: "#fff" } },
              error: { iconTheme: { primary: "hsl(var(--destructive))", secondary: "#fff" } },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
