import { execSync } from "child_process";

/**
 * iOS 프로젝트를 동기화합니다.
 */
export function syncIOSProject() {
  console.log("📱 Syncing iOS project...");
  execSync("npx cap copy ios", { stdio: "inherit" });
}

/**
 * Xcode를 엽니다.
 */
export function openXcode() {
  console.log("🔧 Opening Xcode...");
  execSync("npx cap open ios", { stdio: "inherit" });
}

/**
 * Live Reload 모드로 iOS 앱을 실행합니다.
 * @param {string} ip - IP 주소
 * @param {number} port - 포트 번호 (기본값: 5173)
 * @param {string} scheme - iOS 스키마 (기본값: 'App')
 */
export function runIOSWithLiveReload(ip, port = 5173, scheme = "App") {
  console.log("📱 Starting iOS app with Live Reload...");
  execSync(
    `npx cap run ios --live-reload --host ${ip} --port ${port} --scheme ${scheme}`,
    { stdio: "inherit" }
  );
}

/**
 * iOS 앱을 빌드 기반으로 실행합니다.
 * @param {string} scheme - iOS 스키마 (기본값: 'App')
 */
export function runIOSWithBuild(scheme = "App") {
  console.log("📱 Starting iOS app with build...");
  execSync(`npx cap run ios --scheme ${scheme}`, { stdio: "inherit" });
}
