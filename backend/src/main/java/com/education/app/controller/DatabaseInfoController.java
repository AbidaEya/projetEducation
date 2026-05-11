package com.education.app.controller;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/db")
public class DatabaseInfoController {

    private final JdbcTemplate jdbcTemplate;

    public DatabaseInfoController(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @GetMapping("/tables")
    public Map<String, Object> listTables() {
        String database = jdbcTemplate.queryForObject("SELECT DATABASE()", String.class);

        List<Map<String, Object>> tables = jdbcTemplate.queryForList(
                "SELECT table_name AS name, table_type AS type " +
                        "FROM information_schema.tables " +
                        "WHERE table_schema = DATABASE() " +
                        "ORDER BY table_type, table_name"
        );

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("database", database);
        result.put("count", tables.size());
        result.put("tables", tables);
        return result;
    }
}
