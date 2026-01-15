import type { CollectionConfig } from 'payload';

import { adminOnly } from '@/access/admin-only';
import { adminOnlyFieldAccess } from '@/access/admin-only-field-access';
import { adminOrSelf } from '@/access/admin-or-self';
import { publicAccess } from '@/access/public-access';
import { checkRole } from '@/access/utilities';

import { ensureFirstUserIsAdmin } from './hooks/ensure-first-user-is-admin';

export const Users: CollectionConfig = {
	slug: 'users',
	access: {
		admin: ({ req: { user } }) => checkRole(['admin'], user),
		create: publicAccess,
		delete: adminOnly,
		read: adminOrSelf,
		update: adminOrSelf,
	},
	admin: {
		group: 'Users',
		defaultColumns: ['name', 'email', 'roles'],
		useAsTitle: 'name',
	},
	auth: {
		tokenExpiration: 1_209_600,
	},
	fields: [
		{
			name: 'name',
			type: 'text',
		},
		{
			name: 'roles',
			type: 'select',
			access: {
				create: adminOnlyFieldAccess,
				read: adminOnlyFieldAccess,
				update: adminOnlyFieldAccess,
			},
			defaultValue: ['customer'],
			hasMany: true,
			hooks: {
				beforeChange: [ensureFirstUserIsAdmin],
			},
			options: [
				{
					label: 'admin',
					value: 'admin',
				},
				{
					label: 'customer',
					value: 'customer',
				},
			],
		},
		{
			name: 'orders',
			type: 'join',
			collection: 'orders',
			on: 'customer',
			admin: {
				allowCreate: false,
				defaultColumns: ['id', 'createdAt', 'total', 'currency', 'items'],
			},
		},
		{
			name: 'cart',
			type: 'join',
			collection: 'carts',
			on: 'customer',
			admin: {
				allowCreate: false,
				defaultColumns: ['id', 'createdAt', 'total', 'currency', 'items'],
			},
		},
		{
			name: 'addresses',
			type: 'join',
			collection: 'addresses',
			on: 'customer',
			admin: {
				allowCreate: false,
				defaultColumns: ['id'],
			},
		},
	],
};
