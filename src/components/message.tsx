import clsx from 'clsx';

interface Props {
	className?: string;
	error?: React.ReactNode;
	message?: React.ReactNode;
	success?: React.ReactNode;
	warning?: React.ReactNode;
}

export const Message = ({
	className,
	error,
	message,
	success,
	warning,
}: Props) => {
	const messageToRender = message || error || success || warning;

	if (messageToRender) {
		return (
			<div
				className={clsx(
					'my-8 rounded-lg p-4',
					{
						'bg-success': Boolean(success),
						'bg-warning': Boolean(warning),
						'bg-error': Boolean(error),
					},
					className
				)}
			>
				{messageToRender}
			</div>
		);
	}
	return null;
};
