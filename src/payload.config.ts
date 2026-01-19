import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { postgresAdapter } from '@payloadcms/db-postgres';
import { ecommercePlugin } from '@payloadcms/plugin-ecommerce';
import { formBuilderPlugin } from '@payloadcms/plugin-form-builder';
import { seoPlugin } from '@payloadcms/plugin-seo';
import type { GenerateTitle, GenerateURL } from '@payloadcms/plugin-seo/types';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import { es } from '@payloadcms/translations/languages/es';
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
import { Media } from './collections/media/media';
import { OrdersCollection } from './collections/orders/orders';
import { Pages } from './collections/pages/pages';
import { ProductsCollection } from './collections/products';
import { SubCategories } from './collections/sub-categories';
import { TransactionsCollection } from './collections/transactions';
import { Users } from './collections/users/users';
import { getServerSideURL } from './lib/get-url';
import { InventoryBatches } from './collections/inventory-batches';

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
		components: {
			graphics: {
				Logo: '@/components/big-logo#BigLogo',
				Icon: '@/components/icon#Icon',
			},
			views: {
				dashboard: {
					Component: '@/components/custom-dashboard#CustomDashboard',
				},
			},
		},
	},
	i18n: {
		fallbackLanguage: 'es',
		supportedLanguages: { es },
	},
	collections: [
		Users,
		Media,
		Pages,
		Categories,
		SubCategories,
		InventoryBatches,
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
								editor: lexicalEditor(),
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
