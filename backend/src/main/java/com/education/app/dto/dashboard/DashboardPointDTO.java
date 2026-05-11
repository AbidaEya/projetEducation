package com.education.app.dto.dashboard;

public class DashboardPointDTO {
    private String label;
    private Double value;

    public DashboardPointDTO() {}

    public DashboardPointDTO(String label, Double value) {
        this.label = label;
        this.value = value;
    }

    public String getLabel() { return label; }
    public void setLabel(String label) { this.label = label; }

    public Double getValue() { return value; }
    public void setValue(Double value) { this.value = value; }
}
