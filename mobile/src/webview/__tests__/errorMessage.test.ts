import { getErrorMessage } from '../errorMessage';

describe('getErrorMessage', () => {
  it('returns an offline message when the error looks like a network failure', () => {
    const message = getErrorMessage({
      code: -2,
      description: 'net::ERR_INTERNET_DISCONNECTED',
    });

    expect(message).toBe('인터넷 연결이 없습니다. 네트워크 상태를 확인한 후 다시 시도해 주세요.');
  });

  it('returns a generic message for other errors', () => {
    const message = getErrorMessage({
      code: -6,
      description: 'net::ERR_FILE_NOT_FOUND',
    });

    expect(message).toBe('페이지를 불러올 수 없습니다. 다시 시도해 주세요.');
  });
});
