import type { CollectionConfig } from 'payload';

export const InventoryBatches: CollectionConfig = {
	slug: 'inventory-batches',
	labels: {
		singular: 'Lote de Inventario',
		plural: 'Lotes de Inventario',
	},
	admin: {
		useAsTitle: 'batchNumber',
		defaultColumns: [
			'batchNumber',
			'product',
			'variant',
			'quantity',
			'expiryDate',
			'status',
		],
		group: 'Ecommerce',
	},
	fields: [
		{
			label: 'Numbero de Inventario',
			name: 'batchNumber',
			type: 'text',
			required: true,
			unique: true,
			index: true,
		},
		{
			label: 'Producto',
			name: 'product',
			type: 'relationship',
			relationTo: 'products',
			required: false,
			index: true,
		},
		{
			label: 'Unidades',
			name: 'quantity',
			type: 'number',
			required: true,
			min: 0,
			defaultValue: 0,
		},
		{
			label: 'Fecha de Expiracion',
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
			label: 'Fecha de Fabricacion',
			name: 'manufactureDate',
			type: 'date',
		},
		{
			label: 'Fecha de Recepcion',
			name: 'receivedDate',
			type: 'date',
			required: true,
			defaultValue: () => new Date().toISOString(),
		},
		{
			label: 'Estado',
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
			label: 'Proveedor',
			name: 'supplier',
			type: 'text',
		},
		{
			label: 'Notas',
			name: 'notes',
			type: 'textarea',
		},
	],
	hooks: {
		beforeChange: [
			({ data, originalDoc }) => {
				// Validate that exactly one of product or variant is set
				if ((data.product && data.variant) || !(data.product || data.variant)) {
					throw new Error(
						'Inventory batch must be linked to either a product or a variant, but not both or neither.'
					);
				}

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
