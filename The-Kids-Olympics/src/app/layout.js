import { Quicksand, Patrick_Hand } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const quicksand = Quicksand({
  weight: ["300", "400", "500", "600", "700"],
});
const patrickhand = Patrick_Hand({
  weight: ["400"],
});

export const metadata = {
  title: "Ramatotsav 2026",
  description: "Presents - Raipur Bal-Balika Mandal",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={quicksand.className}>
        {children}
        <Toaster
          richColors
          position="bottom-right"
          toastOptions={{
            style: {
              fontFamily: "Quicksand, sans-serif",
            },
          }}
        />
      </body>
    </html>
  );
}
