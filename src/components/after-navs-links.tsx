import { Link, NavGroup } from '@payloadcms/ui';

export const AfterNavsLinks = () => {
	return (
		<NavGroup label='Back-office'>
			<Link className='nav__link' href='/admin/back-1'>
				Backoffice 1
			</Link>
		</NavGroup>
	);
};
