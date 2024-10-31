import {
  SafeAreaView,
  StatusBar,
  View,
  TouchableWithoutFeedback,
} from "react-native";
import Header from "../components/navbar/Header";
import TabBar from "../components/TabBar";
import AudioPlayerModal from "../components/reciter/AudioPlayerModal";
import { AppNavigator } from "../navigationConfig";
import { useState, useCallback } from "react";
import ScrollToTop from "./ScrollToTop";
import { getCurrentLanguage } from "../services/i18next";

function getPlayerModalHeight(playerState) {
  if (playerState.isModalVisible) {
    if (playerState.isModalExpanded) {
      return 165;
    } else {
      return 80;
    }
  }
  return 0;
}

function Layout({ playerState }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const tabsHeight = 55;
  const playerModalHeight = getPlayerModalHeight(playerState);

  const toggleMenu = useCallback(() => {
    setIsMenuOpen((prev) => !prev);
  }, []);

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  return (
    <TouchableWithoutFeedback onPress={closeMenu}>
      <SafeAreaView
        className={`${
          getCurrentLanguage() === "ar" ? "font-arabic" : "font-english"
        } flex-1 bg-slate-200 dark:bg-gray-800`}
        style={{ position: "relative" }}
      >
        <StatusBar backgroundColor="#22c55e" barStyle="light-content" />
        <View
          style={{
            flex: 1,
            marginBottom: tabsHeight + playerModalHeight,
          }}
        >
          <Header isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} />
          <AppNavigator />
        </View>

        {/* Audio Player Modal */}
        <View
          style={{
            position: "absolute",
            bottom: 55,
            left: 0,
            right: 0,
            zIndex: 1000,
          }}
          className="w-full"
        >
          <AudioPlayerModal />
        </View>

        {/* Tab Bar */}
        <View style={{ position: "absolute", bottom: 1, left: 0, right: 0 }}>
          <TabBar />
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

export default Layout;
