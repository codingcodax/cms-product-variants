import type { CollectionConfig } from 'payload';
import { adminOnly } from '@/access/admin-only';
import { adminOrSelf } from '@/access/admin-or-self';

export const VariantOptions: CollectionConfig = {
	slug: 'variant-options',
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
	admin: { useAsTitle: 'value' },
	fields: [
		{
			name: 'value',
			type: 'text',
			required: true,
		},
		{
			name: 'type',
			type: 'relationship',
			relationTo: 'variant-types',
			required: true, // Bidirectional link
		},
	],
};
