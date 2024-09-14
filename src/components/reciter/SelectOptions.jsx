import { useColorScheme } from "nativewind";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { SelectList } from "react-native-dropdown-select-list";

export default function SelectOptions({
  setRecitation,
  recitations,
  recitationName,
}) {
  const { t } = useTranslation();
  const { colorScheme } = useColorScheme();
  const isDarkMode = colorScheme === "dark";

  const selectListStyles = {
    boxStyles: {
      borderColor: isDarkMode ? "#4B5563" : "#ccc",
      borderRadius: 8,
      marginTop: 10,
      backgroundColor: isDarkMode ? "#374151" : "white",
      // position: "relative",
      flexDirection: "row-reverse",
    },
    inputStyles: {
      color: isDarkMode ? "#E5E7EB" : "#333",
      fontSize: 18,
      fontWeight: "bold",
    },
    dropdownStyles: {
      borderColor: isDarkMode ? "#4B5563" : "#ccc",
      backgroundColor: isDarkMode ? "#1F2937" : "white",
      position: "absolute",
      zIndex: 9,
      width: "100%",
      top: 50,
    },
    dropdownItemStyles: {
      paddingVertical: 10,
    },
    dropdownTextStyles: {
      color: isDarkMode ? "#E5E7EB" : "#333",
      fontSize: 18,
      fontWeight: "bold",
    },
  };

  const recitationOptions = recitations?.map((rec) => ({
    key: rec?.recitationInfo?.slug,
    value: rec?.recitationInfo?.arabicName,
  }));

  return (
    <View className="mx-auto mb-2 w-[70%]">
      <SelectList
        setSelected={(val) => setRecitation(val)}
        data={recitationOptions}
        search={false}
        save="key"
        placeholder={recitationName || t("chooseTypeOfRecitation")}
        {...selectListStyles}
      />
    </View>
  );
}
