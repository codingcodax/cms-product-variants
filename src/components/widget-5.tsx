import { Table } from './table';

const columns = [
	{
		key: 'order',
		label: 'Orden',
	},
	{
		key: 'total',
		label: 'Total',
	},
	{
		key: 'products_qty',
		label: 'No. Productos',
	},
	{
		key: 'date',
		label: 'Fecha',
	},
];

const rows: Record<string, string>[] = [
	{
		order: '#ORD-1007',
		total: '$12,450',
		products_qty: '12',
		date: '22/01/2026',
	},
	{
		order: '#ORD-1006',
		total: '$850',
		products_qty: '1',
		date: '18/01/2026',
	},
	{
		order: '#ORD-1005',
		total: '$3,200',
		products_qty: '3',
		date: '15/01/2026',
	},
	{
		order: '#ORD-1004',
		total: '$15,700',
		products_qty: '24',
		date: '10/01/2026',
	},
	{
		order: '#ORD-1003',
		total: '$2,150',
		products_qty: '2',
		date: '05/01/2026',
	},
	{
		order: '#ORD-1002',
		total: '$6,800',
		products_qty: '7',
		date: '30/12/2025',
	},
	{
		order: '#ORD-1001',
		total: '$4,500',
		products_qty: '4',
		date: '21/12/2025',
	},
];

export const Widget5 = () => {
	return <Table columns={columns} rows={rows} title='Table' />;
};
