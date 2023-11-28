import './globals.css'

export const metadata = {
  title: 'Seagrass AGC Modelling',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className='flexible'>{children}</body>
    </html>
  )
}
