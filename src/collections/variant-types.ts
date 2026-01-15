import type { CollectionConfig } from 'payload';
import { adminOnly } from '@/access/admin-only';
import { adminOrSelf } from '@/access/admin-or-self';

export const VariantTypes: CollectionConfig = {
	slug: 'variant-types',
	labels: {
		singular: 'Tipo de Variante',
		plural: 'Tipos de Variantes',
	},
	access: {
		create: adminOrSelf,
		delete: adminOnly,
		read: adminOrSelf,
		update: adminOrSelf,
	},
	admin: {
		useAsTitle: 'name',
	},
	fields: [
		{
			name: 'name',
			type: 'text',
			required: true,
			unique: true,
		},
		{
			name: 'description',
			type: 'textarea',
			required: false,
		},
		{
			name: 'options',
			type: 'relationship',
			relationTo: 'variant-options',
			hasMany: true,
			required: true,
			minRows: 2,
		},
	],
};
