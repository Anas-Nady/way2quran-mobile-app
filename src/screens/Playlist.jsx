import React, { useEffect, useState, useMemo } from "react";
import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import HeadingScreen from "./../components/HeadingScreen";
import GoBackButton from "../components/ui/GoBackButton";
import { getAllBookmarks, removeBookmark } from "../helper/bookmarkHandlers";
import EmptyState from "../components/ui/EmptyState";
import { useAudioPlayer } from "../contexts/AudioPlayerContext";
import {
  pauseAudio,
  playAudio,
  playNextAudio,
  resumeAudio,
} from "../helper/audioPlayerHelper";
import { Audio } from "expo-av";
import ConfirmationDialog from "../components/ui/ConfirmationDialog";
import { useTranslate } from "../helper/i18nHelper";

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

  return (
    <TouchableOpacity
      onPress={onToggleSurahs}
      className="mb-4 bg-white border border-gray-400 shadow-md dark:border-gray-500 dark:bg-gray-700 rounded-xl"
    >
      <View className="flex-row-reverse items-center justify-between p-4">
        <Image
          source={{ uri: data.reciter.photo }}
          className="w-20 h-20 rounded-full"
        />
        <View className="flex-1 mx-2">
          <Text className="text-xl font-bold text-gray-800 dark:text-gray-200">
            {data.reciter.arabicName}
          </Text>
          <Text className="text-sm text-gray-600 dark:text-gray-200">
            {data.recitation?.recitationInfo?.arabicName}
          </Text>
        </View>
        <View className="flex-row-reverse items-center justify-between gap-3">
          <TouchableOpacity onPress={() => onPlay(data)}>
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
        <View className="border-t border-gray-300 dark:border-gray-600">
          <Text className="p-1 px-2 mx-auto -mt-3 font-bold text-gray-500 bg-green-700 rounded-full text-md dark:text-gray-100">
            {sortedSurahs.length}
          </Text>
          <View className="flex-row-reverse flex-wrap gap-2 p-4">
            {sortedSurahs.map((surah) => (
              <Text
                key={surah?.surahNumber}
                className="flex-grow p-1 font-semibold text-center text-gray-100 bg-green-700 rounded text-md dark:text-gray-50"
              >
                {surah?.surahInfo?.arabicName}
              </Text>
            ))}
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
    if (playlist.surahs?.length === 0) {
      // Handle empty playlist
      return;
    }

    // Sort the surahs by surahNumber
    const sortedSurahs = [...playlist.surahs].sort(
      (a, b) => a.surahNumber - b.surahNumber
    );

    let startSurah, startIndex;

    // Check if we're resuming the same playlist
    if (playerState.recitation?.audioFiles === sortedSurahs) {
      // Resume from the current surah
      startIndex = playerState.surahIndex;
      startSurah = sortedSurahs[startIndex];
    } else {
      // Start from the beginning of the new playlist
      startIndex = 0;
      startSurah = sortedSurahs[0];
    }

    if (playerState.soundObject === null) {
      const playback = await new Audio.Sound();
      const status = await playAudio(playback, startSurah.url);

      setPlayerState({
        ...playerState,
        playbackObject: playback,
        currentAudio: startSurah,
        soundObject: status,
        reciter: playlist.reciter,
        recitation: { ...playlist.recitation, audioFiles: sortedSurahs },
        surah: startSurah,
        surahIndex: startIndex,
        isAutoPlayEnabled: true,
        isPlaying: true,
        isModalVisible: true,
      });
    } else if (
      playerState.isPlaying &&
      playerState.recitation?.audioFiles === sortedSurahs
    ) {
      // Pause current playlist
      const status = await pauseAudio(playerState.playbackObject);
      setPlayerState({
        ...playerState,
        soundObject: status,
        isPlaying: false,
      });
    } else if (
      !playerState.isPlaying &&
      playerState.recitation?.audioFiles === sortedSurahs
    ) {
      // Resume current playlist
      const status = await resumeAudio(playerState.playbackObject);
      setPlayerState({
        ...playerState,
        soundObject: status,
        isPlaying: true,
        isModalVisible: true,
      });
    } else {
      // Switch to new playlist
      const status = await playNextAudio(
        playerState.playbackObject,
        startSurah.url
      );
      setPlayerState({
        ...playerState,
        currentAudio: startSurah,
        soundObject: status,
        reciter: playlist.reciter,
        recitation: { ...playlist.recitation, audioFiles: sortedSurahs },
        surah: startSurah,
        isAutoPlayEnabled: true,
        surahIndex: startIndex,
        isPlaying: true,
        isModalVisible: true,
      });
    }
  };

  const isCurrentlyPlaying = (playlist) => {
    return (
      playerState.isPlaying &&
      `${playerState.reciter.slug}_${playerState.recitation?.slug}` ===
        playlist.key
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

  return (
    <ScrollView className="flex-1 bg-gray-100 dark:bg-gray-800">
      <GoBackButton />
      <HeadingScreen headingTxt={translate("playlists")} />
      <View className="p-4">
        {playlists?.map((data) => (
          <PlaylistCard
            key={data.key}
            data={data}
            expanded={expandedPlaylist === data.key} // only expand the selected one
            onToggleSurahs={() => handleToggleSurahs(data.key)}
            onDelete={() => handleDelete(data)}
            onPlay={handlePlayPlaylist}
            isCurrentlyPlaying={isCurrentlyPlaying(data)}
            reciter={data.reciter}
            recitation={data.recitation}
          />
        ))}
        {playlists.length === 0 && (
          <EmptyState message={translate("emptyState")} />
        )}
      </View>
      <ConfirmationDialog
        isVisible={isDialogVisible}
        onConfirm={onConfirmDelete}
        onCancel={onCancelDelete}
        message={translate("deleteConfirmation")}
      />
    </ScrollView>
  );
}
