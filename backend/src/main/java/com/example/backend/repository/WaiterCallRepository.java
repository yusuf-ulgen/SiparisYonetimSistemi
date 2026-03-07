package com.example.backend.repository;

import com.example.backend.model.WaiterCall;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface WaiterCallRepository extends JpaRepository<WaiterCall, Long> {
    List<WaiterCall> findByDismissedFalseOrderByCreatedAtDesc();
}
