import { Image, View } from "react-native";
import getObjectFitClass from "./../../helpers/getObjectFitClass";
import { defaultReciterPhoto } from "../../constants/images";
import logo from "./../../assets/logo.png";

export default function ReciterImg({
  uri,
  alt = "Way2quran",
  otherClasses = "",
}) {
  const sizeClass = "w-[220px] h-[220px]";
  const srcImg = uri === defaultReciterPhoto ? logo : { uri };

  return (
    <View
      className={`${sizeClass} rounded-full overflow-hidden border-2 border-gray-400 dark:border-gray-400`}
    >
      <Image
        source={srcImg}
        width={220}
        height={220}
        resizeMode={uri === defaultReciterPhoto ? "contain" : "cover"}
        alt={alt}
        className={`${otherClasses} ${getObjectFitClass(uri)} w-full h-full`}
      />
    </View>
  );
}
