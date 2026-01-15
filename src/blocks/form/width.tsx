interface Props {
	className?: string;
	width?: number | string;
}

export const Width = ({
	children,
	className,
	width,
}: React.PropsWithChildren<Props>) => {
	return (
		<div
			className={className}
			style={{ maxWidth: width ? `${width}%` : undefined }}
		>
			{children}
		</div>
	);
};
