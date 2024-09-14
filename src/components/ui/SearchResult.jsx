import { useNavigation } from "@react-navigation/native";
import { View, Text, TouchableOpacity } from "react-native";
import Error from "./Error";
import EmptyState from "./EmptyState";
import Loading from "./Loading";
import { useTranslate } from "../../helper/i18nHelper";

export default function SearchResult({ results, loading, error }) {
  const navigation = useNavigation();
  const translate = useTranslate("SearchScreen");

  const renderResults = (items, pathPrefix) =>
    items.map((item, index) => (
      <TouchableOpacity
        key={index}
        onClick={() => navigation.navigate(`/${pathPrefix}/${item.slug}`)}
        className="block px-2 py-3"
        role="button"
        tabIndex={0}
      >
        <Text className="pt-1 pb-2 text-xl font-medium text-gray-800 border-b border-gray-400 dark:text-gray-100 text-start dark:border-gray-500">
          {item.arabicName}
        </Text>
      </TouchableOpacity>
    ));

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error?.message || translate("fetchError")} />;
  }

  const noDataFound =
    results.reciters.length === 0 &&
    results.recitations.length === 0 &&
    results.surahs.length === 0;

  if (noDataFound) {
    return <EmptyState message={translate("emptyState")} />;
  }

  return (
    <View className="w-[90%] flex-1 mx-auto mt-2">
      <View className="">
        {results.reciters.length > 0 &&
          renderResults(results.reciters, "Reciters")}
        {results.recitations.length > 0 &&
          renderResults(results.recitations, "Recitations")}
        {results.surahs.length > 0 && renderResults(results.surahs, "Surah")}
      </View>
    </View>
  );
}
