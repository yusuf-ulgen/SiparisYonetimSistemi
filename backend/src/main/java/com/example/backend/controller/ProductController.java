package com.example.backend.controller;

import com.example.backend.model.Category;
import com.example.backend.model.Product;
import com.example.backend.repository.CategoryRepository;
import com.example.backend.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "*")
public class ProductController {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    // Tüm ürünleri getir (Admin Paneli İçin)
    @GetMapping
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    // Sadece aktif ürünleri getir (Müşteri Menüsü İçin)
    @GetMapping("/active")
    public List<Product> getActiveProducts() {
        return productRepository.findByAvailableTrue();
    }

    // Kategoriye göre ürünleri getir
    @GetMapping("/category/{categoryId}")
    public List<Product> getProductsByCategory(@PathVariable Long categoryId) {
        return productRepository.findByCategory_Id(categoryId);
    }

    @PostMapping
    public ResponseEntity<Product> createProduct(@RequestBody @NonNull Product productRequest) {
        if (productRequest.getCategory() != null && productRequest.getCategory().getId() != null) {
            Category category = categoryRepository.findById(productRequest.getCategory().getId())
                    .orElseThrow(() -> new RuntimeException("Category not found"));
            productRequest.setCategory(category);
        }
        Product savedProduct = productRepository.save(productRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedProduct);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(@PathVariable @NonNull Long id,
            @RequestBody @NonNull Product productDetails) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        product.setName(productDetails.getName());
        product.setDescription(productDetails.getDescription());
        product.setPrice(productDetails.getPrice());
        product.setImageUrl(productDetails.getImageUrl());
        product.setAvailable(productDetails.isAvailable());

        if (productDetails.getCategory() != null && productDetails.getCategory().getId() != null) {
            Category category = categoryRepository.findById(productDetails.getCategory().getId())
                    .orElseThrow(() -> new RuntimeException("Category not found"));
            product.setCategory(category);
        }

        return ResponseEntity.ok(productRepository.save(product));
    }

    // Ürünü sil
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable @NonNull Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        productRepository.delete(product);
        return ResponseEntity.ok().build();
    }

    // Ürünü ID'ye göre getir
    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable @NonNull Long id) {
        return productRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
