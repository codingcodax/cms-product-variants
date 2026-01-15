import type { CollectionOverride } from '@payloadcms/plugin-ecommerce/types';

export const CartsCollection: CollectionOverride = ({ defaultCollection }) => ({
	...defaultCollection,
	labels: {
		singular: 'Cart',
		plural: 'Carts',
	},
	admin: {
		...defaultCollection?.admin,
	},
});
