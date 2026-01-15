import type { ArrayField, Field } from 'payload';
import { deepMerge } from '@/lib/deep-merge';
import type { LinkAppearances } from './link';
import { link } from './link';

type LinkGroupType = (options?: {
	appearances?: LinkAppearances[] | false;
	overrides?: Partial<ArrayField>;
}) => Field;

export const linkGroup: LinkGroupType = ({
	appearances,
	overrides = {},
} = {}) => {
	const generatedLinkGroup: Field = {
		name: 'links',
		type: 'array',
		fields: [
			link({
				appearances,
			}),
		],
	};

	return deepMerge(generatedLinkGroup, overrides);
};
