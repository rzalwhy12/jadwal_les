import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata = {
  title: "Jadwal TMS - Manajemen Jadwal Murid",
  description: "Aplikasi manajemen jadwal murid sekolah musik TMS. Kelola jadwal les piano, guitar, drum, vokal, dan instrumen lainnya.",
  keywords: "jadwal, musik, sekolah musik, TMS, les musik, piano, guitar, drum",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
