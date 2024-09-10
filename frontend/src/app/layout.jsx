import { Inter } from "next/font/google";
import "./globals.css";
import Header from "../components/formatting/Header";
import Footer from "../components/formatting/Footer";
import { retrieveSession } from "../components/formatting/retrieveSession";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "chessGambit",
  description: "Let's play free chess.",
};

export default function RootLayout({ children }) {
  const { sessionId, sessionUsername } = retrieveSession();

  return (
    <html lang="en">
      <title>chessGambit</title>
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0, user-scalable=no"
      />
      <meta title="description" content="Let's play free chess." />
      <body className={inter.className}>
        <Header sessionUsername={sessionUsername} />
        {children}
        <Footer />
      </body>
    </html>
  );
}
