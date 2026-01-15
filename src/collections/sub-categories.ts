import type { CollectionConfig } from 'payload';
import { slugField } from 'payload';

export const SubCategories: CollectionConfig = {
	slug: 'sub-categories',
	admin: {
		useAsTitle: 'title',
		group: 'Ecommerce',
	},
	labels: {
		singular: 'Sub Categoria',
		plural: 'Sub Categorias',
	},
	fields: [
		{
			label: 'Categoria Padre',
			name: 'category',
			type: 'relationship',
			relationTo: 'categories',
			required: true,
		},
		{
			label: 'Nombre',
			name: 'title',
			type: 'text',
			required: true,
		},
		{
			label: 'Productos en esta categoria',
			name: 'products',
			type: 'join',
			collection: 'products',
			on: 'categories',
		},
		slugField({
			position: undefined,
		}),
	],
};
