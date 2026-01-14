import { beforeEach, describe, expect, it, vi } from "vitest";

import { DeleteProductUseCase } from "./DeleteProductUseCase";
import { ProductId } from "@/domain/product/ProductId";
import { ProductNotFoundError } from "@/domain/product/errors";
import type { ProductRepository } from "@/domain/product/ProductRepository";
import { createMockProductRepository } from "@/test-utils/helpers";

describe("DeleteProductUseCase", () => {
  let mockRepository: ProductRepository;
  let deleteUseCase: DeleteProductUseCase;

  beforeEach(() => {
    mockRepository = createMockProductRepository();
    deleteUseCase = new DeleteProductUseCase(mockRepository);
  });

  it("deletes a product successfully", async () => {
    const productId = 1;

    vi.mocked(mockRepository.exists).mockResolvedValue(true);
    vi.mocked(mockRepository.delete).mockResolvedValue();

    await deleteUseCase.execute(productId);

    expect(mockRepository.exists).toHaveBeenCalledWith(
      ProductId.create(productId)
    );
    expect(mockRepository.delete).toHaveBeenCalledWith(
      ProductId.create(productId)
    );
  });

  it("throws error when product not found", async () => {
    const productId = 999;

    vi.mocked(mockRepository.exists).mockResolvedValue(false);

    await expect(deleteUseCase.execute(productId)).rejects.toThrow(
      ProductNotFoundError
    );

    expect(mockRepository.exists).toHaveBeenCalledWith(
      ProductId.create(productId)
    );
    expect(mockRepository.delete).not.toHaveBeenCalled();
  });
});
