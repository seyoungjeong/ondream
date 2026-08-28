import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Linking } from 'react-native';
import CounselingScreen from '../CounselingScreen';

describe('CounselingScreen', () => {
  it('opens the phone dialer with the 1388 hotline number when the call button is pressed', async () => {
    const openURLSpy = jest.spyOn(Linking, 'openURL').mockResolvedValue(true as never);

    const { getByTestId } = await render(<CounselingScreen />);
    await fireEvent.press(getByTestId('counseling-call-button'));

    expect(openURLSpy).toHaveBeenCalledWith('tel:1388');
  });
});
