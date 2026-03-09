package com.example.backend.controller;

import com.example.backend.model.Order;
import com.example.backend.repository.OrderRepository;
import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*") // Allow React to connect
@RequiredArgsConstructor
public class OrderController {

    private final OrderRepository orderRepository;

    // List all active orders (for Staff Dashboard)
    @GetMapping
    public List<Order> getAllOrders() {
        return orderRepository.findByStatusNot(Order.OrderStatus.COMPLETED);
    }

    // List ALL orders including completed (for Admin Reports)
    @GetMapping("/all")
    public List<Order> getAllTimeOrders() {
        return orderRepository.findAll();
    }

    // Create a new order (for Customer)
    @PostMapping
    public Order createOrder(@RequestBody Order order) {
        order.setStatus(Order.OrderStatus.NEW);

        // Link order_items to the specific order (Bi-directional link fix)
        if (order.getItems() != null) {
            order.getItems().forEach(item -> item.setOrder(order));
        }

        return orderRepository.save(order);
    }

    // Update specific order status (for Staff Dashboard)
    @PutMapping("/{id}/status")
    public Order updateOrderStatus(@PathVariable Long id, @RequestParam Order.OrderStatus status) {
        Order order = orderRepository.findById(id).orElseThrow(() -> new RuntimeException("Order not found"));
        order.setStatus(status);
        return orderRepository.save(order);
    }
}
