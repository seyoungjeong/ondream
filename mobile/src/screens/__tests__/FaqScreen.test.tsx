import React from 'react';
import { render } from '@testing-library/react-native';
import FaqScreen from '../FaqScreen';
import WebViewScreen from '../WebViewScreen';
import { SECTION_URLS } from '../../constants/urls';

jest.mock('../WebViewScreen', () => jest.fn(() => null));

describe('FaqScreen', () => {
  it('renders WebViewScreen with the faq url', async () => {
    await render(<FaqScreen />);
    expect(WebViewScreen).toHaveBeenCalledWith(expect.objectContaining({ url: SECTION_URLS.faq }), undefined);
  });
});
