import type { TextField } from '@payloadcms/plugin-form-builder/types';
import type {
	FieldErrorsImpl,
	FieldValues,
	UseFormRegister,
} from 'react-hook-form';
import { FormError } from '@/components/forms/form-error';
import { FormItem } from '@/components/forms/form-item';
import { Label } from '@/components/ui/label';
import { Textarea as TextAreaComponent } from '@/components/ui/textarea';
import { capitaliseFirstLetter } from '@/lib/utils';
import { Width } from './width';

export const Textarea: React.FC<
	TextField & {
		errors: Partial<
			FieldErrorsImpl<{
				[x: string]: undefined;
			}>
		>;
		register: UseFormRegister<FieldValues>;
		rows?: number;
	}
> = ({
	name,
	defaultValue,
	errors,
	label,
	register,
	required: requiredFromProps,
	rows = 3,
	width,
}) => {
	return (
		<Width width={width}>
			<FormItem>
				<Label htmlFor={name}>{label}</Label>

				<TextAreaComponent
					defaultValue={defaultValue}
					id={name}
					rows={rows}
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
