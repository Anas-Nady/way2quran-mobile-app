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
import { useState, useCallback, useEffect } from "react";
import { currentLanguage } from "../helpers/flexDirection";
import SplashScreen from "../screens/SplashScreen";

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
  const [splashScreenLoaded, setSplashScreenLoaded] = useState(true);
  const tabsHeight = 55;
  const playerModalHeight = getPlayerModalHeight(playerState);

  useEffect(() => {
    setInterval(() => {
      setSplashScreenLoaded(false);
    }, 3500);
  }, [splashScreenLoaded]);

  const toggleMenu = useCallback(() => {
    setIsMenuOpen((prev) => !prev);
  }, []);

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  return (
    <SafeAreaView
      className={`${
        currentLanguage === "ar" ? "font-arabic" : "font-english"
      } flex-1 bg-gray-800`}
    >
      <StatusBar backgroundColor="#22c55e" barStyle="light-content" />

      {splashScreenLoaded ? (
        <SplashScreen />
      ) : (
        <TouchableWithoutFeedback onPress={closeMenu}>
          <View style={{ flex: 1 }}>
            <Header isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} />
            <View
              style={{
                flex: 1,
                marginBottom: playerModalHeight + tabsHeight,
                paddingBottom: 5,
              }}
            >
              <AppNavigator />
            </View>

            {/* Audio Player Modal */}
            <View
              style={{
                position: "absolute",
                bottom: tabsHeight + 5,
                left: 0,
                right: 0,
                zIndex: 200,
              }}
              className="w-full"
            >
              <AudioPlayerModal />
            </View>

            {/* Tab Bar */}
            <View
              style={{ position: "absolute", bottom: 0, left: 0, right: 0 }}
            >
              <TabBar />
            </View>
          </View>
        </TouchableWithoutFeedback>
      )}
    </SafeAreaView>
  );
}

export default Layout;
