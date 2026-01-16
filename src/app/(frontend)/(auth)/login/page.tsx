import configPromise from '@payload-config';
import type { Metadata } from 'next';
import { headers as getHeaders } from 'next/headers';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getPayload } from 'payload';
import { LoginForm } from '@/components/forms/login-form';
import { RenderParams } from '@/components/render-params/render-params';

export default async function Login() {
	const headers = await getHeaders();
	const payload = await getPayload({ config: configPromise });
	const { user } = await payload.auth({ headers });

	if (user) {
		redirect(
			`/account?warning=${encodeURIComponent('You are already logged in.')}`
		);
	}

	return (
		<div className='container'>
			<div className='mx-auto my-12 max-w-xl'>
				<RenderParams />

				<h1 className='mb-4 text-[1.8rem]'>Log in</h1>
				<p className='mb-8'>
					This is where your customers will login to manage their account,
					review their order history, and more. To manage all users,{' '}
					<Link href='/admin/collections/users'>
						login to the admin dashboard
					</Link>
					.
				</p>
				<LoginForm />
			</div>
		</div>
	);
}

export const metadata: Metadata = {
	description: 'Login or create an account to get started.',
	openGraph: {
		title: 'Login',
		url: '/login',
	},
	title: 'Login',
};
