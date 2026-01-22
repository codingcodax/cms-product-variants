'use client';

import { Link, NavGroup, useAuth } from '@payloadcms/ui';

export const AfterNavsLinks = () => {
	const { user } = useAuth();

	if (!user?.roles?.includes('admin')) {
		return null;
	}

	return (
		<NavGroup label='Back-office'>
			<Link className='nav__link' href='/admin/back-1'>
				Backoffice 1
			</Link>
		</NavGroup>
	);
};
