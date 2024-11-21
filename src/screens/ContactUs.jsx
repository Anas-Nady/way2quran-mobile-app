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
import { useTranslate } from "../helpers/i18nHelper";

export default function ContactUs() {
  const translate = useTranslate("ContactUsScreen");
  const keyboardVerticalOffset = Platform.OS === "ios" ? 0 : 46;

  return (
    <KeyboardAvoidingView
      behavior="padding"
      keyboardVerticalOffset={keyboardVerticalOffset}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        className="w-full p-4 bg-slate-800"
        nestedScrollEnabled={true}
        style={{ flex: 1 }}
      >
        <GoBackButton />
        <HeadingScreen headingTxt={translate("contactTitle")} />
        <View className="w-full p-4 mx-auto">
          <Text className="mb-5 text-base text-center text-gray-400">
            {translate("contactDescription")}
          </Text>
          <ContactUsForm />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
