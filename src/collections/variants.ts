import type { CollectionConfig } from 'payload';
import { slugField } from 'payload';

export const Variants: CollectionConfig = {
	slug: 'custom-product-variants',
	labels: {
		singular: 'Variante de Producto',
		plural: 'Variantes de Productos',
	},
	admin: {
		group: 'Ecommerce',
		useAsTitle: 'slug',
	},
	fields: [
		{
			type: 'row',
			fields: [
				{
					name: 'product',
					type: 'relationship',
					relationTo: 'products',
					required: true,
				},
				{
					name: 'price',
					type: 'number',
					required: true,
				},
			],
		},
		slugField({
			position: undefined,
		}),
		{
			type: 'row',
			fields: [
				{
					name: 'variant-type',
					type: 'relationship',
					relationTo: 'custom-variant-types',
					required: true,
				},
				{
					name: 'variant-option',
					type: 'relationship',
					relationTo: 'custom-variant-options',
					required: true,
				},
			],
		},
	],
	hooks: {
		beforeChange: [
			async ({ data, req }) => {
				// Auto-generate variantSlug from type and option
				if (data.type && data.option) {
					const typeDoc = await req.payload.findByID({
						collection: 'custom-variant-types',
						id: data.type,
					});
					const optionDoc = await req.payload.findByID({
						collection: 'custom-variant-options',
						id: data.option,
					});
					if (typeDoc && optionDoc) {
						data.generate_slug = `${typeDoc.label}-${optionDoc.value}`
							.toLowerCase()
							.replace(/\s+/g, '-');
					}
				}
				return data;
			},
		],
	},
};
