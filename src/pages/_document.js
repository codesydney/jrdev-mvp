import { Html, Head, Main, NextScript } from "next/document";
import Header from "@/components/header/Header";
export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <script
          //fontAwesome icon kit link
          async
          src="https://kit.fontawesome.com/4b926c6456.js"
          crossorigin="anonymous"
        ></script>
      </Head>

      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
