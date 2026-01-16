import type { CollectionConfig } from 'payload';
import { adminOnly } from '@/access/admin-only';
import { adminOrSelf } from '@/access/admin-or-self';

export const VariantTypes: CollectionConfig = {
	slug: 'custom-variant-types',
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
		useAsTitle: 'label',
		group: 'Ecommerce',
	},
	fields: [
		{
			name: 'label',
			type: 'text',
			unique: true,
		},
		{
			name: 'description',
			type: 'textarea',
			required: false,
		},
	],
};
