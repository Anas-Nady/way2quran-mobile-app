import { AntDesign, Feather } from "@expo/vector-icons";
import { TouchableOpacity, View } from "react-native";
import Menu from "./Menu";
import AppTitle from "./../AppTitle";
import Animated, { FadeIn } from "react-native-reanimated";
import { useNavigation } from "@react-navigation/native";
import { flexDirection } from "../../helpers/flexDirection";

const Header = ({ isMenuOpen, toggleMenu }) => {
  const navigation = useNavigation();

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
        <View className={`${flexDirection()} items-center justify-between p-3`}>
          <TouchableOpacity
            onPress={toggleMenu}
            className="px-2 py-1 bg-white rounded dark:bg-gray-600"
          >
            <Feather className="flex" name="menu" size={30} color={"white"} />
          </TouchableOpacity>
          <AppTitle />
          <View className="px-2 bg-white rounded dark:bg-gray-600">
            <TouchableOpacity
              onPress={() => navigation.navigate("Search")}
              className="my-2"
            >
              <AntDesign name="search1" size={30} color={"white"} />
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
            entering={FadeIn.delay(20).springify()}
          >
            <Menu closeMenu={toggleMenu} />
          </Animated.View>
        )}
      </View>
    </>
  );
};

export default Header;
