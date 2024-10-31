import { useState } from "react";
import { View } from "react-native";
import Input from "./ui/Input";
import TextAreaInput from "./ui/TextAreaInput";
import Button from "./ui/Button";
import ToastMessage from "./ui/ToastMessage";
import { createMessage } from "../services/api";
import { useTranslate } from "../helpers/i18nHelper";

const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

export default function ContactUsForm() {
  const translate = useTranslate("ContactUsScreen");

  const [senderName, setSenderName] = useState("");
  const [senderEmail, setSenderEmail] = useState("");
  const [content, setContent] = useState("");

  const [state, setState] = useState({
    loading: false,
    error: "",
    success: "",
  });

  const handleSendMessage = async () => {
    setState({ loading: true, error: "", success: "" });

    if (!senderName.trim()) {
      setState({ loading: false, error: translate("errorNameRequired") });
      return;
    }

    if (!validateEmail(senderEmail)) {
      setState({ loading: false, error: translate("errorInvalidEmail") });
      return;
    }

    if (!content.trim()) {
      setState({ loading: false, error: translate("errorMessageRequired") });
      return;
    }

    try {
      await createMessage({
        senderName,
        senderEmail,
        content,
      });

      setState({
        loading: false,
        success: translate("successCreatedMessage"),
        error: "",
      });

      setSenderName("");
      setSenderEmail("");
      setContent("");
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      setState({ loading: false, error: errorMessage, success: "" });
    }
  };

  return (
    <View className="px-5">
      {state.error && <ToastMessage error={true} message={state.error} />}
      {state.success && <ToastMessage success={true} message={state.success} />}
      <View className="w-full mx-auto">
        <Input
          labelText={translate("name")}
          id="senderName"
          type="text"
          value={senderName}
          onChangeText={setSenderName}
        />
        <Input
          labelText={translate("email")}
          id="senderEmail"
          type="email"
          value={senderEmail}
          onChangeText={setSenderEmail}
        />
        <TextAreaInput
          name="message"
          value={content}
          label={translate("textarea")}
          onChangeText={setContent}
        />
        <View className="items-center justify-center">
          <Button
            disabled={state.loading}
            onPress={handleSendMessage}
            text={
              state.loading ? translate("sending") : translate("sendMessageBtn")
            }
          />
        </View>
      </View>
    </View>
  );
}
