import clsx from 'clsx';

import { Price } from '@/components/price';

interface Props {
	amount: number;
	position?: 'bottom' | 'center';
	title: string;
}

export const Label = ({ amount, position = 'bottom', title }: Props) => {
	return (
		<div
			className={clsx(
				'@container/label absolute bottom-0 left-0 flex w-full px-4 pb-4',
				{
					'': position === 'center',
				}
			)}
		>
			<div className='flex grow items-end justify-between font-semibold text-sm'>
				<h3 className='mr-4 line-clamp-2 rounded-full border bg-white/70 p-2 px-3 font-mono text-black leading-none tracking-tight backdrop-blur-md dark:border-neutral-800 dark:bg-black/70 dark:text-white'>
					{title}
				</h3>

				<Price
					amount={amount}
					className='flex-none rounded-full bg-blue-600 p-2 text-white'
					currencyCodeClassName='hidden @[275px]/label:inline'
				/>
			</div>
		</div>
	);
};
