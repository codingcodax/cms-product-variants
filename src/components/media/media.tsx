import { Fragment } from 'react';
import { Image } from './image';
import type { Props } from './types';
import { Video } from './video';

export const Media = (props: Props) => {
	const { className, htmlElement = 'div', resource } = props;

	const isVideo =
		typeof resource === 'object' && resource?.mimeType?.includes('video');
	const Tag = htmlElement || Fragment;

	return (
		<Tag
			{...(htmlElement !== null
				? {
						className,
					}
				: {})}
		>
			{isVideo ? <Video {...props} /> : <Image {...props} />}
		</Tag>
	);
};
