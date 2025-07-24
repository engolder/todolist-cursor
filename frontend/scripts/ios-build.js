import { execSync } from "child_process";

/**
 * iOS 앱을 빌드합니다.
 * 웹앱 빌드 후 iOS 프로젝트와 동기화합니다.
 */
function buildIOSApp() {
  console.log("🔨 Building web app...");
  execSync("yarn build", { stdio: "inherit" });

  console.log("📱 Syncing with iOS project...");
  execSync("npx cap sync ios", { stdio: "inherit" });

  console.log("✅ iOS build completed!");
  console.log('💡 Use "yarn ios:open" to open Xcode');
}

// 스크립트 실행
buildIOSApp();
