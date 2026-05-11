package com.education.app.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcTemplate;

import javax.sql.DataSource;
import java.sql.Connection;
import java.util.List;
import java.util.Map;

@Configuration
public class NotificationSchemaCompatibilityConfig {

    private static final Logger log = LoggerFactory.getLogger(NotificationSchemaCompatibilityConfig.class);

    @Bean
    CommandLineRunner fixLegacyNotificationColumns(JdbcTemplate jdbcTemplate, DataSource dataSource) {
        return args -> {
            try (Connection connection = dataSource.getConnection()) {
                String databaseProduct = connection.getMetaData().getDatabaseProductName();

                List<Map<String, Object>> rows = jdbcTemplate.queryForList(
                        "SELECT IS_NULLABLE FROM INFORMATION_SCHEMA.COLUMNS " +
                                "WHERE UPPER(TABLE_NAME) = 'NOTIFICATIONS' AND UPPER(COLUMN_NAME) = 'ETUDIANT_ID'");

                if (rows.isEmpty()) {
                    return;
                }

                Object nullableValue = rows.get(0).get("IS_NULLABLE");
                boolean isNullable = nullableValue != null && "YES".equalsIgnoreCase(nullableValue.toString());
                if (isNullable) {
                    return;
                }

                if (databaseProduct != null && databaseProduct.toLowerCase().contains("mysql")) {
                    jdbcTemplate.execute("ALTER TABLE notifications MODIFY COLUMN etudiant_id BIGINT NULL");
                } else {
                    try {
                        jdbcTemplate.execute("ALTER TABLE notifications ALTER COLUMN etudiant_id BIGINT NULL");
                    } catch (Exception ignored) {
                        jdbcTemplate.execute("ALTER TABLE notifications ALTER COLUMN etudiant_id SET NULL");
                    }
                }

                log.info("Applied compatibility fix: notifications.etudiant_id is now nullable");
            } catch (Exception ex) {
                log.warn("Could not apply notifications schema compatibility fix: {}", ex.getMessage());
            }
        };
    }
}
