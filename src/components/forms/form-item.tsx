import { cn } from '@/lib/utils';

interface Props {
	className?: string;
	children?: React.ReactNode;
}

export const FormItem = ({ className, children }: Props) => {
	return <div className={cn('flex flex-col gap-2', className)}>{children}</div>;
};
