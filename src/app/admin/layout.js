import { Inter } from "next/font/google";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata = {
  title: "Admin - Jadwal TMS",
  description: "Panel admin untuk mengelola jadwal murid sekolah musik TMS.",
};

export default function AdminLayout({ children }) {
  return children;
}
