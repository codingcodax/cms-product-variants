import type { FieldHook } from 'payload';
import { checkRole } from '@/access/utilities';
import type { Product } from '@/payload-types';

export const getInventory: FieldHook<
	Product,
	number | undefined,
	Product
> = async ({ req, data }) => {
	if (!(req.user && checkRole(['admin'], req.user))) {
		return 0;
	}

	const batches = await req.payload.find({
		collection: 'inventory-batches',
		where: {
			and: [
				{ status: { equals: 'active' } },
				{
					or: [
						{ product: { equals: data?.id } },
						{ 'variant.product': { equals: data?.id } },
					],
				},
			],
		},
	});

	return batches.docs.reduce((sum, batch) => sum + (batch.quantity || 0), 0);
};
