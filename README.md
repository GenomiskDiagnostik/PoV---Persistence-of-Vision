# Expo Android Template

A minimal, reusable Expo managed app template configured for Android APK builds with Expo Application Services (EAS) and GitHub Actions. Use this repository as a starting point for new mobile apps.

## Using this repo as an Expo Android template

1. Click **Use this template** on GitHub to create a new repository.
2. After your new repository is created, update the template placeholders:
   - Open `mobile/app.json` and change `"name"`, `"slug"`, `"owner"`, and `"android.package"` from their `CHANGE_ME` values to match your app.
   - Add your own app icons to `mobile/assets/` (e.g., `icon.png`, `adaptive-icon.png`) and reference them from `app.json` if desired.
3. Create or sign in to your Expo account at https://expo.dev.
4. Generate an Expo Personal Access Token (PAT) with EAS Build permissions from your Expo account settings.
5. Add the PAT as a GitHub Repository secret in your new repo:
   - GitHub → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**
   - Name: `EXPO_TOKEN`
   - Value: your Expo Personal Access Token
6. Run the app locally:
   - `cd mobile`
   - `npm install`
   - `npm start`
7. Push to the `main` branch. The included GitHub Action (`.github/workflows/build-android-apk.yml`) will automatically install dependencies and trigger a non-interactive EAS Android APK build using the `preview` profile.

## Project structure
- `mobile/` – Expo managed React Native app and EAS configuration
- `.github/workflows/build-android-apk.yml` – GitHub Actions workflow for EAS Android builds

## Local development
- Start the dev server: `npm start`
- Launch on Android emulator/device: `npm run android`
- Build an internal APK locally (non-interactive): `npm run build:android:preview`

## Notes
- Replace all `CHANGE_ME` placeholders before releasing your own app.
- Ensure `EXPO_TOKEN` is configured in GitHub Actions to allow builds to run in CI.
