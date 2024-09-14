import { Image, View } from "react-native";
import getObjectFitClass from "./../../helper/getObjectFitClass";
import { defaultReciterPhoto } from "../../constants/images";

export default function ReciterImg({
  uri,
  alt = "Way2quran",
  otherClasses = "",
  isSmaller = false,
}) {
  const sizeClass = isSmaller ? "w-[150px] h-[150px]" : "w-[200px] h-[200px]";

  return (
    <View
      className={`${sizeClass} rounded-full overflow-hidden border-2 border-gray-300 dark:border-gray-200`}
    >
      <Image
        source={{ uri }}
        width={200}
        height={200}
        resizeMode={uri === defaultReciterPhoto ? "contain" : "cover"}
        alt={alt}
        className={`${otherClasses} ${getObjectFitClass(uri)} w-full h-full`}
      />
    </View>
  );
}
