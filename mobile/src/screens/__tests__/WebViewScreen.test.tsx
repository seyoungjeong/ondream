import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import WebViewScreen from '../WebViewScreen';

let capturedOnError: ((event: any) => void) | undefined;
let mockReload = jest.fn();
let mockInjectJavaScript = jest.fn();

jest.mock('react-native-webview', () => {
  const RN = require('react');
  const MockWebView = RN.forwardRef((props: any, ref: any) => {
    capturedOnError = props.onError;
    RN.useImperativeHandle(ref, () => ({
      reload: mockReload,
      goBack: jest.fn(),
      injectJavaScript: mockInjectJavaScript,
    }));
    return null;
  });
  return { __esModule: true, default: MockWebView };
});

describe('WebViewScreen', () => {
  beforeEach(() => {
    mockReload = jest.fn();
    mockInjectJavaScript = jest.fn();
  });

  it('shows the error message and a working retry button after a load failure', async () => {
    const { getByText, getByTestId } = await render(<WebViewScreen url="https://example.com" />);

    await act(async () => {
      capturedOnError?.({
        nativeEvent: { code: -2, description: 'net::ERR_INTERNET_DISCONNECTED' },
      });
    });

    expect(getByText('인터넷 연결이 없습니다. 네트워크 상태를 확인한 후 다시 시도해 주세요.')).toBeTruthy();

    await fireEvent.press(getByTestId('webview-retry-button'));

    expect(mockReload).toHaveBeenCalledTimes(1);
  });

  it('shows the header logo', async () => {
    const { getByTestId } = await render(<WebViewScreen url="https://example.com" />);

    expect(getByTestId('webview-header-logo')).toBeTruthy();
  });

  it('navigates to the logout url when the logout button is pressed', async () => {
    const { getByTestId } = await render(<WebViewScreen url="https://example.com" />);

    await fireEvent.press(getByTestId('webview-logout-button'));

    expect(mockInjectJavaScript).toHaveBeenCalledTimes(1);
    expect(mockInjectJavaScript.mock.calls[0][0]).toContain('https://ondream.co.kr/member/logout');
  });
});
