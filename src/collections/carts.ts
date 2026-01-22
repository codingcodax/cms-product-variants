import type { CollectionOverride } from '@payloadcms/plugin-ecommerce/types';

export const CartsCollection: CollectionOverride = ({ defaultCollection }) => ({
	...defaultCollection,
	labels: {
		singular: 'Cart',
		plural: 'Carts',
	},
	admin: {
		...defaultCollection?.admin,
		hidden: ({ user }) => !user?.roles?.includes('admin'),
	},
	access: {
		admin: ({ req: { user } }) => user?.roles?.includes('admin') ?? false,
	},
});
