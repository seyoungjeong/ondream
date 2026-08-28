export type WebViewErrorInfo = {
  code: number;
  description: string;
};

export function getErrorMessage(error: WebViewErrorInfo): string {
  const looksOffline = error.code === -2 || error.description.toLowerCase().includes('disconnected');

  if (looksOffline) {
    return '인터넷 연결이 없습니다. 네트워크 상태를 확인한 후 다시 시도해 주세요.';
  }

  return '페이지를 불러올 수 없습니다. 다시 시도해 주세요.';
}
