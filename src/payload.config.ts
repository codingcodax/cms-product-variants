import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { postgresAdapter } from '@payloadcms/db-postgres';
import { ecommercePlugin } from '@payloadcms/plugin-ecommerce';
import { formBuilderPlugin } from '@payloadcms/plugin-form-builder';
import { seoPlugin } from '@payloadcms/plugin-seo';
import type { GenerateTitle, GenerateURL } from '@payloadcms/plugin-seo/types';
import {
	FixedToolbarFeature,
	HeadingFeature,
	lexicalEditor,
} from '@payloadcms/richtext-lexical';
import { buildConfig } from 'payload';
import sharp from 'sharp';
import type { Page, Product } from '@/payload-types';
import { adminOnlyFieldAccess } from './access/admin-only-field-access';
import { adminOrPublishedStatus } from './access/admin-or-published-status';
import { customerOnlyFieldAccess } from './access/customer-only-field-access';
import { isAdmin } from './access/is-admin';
import { isDocumentOwner } from './access/is-document-owner';
import { CartsCollection } from './collections/carts';
import { Categories } from './collections/categories';
import { InventoryBatches } from './collections/inventory-batches';
import { Media } from './collections/media/media';
import { OrdersCollection } from './collections/orders/orders';
import { Pages } from './collections/pages/pages';
import { ProductsCollection } from './collections/products/products';
import { SubCategories } from './collections/sub-categories';
import { TransactionsCollection } from './collections/transactions';
import { Users } from './collections/users/users';
import { VariantOptions } from './collections/variant-options';
import { VariantTypes } from './collections/variant-types';
import { Variants } from './collections/variants';
import { getServerSideURL } from './lib/get-url';

const generateTitle: GenerateTitle<Product | Page> = ({ doc }) => {
	return doc?.title
		? `${doc.title} | Payload Ecommerce Template`
		: 'Payload Ecommerce Template';
};

const generateURL: GenerateURL<Product | Page> = ({ doc }) => {
	const url = getServerSideURL();

	return doc?.slug ? `${url}/${doc.slug}` : url;
};

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
	admin: {
		suppressHydrationWarning: true,
		user: Users.slug,
		importMap: {
			baseDir: path.resolve(dirname),
		},
	},
	collections: [
		Users,
		Media,
		Pages,
		VariantTypes,
		VariantOptions,
		Variants,
		InventoryBatches,
		Categories,
		SubCategories,
	],
	editor: lexicalEditor(),
	secret: process.env.PAYLOAD_SECRET || '',
	typescript: {
		outputFile: path.resolve(dirname, 'payload-types.ts'),
	},
	db: postgresAdapter({
		pool: {
			connectionString: process.env.DATABASE_URL || '',
		},
	}),
	sharp,
	plugins: [
		seoPlugin({
			generateTitle,
			generateURL,
		}),
		formBuilderPlugin({
			fields: {
				payment: false,
			},
			formSubmissionOverrides: {
				admin: {
					group: 'Content',
				},
			},
			formOverrides: {
				admin: {
					group: 'Content',
				},
				fields: ({ defaultFields }) => {
					return defaultFields.map((field) => {
						if ('name' in field && field.name === 'confirmationMessage') {
							return {
								...field,
								editor: lexicalEditor({
									features: ({ rootFeatures }) => {
										return [
											...rootFeatures,
											FixedToolbarFeature(),
											HeadingFeature({
												enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'],
											}),
										];
									},
								}),
							};
						}
						return field;
					});
				},
			},
		}),
		ecommercePlugin({
			access: {
				adminOnlyFieldAccess,
				adminOrPublishedStatus,
				customerOnlyFieldAccess,
				isAdmin,
				isDocumentOwner,
			},
			currencies: {
				defaultCurrency: 'MXN',
				supportedCurrencies: [
					{
						code: 'MXN',
						decimals: 0,
						label: 'Peso Mexicano',
						symbol: '$',
					},
				],
			},
			customers: {
				slug: 'users',
			},
			products: {
				productsCollectionOverride: ProductsCollection,
			},
			carts: {
				cartsCollectionOverride: CartsCollection,
				allowGuestCarts: true,
			},
			orders: {
				ordersCollectionOverride: OrdersCollection,
			},
			transactions: {
				transactionsCollectionOverride: TransactionsCollection,
			},
		}),
	],
});
