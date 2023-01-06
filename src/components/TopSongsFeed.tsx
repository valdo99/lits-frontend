import { t } from "@lingui/macro";
import { useLingui } from "@lingui/react";
import { useInfiniteQuery } from "@tanstack/react-query";

import { PaginatedList } from "@components/Basic/PaginatedList";
import { SongCard } from "@components/Song/SongCard";
import { useApiClient, useUser } from "@providers/AuthProvider";
import { usePlayer } from "@providers/PlayerProvider";
import { getNextPageParam } from "@utils/getNextPageParam";

export const TopSongsFeed = () => {
  const { i18n } = useLingui();
  const { user, loading } = useUser();
  const apiClient = useApiClient();
  const { setQueue } = usePlayer();

  const query = useInfiniteQuery(
    ["feed", user?._id],
    ({ pageParam }) => apiClient.songs.feed({ page: pageParam }),
    {
      enabled: !loading,
      getNextPageParam,
    }
  );

  const { data: songs, refetch } = query;

  const onPlay = (songId: string) => {
    if (!songs) return;

    const songsList = songs.pages
      .map((page) => page.data)
      .flat()
      .filter((song) => song.preview_url !== null);
    const index = songsList.findIndex((song) => song._id === songId);

    setQueue(songsList, index);
  };

  return (
    <PaginatedList
      title={t(i18n)`Today's top songs`}
      tooltip={t(i18n)`Songs which received the most likes today`}
      query={query}
      item={(song) => (
        <SongCard
          key={song._id}
          song={song}
          onLikeChange={refetch}
          onPlay={() => onPlay(song._id)}
        />
      )}
    />
  );
};
