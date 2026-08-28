import React from 'react';
import WebViewScreen from './WebViewScreen';
import { SECTION_URLS } from '../constants/urls';

export default function BoardScreen() {
  return <WebViewScreen url={SECTION_URLS.board} />;
}
