package edu.cit.olo.workfast.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

@Data
public class ProjectRequestDTO {
    private String name;
    private String description;
    private BigDecimal depositAmount;
    private List<Long> departmentSequence;
}
