import { CreateProductUseCase } from "@/application/use-cases/CreateProductUseCase";
import { DeleteProductUseCase } from "@/application/use-cases/DeleteProductUseCase";
import { GetProductUseCase } from "@/application/use-cases/GetProductUseCase";
import { GetProductsUseCase } from "@/application/use-cases/GetProductsUseCase";
import type { ProductRepository } from "@/domain/product/ProductRepository";
import { ProductRepositoryImpl } from "../repositories/ProductRepositoryImpl";
import { UpdateProductUseCase } from "@/application/use-cases/UpdateProductUseCase";

/**
 * Dependency Injection Container
 *
 * Centralizes dependency creation and lifecycle management following DDD principles.
 * This container serves as the composition root, wiring together domain, application,
 * and infrastructure layers.
 *
 * Key responsibilities:
 * - Manages singleton instances (e.g., ProductRepository) to ensure consistent state
 * - Creates use case instances with proper dependencies injected
 * - Provides a single point of control for swapping implementations (e.g., mocks in tests)
 *
 * Benefits:
 * - Decoupling: Application layer (stores) doesn't know about concrete implementations
 * - Testability: Easy to mock the container in tests (see stores/products.spec.ts)
 * - Maintainability: Change repository implementation in one place
 * - Consistency: All use cases share the same repository instance
 *
 * Usage: Stores import `diContainer` and call methods like `diContainer.getProductsUseCase()`
 * instead of manually instantiating use cases with `new CreateProductUseCase(new ProductRepositoryImpl())`
 */
class DIContainer {
  private productRepository: ProductRepository | null = null;

  getProductRepository(): ProductRepository {
    if (!this.productRepository) {
      this.productRepository = new ProductRepositoryImpl();
    }
    return this.productRepository;
  }

  getCreateProductUseCase(): CreateProductUseCase {
    return new CreateProductUseCase(this.getProductRepository());
  }

  getUpdateProductUseCase(): UpdateProductUseCase {
    return new UpdateProductUseCase(this.getProductRepository());
  }

  getProductsUseCase(): GetProductsUseCase {
    return new GetProductsUseCase(this.getProductRepository());
  }

  getProductUseCase(): GetProductUseCase {
    return new GetProductUseCase(this.getProductRepository());
  }

  getDeleteProductUseCase(): DeleteProductUseCase {
    return new DeleteProductUseCase(this.getProductRepository());
  }
}

export const diContainer = new DIContainer();
