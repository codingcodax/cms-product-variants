import configPromise from '@payload-config';
import type { Metadata } from 'next';
import { headers as getHeaders } from 'next/headers';
import { redirect } from 'next/navigation';
import { getPayload } from 'payload';
import { SignupForm } from '@/components/forms/signup-form';
import { RenderParams } from '@/components/render-params/render-params';
import { mergeOpenGraph } from '@/lib/merge-open-graph';

export const metadata: Metadata = {
	description: 'Create an account or log in to your existing account.',
	openGraph: mergeOpenGraph({
		title: 'Account',
		url: '/account',
	}),
	title: 'Account',
};

const Page = async () => {
	const headers = await getHeaders();
	const payload = await getPayload({ config: configPromise });
	const { user } = await payload.auth({ headers });

	if (user) {
		redirect(
			`/account?warning=${encodeURIComponent('You are already logged in.')}`
		);
	}

	return (
		<div className='container py-16'>
			<h1 className='mb-4 text-xl'>Create Account</h1>
			<RenderParams />
			<SignupForm />
		</div>
	);
};

export default Page;
