import {
	MetaDescriptionField,
	MetaImageField,
	MetaTitleField,
	OverviewField,
	PreviewField,
} from '@payloadcms/plugin-seo/fields';
import type { CollectionConfig } from 'payload';
import { slugField } from 'payload';
import { adminOnly } from '@/access/admin-only';
import { adminOrPublishedStatus } from '@/access/admin-or-published-status';
import { Archive } from '@/blocks/archive-block/config';
import { Banner } from '@/blocks/banner/config';
import { CallToAction } from '@/blocks/call-to-action/config';
import { Carousel } from '@/blocks/carousel/config';
import { Content } from '@/blocks/content/config';
import { FormBlock } from '@/blocks/form/config';
import { MediaBlock } from '@/blocks/media-block/config';
import { ThreeItemGrid } from '@/blocks/three-item-grid/config';
import { hero } from '@/fields/hero';
import { generatePreviewPath } from '@/lib/generate-preview-path';
import { revalidateDelete, revalidatePage } from './hooks/revalidate-page';

export const Pages: CollectionConfig = {
	slug: 'pages',
	access: {
		create: adminOnly,
		delete: adminOnly,
		read: adminOrPublishedStatus,
		update: adminOnly,
	},
	admin: {
		group: 'Content',
		defaultColumns: ['title', 'slug', 'updatedAt'],
		livePreview: {
			url: ({ data, req }) =>
				generatePreviewPath({
					slug: data?.slug,
					collection: 'pages',
					req,
				}),
		},
		preview: (data, { req }) =>
			generatePreviewPath({
				slug: data?.slug as string,
				collection: 'pages',
				req,
			}),
		useAsTitle: 'title',
	},
	fields: [
		{
			name: 'title',
			type: 'text',
			required: true,
		},
		{
			name: 'publishedOn',
			type: 'date',
			admin: {
				date: {
					pickerAppearance: 'dayAndTime',
				},
				position: 'sidebar',
			},
			hooks: {
				beforeChange: [
					({ siblingData, value }) => {
						if (siblingData._status === 'published' && !value) {
							return new Date();
						}
						return value;
					},
				],
			},
		},
		{
			type: 'tabs',
			tabs: [
				{
					fields: [hero],
					label: 'Hero',
				},
				{
					fields: [
						{
							name: 'layout',
							type: 'blocks',
							blocks: [
								CallToAction,
								Content,
								MediaBlock,
								Archive,
								Carousel,
								ThreeItemGrid,
								Banner,
								FormBlock,
							],
							required: true,
						},
					],
					label: 'Content',
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
		slugField(),
	],
	hooks: {
		afterChange: [revalidatePage],
		afterDelete: [revalidateDelete],
	},
	versions: {
		drafts: {
			autosave: true,
		},
		maxPerDoc: 50,
	},
};
