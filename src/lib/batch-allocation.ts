import type { Payload } from 'payload';

interface BatchAllocationResult {
	allocations: Array<{
		batchId: number;
		batchNumber: string;
		quantityToDeduct: number;
		remainingQuantity: number;
	}>;
	totalAllocated: number;
	shortfall: number;
}

export async function allocateBatchesFEFO(
	payload: Payload,
	productId: string,
	variantId: string | null,
	requestedQuantity: number
): Promise<BatchAllocationResult> {
	// Fetch all active batches for this product/variant, sorted by expiry date
	const batches = await payload.find({
		collection: 'inventory-batches',
		where: {
			and: [
				{ product: { equals: productId } },
				{ status: { equals: 'active' } },
				{ quantity: { greater_than: 0 } },
				...(variantId ? [{ variantID: { equals: variantId } }] : []),
			],
		},
		sort: 'expiryDate', // Earliest expiry first (FEFO principle)
		limit: 100,
	});

	const allocations: BatchAllocationResult['allocations'] = [];
	let remainingToAllocate = requestedQuantity;
	let totalAllocated = 0;

	// Iterate through batches in FEFO order
	for (const batch of batches.docs) {
		if (remainingToAllocate <= 0) {
			break;
		}

		const availableInBatch = batch.quantity || 0;
		const quantityFromThisBatch = Math.min(
			availableInBatch,
			remainingToAllocate
		);

		allocations.push({
			batchId: batch.id,
			batchNumber: batch.batchNumber,
			quantityToDeduct: quantityFromThisBatch,
			remainingQuantity: availableInBatch - quantityFromThisBatch,
		});

		totalAllocated += quantityFromThisBatch;
		remainingToAllocate -= quantityFromThisBatch;
	}

	return {
		allocations,
		totalAllocated,
		shortfall: remainingToAllocate > 0 ? remainingToAllocate : 0,
	};
}
