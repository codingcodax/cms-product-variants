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
import { type DefaultDocumentIDType, slugField, type Where } from 'payload';
import { adminOrSelf } from '@/access/admin-or-self';
import { publicAccess } from '@/access/public-access';
import { generatePreviewPath } from '@/lib/generate-preview-path';

export const ProductsCollection: CollectionOverride = () => ({
	slug: 'products',
	labels: {
		singular: 'Producto',
		plural: 'Productos',
	},
	admin: {
		defaultColumns: ['title'],
		label: 'Productos',
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
						{
							label: 'Imagenes',
							name: 'images',
							type: 'array',
							minRows: 1,
							fields: [
								{
									name: 'image',
									type: 'upload',
									relationTo: 'media',
									required: true,
								},
								{
									name: 'variant',
									type: 'relationship',
									relationTo: 'variants',
									admin: {
										condition: (data) => {
											return (
												data?.enableVariants === true &&
												data?.variantTypes?.length > 0
											);
										},
									},
									filterOptions: ({ data }) => {
										if (data?.enableVariants && data?.variantTypes?.length) {
											const variantTypeIDs = data.variantTypes.map(
												(item: { id: number } | undefined) => {
													if (typeof item === 'object' && item?.id) {
														return item.id;
													}
													return item;
												}
											) as DefaultDocumentIDType[];

											if (variantTypeIDs.length === 0) {
												return {
													variantType: {
														in: [],
													},
												};
											}

											const query: Where = {
												variantType: {
													in: variantTypeIDs,
												},
											};

											return query;
										}

										return {
											variantType: {
												in: [],
											},
										};
									},
								},
							],
						},
					],
				},
				{
					label: 'Opciones de Variantes',
					fields: [
						{
							type: 'row',
							fields: [
								{
									label: 'Habilitar Variantes',
									name: 'enableVariants',
									type: 'checkbox',
									admin: {
										width: 'fit-content',
									},
								},
								{
									label: 'Variantes tienen diferentes precios',
									name: 'enableVariantPrices',
									type: 'checkbox',
									admin: {
										description:
											'Si es falso, el precio esta en los detalles del producto',
										width: 'fit-content',
										style: {
											marginLeft: '2rem',
										},
									},
								},
							],
						},
						{
							label: 'Variantes',
							name: 'variants',
							type: 'array',
							admin: {
								components: {
									RowLabel:
										'@/collections/products/components/row-labels/variant-label#VariantLabel',
								},
								condition: (_, siblingData) => {
									return Boolean(siblingData.enableVariants);
								},
							},
							minRows: 1,
							fields: [
								{
									label: 'Tipo',
									name: 'type',
									type: 'relationship',
									relationTo: 'variant-types',
									required: true,
								},
								{
									label: 'Opción',
									name: 'option',
									type: 'relationship',
									relationTo: 'variant-options',
									required: true,
								},
								{
									name: 'variantSlug',
									type: 'text',
									admin: {
										readOnly: true,
									},
								},
								{
									name: 'image',
									type: 'upload',
									relationTo: 'media',
								},
								{
									label: 'Precio',
									name: 'price',
									type: 'number',
									required: true,
									admin: {
										condition: (data) => Boolean(data.enableVariantPrices),
									},
								},
							],
						},
						{
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
			name: 'totalAvailableStock',
			type: 'number',
			admin: {
				readOnly: true,
				position: 'sidebar',
				description: 'Sum of all active batch quantities',
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
