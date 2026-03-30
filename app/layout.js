import { Inter, Poppins } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const poppins = Poppins({
  weight: ['400', '500', '600', '700'],
  subsets: ["latin"],
  variable: "--font-poppins",
});

export const metadata = {
  title: "Gantt Manager | Borcelle Company",
  description: "Professional project management with Gantt charts",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <body className="bg-white min-h-screen font-sans antialiased text-borcelle-dark">
        <main>{children}</main>
      </body>
    </html>
  );
}
