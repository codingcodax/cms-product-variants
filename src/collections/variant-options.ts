import type { CollectionConfig } from 'payload';
import { adminOnly } from '@/access/admin-only';
import { adminOrSelf } from '@/access/admin-or-self';

export const VariantOptions: CollectionConfig = {
	slug: 'custom-variant-options',
	labels: {
		singular: 'Opción de Variante',
		plural: 'Opciones de Variantes',
	},
	access: {
		create: adminOrSelf,
		delete: adminOnly,
		read: adminOrSelf,
		update: adminOrSelf,
	},
	admin: { useAsTitle: 'value', group: 'Ecommerce' },
	fields: [
		{
			label: 'Valor',
			name: 'value',
			type: 'text',
			required: true,
		},
		{
			name: 'variant-type',
			type: 'relationship',
			relationTo: 'custom-variant-types',
			required: true,
		},
	],
};
