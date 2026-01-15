import { Checkbox } from './checkbox';
import { Email } from './email';
import { Message } from './message';
// biome-ignore lint/suspicious/noShadowRestrictedNames: idk
import { Number } from './number';
import { Select } from './select';
import { Text } from './text';
import { Textarea } from './textarea';

export const fields = {
	checkbox: Checkbox,
	email: Email,
	message: Message,
	number: Number,
	select: Select,
	text: Text,
	textarea: Textarea,
};
