import axios from "axios";
import { format } from "date-fns";
import AsyncStorage from "@react-native-async-storage/async-storage";

const PRAYER_TIMES_CACHE_KEY = "prayer_times_cache";
const PRAYER_TIMES_DATE_KEY = "prayer_times_date";

async function isCacheValid() {
  const cachedDate = await AsyncStorage.getItem(PRAYER_TIMES_DATE_KEY);
  const today = format(new Date(), "yyyy-MM-dd");

  return cachedDate === today;
}

export async function getPrayerTimes({ latitude, longitude }) {
  try {
    const cacheValid = await isCacheValid();

    if (cacheValid) {
      // If cache is valid, return the cached prayer times
      const cachedPrayerTimes = await AsyncStorage.getItem(
        PRAYER_TIMES_CACHE_KEY
      );
      return JSON.parse(cachedPrayerTimes);
    }

    const today = format(new Date(), "yyyy-MM-dd");

    // Fetch prayer times from API
    const response = await axios.get(
      `http://api.aladhan.com/v1/timings/${today}`,
      {
        params: {
          latitude,
          longitude,
          method: 2, // Islamic Society of North America (ISNA)
          school: 0, // Shafi (standard)
        },
      }
    );

    const timings = response.data.data.timings;

    // Format the times to HH:mm format
    const prayerTimes = {
      fajr: format(new Date(`${today} ${timings.Fajr}`), "HH:mm"),
      dhuhr: format(new Date(`${today} ${timings.Dhuhr}`), "HH:mm"),
      asr: format(new Date(`${today} ${timings.Asr}`), "HH:mm"),
      maghrib: format(new Date(`${today} ${timings.Maghrib}`), "HH:mm"),
      isha: format(new Date(`${today} ${timings.Isha}`), "HH:mm"),
    };

    // Cache the fetched prayer times and the current date
    await AsyncStorage.setItem(
      PRAYER_TIMES_CACHE_KEY,
      JSON.stringify(prayerTimes)
    );
    await AsyncStorage.setItem(PRAYER_TIMES_DATE_KEY, today);

    return prayerTimes;
  } catch (error) {
    console.error("Error fetching prayer times:", error);
    throw error;
  }
}

// Get the next prayer time
export function getNextPrayer(prayerTimes) {
  const now = new Date();
  const currentTime = format(now, "HH:mm");

  const prayers = [
    { name: "Fajr", time: prayerTimes.fajr },
    { name: "Dhuhr", time: prayerTimes.dhuhr },
    { name: "Asr", time: prayerTimes.asr },
    { name: "Maghrib", time: prayerTimes.maghrib },
    { name: "Isha", time: prayerTimes.isha },
  ];

  // Find the next prayer
  for (const prayer of prayers) {
    if (prayer.time > currentTime) {
      return prayer;
    }
  }

  // If no next prayer today, return first prayer of next day
  return prayers[0];
}

export function calculateRemainingTime(times, nextPrayer) {
  if (!times || !nextPrayer) return null;

  const now = new Date();
  const [hours, minutes] = times[nextPrayer.name.toLowerCase()]
    .split(":")
    .map(Number);
  const prayerTime = new Date();
  prayerTime.setHours(hours, minutes, 0);

  if (prayerTime < now) {
    prayerTime.setDate(prayerTime.getDate() + 1);
  }

  const diff = prayerTime - now;
  const hours_remaining = Math.floor(diff / (1000 * 60 * 60));
  const minutes_remaining = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds_remaining = Math.floor((diff % (1000 * 60)) / 1000);

  return {
    hours: hours_remaining,
    minutes: minutes_remaining,
    seconds: seconds_remaining,
  };
}

// Helper function to check if it's prayer time
export function isPrayerTime(currentTime, prayerTimes) {
  return Object.values(prayerTimes).includes(currentTime);
}
