import { getLocalIP, logNetworkInfo } from "./utils/network.js";
import { syncIOSProject, openXcode } from "./utils/capacitor.js";

/**
 * Live Reload 설정을 위한 기본 설정을 수행합니다.
 * Xcode를 열고 개발 서버 실행을 위한 준비를 합니다.
 */
function setupLiveReload() {
  const ip = getLocalIP();
  logNetworkInfo(ip);

  // iOS 프로젝트 동기화
  syncIOSProject();

  // Xcode 열기
  openXcode();

  console.log("🚀 Live Reload setup complete!");
  console.log(`💡 Use 'yarn ios:dev:live' to start with Live Reload`);
  console.log(
    `💡 Or manually: 'npx cap run ios --live-reload --host ${ip} --port 5173'`
  );
}

// 스크립트 실행
setupLiveReload();
