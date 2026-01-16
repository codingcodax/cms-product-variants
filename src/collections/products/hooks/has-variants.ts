import type { FieldHook } from 'payload';
import { checkRole } from '@/access/utilities';
import type { Product } from '@/payload-types';

export const hasVariants: FieldHook<Product, string, Product> = async ({
	req,
	data,
}) => {
	if (!(req.user && checkRole(['admin'], req.user))) {
		return 'No';
	}

	if (!data?.id) {
		return 'No';
	}

	const variants = await req.payload.find({
		collection: 'custom-product-variants',
		where: { product: { equals: data.id } },
		limit: 1,
	});

	return variants.totalDocs > 0 ? 'Si' : 'No';
};
