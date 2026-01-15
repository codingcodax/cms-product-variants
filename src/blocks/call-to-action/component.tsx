import { CMSLink } from '@/components/link';
import { RichText } from '@/components/rich-text';
import type { CallToActionBlock as CTABlockProps } from '@/payload-types';

type Props = CTABlockProps & {
	id?: string | number;
	className?: string;
};

export const CallToActionBlock = ({ links, richText }: Props) => {
	return (
		<div className='container'>
			<div className='flex flex-col gap-8 rounded border border-border bg-card p-4 md:flex-row md:items-center md:justify-between'>
				<div className='flex max-w-3xl items-center'>
					{richText && (
						<RichText className='mb-0' data={richText} enableGutter={false} />
					)}
				</div>
				<div className='flex flex-col gap-8'>
					{(links || []).map(({ link }, i) => {
						return <CMSLink key={i} size='lg' {...link} />;
					})}
				</div>
			</div>
		</div>
	);
};
