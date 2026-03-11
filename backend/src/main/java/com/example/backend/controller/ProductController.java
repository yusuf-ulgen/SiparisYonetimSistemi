package com.example.backend.controller;

import com.example.backend.model.Category;
import com.example.backend.model.Product;
import com.example.backend.repository.CategoryRepository;
import com.example.backend.repository.ProductRepository;
import org.springframework.http.HttpStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductRepository productRepository;

    private final CategoryRepository categoryRepository;

    // Fetch all products
    @GetMapping
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    // Fetch only active products
    @GetMapping("/active")
    public List<Product> getActiveProducts() {
        return productRepository.findByAvailableTrue();
    }

    // Fetch products by category
    @GetMapping("/category/{categoryId}")
    public List<Product> getProductsByCategory(@PathVariable Long categoryId) {
        return productRepository.findByCategory_Id(categoryId);
    }

    @PostMapping
    public ResponseEntity<Product> createProduct(@RequestBody Product productRequest) {
        if (productRequest.getCategory() != null && productRequest.getCategory().getId() != null) {
            @SuppressWarnings("null")
            Category category = categoryRepository.findById(productRequest.getCategory().getId())
                    .orElseThrow(() -> new RuntimeException("Category not found"));
            productRequest.setCategory(category);
        }
        Product savedProduct = productRepository.save(productRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedProduct);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(@PathVariable Long id,
            @RequestBody Product productDetails) {
        @SuppressWarnings("null")
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        product.setName(productDetails.getName());
        product.setDescription(productDetails.getDescription());
        product.setPrice(productDetails.getPrice());
        product.setImageUrl(productDetails.getImageUrl());
        product.setAvailable(productDetails.isAvailable());

        if (productDetails.getCategory() != null && productDetails.getCategory().getId() != null) {
            @SuppressWarnings("null")
            Category category = categoryRepository.findById(productDetails.getCategory().getId())
                    .orElseThrow(() -> new RuntimeException("Category not found"));
            product.setCategory(category);
        }

        return ResponseEntity.ok(productRepository.save(product));
    }

    // Delete a product
    @SuppressWarnings("null")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        @SuppressWarnings("null")
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        productRepository.delete(product);
        return ResponseEntity.ok().build();
    }

    // Fetch product by ID
    @SuppressWarnings("null")
    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        return productRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}