package edu.cit.olo.workfast.repository;

import edu.cit.olo.workfast.entity.File;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface FileRepository extends JpaRepository<File, UUID> {
    List<File> findByProjectId(UUID projectId);
}
