import type {
	DefaultNodeTypes,
	SerializedBlockNode,
} from '@payloadcms/richtext-lexical';
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical';
import {
	type JSXConvertersFunction,
	RichText as RichTextWithoutBlocks,
} from '@payloadcms/richtext-lexical/react';
import { BannerBlock } from '@/blocks/banner/component';
import { CallToActionBlock } from '@/blocks/call-to-action/component';
import { MediaBlock } from '@/blocks/media-block/component';
import { cn } from '@/lib/utils';
import type {
	BannerBlock as BannerBlockProps,
	CallToActionBlock as CTABlockProps,
	MediaBlock as MediaBlockProps,
} from '@/payload-types';

type NodeTypes =
	| DefaultNodeTypes
	| SerializedBlockNode<CTABlockProps | MediaBlockProps | BannerBlockProps>;

const jsxConverters: JSXConvertersFunction<NodeTypes> = ({
	defaultConverters,
}) => ({
	...defaultConverters,
	blocks: {
		banner: ({ node }) => (
			<BannerBlock className='col-start-2 mb-4' {...node.fields} />
		),
		mediaBlock: ({ node }) => (
			<MediaBlock
				className='col-span-3 col-start-1'
				imgClassName='m-0'
				{...node.fields}
				captionClassName='mx-auto max-w-3xl'
				disableInnerContainer={true}
				enableGutter={false}
			/>
		),
		cta: ({ node }) => <CallToActionBlock {...node.fields} />,
	},
});

type Props = {
	data: SerializedEditorState;
	enableGutter?: boolean;
	enableProse?: boolean;
} & React.HTMLAttributes<HTMLDivElement>;

export const RichText: React.FC<Props> = (props) => {
	const { className, enableProse = true, enableGutter = true, ...rest } = props;
	return (
		<RichTextWithoutBlocks
			className={cn(
				{
					container: enableGutter,
					'max-w-none': !enableGutter,
					'prose md:prose-md dark:prose-invert mx-auto': enableProse,
				},
				className
			)}
			converters={jsxConverters}
			{...rest}
		/>
	);
};
