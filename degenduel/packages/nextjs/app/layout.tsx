
import "@rainbow-me/rainbowkit/styles.css";
import "@scaffold-ui/components/styles.css";
import { Inter, JetBrains_Mono } from "next/font/google";
import { ScaffoldEthAppWithProviders } from "~~/components/ScaffoldEthAppWithProviders";
import { ThemeProvider } from "~~/components/ThemeProvider";
import { ErrorBoundary } from "~~/components/ErrorBoundary";
import "~~/styles/globals.css";
import { getMetadata } from "~~/utils/scaffold-eth/getMetadata";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata = getMetadata({
  title: "DegenDuel | PvP Prediction Duels on Flare",
  description: "Trustless PvP prediction game using Flare's FTSO, FDC, and RNG protocols",
});

const ScaffoldEthApp = ({ children }: { children: React.ReactNode }) => {
  return (
    <html suppressHydrationWarning className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className={inter.className}>
        <ThemeProvider enableSystem>
          <ErrorBoundary>
            <ScaffoldEthAppWithProviders>{children}</ScaffoldEthAppWithProviders>
          </ErrorBoundary>
        </ThemeProvider>
      </body>
    </html>
  );
};

export default ScaffoldEthApp;
