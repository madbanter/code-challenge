import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import fetchMock from 'jest-fetch-mock';
import React from 'react'
import CreateAccount from 'src/pages/create_account';
import { validateCredentials, validations, exposedPasswordCheck } from '../../src/pages/api/validity_checks';

describe('CreateAccount', () => {
  beforeEach(() => {
    fetchMock.enableMocks();
  });

  afterEach(() => {
    fetchMock.resetMocks();
  });

  test('rendering', () => {
    render(<CreateAccount />);
    fetchMock.mockResponseOnce(JSON.stringify({}));
    const usernameField = screen.getByRole('textbox');
    const passwordField = screen.getByLabelText('Password');
    const form = screen.getByRole('form');
    userEvent.type(usernameField, 'myusername');
    userEvent.type(passwordField, 'Donotusethispassword1000!');
    expect(form).toHaveFormValues({username: 'myusername', password: 'Donotusethispassword1000!'})
    fireEvent.submit(form);
    expect(screen.getAllByRole('listitem')).toHaveLength(1);
    expect(fetchMock).toBeCalledTimes(1);
    expect(fetchMock).toBeCalledWith('/api/create_new_account', {
      body: '{}',
      method: 'POST',
    });
  });
});
