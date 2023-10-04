import "./globals.css";
import { Inter } from "next/font/google";
import Providers from "./providers";
import Layout from "@/components/layout/Main";
import { Typography } from "antd";

const { Text } = Typography;

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "TimeLogix",
  description: "",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={inter.className}>
        <Providers>
          <Layout>{children}</Layout>
        </Providers>
      </body>
    </html>
  );
}
