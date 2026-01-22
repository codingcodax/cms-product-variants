export const Widget3 = () => {
	return (
		<div
			className='card'
			style={{
				display: 'flex',
				flexDirection: 'column',
				gap: '8px',
			}}
		>
			<h3 className='card__title'>Sin Stock</h3>
			<h1 style={{ fontSize: '1.5rem' }}>
				4 <span style={{ fontSize: '0.875rem' }}>productos</span>
			</h1>
		</div>
	);
};
