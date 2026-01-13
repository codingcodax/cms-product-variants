import './styles.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
	description: 'A blank template using Payload in a Next.js app.',
	title: 'Payload Blank Template',
};

const RootLayout = (props: { children: React.ReactNode }) => {
	const { children } = props;

	return (
		<html lang='en'>
			<body>
				<main>{children}</main>
			</body>
		</html>
	);
};

export default RootLayout;
