import type { CollectionOverride } from '@payloadcms/plugin-ecommerce/types';
import { reserveInventoryOnOrder } from './hooks/reserve-inventory-on-order';

export const OrdersCollection: CollectionOverride = ({
	defaultCollection,
}) => ({
	...defaultCollection,
	labels: {
		singular: 'Order',
		plural: 'Orders',
	},
	admin: {
		...defaultCollection?.admin,
		hidden: ({ user }) => !user?.roles?.includes('admin'),
	},
	hooks: {
		afterChange: [reserveInventoryOnOrder],
	},
});
