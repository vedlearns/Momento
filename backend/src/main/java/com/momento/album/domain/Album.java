package com.momento.album.domain;

import java.time.Instant;
import java.util.UUID;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
@Table(name = "albums")
public class Album {

	@Id
	@GeneratedValue(strategy = GenerationType.UUID)
	private UUID id;
	
	@Column(name="owner_id",nullable=false ,updatable = false)
	private UUID ownerId;
	
	@Column(name="parent_album_id")
	private UUID parentAlbumId;
	
	@Column(length=255,nullable=false)
	private String name;
	
	@Column(columnDefinition = "text")
	private String description;
	
	@Column(name="cover_media_id")
	private UUID coverMediaId;
	
	@CreationTimestamp
	@Column(name="created_at",nullable=false,updatable = false)
	private Instant createdAt;
	
	@Column(name="updated_at",updatable = false ,nullable=false , insertable = false)
	private Instant updatedAt;
	
	@Column(name="deleted_at")
	private Instant deletedAt;
	
	
	public Album(UUID ownerId,UUID parentAlbumId,String name , String description)
	{
		this.ownerId=ownerId;
		this.parentAlbumId=parentAlbumId;
		this.name=name;
		this.description=description;	
	}
	
	// Checks whether the album is soft-deleted.
	public boolean isDeleted()
	{
		return deletedAt !=null;
	}
	
	// Updates the album's name and description.
	public void updateDetails(String name,String description) {
		  if (name == null || name.isBlank()) {
        throw new IllegalArgumentException("Album name cannot be empty");
    }
		this.name=name;
		this.description=description;
	}
	
	// Moves the album to a new parent album.
	public void moveTo(UUID newParentAlbumId) {
		this.parentAlbumId=newParentAlbumId;
	}
	
	// Sets the cover media for the album.
	public void setCover(UUID coverMediaId) {
		this.coverMediaId=coverMediaId;
	}
	
	// Soft-deletes the album by setting its deletion timestamp if not already deleted.
	public void softDelete(Instant now) {
		if(this.deletedAt==null)
			this.deletedAt=now;
	}
}
