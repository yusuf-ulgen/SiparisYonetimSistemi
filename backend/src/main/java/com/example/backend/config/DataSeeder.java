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
import java.util.Objects;

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

        @Override
        public void run(String... args) throws Exception {
                // Admin kullanıcı yoksa oluştur
                if (!userRepository.existsByUsername("admin")) {
                        userRepository.save(Objects.requireNonNull(User.builder()
                                        .username("admin")
                                        .password(passwordEncoder.encode("admin123"))
                                        .role(User.Role.ADMIN)
                                        .active(true)
                                        .build()));
                        System.out.println("👤 DataSeeder: Admin kullanıcı oluşturuldu (admin/admin123 - Encrypted)");
                } else {
                        // Mevcut admin şifresini kontrol et ve gerekirse şifrele (Eski sürümlerden
                        // geçiş için)
                        userRepository.findByUsernameAndActiveTrue("admin").ifPresent(admin -> {
                                if ("admin123".equals(admin.getPassword())) {
                                        admin.setPassword(passwordEncoder.encode("admin123"));
                                        userRepository.save(admin);
                                        System.out.println("🔐 DataSeeder: Mevcut admin şifresi şifrelendi.");
                                }
                        });
                }

                // Varsayılan Site Ayarları (Eğer boşsa)
                if (siteSettingsRepository.count() == 0) {
                        System.out.println("⚙️ DataSeeder: Varsayılan site ayarları yükleniyor...");
                        siteSettingsRepository.save(Objects
                                        .requireNonNull(new SiteSettings(null, "restaurant_name", "QR Sipariş Sistemi",
                                                        "Sitede görünen restoran adı")));
                        siteSettingsRepository
                                        .save(Objects.requireNonNull(new SiteSettings(null, "restaurant_logo", "🌿",
                                                        "Sitede görünen logo (emoji veya URL)")));
                        siteSettingsRepository.save(Objects
                                        .requireNonNull(new SiteSettings(null, "contact_phone", "+90 555 123 4567",
                                                        "Siparişler sayfasındaki iletişim no")));
                        siteSettingsRepository.save(Objects.requireNonNull(new SiteSettings(null, "contact_address",
                                        "Atatürk Mah. Restoran Sok. No:1", "İletişim Adresi")));
                        siteSettingsRepository.save(Objects.requireNonNull(
                                        new SiteSettings(null, "home_hero_bg", "",
                                                        "Ana sayfa arkaplan görsel URL'si")));
                }

                if (categoryRepository.count() == 0) {
                        System.out.println("🌱 DataSeeder: Örnek veriler ekleniyor...");

                        // 1. Masaları ekle (10 masa)
                        for (int i = 1; i <= 10; i++) {
                                tableRepository.save(Objects.requireNonNull(RestaurantTable.builder()
                                                .tableNumber("Masa " + i)
                                                .qrCodeUrl("http://localhost:3000/menu?table=Masa+" + i)
                                                .occupied(false)
                                                .build()));

                        }

                        // 2. Kategoriler
                        Category sicak = categoryRepository
                                        .save(Objects.requireNonNull(
                                                        new Category(null, "Sıcak İçecekler", "Çay, Kahve vb.", null)));
                        Category soguk = categoryRepository
                                        .save(Objects.requireNonNull(new Category(null, "Soğuk İçecekler",
                                                        "Kola, Ayran, Limonata", null)));
                        Category tatli = categoryRepository
                                        .save(Objects.requireNonNull(new Category(null, "Tatlılar",
                                                        "Lezzetli tatlı çeşitleri", null)));
                        Category ana = categoryRepository
                                        .save(Objects.requireNonNull(new Category(null, "Ana Yemekler",
                                                        "Doyurucu ana öğünler", null)));
                        Category pizza = categoryRepository
                                        .save(Objects.requireNonNull(new Category(null, "Pizza",
                                                        "Çeşitli pizza seçenekleri", null)));

                        // 3. Ürünler
                        // Sıcak İçecekler
                        kaydet("Çay", "İnce belli bardakta taze çay", 15.0,
                                        "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Turkish_tea.jpg/640px-Turkish_tea.jpg",
                                        sicak);
                        kaydet("Türk Kahvesi", "Geleneksel köpüklü Türk kahvesi", 40.0,
                                        "https://images.unsplash.com/photo-1504630083234-14187a9df0f5?auto=format&fit=crop&w=300&q=80",
                                        sicak);
                        kaydet("Filtre Kahve", "Taze çekilmiş filtre kahve", 50.0,
                                        "https://images.unsplash.com/photo-1559525839-b184a4d698c7?auto=format&fit=crop&w=300&q=80",
                                        sicak);

                        // Soğuk İçecekler
                        kaydet("Ayran", "Köpüklü yayık ayran", 20.0,
                                        "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Ayran.jpg/640px-Ayran.jpg",
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
                                        "https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/S%C3%BCtla%C3%A7.jpg/640px-S%C3%BCtla%C3%A7.jpg",
                                        tatli);

                        // Ana Yemekler
                        kaydet("Izgara Köfte", "Porsiyon ızgara köfte, pilav ve patates ile", 220.0,
                                        "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&w=300&q=80",
                                        ana);
                        kaydet("Tavuk Şiş", "Özel marine edilmiş tavuk şiş", 180.0,
                                        "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=300&q=80",
                                        ana);
                        kaydet("Adana Kebap", "Acılı el yapımı Adana kebap", 240.0,
                                        "https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/Adana_kebap.jpg/640px-Adana_kebap.jpg",
                                        ana);

                        // Pizza
                        kaydet("Margherita", "Domates, mozzarella, fesleğen", 130.0,
                                        "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=300&q=80",
                                        pizza);
                        kaydet("Karışık Pizza", "Sucuk, mantar, biber, mısır, zeytin", 160.0,
                                        "https://images.unsplash.com/photo-1590947132387-155cc02f3212?auto=format&fit=crop&w=300&q=80",
                                        pizza);
                        kaydet("Ton Balıklı Pizza", "Ton balığı, soğan, kapari, mozzarella", 170.0,
                                        "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Pizza_Tonno.jpg/640px-Pizza_Tonno.jpg",
                                        pizza);

                        System.out.println("✅ DataSeeder: 5 kategori, 15 ürün, 10 masa eklendi!");
                } else {
                        System.out.println("ℹ️ DataSeeder: Veritabanında zaten veri var, seed atlandı.");

                        // Mevcut verilerde varsa STAFF hesabı da şifreli oluştur (Garsonlar için)
                        if (!userRepository.existsByUsername("garson")) {
                                userRepository.save(Objects.requireNonNull(User.builder()
                                                .username("garson")
                                                .password(passwordEncoder.encode("garson"))
                                                .role(User.Role.STAFF)
                                                .active(true)
                                                .build()));
                        }

                        System.out.println("🔧 DataSeeder: Mevcut veriler için hatalı görseller düzeltiliyor...");

                        java.util.List<Product> products = productRepository.findAll();
                        for (Product p : products) {
                                boolean updated = false;
                                switch (p.getName()) {
                                        case "Çay":
                                                p.setImageUrl("https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Turkish_tea.jpg/640px-Turkish_tea.jpg");
                                                updated = true;
                                                break;
                                        case "Ayran":
                                                p.setImageUrl("https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Ayran.jpg/640px-Ayran.jpg");
                                                updated = true;
                                                break;
                                        case "Sütlaç":
                                                p.setImageUrl("https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/S%C3%BCtla%C3%A7.jpg/640px-S%C3%BCtla%C3%A7.jpg");
                                                updated = true;
                                                break;
                                        case "Adana Kebap":
                                                p.setImageUrl("https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/Adana_kebap.jpg/640px-Adana_kebap.jpg");
                                                updated = true;
                                                break;
                                        case "Ton Balıklı Pizza":
                                                p.setImageUrl("https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Pizza_Tonno.jpg/640px-Pizza_Tonno.jpg");
                                                updated = true;
                                                break;
                                }
                                if (updated) {
                                        productRepository.save(Objects.requireNonNull(p));
                                }
                        }
                        System.out.println("✅ DataSeeder: Görsel düzeltmeleri tamamlandı.");
                }
        }

        private void kaydet(String name, String desc, double price, String imageUrl, Category cat) {
                productRepository.save(
                                Objects.requireNonNull(new Product(null, name, desc, price, imageUrl, cat, true)));
        }
}
