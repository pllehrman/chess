import { Inter } from "next/font/google";
import "./globals.css";
import Header from "../components/formatting/Header";
import Footer from "../components/formatting/Footer";
import { headers } from "next/headers"; // This works server-side only
import { retrieveSession } from "@/components/formatting/retrieveSession";
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "chessGambit",
  description: "Let's play free chess.",
};

export default function RootLayout({ children }) {
  // Logic to filter bots
  const userAgent = headers().get("user-agent") || "";

  const botUserAgents = [
    "facebookexternalhit", // Facebook's link preview bot
    "Slackbot", // Slackbot preview
    "WhatsApp", // WhatsApp preview
    "Twitterbot", // Twitter's link preview bot
    "Applebot", // Applebot for iMessage
    "iMessage", // iMessage link preview
    "CFNetwork", // Apple services (likely iMessage or Safari)
    "Darwin", // Apple-related background service
  ];

  const isBot = botUserAgents.some((bot) => userAgent.includes(bot));

  if (isBot) {
    return (
      <html>
        <head>
          <meta property="og:title" content="Play Chess" />
          <meta
            property="og:description"
            content="Play chess with your friends!"
          />
          <meta property="og:image" content="/chess-board.png" />
          <meta property="og:url" content={`https://freechessgambit.com`} />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="Play Chess" />
          <meta
            name="twitter:description"
            content="Play chess with your friends!"
          />
          <meta name="twitter:image" content="/chess-board.png" />
        </head>
        <body>
          <img src="/chess-board.png" alt="Chess Board Preview" />
          <p>Preview data for bots</p>
        </body>
      </html>
    );
  }
  return (
    <html lang="en">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, user-scalable=no"
        />
        <meta name="description" content="Let's play free chess." />
      </head>
      <body className={inter.className}>
        <Header sessionUsername={retrieveSession().sessionUsername} />
        {children}
        <Footer />
      </body>
    </html>
  );
}
