import type {
	SerializedEditorState,
	SerializedLexicalNode,
} from '@payloadcms/richtext-lexical/lexical';
import type { StaticImageData } from 'next/image';
import { Media } from '@/components/media/media';
import { RichText } from '@/components/rich-text';
import { cn } from '@/lib/utils';
import type { MediaBlock as MediaBlockProps } from '@/payload-types';

type Props = MediaBlockProps & {
	id?: string | number;
	breakout?: boolean;
	captionClassName?: string;
	className?: string;
	enableGutter?: boolean;
	imgClassName?: string;
	staticImage?: StaticImageData;
	disableInnerContainer?: boolean;
};

export const MediaBlock = (props: Props) => {
	const {
		captionClassName,
		className,
		enableGutter = true,
		imgClassName,
		media,
		staticImage,
		disableInnerContainer,
	} = props;

	let caption: SerializedEditorState<SerializedLexicalNode> | undefined;
	if (media && typeof media === 'object') {
		caption = media.caption;
	}

	return (
		<div
			className={cn(
				'',
				{
					container: enableGutter,
				},
				className
			)}
		>
			<Media
				imgClassName={cn('rounded-[0.8rem] border border-border', imgClassName)}
				resource={media}
				src={staticImage}
			/>
			{caption && (
				<div
					className={cn(
						'mt-6',
						{
							container: !disableInnerContainer,
						},
						captionClassName
					)}
				>
					<RichText data={caption} enableGutter={false} />
				</div>
			)}
		</div>
	);
};
