import { Inter, Poppins, Handlee } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const poppins = Poppins({
  weight: ['400', '600', '700'],
  subsets: ["latin"],
  variable: "--font-poppins",
});

const handlee = Handlee({
  weight: '400',
  subsets: ["latin"],
  variable: "--font-handlee",
});

export const metadata = {
  title: "Gantt Manager",
  description: "Professional project management with Gantt charts",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable} ${handlee.variable}`}>
      <body className="bg-cream-soft min-h-screen font-sans antialiased">
        <main>{children}</main>
      </body>
    </html>
  );
}
