# Lab 5: Xylophone - Using Flutter and Dart Packages to Speed Up Development

A TypeScript React Native xylophone with seven colored keys and the original WAV notes. `react-native-sound` loads the bundled Android audio resources and plays the selected note when a key is tapped.

## Run on Android

```sh
cd source
npm install
npm run android
```

Requirements: Node.js 22.11 or newer, Java, Android Studio/SDK, and an Android emulator or device. Build a release APK with `cd source/android && ./gradlew assembleRelease`.

The release app was built and launched on the Pixel 7 Android emulator. I tapped multiple keys and confirmed the playback status and Android audio focus. The local demo video is stored separately from this repository.
