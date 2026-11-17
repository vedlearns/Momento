package com.momento.album.infrastructure;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;

import com.momento.album.domain.Album;

public interface AlbumRepository extends JpaRepository<Album, UUID> {

	/** The ownership check for albums. */
	Optional<Album> findByIdAndOwnerIdAndDeletedAtIsNull(UUID id, UUID ownerId);

	/** Top-level albums of a user. */
	List<Album> findByOwnerIdAndParentAlbumIdIsNullAndDeletedAtIsNull(UUID ownerId, Sort sort);

	/** Child albums of one album. */
	List<Album> findByOwnerIdAndParentAlbumIdAndDeletedAtIsNull(UUID ownerId, UUID parentAlbumId, Sort sort);
}
