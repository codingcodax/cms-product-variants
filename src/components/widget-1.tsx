export const Widget1 = () => {
	return (
		<div
			className='card'
			style={{
				display: 'flex',
				flexDirection: 'column',
				gap: '8px',
			}}
		>
			<h3 className='card__title'>Ventas Totales</h3>
			<h1 style={{ fontSize: '1.5rem' }}>
				26 <span style={{ fontSize: '0.875rem' }}>ventas</span>
			</h1>
		</div>
	);
};
