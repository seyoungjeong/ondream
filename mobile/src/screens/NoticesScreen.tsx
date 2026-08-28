import React from 'react';
import WebViewScreen from './WebViewScreen';
import { SECTION_URLS } from '../constants/urls';

export default function NoticesScreen() {
  return <WebViewScreen url={SECTION_URLS.notices} />;
}
