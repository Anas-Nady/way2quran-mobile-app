import React, { useEffect, useState, useMemo, useContext } from "react";
import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import HeadingScreen from "./../components/HeadingScreen";
import GoBackButton from "../components/ui/GoBackButton";
import { getAllBookmarks, removeBookmark } from "../helpers/bookmarkHandlers";
import EmptyState from "../components/ui/EmptyState";
import { useAudioPlayer } from "../contexts/AudioPlayerContext";
import {
  pauseAudio,
  playAudio,
  playNextAudio,
  resumeAudio,
} from "../helpers/audioPlayerHelper";
import { Audio } from "expo-av";
import ConfirmationDialog from "../components/ui/ConfirmationDialog";
import { useTranslate } from "../helpers/i18nHelper";
import getName from "../helpers/getName";
import { flexDirection } from "../helpers/flexDirection";
import { ScreenDimensionsContext } from "../contexts/ScreenDimensionsProvider";

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
      className="mb-4 bg-gray-700 border border-gray-500 rounded-xl"
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
        <View className="border-t border-gray-600">
          <Text className="p-1 px-2 mx-auto -mt-3 font-bold text-white rounded-full text-md">
            {sortedSurahs.length}
          </Text>
          <View className={`${flexDirection()} flex-wrap gap-2 p-4`}>
            {sortedSurahs.map((surah) => (
              <Text
                key={surah?.surahNumber}
                className="flex-grow p-1 font-semibold text-center rounded text-md text-gray-50"
              >
                {getName(surah?.surahInfo)}
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
  const { screenWidth: width } = useContext(ScreenDimensionsContext);

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
    <View style={{ width }} className="flex-1 w-full bg-gray-800">
      <ScrollView
        showsVerticalScrollIndicator={false}
        className="flex-1 w-full p-4 mx-auto"
      >
        <GoBackButton />
        <HeadingScreen headingTxt={translate("playlists")} />
        <View>
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
    </View>
  );
}
