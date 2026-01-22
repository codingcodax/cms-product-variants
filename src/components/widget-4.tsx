export const Widget4 = () => {
	return (
		<div
			className='card'
			style={{
				display: 'flex',
				flexDirection: 'column',
				gap: '8px',
			}}
		>
			<h3 className='card__title'>Por expirar</h3>
			<h1 style={{ fontSize: '1.5rem' }}>
				2 <span style={{ fontSize: '0.875rem' }}>lotes</span>
			</h1>
		</div>
	);
};
