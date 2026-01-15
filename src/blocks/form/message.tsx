import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical';
import { RichText } from '@/components/rich-text';
import { Width } from './width';

export const Message: React.FC<{ message: SerializedEditorState }> = ({
	message,
}) => {
	return (
		<Width className='my-12' width='100'>
			{message && <RichText data={message} />}
		</Width>
	);
};
