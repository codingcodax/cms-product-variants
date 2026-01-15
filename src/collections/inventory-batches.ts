import type { CollectionConfig } from 'payload';

export const InventoryBatches: CollectionConfig = {
	slug: 'inventory-batches',
	admin: {
		useAsTitle: 'batchNumber',
		defaultColumns: [
			'batchNumber',
			'product',
			'variantID',
			'quantity',
			'expiryDate',
			'status',
		],
		group: 'Ecommerce',
	},
	fields: [
		{
			name: 'batchNumber',
			type: 'text',
			required: true,
			unique: true,
			index: true,
		},
		{
			name: 'product',
			type: 'relationship',
			relationTo: 'products',
			required: true,
			index: true,
		},
		{
			name: 'variantID',
			type: 'text',
			admin: {
				description:
					'Variant option ID if this batch is for a specific variant',
				condition: (_data, siblingData) => {
					// Show only if the linked product has enableVariants = true
					return siblingData?.product?.enableVariants === true;
				},
			},
			index: true,
		},
		{
			name: 'quantity',
			type: 'number',
			required: true,
			min: 0,
			defaultValue: 0,
		},
		{
			name: 'expiryDate',
			type: 'date',
			admin: {
				date: {
					pickerAppearance: 'dayAndTime',
					displayFormat: 'MMM dd, yyyy',
				},
			},
		},
		{
			name: 'manufactureDate',
			type: 'date',
		},
		{
			name: 'receivedDate',
			type: 'date',
			required: true,
			defaultValue: () => new Date().toISOString(),
		},
		{
			name: 'status',
			type: 'select',
			options: [
				{ label: 'Active', value: 'active' },
				{ label: 'Depleted', value: 'depleted' },
				{ label: 'Expired', value: 'expired' },
				{ label: 'Reserved', value: 'reserved' },
				{ label: 'Recalled', value: 'recalled' },
			],
			defaultValue: 'active',
			index: true,
		},
		{
			name: 'supplier',
			type: 'text',
		},
		{
			name: 'costPerUnit',
			type: 'number',
			admin: {
				description: 'Cost per unit for inventory valuation',
			},
		},
		{
			name: 'notes',
			type: 'textarea',
		},
	],
	hooks: {
		beforeChange: [
			({ data, originalDoc }) => {
				// Auto-mark as depleted when quantity reaches 0
				if (data.quantity === 0 && data.status === 'active') {
					data.status = 'depleted';
				}

				// Auto-mark as expired if past expiry date
				if (data.expiryDate && new Date(data.expiryDate) < new Date()) {
					data.status = 'expired';
				}

				// Reactivate if quantity is added back to a depleted batch
				if (data.quantity > 0 && originalDoc?.status === 'depleted') {
					data.status = 'active';
				}

				return data;
			},
		],
		afterRead: [
			({ doc }) => {
				if (doc.expiryDate && doc.status === 'active') {
					const daysUntilExpiry = Math.floor(
						(new Date(doc.expiryDate).getTime() - Date.now()) /
							(1000 * 60 * 60 * 24)
					);

					// Add warning flag if expiring within 30 days
					if (daysUntilExpiry <= 30 && daysUntilExpiry > 0) {
						doc.nearExpiry = true;
						doc.daysUntilExpiry = daysUntilExpiry;
					}
				}
				return doc;
			},
		],
	},
};
