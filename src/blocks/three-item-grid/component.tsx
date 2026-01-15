import Link from 'next/link';
import type { DefaultDocumentIDType } from 'payload';
import { GridTileImage } from '@/components/grid/tile';
import type {
	Media,
	Product,
	ThreeItemGridBlock as ThreeItemGridBlockProps,
} from '@/payload-types';

interface Props {
	item: Product;
	priority?: boolean;
	size: 'full' | 'half';
}

export const ThreeItemGridItem = ({ item, size }: Props) => {
	const price = 0;

	return (
		<div
			className={
				size === 'full'
					? 'md:col-span-4 md:row-span-2'
					: 'md:col-span-2 md:row-span-1'
			}
		>
			<Link
				className='relative block aspect-square h-full w-full'
				href={`/products/${item.slug}`}
			>
				<GridTileImage
					label={{
						// biome-ignore lint/style/noNonNullAssertion: idk
						amount: price!,
						position: size === 'full' ? 'center' : 'bottom',
						title: item.title,
					}}
					media={item.meta?.image as Media}
				/>
			</Link>
		</div>
	);
};

type TrheeItemGridBlockProps = ThreeItemGridBlockProps & {
	id?: DefaultDocumentIDType;
	className?: string;
};

export const ThreeItemGridBlock = ({ products }: TrheeItemGridBlockProps) => {
	if (!(products?.[0] && products[1] && products[2])) {
		return null;
	}

	const [firstProduct, secondProduct, thirdProduct] = products;

	return (
		<section className='container grid gap-4 pb-4 md:grid-cols-6 md:grid-rows-2'>
			<ThreeItemGridItem item={firstProduct as Product} priority size='full' />
			<ThreeItemGridItem item={secondProduct as Product} priority size='half' />
			<ThreeItemGridItem item={thirdProduct as Product} size='half' />
		</section>
	);
};
