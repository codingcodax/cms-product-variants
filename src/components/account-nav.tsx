'use client';

import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';

interface Props {
	className?: string;
}

export const AccountNav: React.FC<Props> = ({ className }) => {
	const pathname = usePathname();

	return (
		<div className={clsx(className)}>
			<ul className='flex flex-col gap-2'>
				<li>
					<Button asChild variant='link'>
						<Link
							className={clsx(
								'text-primary/50 hover:text-primary hover:no-underline',
								{
									'text-primary': pathname === '/account',
								}
							)}
							href='/account'
						>
							Account settings
						</Link>
					</Button>
				</li>

				<li>
					<Button asChild variant='link'>
						<Link
							className={clsx(
								'text-primary/50 hover:text-primary hover:no-underline',
								{
									'text-primary': pathname === '/account/addresses',
								}
							)}
							href='/account/addresses'
						>
							Addresses
						</Link>
					</Button>
				</li>

				<li>
					<Button
						asChild
						className={clsx(
							'text-primary/50 hover:text-primary hover:no-underline',
							{
								'text-primary':
									pathname === '/orders' || pathname.includes('/orders'),
							}
						)}
						variant='link'
					>
						<Link href='/orders'>Orders</Link>
					</Button>
				</li>
			</ul>

			<hr className='w-full border-white/5' />

			<Button
				asChild
				className={clsx(
					'text-primary/50 hover:text-primary hover:no-underline',
					{
						'text-primary': pathname === '/logout',
					}
				)}
				variant='link'
			>
				<Link href='/logout'>Log out</Link>
			</Button>
		</div>
	);
};
