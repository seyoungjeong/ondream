import React from 'react';
import { render } from '@testing-library/react-native';
import BoardScreen from '../BoardScreen';
import WebViewScreen from '../WebViewScreen';
import { SECTION_URLS } from '../../constants/urls';

jest.mock('../WebViewScreen', () => jest.fn(() => null));

describe('BoardScreen', () => {
  it('renders WebViewScreen with the board url', async () => {
    await render(<BoardScreen />);
    expect(WebViewScreen).toHaveBeenCalledWith(expect.objectContaining({ url: SECTION_URLS.board }), undefined);
  });
});
