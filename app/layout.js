import './globals.css';

export const metadata = {
  title: 'Venu Gopal Erra | Senior Project Leader - PMP® PRINCE2® CSM®',
  description: 'Senior Project Leader at ALTEN LTD-UK with 18+ years in rail transport and automotive project management. PMP®, PRINCE2® Practitioner, and CSM® certified.',
  keywords: 'Venu Gopal Erra, Project Manager, PMP, PRINCE2, CSM, Rail Transport, Automotive, UK, Hyderabad',
  openGraph: {
    title: 'Venu Gopal Erra | Senior Project Leader',
    description: '18+ years project management in rail transport & automotive',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
