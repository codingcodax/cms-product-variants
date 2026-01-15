import type { CollectionConfig } from 'payload';
import { slugField } from 'payload';
import { adminOrSelf } from '@/access/admin-or-self';
import { publicAccess } from '@/access/public-access';

export const Categories: CollectionConfig = {
	slug: 'categories',
	labels: {
		singular: 'Categoria',
		plural: 'Categorias',
	},
	admin: {
		useAsTitle: 'title',
		group: 'Ecommerce',
	},
	access: {
		create: adminOrSelf,
		delete: adminOrSelf,
		read: publicAccess,
		update: adminOrSelf,
	},
	fields: [
		{
			label: 'Categoria',
			name: 'title',
			type: 'text',
			required: true,
		},
		{
			label: 'Sub Categorias',
			name: 'subCategories',
			type: 'join',
			collection: 'sub-categories',
			on: 'category',
		},
		{
			label: 'Produtos',
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
