import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Image, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { BackHandler } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import WebView, { WebViewNavigation } from 'react-native-webview';
import { getErrorMessage } from '../webview/errorMessage';
import { HIDE_CHROME_JS, FIX_MYPAGE_LAYOUT_JS, SUPPRESS_LOGIN_ALERTS_JS } from '../webview/injectedStyle';
import { SECTION_URLS } from '../constants/urls';

const HOMEPAGE_URL = 'https://ondream.co.kr/';

type Props = {
  url: string;
};

export default function WebViewScreen({ url }: Props) {
  const webviewRef = useRef<WebView>(null);
  const [canGoBack, setCanGoBack] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const isFocused = useIsFocused();

  function handleNavigationStateChange(navState: WebViewNavigation) {
    setCanGoBack(navState.canGoBack);
    if (navState.url === HOMEPAGE_URL && url !== SECTION_URLS.account) {
      webviewRef.current?.injectJavaScript(`window.location.href = ${JSON.stringify(SECTION_URLS.account)}; true;`);
    }
  }

  useEffect(() => {
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      if (isFocused && canGoBack) {
        webviewRef.current?.goBack();
        return true;
      }
      return false;
    });
    return () => subscription.remove();
  }, [isFocused, canGoBack]);

  function handleRetry() {
    setErrorMessage(null);
    webviewRef.current?.reload();
  }

  function handleLogout() {
    webviewRef.current?.injectJavaScript(`window.location.href = ${JSON.stringify(SECTION_URLS.logout)}; true;`);
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Image
          source={require('../../assets/header-logo.png')}
          style={styles.headerLogo}
          resizeMode="contain"
          testID="webview-header-logo"
        />
        <View style={styles.headerActions}>
          <TouchableOpacity
            onPress={() => webviewRef.current?.goBack()}
            disabled={!canGoBack}
            testID="webview-back-button"
          >
            <Text style={[styles.headerButton, !canGoBack && styles.headerButtonDisabled]}>뒤로</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => webviewRef.current?.reload()} testID="webview-refresh-button">
            <Text style={styles.headerButton}>새로고침</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleLogout} testID="webview-logout-button">
            <Text style={styles.headerButton}>로그아웃</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.webviewContainer}>
        <WebView
          ref={webviewRef}
          source={{ uri: url }}
          injectedJavaScript={HIDE_CHROME_JS + FIX_MYPAGE_LAYOUT_JS}
          injectedJavaScriptBeforeContentLoaded={SUPPRESS_LOGIN_ALERTS_JS}
          onNavigationStateChange={handleNavigationStateChange}
          onLoadStart={() => {
            setLoading(true);
            setErrorMessage(null);
          }}
          onLoadEnd={() => {
            setLoading(false);
            webviewRef.current?.injectJavaScript(HIDE_CHROME_JS);
            webviewRef.current?.injectJavaScript(FIX_MYPAGE_LAYOUT_JS);
          }}
          onError={(syntheticEvent) => {
            const { nativeEvent } = syntheticEvent;
            setErrorMessage(getErrorMessage({ code: nativeEvent.code, description: nativeEvent.description }));
          }}
          onHttpError={(syntheticEvent) => {
            const { nativeEvent } = syntheticEvent;
            setErrorMessage(
              getErrorMessage({ code: nativeEvent.statusCode, description: String(nativeEvent.statusCode) })
            );
          }}
        />

        {errorMessage && (
          <View style={styles.errorOverlay}>
            <Text style={styles.errorText}>{errorMessage}</Text>
            <TouchableOpacity onPress={handleRetry} testID="webview-retry-button">
              <Text style={styles.retryButton}>다시 시도</Text>
            </TouchableOpacity>
          </View>
        )}

        {loading && !errorMessage && (
          <View style={styles.loadingOverlay} pointerEvents="none">
            <ActivityIndicator size="large" />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  headerLogo: { width: 88, height: 24 },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  headerButton: { fontSize: 16, color: '#007AFF' },
  headerButtonDisabled: { color: '#C7C7CC' },
  webviewContainer: { flex: 1 },
  errorText: { fontSize: 16, textAlign: 'center', marginBottom: 16 },
  retryButton: { fontSize: 16, color: '#007AFF', fontWeight: '600' },
  errorOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#FFFFFF',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
