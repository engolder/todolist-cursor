import { getLocalIP, logNetworkInfo } from "./utils/network.js";
import { execSync } from "child_process";

/**
 * iOS Live Reload를 자동으로 실행합니다.
 */
function setupLiveReload() {
  const ip = getLocalIP();
  logNetworkInfo(ip);
  const port = 5173;
  const scheme = "App";

  // iOS 프로젝트 동기화
  console.log("🔄 Syncing iOS project (cap sync ios)...");
  execSync("npx cap sync ios", { stdio: "inherit" });

  // Live Reload로 iOS 앱 실행
  console.log("📱 Starting iOS app with Live Reload...");
  execSync(
    `npx cap run ios --live-reload --host ${ip} --port ${port} --scheme ${scheme}`,
    { stdio: "inherit" }
  );

  console.log("🚀 iOS Live Reload started automatically!");
}

// 스크립트 실행
setupLiveReload();
