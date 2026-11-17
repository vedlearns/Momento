package com.momento.media.infrastructure;

import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.momento.media.domain.AssetType;
import com.momento.media.domain.MediaAsset;

public interface MediaAssetRepository extends JpaRepository<MediaAsset, UUID> {

	//Find all assets of a media item
    List<MediaAsset> findByMediaItemId(UUID mediaItemId);

    // Find a specific asset by type
    /** For ORIGINAL, THUMBNAIL, POSTER and HLS_MASTER_PLAYLIST at most one row exists. */
    Optional<MediaAsset> findByMediaItemIdAndAssetType(UUID mediaItemId, AssetType assetType);

    /**
     * Load thumbnails for a whole page of media in ONE query instead of one per item
     * (this avoids the N+1 problem):
     * What happens?
		1 query to fetch 20 media items.
		20 additional queries to fetch their thumbnails.
		21 database queries
		This is called the N+1 problem.
     * findByMediaItemIdInAndAssetType(ids, AssetType.THUMBNAIL)
     */
    List<MediaAsset> findByMediaItemIdInAndAssetType(Collection<UUID> mediaItemIds, AssetType assetType);

	
}
