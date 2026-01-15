import configPromise from '@payload-config';
import { type DefaultDocumentIDType, getPayload } from 'payload';
import type {
	CarouselBlock as CarouselBlockProps,
	Product,
} from '@/payload-types';

import { CarouselClient } from './component.client';

type Props = CarouselBlockProps & {
	id?: DefaultDocumentIDType;
};

export const CarouselBlock = async (props: Props) => {
	const { categories, limit = 3, populateBy, selectedDocs } = props;

	let products: Product[] = [];

	if (populateBy === 'collection') {
		const payload = await getPayload({ config: configPromise });

		const flattenedCategories = categories?.length
			? categories.map((category) => {
					if (typeof category === 'object') {
						return category.id;
					}
					return category;
				})
			: null;

		const fetchedProducts = await payload.find({
			collection: 'products',
			depth: 1,
			limit: limit || undefined,
			...(flattenedCategories && flattenedCategories.length > 0
				? {
						where: {
							categories: {
								in: flattenedCategories,
							},
						},
					}
				: {}),
		});

		products = fetchedProducts.docs;
	} else if (selectedDocs?.length) {
		products = selectedDocs.map((post) => {
			if (typeof post.value !== 'string') {
				return post.value;
			}
			return null;
		}) as Product[];
	}

	if (!products?.length) {
		return null;
	}

	return (
		<div className='w-full pt-1 pb-6'>
			<CarouselClient products={products} />
		</div>
	);
};
