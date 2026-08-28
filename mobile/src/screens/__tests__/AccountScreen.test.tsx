import React from 'react';
import { render } from '@testing-library/react-native';
import AccountScreen from '../AccountScreen';
import WebViewScreen from '../WebViewScreen';
import { SECTION_URLS } from '../../constants/urls';

jest.mock('../WebViewScreen', () => jest.fn(() => null));

describe('AccountScreen', () => {
  it('renders WebViewScreen with the account url', async () => {
    await render(<AccountScreen />);
    expect(WebViewScreen).toHaveBeenCalledWith(expect.objectContaining({ url: SECTION_URLS.account }), undefined);
  });
});
