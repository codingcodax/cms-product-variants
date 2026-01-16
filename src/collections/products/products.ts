import type { CollectionOverride } from '@payloadcms/plugin-ecommerce/types';
import {
	MetaDescriptionField,
	MetaImageField,
	MetaTitleField,
	OverviewField,
	PreviewField,
} from '@payloadcms/plugin-seo/fields';
import {
	FixedToolbarFeature,
	HeadingFeature,
	HorizontalRuleFeature,
	InlineToolbarFeature,
	lexicalEditor,
} from '@payloadcms/richtext-lexical';
import { slugField } from 'payload';
import { adminOnlyFieldAccess } from '@/access/admin-only-field-access';
import { adminOrSelf } from '@/access/admin-or-self';
import { publicAccess } from '@/access/public-access';
import { generatePreviewPath } from '@/lib/generate-preview-path';
import { getInventory } from './hooks/get-inventory';
import { hasVariants } from './hooks/has-variants';

export const ProductsCollection: CollectionOverride = () => ({
	trash: true,
	slug: 'products',
	labels: {
		singular: 'Producto',
		plural: 'Productos',
	},
	admin: {
		defaultColumns: ['title', 'hasVariants'],
		label: 'Productos',
		description: 'Tus productos',
		livePreview: {
			url: ({ data, req }) =>
				generatePreviewPath({
					slug: data?.slug,
					collection: 'products',
					req,
				}),
		},
		preview: (data, { req }) =>
			generatePreviewPath({
				slug: data?.slug as string,
				collection: 'products',
				req,
			}),
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
		{ label: 'Nombre', name: 'title', type: 'text', required: true },
		{
			type: 'tabs',
			tabs: [
				{
					label: 'Contenido',
					fields: [
						{
							label: 'Descripcion',
							name: 'description',
							type: 'richText',
							editor: lexicalEditor({
								features: ({ rootFeatures }) => {
									return [
										...rootFeatures,
										HeadingFeature({
											enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'],
										}),
										FixedToolbarFeature(),
										InlineToolbarFeature(),
										HorizontalRuleFeature(),
									];
								},
							}),
							required: false,
						},
						// {
						// 	label: 'Imagenes',
						// 	name: 'images',
						// 	type: 'array',
						// 	minRows: 1,
						// 	fields: [
						// 		{
						// 			name: 'image',
						// 			type: 'upload',
						// 			relationTo: 'media',
						// 			required: true,
						// 		},
						// 		{
						// 			name: 'variant',
						// 			type: 'relationship',
						// 			relationTo: 'variants',
						// 			admin: {
						// 				condition: (data) => Boolean(data?.enableVariants),
						// 			},
						// 			filterOptions: ({ id }) => {
						// 				if (id) {
						// 					return {
						// 						product: {
						// 							equals: id,
						// 						},
						// 					};
						// 				}
						// 				return false;
						// 			},
						// 		},
						// 	],
						// },
					],
				},
				// {
				// 	label: 'Opciones de Variantes',
				// 	fields: [
				// 		{
				// 			type: 'row',
				// 			fields: [
				// 				{
				// 					label: 'Habilitar Variantes',
				// 					name: 'enableVariants',
				// 					type: 'checkbox',
				// 					admin: {
				// 						width: 'fit-content',
				// 					},
				// 				},
				// 				{
				// 					label: 'Variantes tienen diferentes precios',
				// 					name: 'enableVariantPrices',
				// 					type: 'checkbox',
				// 					admin: {
				// 						description:
				// 							'Si es falso, el precio esta en los detalles del producto',
				// 						width: 'fit-content',
				// 						style: {
				// 							marginLeft: '2rem',
				// 						},
				// 					},
				// 				},
				// 			],
				// 		},
				// 		{
				// 			name: 'variants',
				// 			type: 'relationship',
				// 			relationTo: 'variants',
				// 			hasMany: true,
				// 			admin: {
				// 				condition: (_, siblingData) =>
				// 					Boolean(siblingData.enableVariants),
				// 			},
				// 		},
				// 		{
				// 			name: 'relatedProducts',
				// 			type: 'relationship',
				// 			filterOptions: ({ id }) => {
				// 				if (id) {
				// 					return {
				// 						id: {
				// 							not_in: [id],
				// 						},
				// 					};
				// 				}
				//
				// 				// ID comes back as undefined during seeding so we need to handle that case
				// 				return {
				// 					id: {
				// 						exists: true,
				// 					},
				// 				};
				// 			},
				// 			hasMany: true,
				// 			relationTo: 'products',
				// 		},
				// 	],
				// },
				{
					name: 'meta',
					label: 'SEO',
					fields: [
						OverviewField({
							titlePath: 'meta.title',
							descriptionPath: 'meta.description',
							imagePath: 'meta.image',
						}),
						MetaTitleField({
							hasGenerateFn: true,
						}),
						MetaImageField({
							relationTo: 'media',
						}),

						MetaDescriptionField({}),
						PreviewField({
							// if the `generateUrl` function is configured
							hasGenerateFn: true,

							// field paths to match the target field for data
							titlePath: 'meta.title',
							descriptionPath: 'meta.description',
						}),
					],
				},
			],
		},
		{
			label: '¿Tiene variantes?',
			name: 'hasVariants',
			type: 'text',
			virtual: true,
			admin: {
				hidden: true,
				readOnly: true,
				position: 'sidebar',
			},
			access: {
				read: adminOnlyFieldAccess,
			},
			hooks: {
				afterRead: [hasVariants],
			},
		},
		{
			name: 'categories',
			type: 'relationship',
			admin: {
				position: 'sidebar',
				sortOptions: 'title',
			},
			hasMany: true,
			relationTo: 'categories',
		},
		{
			name: 'sub-categories',
			type: 'relationship',
			admin: {
				position: 'sidebar',
				sortOptions: 'title',
			},
			hasMany: true,
			relationTo: 'sub-categories',
		},
		{
			name: 'totalAvailableStock',
			type: 'number',
			admin: {
				readOnly: true,
				position: 'sidebar',
				description: 'Sum of all active batch quantities',
			},
			access: {
				read: adminOnlyFieldAccess,
			},
			hooks: {
				afterRead: [getInventory],
			},
		},
		slugField(),
	],
});
