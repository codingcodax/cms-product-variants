import type { CheckboxField } from '@payloadcms/plugin-form-builder/types';
import type {
	FieldErrorsImpl,
	FieldValues,
	UseFormRegister,
} from 'react-hook-form';
import { useFormContext } from 'react-hook-form';
import { FormError } from '@/components/forms/form-error';
import { Checkbox as CheckboxUi } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { capitaliseFirstLetter } from '@/lib/utils';
import { Width } from './width';

export const Checkbox: React.FC<
	CheckboxField & {
		errors: Partial<
			FieldErrorsImpl<{
				[x: string]: undefined;
			}>
		>;
		getValues: undefined;
		register: UseFormRegister<FieldValues>;
		setValue: undefined;
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
	const props = register(name, {
		required: requiredFromProps
			? `${capitaliseFirstLetter(label || name)} is required.`
			: undefined,
	});
	const { setValue } = useFormContext();

	return (
		<Width width={width}>
			<div className='flex items-center gap-2'>
				<CheckboxUi
					defaultChecked={defaultValue}
					id={name}
					{...props}
					onCheckedChange={(checked) => {
						setValue(props.name, checked);
					}}
				/>
				<Label htmlFor={name}>{label}</Label>
			</div>
			{errors?.[name]?.message &&
				typeof errors?.[name]?.message === 'string' && (
					<FormError message={errors?.[name]?.message} />
				)}
		</Width>
	);
};
