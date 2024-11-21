import React, { useEffect, useState, useMemo } from "react";
import { View, Text, Image, TouchableOpacity, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import HeadingScreen from "./../components/HeadingScreen";
import GoBackButton from "../components/ui/GoBackButton";
import { getAllBookmarks, removeBookmark } from "../helpers/bookmarkHandlers";
import EmptyState from "../components/ui/EmptyState";
import { useAudioPlayer } from "../contexts/AudioPlayerContext";
import TrackPlayer, { State } from "react-native-track-player/lib/src";
import ConfirmationDialog from "../components/ui/ConfirmationDialog";
import { useTranslate } from "../helpers/i18nHelper";
import getName from "../helpers/getName";
import { flexDirection } from "../helpers/flexDirection";

const PlaylistCard = ({
  data,
  onToggleSurahs,
  onPlay,
  onDelete,
  expanded,
  isCurrentlyPlaying,
}) => {
  const sortedSurahs = useMemo(() => {
    return [...data.surahs].sort((a, b) => a.surahNumber - b.surahNumber);
  }, [data.surahs]);

  const renderSurah = ({ item }) => (
    <Text className="flex-grow p-1 mx-1 font-semibold text-center border border-gray-500 rounded text-md text-gray-50">
      {getName(item?.surahInfo)}
    </Text>
  );

  const { playerState } = useAudioPlayer();

  const numColumns = 4;
  return (
    <TouchableOpacity
      onPress={onToggleSurahs}
      className="w-[95%] mx-auto mb-4 bg-gray-700 border border-gray-500 rounded-xl"
    >
      <View className={`${flexDirection()} items-center justify-between p-4`}>
        <Image
          source={{ uri: data.reciter.photo }}
          className="w-20 h-20 rounded-full"
        />
        <View className="flex-1 mx-2">
          <Text className="text-xl font-bold text-gray-200">
            {getName(data.reciter)}
          </Text>
          <Text className="text-sm text-gray-200">
            {getName(data.recitation?.recitationInfo)}
          </Text>
        </View>
        <View className="flex-row-reverse items-center justify-between gap-3">
          <TouchableOpacity
            disabled={playerState.playLoading}
            onPress={() => onPlay(data)}
          >
            <Ionicons
              name={
                isCurrentlyPlaying
                  ? "pause-circle-outline"
                  : "play-circle-outline"
              }
              size={30}
              color={isCurrentlyPlaying ? "#22c55e" : "white"}
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={onDelete}>
            <Ionicons name="trash-bin" size={28} color="#E53E3E" />
          </TouchableOpacity>
        </View>
      </View>
      {expanded && (
        <View className="border-t border-gray-600">
          <Text className="p-1 px-2 mx-auto -mt-3 font-bold text-white border border-gray-500 rounded-full text-md">
            {sortedSurahs.length}
          </Text>
          <View className={`p-4`}>
            <FlatList
              data={sortedSurahs}
              renderItem={renderSurah}
              keyExtractor={(item) => item?.surahNumber.toString()}
              numColumns={numColumns}
              scrollEnabled={false}
              contentContainerStyle={{ flexGrow: 1 }}
              showsVerticalScrollIndicator={false}
              style={{ flex: 1, gap: 10 }}
            />
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default function Playlist() {
  const TYPE = "Playlist";
  const [playlists, setPlaylists] = useState([]);
  const [expandedPlaylist, setExpandedPlaylist] = useState(null);
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const translate = useTranslate("PlaylistScreen");

  const { playerState, setPlayerState } = useAudioPlayer();

  useEffect(() => {
    loadBookmarks();
  }, []);

  const loadBookmarks = async () => {
    const allBookmarks = await getAllBookmarks(TYPE);
    setPlaylists(allBookmarks);
  };

  const handleDeleteBookmark = async (key) => {
    await removeBookmark(TYPE, key);

    loadBookmarks();
  };

  const handleToggleSurahs = (key) => {
    // If the current playlist is already expanded, collapse it by setting to null
    // Otherwise, expand the clicked playlist
    setExpandedPlaylist(expandedPlaylist === key ? null : key);
  };

  const handlePlayPlaylist = async (playlist) => {
    setPlayerState((prev) => ({ ...prev, playLoading: true }));

    try {
      if (playlist.surahs?.length === 0) {
        return;
      }

      // Sort the surahs by surahNumber
      const sortedSurahs = [...playlist.surahs].sort(
        (a, b) => a.surahNumber - b.surahNumber
      );

      // Check if we're currently playing this playlist
      const currentTrack = await TrackPlayer.getCurrentTrack();
      const playerState = await TrackPlayer.getState();
      const isCurrentPlaylist =
        playerState.recitation?.audioFiles === sortedSurahs;

      // If no track is playing, start new playlist
      if (currentTrack === null) {
        await TrackPlayer.reset();
        await TrackPlayer.add({
          id: sortedSurahs[0].surahNumber.toString(),
          url: sortedSurahs[0].url,
          title: getName(sortedSurahs[0].surahInfo),
          artist: getName(playlist.reciter),
          artwork: playlist.reciter.photo,
          genre: "Quran",
        });
        await TrackPlayer.updateNowPlayingMetadata({
          artwork: playerState.reciter.photo,
        });

        await TrackPlayer.play();

        setPlayerState((prev) => ({
          ...prev,
          playLoading: false,
          currentAudio: sortedSurahs[0],
          reciter: playlist.reciter,
          recitation: { ...playlist.recitation, audioFiles: sortedSurahs },
          surahIndex: 0,
          isAutoPlayEnabled: true,
          isPlaying: true,
          isModalVisible: true,
        }));
        return;
      }

      // If this playlist is already playing - handle play/pause
      if (isCurrentPlaylist) {
        if (playerState === State.Playing) {
          await TrackPlayer.pause();
          setPlayerState((prev) => ({
            ...prev,
            playLoading: false,
            isPlaying: false,
          }));
        } else {
          await TrackPlayer.play();
          setPlayerState((prev) => ({
            ...prev,
            playLoading: false,
            isPlaying: true,
            isModalVisible: true,
          }));
        }
        return;
      }

      // Switch to new playlist
      await TrackPlayer.reset();
      await TrackPlayer.add({
        id: sortedSurahs[0].surahNumber.toString(),
        url: sortedSurahs[0].url,
        title: getName(sortedSurahs[0].surahInfo),
        artist: getName(playlist.reciter),
        artwork: playlist.reciter.photo,
        genre: "Quran",
      });
      await TrackPlayer.updateNowPlayingMetadata({
        artwork: playerState.reciter.photo,
      });
      await TrackPlayer.play();

      setPlayerState((prev) => ({
        ...prev,
        playLoading: false,
        currentAudio: sortedSurahs[0],
        reciter: playlist.reciter,
        recitation: { ...playlist.recitation, audioFiles: sortedSurahs },
        surahIndex: 0,
        isAutoPlayEnabled: true,
        isPlaying: true,
        isModalVisible: true,
      }));
    } catch (error) {
      console.error("Error playing playlist:", error);
      setPlayerState((prev) => ({ ...prev, playLoading: false }));
    }
  };

  const isCurrentlyPlaying = (playlist) => {
    return (
      playerState.isPlaying &&
      playerState.reciter?.slug === playlist.reciter.slug &&
      playerState.recitation?.recitationInfo?.slug ===
        playlist.recitation.recitationInfo.slug
    );
  };

  const [playlistToDelete, setPlaylistToDelete] = useState(null);

  const handleDelete = (playlist) => {
    setPlaylistToDelete(playlist);
    setIsDialogVisible(true);
  };

  const onConfirmDelete = () => {
    if (playlistToDelete) {
      handleDeleteBookmark(playlistToDelete.key);
    }
    setIsDialogVisible(false);
    setPlaylistToDelete(null);
  };

  const onCancelDelete = () => {
    setIsDialogVisible(false);
    setPlaylistToDelete(null);
  };

  const renderPlaylistItem = ({ item: data }) => (
    <PlaylistCard
      data={data}
      expanded={expandedPlaylist === data.key}
      onToggleSurahs={() => handleToggleSurahs(data.key)}
      onDelete={() => handleDelete(data)}
      onPlay={handlePlayPlaylist}
      isCurrentlyPlaying={isCurrentlyPlaying(data)}
      reciter={data.reciter}
      recitation={data.recitation}
    />
  );

  const ListEmptyComponent = () => (
    <EmptyState message={translate("emptyState")} />
  );

  const renderHeader = () => {
    return (
      <View>
        <GoBackButton />
        <HeadingScreen headingTxt={translate("playlists")} />
      </View>
    );
  };

  return (
    <View className="flex-1 w-full mx-auto bg-gray-800">
      <FlatList
        data={playlists}
        renderItem={renderPlaylistItem}
        ListHeaderComponent={renderHeader}
        keyExtractor={(item) => item.key}
        contentContainerStyle={{ flexGrow: 1, backgroundColor: "#1f2937" }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={ListEmptyComponent}
      />
      <ConfirmationDialog
        isVisible={isDialogVisible}
        onConfirm={onConfirmDelete}
        onCancel={onCancelDelete}
        message={translate("deleteConfirmation")}
      />
    </View>
  );
}
