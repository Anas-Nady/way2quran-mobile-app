import { useEffect, useState } from "react";
import { View, Text, ScrollView } from "react-native";
import * as Location from "expo-location";
import Loading from "./../components/ui/Loading";
import Error from "./../components/ui/Error";
import { useTranslate } from "./../helpers/i18nHelper.js";
import { flexDirection } from "../helpers/flexDirection.js";
import GoBackButton from "../components/ui/GoBackButton.jsx";

const PrayerTimes = () => {
  const translate = useTranslate("PrayerTimes");
  const [prayerTimes, setPrayerTimes] = useState(null);
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [nextPrayer, setNextPrayer] = useState(null);

  useEffect(() => {
    const fetchPrayerTimes = async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setError(translate("locationPermissionError"));
          setLoading(false);
          return;
        }

        let location = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = location.coords;

        // Fetch address
        const [addressResponse] = await Location.reverseGeocodeAsync({
          latitude,
          longitude,
        });
        if (addressResponse) {
          const { city, country } = addressResponse;
          setAddress(`${city}, ${country}`);
        }

        const response = await fetch(
          `https://api.aladhan.com/v1/timings?latitude=${latitude}&longitude=${longitude}&method=2`
        );

        if (!response.ok) {
          const errorData = await response.json();
          setError(errorData?.data || translate("fetchError"));
          setLoading(false);
          return;
        }

        const data = await response.json();
        const mainPrayers = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];
        const filteredTimes = Object.fromEntries(
          Object.entries(data.data.timings).filter(([key]) =>
            mainPrayers.includes(key)
          )
        );
        setPrayerTimes(filteredTimes);
        setNextPrayer(getNextPrayer(filteredTimes));
        setLoading(false);
      } catch (error) {
        setError(error?.message || translate("fetchError"));
        setLoading(false);
      }
    };

    fetchPrayerTimes();
  }, []);

  const getNextPrayer = (times) => {
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();

    for (const [prayer, time] of Object.entries(times)) {
      const [hours, minutes] = time.split(":").map(Number);
      const prayerTime = hours * 60 + minutes;

      if (prayerTime > currentTime) {
        return prayer;
      }
    }

    return Object.keys(times)[0]; // Return first prayer if all prayers have passed
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error} />;
  }

  return (
    <ScrollView className="flex-1 w-full p-4 py-5 bg-gray-800">
      <GoBackButton />
      <View className="justify-center flex-1 my-5 ">
        <Text className="mb-2 text-3xl font-bold text-center text-white">
          {translate("title")}
        </Text>
        <Text className="px-2 py-1 mb-6 text-lg text-center text-green-500 rounded-xl">
          {address}
        </Text>

        <View className="p-6 mb-2 border border-gray-500 rounded-lg">
          {Object.entries(prayerTimes).map(([prayer, time]) => {
            const isPassed =
              prayer !== nextPrayer && getNextPrayer(prayerTimes) !== prayer;

            return (
              <View
                key={prayer}
                className={`${flexDirection()} items-center justify-between gap-3 border border-gray-500 px-3 py-1 pb-4 my-3 rounded
                  ${isPassed ? "bg-gray-700" : ""} 
                  ${prayer === nextPrayer ? "bg-gray-800" : ""}`}
              >
                <View>
                  <Text
                    className={`text-xl font-semibold ${
                      prayer === nextPrayer
                        ? "font-bold text-green-500"
                        : "text-gray-300"
                    }`}
                  >
                    {translate(`${prayer.toLowerCase()}`)}
                    {":"}
                  </Text>
                </View>
                <Text
                  className={`text-xl font-semibold ${
                    prayer === nextPrayer
                      ? "font-bold text-green-500"
                      : "text-gray-300"
                  }`}
                >
                  {time}
                </Text>
              </View>
            );
          })}
        </View>
      </View>
    </ScrollView>
  );
};

export default PrayerTimes;
