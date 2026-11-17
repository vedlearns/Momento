package com.momento.album.infrastructure;

import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.momento.album.domain.AlbumMedia;
import com.momento.album.domain.AlbumMediaId;
import com.momento.media.domain.MediaItem;

public interface AlbumMediaRepository extends JpaRepository<AlbumMedia, AlbumMediaId> {

    /** Next position for appending to an album (-1 when empty, so the first item gets 0). */
    @Query("select coalesce(max(am.position), -1) from AlbumMedia am where am.id.albumId = :albumId")
    int findMaxPosition(@Param("albumId") UUID albumId);

    /** Media of an album in display order, skipping soft-deleted media. */
    @Query("""
            select m from AlbumMedia am
            join MediaItem m on m.id = am.id.mediaItemId
            where am.id.albumId = :albumId
              and m.deletedAt is null
            order by am.position asc, am.addedAt asc
            """)
    Slice<MediaItem> findMediaInAlbum(@Param("albumId") UUID albumId, Pageable pageable);

    /** Which albums contain this media item (all of them belong to the same owner). */
    @Query("select am.id.albumId from AlbumMedia am where am.id.mediaItemId = :mediaItemId")
    List<UUID> findAlbumIdsByMediaItemId(@Param("mediaItemId") UUID mediaItemId);

    long countByIdAlbumId(UUID albumId);
}
