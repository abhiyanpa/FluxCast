# FluxCast Android App Setup

## 📱 Building the Android App

### Prerequisites

1. **Android Studio** - Download from: https://developer.android.com/studio
2. **Java JDK 17+** - Required by Android Studio
3. **Node.js** - Already installed

### Quick Build Commands

```bash
# Build web app and sync to Android
npm run android:build

# Open in Android Studio
npm run android:open
```

## 🔧 Development Workflow

### 1. Make Changes to Web App
```bash
# Edit your React code in src/
npm run dev  # Test in browser
```

### 2. Sync to Android
```bash
# Build and copy to Android
npm run build
npx cap sync android
```

### 3. Build APK/AAB

#### Option A: Using Android Studio (Recommended)
```bash
# Open project in Android Studio
npm run android:open
```

Then in Android Studio:
- **Build > Build Bundle(s) / APK(s) > Build APK(s)** - For testing
- **Build > Generate Signed Bundle / APK** - For Play Store

#### Option B: Using Command Line
```bash
# Build debug APK
cd android
./gradlew assembleDebug

# Build release APK
./gradlew assembleRelease
```

## 📦 Output Files

### Debug APK (for testing)
```
android/app/build/outputs/apk/debug/app-debug.apk
```

### Release APK/AAB (for distribution)
```
android/app/build/outputs/apk/release/app-release.apk
android/app/build/outputs/bundle/release/app-release.aab
```

## 🎨 Customization

### App Icon
Replace icons in:
```
android/app/src/main/res/mipmap-*/ic_launcher.png
```

Use https://romannurik.github.io/AndroidAssetStudio/ to generate all sizes.

### Splash Screen
Edit colors in:
```
android/app/src/main/res/values/styles.xml
```

### App Name
Edit in:
```
android/app/src/main/res/values/strings.xml
```

## 🔐 Signing for Release

### 1. Generate Keystore
```bash
keytool -genkey -v -keystore fluxcast-release.keystore -alias fluxcast -keyalg RSA -keysize 2048 -validity 10000
```

### 2. Configure Signing
Create `android/keystore.properties`:
```properties
storeFile=../fluxcast-release.keystore
storePassword=YOUR_STORE_PASSWORD
keyAlias=fluxcast
keyPassword=YOUR_KEY_PASSWORD
```

### 3. Build Signed Release
In Android Studio:
1. Build > Generate Signed Bundle / APK
2. Choose Android App Bundle (AAB) for Play Store
3. Select your keystore
4. Enter passwords

## 📱 Testing

### Install on Device
```bash
# Install debug APK
adb install android/app/build/outputs/apk/debug/app-debug.apk

# Or use Android Studio's Run button
```

### Debug on Device
```bash
# View logs
npx cap run android -l

# Or use Android Studio Logcat
```

## 🚀 Publishing to Google Play Store

### 1. Prepare Release
- Update version in `android/app/build.gradle`:
  ```gradle
  versionCode 1
  versionName "1.0.0"
  ```

### 2. Build AAB
- Use Android Studio: Build > Generate Signed Bundle
- Choose **Android App Bundle (AAB)**
- Upload to Play Store

### 3. Play Store Requirements
- **Screenshots**: 2-8 screenshots (phone, tablet)
- **Feature Graphic**: 1024x500px
- **App Icon**: 512x512px
- **Privacy Policy**: Required URL
- **Content Rating**: Complete questionnaire

## 🔧 Configuration Files

### capacitor.config.json
```json
{
  "appId": "com.abhiyanpa.fluxcast",
  "appName": "FluxCast",
  "webDir": "dist",
  "server": {
    "androidScheme": "https"
  }
}
```

### android/app/build.gradle
- Set minSdkVersion: 22
- Set targetSdkVersion: 34
- Set versionCode and versionName

## 🐛 Common Issues

### Issue: "SDK location not found"
**Solution**: Create `android/local.properties`:
```properties
sdk.dir=C\:\\Users\\YourUsername\\AppData\\Local\\Android\\Sdk
```

### Issue: "Gradle build failed"
**Solution**: 
```bash
cd android
./gradlew clean
./gradlew assembleDebug
```

### Issue: "Cleartext not permitted"
**Solution**: Already configured in `capacitor.config.json` with `allowMixedContent: true`

## 📖 Useful Commands

```bash
# Check Capacitor configuration
npx cap doctor

# Update Capacitor
npm install @capacitor/cli@latest @capacitor/core@latest @capacitor/android@latest

# Clean and rebuild
cd android && ./gradlew clean && cd ..
npm run android:build
```

## 🔗 Resources

- [Capacitor Docs](https://capacitorjs.com/docs)
- [Android Studio Guide](https://developer.android.com/studio/build)
- [Play Store Publishing](https://support.google.com/googleplay/android-developer/answer/9859152)

## ⚠️ Notes

- Always test on real devices before releasing
- Keep your keystore file safe (backup somewhere secure)
- Never commit keystore or passwords to Git
- Use AAB format for Play Store (required since 2021)
- Test on different Android versions (API 22+)

---

**Next Steps:**
1. Install Android Studio
2. Run `npm run android:open`
3. Build APK and test on your phone!
