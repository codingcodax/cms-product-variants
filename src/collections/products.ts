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
import { generatePreviewPath } from '@/lib/generate-preview-path';

export const ProductsCollection: CollectionOverride = ({
	defaultCollection,
}) => ({
	...defaultCollection,
	labels: {
		singular: 'Producto',
		plural: 'Productos',
	},
	admin: {
		...defaultCollection?.admin,
		defaultColumns: ['title', '_status'],
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
	},
	defaultPopulate: {
		...defaultCollection?.defaultPopulate,
		title: true,
		slug: true,
		gallery: true,
		priceInUSD: true,
		inventory: true,
		meta: true,
	},
	fields: [
		{ label: 'Titulo', name: 'title', type: 'text', required: true },
		{
			type: 'tabs',
			tabs: [
				{
					fields: [
						{
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
							label: false,
							required: false,
						},
						{
							label: 'Galeria',
							name: 'gallery',
							type: 'array',
							minRows: 1,
							fields: [
								{
									name: 'image',
									type: 'upload',
									relationTo: 'media',
									required: true,
								},
							],
						},
					],
					label: 'Contenido',
				},
				{
					fields: [
						{
							label: 'Productos Relacionados',
							name: 'relatedProducts',
							type: 'relationship',
							filterOptions: ({ id }) => {
								if (id) {
									return {
										id: {
											not_in: [id],
										},
									};
								}

								// ID comes back as undefined during seeding so we need to handle that case
								return {
									id: {
										exists: true,
									},
								};
							},
							hasMany: true,
							relationTo: 'products',
						},
					],
					label: 'Detalles',
				},
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
			label: 'Categorias',
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
			label: 'Sub Categorias',
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
			label: 'Precio',
			name: 'price',
			type: 'number',
			required: true,
			admin: {
				width: 'fit-content',
				position: 'sidebar',
			},
		},
		{
			label: 'Stock Disponible',
			name: 'totalAvailableStock',
			type: 'number',
			admin: {
				readOnly: true,
				position: 'sidebar',
			},
			hooks: {
				afterRead: [
					async ({ req, data }) => {
						if (!data?.id) {
							return 0;
						}

						const batches = await req.payload.find({
							collection: 'inventory-batches',
							where: {
								product: { equals: data.id },
								status: { equals: 'active' },
							},
						});

						return batches.docs.reduce(
							(sum, batch) => sum + (batch.quantity || 0),
							0
						);
					},
				],
			},
		},
		slugField(),
	],
});
