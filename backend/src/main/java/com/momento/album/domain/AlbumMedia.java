package com.momento.album.domain;

import java.time.Instant;
import java.util.UUID;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Table: album_media (V5). Join table between albums and media items, with
 * ordering. The same media item can be in many albums.
 *
 * ownerId must equal the owner of both the album and the media item; the
 * composite foreign keys make the database reject anything else.
 */

@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
@Table(name = "album_media")
public class AlbumMedia {

	/*
	 * @EmbeddedId is used when an entity has a composite primary key.
	 *
	 * In our Momento project, the album_media table has two columns
	 * that together form its Primary Key:
	 *
	 * 1. album_id
	 * 2. media_item_id
	 *
	 * Instead of declaring @Id separately on both fields,
	 * we created a separate class called AlbumMediaId.
	 *
	 * @Embeddable in AlbumMediaId tells JPA that this class
	 * can be embedded into an entity.
	 *
	 * @EmbeddedId tells JPA that the 'id' field contains
	 * the composite Primary Key of the AlbumMedia entity.
	 *
	 * Therefore:
	 * id = albumId + mediaItemId
	 *
	 * Both UUIDs together uniquely identify each row
	 * in the album_media table.
	 */
	@EmbeddedId
	private AlbumMediaId id;

	@Column(name = "owner_id", nullable = false, updatable = false)
	private UUID ownerId;

	/** Display order inside the album, lower first. */
	@Column(nullable = false)
	private int position;

	@CreationTimestamp
	@Column(name = "added_at", nullable = false, updatable = false)
	private Instant addedAt;

	public AlbumMedia(UUID albumId, UUID mediaItemId, UUID ownerId, int position) {
		this.id = new AlbumMediaId(albumId, mediaItemId);
		this.ownerId = ownerId;
		this.position = position;
	}

	public void updatePosition(int position) {
		if (position < 0) {
			throw new IllegalArgumentException("Position cannot be negative");
		}

		this.position = position;
	}

}
