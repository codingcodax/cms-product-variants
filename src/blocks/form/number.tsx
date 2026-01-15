import type { TextField } from '@payloadcms/plugin-form-builder/types';
import type {
	FieldErrorsImpl,
	FieldValues,
	UseFormRegister,
} from 'react-hook-form';
import { FormError } from '@/components/forms/form-error';
import { FormItem } from '@/components/forms/form-item';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { capitaliseFirstLetter } from '@/lib/utils';
import { Width } from './width';
// biome-ignore lint/suspicious/noShadowRestrictedNames: idk
export const Number: React.FC<
	TextField & {
		errors: Partial<
			FieldErrorsImpl<{
				[x: string]: undefined;
			}>
		>;
		register: UseFormRegister<FieldValues>;
	}
> = ({
	name,
	defaultValue,
	errors,
	label,
	register,
	required: requiredFromProps,
	width,
}) => {
	return (
		<Width width={width}>
			<FormItem>
				<Label htmlFor={name}>{label}</Label>
				<Input
					defaultValue={defaultValue}
					id={name}
					type='number'
					{...register(name, {
						required: requiredFromProps
							? `${capitaliseFirstLetter(label || name)} is required.`
							: undefined,
					})}
				/>
				{errors?.[name]?.message &&
					typeof errors?.[name]?.message === 'string' && (
						<FormError message={errors?.[name]?.message} />
					)}
			</FormItem>
		</Width>
	);
};
