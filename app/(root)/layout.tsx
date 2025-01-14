import Navbar from "../../components/Navbar";
import "../globals.css";
import localFont from "next/font/local";
import 'easymde/dist/easymde.min.css';
import { Toaster } from "@/components/ui/toaster";

// Local font configuration
const workSans = localFont({
  src: [
    { path: "./fonts/WorkSans-Black.ttf", weight: "800", style: "normal" },
    { path: "./fonts/WorkSans-ExtraBold.ttf", weight: "700", style: "normal" },
    { path: "./fonts/WorkSans-Bold.ttf", weight: "600", style:"normal" },
    { path: "./fonts/WorkSans-SemiBold.ttf", weight: "500", style: "normal" },
    { path: "./fonts/WorkSans-Medium.ttf", weight: "400", style: "normal" },
    { path: "./fonts/WorkSans-Regular.ttf", weight: "300", style: "normal" },
    { path: "./fonts/WorkSans-Thin.ttf", weight: "200", style: "normal" },
    { path: "./fonts/WorkSans-ExtraLight.ttf", weight: "100", style: "normal" },
  ],
  variable: "--font-work-sans",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Add Crisp Chat Script */}
        <script
          type="text/javascript"
          dangerouslySetInnerHTML={{
            __html: `
              window.$crisp = [];
              window.CRISP_WEBSITE_ID = "f0d0885a-314b-45cb-9607-d1a9b658da68"; // Replace with your Crisp Website ID
              (function(){
                d = document;
                s = d.createElement("script");
                s.src = "https://client.crisp.chat/l.js";
                s.async = 1;
                d.getElementsByTagName("head")[0].appendChild(s);
              })();
            `,
          }}
        ></script>
      </head>
      <body className={workSans.variable}>
        <Navbar />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
