package com.example.backend.config;

import com.example.backend.model.Category;
import com.example.backend.model.Product;
import com.example.backend.model.RestaurantTable;
import com.example.backend.model.User;
import com.example.backend.repository.CategoryRepository;
import com.example.backend.repository.ProductRepository;
import com.example.backend.repository.RestaurantTableRepository;
import com.example.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {

        @Autowired
        private CategoryRepository categoryRepository;

        @Autowired
        private ProductRepository productRepository;

        @Autowired
        private RestaurantTableRepository tableRepository;

        @Autowired
        private UserRepository userRepository;

        @Override
        public void run(String... args) throws Exception {
                // Admin kullanıcı yoksa oluştur
                if (!userRepository.existsByUsername("admin")) {
                        userRepository.save(User.builder()
                                        .username("admin")
                                        .password("admin123")
                                        .role(User.Role.ADMIN)
                                        .active(true)
                                        .build());
                        System.out.println("👤 DataSeeder: Admin kullanıcı oluşturuldu (admin/admin123)");
                }

                if (categoryRepository.count() == 0) {
                        System.out.println("🌱 DataSeeder: Örnek veriler ekleniyor...");

                        // 1. Masaları ekle (10 masa)
                        for (int i = 1; i <= 10; i++) {
                                tableRepository.save(RestaurantTable.builder()
                                                .tableNumber("Masa " + i)
                                                .qrCodeUrl("http://localhost:3000/menu?table=Masa+" + i)
                                                .occupied(false)
                                                .build());

                        }

                        // 2. Kategoriler
                        Category sicak = categoryRepository
                                        .save(new Category(null, "Sıcak İçecekler", "Çay, Kahve vb.", null));
                        Category soguk = categoryRepository
                                        .save(new Category(null, "Soğuk İçecekler", "Kola, Ayran, Limonata", null));
                        Category tatli = categoryRepository
                                        .save(new Category(null, "Tatlılar", "Lezzetli tatlı çeşitleri", null));
                        Category ana = categoryRepository
                                        .save(new Category(null, "Ana Yemekler", "Doyurucu ana öğünler", null));
                        Category pizza = categoryRepository
                                        .save(new Category(null, "Pizza", "Çeşitli pizza seçenekleri", null));

                        // 3. Ürünler
                        // Sıcak İçecekler
                        kaydet("Çay", "İnce belli bardakta taze çay", 15.0,
                                        "https://images.unsplash.com/photo-1576092768241-dec231879bfc?auto=format&fit=crop&w=300&q=80",
                                        sicak);
                        kaydet("Türk Kahvesi", "Geleneksel köpüklü Türk kahvesi", 40.0,
                                        "https://images.unsplash.com/photo-1504630083234-14187a9df0f5?auto=format&fit=crop&w=300&q=80",
                                        sicak);
                        kaydet("Filtre Kahve", "Taze çekilmiş filtre kahve", 50.0,
                                        "https://images.unsplash.com/photo-1559525839-b184a4d698c7?auto=format&fit=crop&w=300&q=80",
                                        sicak);

                        // Soğuk İçecekler
                        kaydet("Ayran", "Köpüklü yayık ayran", 20.0,
                                        "https://images.unsplash.com/photo-1626074128038-16440db737ea?auto=format&fit=crop&w=300&q=80",
                                        soguk);
                        kaydet("Limonata", "Taze sıkılmış nane limonata", 45.0,
                                        "https://images.unsplash.com/photo-1621263764928-df1444c5e859?auto=format&fit=crop&w=300&q=80",
                                        soguk);
                        kaydet("Meyve Suyu", "Mevsim meyvelerinden taze sıkılmış", 50.0,
                                        "https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&w=300&q=80",
                                        soguk);

                        // Tatlılar
                        kaydet("Cheesecake", "Orman meyveli Philadelphia cheesecake", 85.0,
                                        "https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=300&q=80",
                                        tatli);
                        kaydet("Tiramisu", "Klasik İtalyan Tiramisu", 90.0,
                                        "https://images.unsplash.com/photo-1571115177098-24ec42ed204d?auto=format&fit=crop&w=300&q=80",
                                        tatli);
                        kaydet("Sütlaç", "Fırında çıtır kabuklu sütlaç", 60.0,
                                        "https://images.unsplash.com/photo-1621326888314-45afd86ef07e?auto=format&fit=crop&w=300&q=80",
                                        tatli);

                        // Ana Yemekler
                        kaydet("Izgara Köfte", "Porsiyon ızgara köfte, pilav ve patates ile", 220.0,
                                        "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&w=300&q=80",
                                        ana);
                        kaydet("Tavuk Şiş", "Özel marine edilmiş tavuk şiş", 180.0,
                                        "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=300&q=80",
                                        ana);
                        kaydet("Adana Kebap", "Acılı el yapımı Adana kebap", 240.0,
                                        "https://images.unsplash.com/photo-1573600073955-f15b3b6caab7?auto=format&fit=crop&w=300&q=80",
                                        ana);

                        // Pizza
                        kaydet("Margherita", "Domates, mozzarella, fesleğen", 130.0,
                                        "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=300&q=80",
                                        pizza);
                        kaydet("Karışık Pizza", "Sucuk, mantar, biber, mısır, zeytin", 160.0,
                                        "https://images.unsplash.com/photo-1590947132387-155cc02f3212?auto=format&fit=crop&w=300&q=80",
                                        pizza);
                        kaydet("Ton Balıklı Pizza", "Ton balığı, soğan, kapari, mozzarella", 170.0,
                                        "https://images.unsplash.com/photo-1534308983496-4fabb1a015ce?auto=format&fit=crop&w=300&q=80",
                                        pizza);

                        System.out.println("✅ DataSeeder: 5 kategori, 15 ürün, 10 masa eklendi!");
                } else {
                        System.out.println("ℹ️ DataSeeder: Veritabanında zaten veri var, seed atlandı.");
                }
        }

        private void kaydet(String name, String desc, double price, String imageUrl, Category cat) {
                productRepository.save(new Product(null, name, desc, price, imageUrl, cat, true));
        }
}
