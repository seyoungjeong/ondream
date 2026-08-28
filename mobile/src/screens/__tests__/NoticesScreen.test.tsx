import React from 'react';
import { render } from '@testing-library/react-native';
import NoticesScreen from '../NoticesScreen';
import WebViewScreen from '../WebViewScreen';
import { SECTION_URLS } from '../../constants/urls';

jest.mock('../WebViewScreen', () => jest.fn(() => null));

describe('NoticesScreen', () => {
  it('renders WebViewScreen with the notices url', async () => {
    await render(<NoticesScreen />);
    expect(WebViewScreen).toHaveBeenCalledWith(expect.objectContaining({ url: SECTION_URLS.notices }), undefined);
  });
});
