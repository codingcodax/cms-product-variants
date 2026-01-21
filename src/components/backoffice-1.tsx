import { DefaultTemplate } from '@payloadcms/next/templates';
import { Gutter } from '@payloadcms/ui';
import type { AdminViewServerProps } from 'payload';

export const Backoffice1 = ({
	initPageResult,
	params,
	searchParams,
}: AdminViewServerProps) => {
	return (
		<DefaultTemplate
			i18n={initPageResult.req.i18n}
			locale={initPageResult.locale}
			params={params}
			payload={initPageResult.req.payload}
			permissions={initPageResult.permissions}
			searchParams={searchParams}
			user={initPageResult.req.user || undefined}
			visibleEntities={initPageResult.visibleEntities}
		>
			<Gutter>
				<h1>Back-office 1</h1>
			</Gutter>
		</DefaultTemplate>
	);
};
