'use client';
import AutoScroll from 'embla-carousel-auto-scroll';
import Link from 'next/link';
import { GridTileImage } from '@/components/grid/tile';
import {
	Carousel,
	CarouselContent,
	CarouselItem,
} from '@/components/ui/carousel';
import type { Media, Product } from '@/payload-types';

interface Props {
	products: Product[];
}

export const CarouselClient = ({ products }: Props) => {
	if (!products?.length) {
		return null;
	}

	// Purposefully duplicating products to make the carousel loop and not run out of products on wide screens.
	const carouselProducts = [...products, ...products, ...products];

	return (
		<Carousel
			className='w-full'
			opts={{ align: 'start', loop: true }}
			plugins={[
				AutoScroll({
					playOnInit: true,
					speed: 1,
					stopOnInteraction: false,
					stopOnMouseEnter: true,
				}),
			]}
		>
			<CarouselContent>
				{carouselProducts.map((product, i) => (
					<CarouselItem
						className='relative aspect-square h-[30vh] max-h-68.75 w-2/3 max-w-118.75 flex-none md:w-1/3'
						key={`${product.slug}${i}`}
					>
						<Link
							className='relative h-full w-full'
							href={`/products/${product.slug}`}
						>
							<GridTileImage
								label={{
									amount: 0,
									title: product.title,
								}}
								media={product.meta?.image as Media}
							/>
						</Link>
					</CarouselItem>
				))}
			</CarouselContent>
		</Carousel>
	);
};
