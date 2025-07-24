import os from "os";

/**
 * 현재 컴퓨터의 로컬 IP 주소를 가져옵니다.
 * @returns {string} IPv4 주소 또는 'localhost'
 */
export function getLocalIP() {
  const ifaces = os.networkInterfaces();

  for (const name of Object.keys(ifaces)) {
    for (const iface of ifaces[name]) {
      if (iface.family === "IPv4" && !iface.internal) {
        return iface.address;
      }
    }
  }

  return "localhost";
}

/**
 * Live Reload URL을 생성합니다.
 * @param {string} ip - IP 주소
 * @param {number} port - 포트 번호 (기본값: 5173)
 * @returns {string} Live Reload URL
 */
export function getLiveReloadURL(ip, port = 5173) {
  return `http://${ip}:${port}`;
}

/**
 * 현재 네트워크 정보를 출력합니다.
 * @param {string} ip - IP 주소
 * @param {number} port - 포트 번호 (기본값: 5173)
 */
export function logNetworkInfo(ip, port = 5173) {
  console.log(`🌐 Using IP address: ${ip}`);
  console.log(`📡 Live Reload URL: ${getLiveReloadURL(ip, port)}`);
}
