import { CreateProductUseCase } from "@/application/use-cases/CreateProductUseCase";
import { DeleteProductUseCase } from "@/application/use-cases/DeleteProductUseCase";
import { GetProductUseCase } from "@/application/use-cases/GetProductUseCase";
import { GetProductsUseCase } from "@/application/use-cases/GetProductsUseCase";
import type { ProductRepository } from "@/domain/product/ProductRepository";
import { ProductRepositoryImpl } from "../repositories/ProductRepositoryImpl";
import { UpdateProductUseCase } from "@/application/use-cases/UpdateProductUseCase";

/**
 * Dependency Injection Container
 * Simple container for managing dependencies
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
