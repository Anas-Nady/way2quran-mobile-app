import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import ContactUsForm from "../components/ContactUsForm";
import HeadingScreen from "../components/HeadingScreen";
import GoBackButton from "../components/ui/GoBackButton";
import { useTranslate } from "../helper/i18nHelper";

export default function ContactUs() {
  const translate = useTranslate("ContactUsScreen");

  return (
    <KeyboardAvoidingView
      behavior="padding"
      keyboardVerticalOffset={Platform.OS !== "ios" ? "46" : 0}
      className="flex-1 w-full p-3 bg-white dark:bg-slate-800"
    >
      <GoBackButton />
      <ScrollView className="w-full">
        <HeadingScreen headingTxt={translate("contactTitle")} />
        <View className="p-4 mx-auto w-[90%]">
          <Text className="mb-5 text-base text-center text-gray-600 dark:text-gray-400">
            {translate("contactDescription")}
          </Text>
          <ContactUsForm />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
