import type { CollectionAfterChangeHook } from 'payload';
import { allocateBatchesFEFO } from '@/lib/batch-allocation';

export const reserveInventoryOnOrder: CollectionAfterChangeHook = async ({
	doc,
	req,
	operation,
	previousDoc,
}) => {
	const payload = req.payload;

	// Only process on new orders or status change to 'paid'
	if (
		operation === 'create' ||
		(doc.status === 'paid' && previousDoc?.status !== 'paid')
	) {
		// Process each order item
		for (const item of doc.items || []) {
			const productId =
				typeof item.product === 'string' ? item.product : item.product?.id;
			const variantId = item.variantID || null;
			const quantity = item.quantity;

			// Allocate using FEFO
			const allocation = await allocateBatchesFEFO(
				payload,
				productId,
				variantId,
				quantity
			);

			// Check if we have enough stock
			if (allocation.shortfall > 0) {
				console.error(
					`Insufficient stock for order ${doc.id}. Shortfall: ${allocation.shortfall}`
				);
				// Handle shortage - send notification, update order status, etc.
				continue;
			}

			// Deduct from batches
			for (const alloc of allocation.allocations) {
				await payload.update({
					collection: 'inventory-batches',
					id: alloc.batchId,
					data: {
						quantity: alloc.remainingQuantity,
						status: alloc.remainingQuantity === 0 ? 'depleted' : 'active',
					},
				});
			}

			// Store allocation details in order item for traceability
			await payload.update({
				collection: 'orders',
				id: doc.id,
				data: {
					items: doc.items.map((orderItem: { id: number }) => {
						if (orderItem.id === item.id) {
							return {
								...orderItem,
								batchAllocations: allocation.allocations.map((a) => ({
									batchNumber: a.batchNumber,
									quantity: a.quantityToDeduct,
								})),
							};
						}
						return orderItem;
					}),
				},
			});
		}
	}

	return doc;
};
