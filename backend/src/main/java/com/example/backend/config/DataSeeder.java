package com.example.backend.config;

import com.example.backend.model.Category;
import com.example.backend.model.Product;
import com.example.backend.model.RestaurantTable;
import com.example.backend.model.SiteSettings;
import com.example.backend.model.User;
import com.example.backend.repository.CategoryRepository;
import com.example.backend.repository.ProductRepository;
import com.example.backend.repository.RestaurantTableRepository;
import com.example.backend.repository.SiteSettingsRepository;
import com.example.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

        @Autowired
        private CategoryRepository categoryRepository;

        @Autowired
        private ProductRepository productRepository;

        @Autowired
        private RestaurantTableRepository tableRepository;

        @Autowired
        private SiteSettingsRepository siteSettingsRepository;

        @Autowired
        private UserRepository userRepository;

        @Autowired
        private PasswordEncoder passwordEncoder;

        @SuppressWarnings("null")
        @Override
        public void run(String... args) {
                System.out.println("🌱 DataSeeder: Starting database initialization...");

                // 1. Create Admin User if not exists
                if (!userRepository.existsByUsername("admin")) {
                        userRepository.save(User.builder()
                                        .username("admin")
                                        .password(passwordEncoder.encode("admin123"))
                                        .role(User.Role.ADMIN)
                                        .active(true)
                                        .build());
                        System.out.println("👤 DataSeeder: Admin user created (admin/admin123)");
                } else {
                        // Migrating plain text passwords if any
                        userRepository.findByUsername("admin").ifPresent(admin -> {
                                if ("admin123".equals(admin.getPassword())) {
                                        admin.setPassword(passwordEncoder.encode("admin123"));
                                        userRepository.save(admin);
                                        System.out.println(
                                                        "🔐 DataSeeder: Admin password migrated to encrypted format.");
                                }
                        });
                }

                // 2. Create Staff User if not exists
                if (!userRepository.existsByUsername("waiter")) {
                        userRepository.save(User.builder()
                                        .username("waiter")
                                        .password(passwordEncoder.encode("waiter123"))
                                        .role(User.Role.STAFF)
                                        .active(true)
                                        .build());
                        System.out.println("👤 DataSeeder: Staff user created (waiter/waiter123)");
                }

                // 3. Site Settings
                if (siteSettingsRepository.count() == 0) {
                        System.out.println("⚙️ DataSeeder: Loading default settings...");
                        siteSettingsRepository.save(new SiteSettings(null, "restaurant_name", "QR Ordering System",
                                        "Restaurant Name"));
                        siteSettingsRepository
                                        .save(new SiteSettings(null, "restaurant_logo", "🌿", "Logo (Emoji/URL)"));
                        siteSettingsRepository
                                        .save(new SiteSettings(null, "contact_phone", "+90 555 123 4567", "Phone"));
                        siteSettingsRepository
                                        .save(new SiteSettings(null, "contact_address", "Restaurant St. No:1",
                                                        "Address"));
                }

                // 4. Sample Data (Categories, Tables, Products)
                if (categoryRepository.count() == 0) {
                        System.out.println("🌱 DataSeeder: Adding sample catalog...");

                        // Tables
                        for (int i = 1; i <= 10; i++) {
                                tableRepository.save(RestaurantTable.builder()
                                                .tableNumber("Table " + i)
                                                .qrCodeUrl("http://localhost:3000/menu?table=Table+" + i)
                                                .occupied(false)
                                                .build());
                        }

                        // Categories
                        Category hotDrinks = categoryRepository
                                        .save(new Category(null, "Hot Drinks", "Tea, Coffee", null));
                        Category coldDrinks = categoryRepository
                                        .save(new Category(null, "Cold Drinks", "Soda, Ayran", null));
                        categoryRepository.save(new Category(null, "Desserts", "Sweet Treats", null));
                        Category mainCourses = categoryRepository
                                        .save(new Category(null, "Main Courses", "Filling Meals", null));
                        Category pizza = categoryRepository.save(new Category(null, "Pizza", "Pizzas", null));

                        // Products
                        saveProduct("Tea", "Fresh tea", 15.0,
                                        "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Turkish_tea.jpg/640px-Turkish_tea.jpg",
                                        hotDrinks);
                        saveProduct("Turkish Coffee", "Foamy", 40.0,
                                        "https://images.unsplash.com/photo-1504630083234-14187a9df0f5?auto=format&fit=crop&w=300&q=80",
                                        hotDrinks);
                        saveProduct("Ayran", "Traditional yogurt drink", 20.0,
                                        "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Ayran.jpg/640px-Ayran.jpg",
                                        coldDrinks);
                        saveProduct("Grilled Meatballs", "With rice", 220.0,
                                        "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&w=300&q=80",
                                        mainCourses);
                        saveProduct("Margherita", "With basil", 130.0,
                                        "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=300&q=80",
                                        pizza);

                        System.out.println("✅ DataSeeder: Initial seeding completed.");
                } else {
                        System.out.println("ℹ️ DataSeeder: Database already has content, skipping seed.");

                        // Image repair logic
                        List<Product> products = productRepository.findAll();
                        for (Product p : products) {
                                boolean updated = false;
                                if ("Tea".equals(p.getName()) || "Çay".equals(p.getName())) {
                                        p.setImageUrl("https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Turkish_tea.jpg/640px-Turkish_tea.jpg");
                                        updated = true;
                                } else if ("Ayran".equals(p.getName())) {
                                        p.setImageUrl("https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Ayran.jpg/640px-Ayran.jpg");
                                        updated = true;
                                }
                                if (updated)
                                        productRepository.save(p);
                        }
                        System.out.println("✅ DataSeeder: Image URLs verified/corrected.");
                }
        }

        private void saveProduct(String name, String desc, double price, String imageUrl, Category cat) {
                productRepository.save(new Product(null, name, desc, price, imageUrl, cat, true));
        }
}