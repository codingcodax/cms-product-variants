import type { CollectionOverride } from '@payloadcms/plugin-ecommerce/types';

export const TransactionsCollection: CollectionOverride = ({
	defaultCollection,
}) => ({
	...defaultCollection,
	labels: {
		singular: 'Transaction',
		plural: 'Transactions',
	},
	admin: {
		...defaultCollection?.admin,
	},
});
