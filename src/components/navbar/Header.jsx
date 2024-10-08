import { Feather } from "@expo/vector-icons";
import { TouchableOpacity, View } from "react-native";
import ToggleMode from "./ToggleMode";
import Menu from "./Menu";
import AppTitle from "./../AppTitle";
import Animated, { FadeIn } from "react-native-reanimated";
import { useColorScheme } from "nativewind";

const Header = ({ isMenuOpen, toggleMenu }) => {
  const { colorScheme } = useColorScheme();

  return (
    <>
      <View
        style={{
          height: 70,
          position: "relative",
          zIndex: 1,
        }}
        className={`w-full bg-slate-200 dark:bg-gray-800 border-b-2 border-gray-300 dark:border-gray-500 flex-col`}
      >
        <View className="flex-row items-center justify-between p-3">
          <View className="px-2 py-1 bg-white rounded dark:bg-gray-600">
            <ToggleMode />
          </View>
          <AppTitle />
          {/* Icons  */}
          <View className="flex-row items-center justify-between gap-3">
            <TouchableOpacity
              onPress={toggleMenu}
              className="px-2 py-1 bg-white rounded dark:bg-gray-600"
            >
              <Feather
                className="flex"
                name="menu"
                size={30}
                color={colorScheme === "dark" ? "white" : "#4b5563"}
              />
            </TouchableOpacity>
          </View>
        </View>
        {/* Menu  */}
        {isMenuOpen && (
          <Animated.View
            style={{
              position: "absolute",
              top: 70,
              left: 0,
              zIndex: 10,
            }}
            className="w-full px-3 py-2 bg-gray-200 border-b border-gray-300 dark:border-gray-500 dark:bg-gray-800"
            entering={FadeIn.delay(100).springify()}
          >
            <Menu closeMenu={toggleMenu} />
          </Animated.View>
        )}
      </View>
    </>
  );
};

export default Header;
