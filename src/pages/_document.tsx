import Document, { Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <link
            rel="icon"
            type="image/png"
            href="./favicon-32x32.png"
            sizes="32x32"
          />
          <link
            rel="preconnect"
            href="https://fonts.googleapis.com"
          />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin=""
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Jost:wght@400;500;600;700&display=swap"
            rel="stylesheet"
          />
          <title>Frontend Mentor | Product Feedback App</title>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
