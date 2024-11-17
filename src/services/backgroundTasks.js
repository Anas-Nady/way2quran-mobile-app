// import * as TaskManager from "expo-task-manager";
// import * as BackgroundFetch from "expo-background-fetch";
// import * as Notifications from "expo-notifications";
// import { getPrayerTimes } from "./prayerTimes";

// const BACKGROUND_NEXT_PRAYER_TASK = "NEXT_PRAYER_NOTIFICATION_TASK";

// TaskManager.defineTask(BACKGROUND_NEXT_PRAYER_TASK, async () => {
//   try {
//     const prayerTimes = await getPrayerTimes();
//     const now = new Date();

//     if (!prayerTimes) {
//       console.log(`No prayer times found and failed to fetch new times.`);
//       return BackgroundFetch.Result.Failed;
//     }

//     const nextPrayer = Object.values(prayerTimes).find(
//       (time) => new Date(time) > now
//     );

//     if (!nextPrayer) {
//       console.log("No upcoming prayer times found.");
//       return BackgroundFetch.Result.NoData;
//     }

//     const notificationTime = new Date(nextPrayer.getTime() - 5 * 60 * 1000); // 5 minutes before

//     if (notificationTime > now) {
//       const timeUntilNotification = Math.round((notificationTime - now) / 1000); // seconds

//       await Notifications.scheduleNotificationAsync({
//         content: {
//           title: "Next Prayer Reminder",
//           body: `Your next prayer is in 5 minutes.`,
//         },
//         trigger: { seconds: timeUntilNotification },
//       });

//       console.log(`Notification scheduled for ${notificationTime}`);
//       return BackgroundFetch.Result.NewData;
//     } else {
//       console.log("Notification time has already passed. Skipping.");
//       return BackgroundFetch.Result.NoData;
//     }
//   } catch (error) {
//     console.error(`Error occurred in background task:`, error);
//     return BackgroundFetch.Result.Failed;
//   }
// });

// export const registerBackgroundNextPrayerTask = async () => {
//   const isRegistered = await TaskManager.isTaskRegisteredAsync(
//     BACKGROUND_NEXT_PRAYER_TASK
//   );
//   if (!isRegistered) {
//     await BackgroundFetch.registerTaskAsync(BACKGROUND_NEXT_PRAYER_TASK, {
//       minimumInterval: 60 * 15,
//       stopOnTerminate: false,
//       startOnBoot: true,
//     });
//     console.log("Background task registered");
//   }
// };

// export async function unregisterBackgroundFetchAsync() {
//   return BackgroundFetch.unregisterTaskAsync(BACKGROUND_NEXT_PRAYER_TASK);
// }
