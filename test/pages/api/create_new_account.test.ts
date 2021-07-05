import { expect } from '@jest/globals';
import createNewAccount from 'src/pages/api/create_new_account';
import { mockRequest } from 'test/utils';

describe('/api/create_new_account', () => {
  test('returns true for valid username and password', async () => {
    const { req, res } = mockRequest({
      method: 'POST',
      body: {username: 'test_account2021', password: 'Anothertestpassword123!'},
    });

    await createNewAccount(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(res._getJSONData()).toEqual({
      result: true,
      errors: {}
    });
  });

  test('returns false with errors for empty username and password', async () => {
    const { req, res } = mockRequest({
      method: 'POST',
      body: {},
    });

    await createNewAccount(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(res._getJSONData()).toEqual({
      result: false,
      errors: {
        "BadPasswordLength": "Password must be at least 20 and at most 50 characters long.",
        "BadUsernameLength": "Username must be at least 10 and at most 50 characters long.",
        "NeedsLetter": "Password must contain at least one letter [a-z or A-Z].",
        "NeedsNumber": "Password must contain at least one number [0-9].",
        "NeedsSymbol": "Password must contain at least one symbol [!, @, #, $, or %].",
      }
    });
  });

  test('returns false with errors for too short username and password', async () => {
    const { req, res } = mockRequest({
      method: 'POST',
      body: {username: 'test', password: 'test123!'},
    });

    await createNewAccount(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(res._getJSONData()).toEqual({
      result: false,
      errors: {
        "BadPasswordLength": "Password must be at least 20 and at most 50 characters long.",
        "BadUsernameLength": "Username must be at least 10 and at most 50 characters long.",
      }
    });
  });

    test('returns false with errors for too long username and password', async () => {
    const { req, res } = mockRequest({
      method: 'POST',
      body: {
        username: 'test12345678901234567890123456789012345678901234567890',
        password: 'tst!12345678901234567890123456789012345678901234567890'
      },
    });

    await createNewAccount(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(res._getJSONData()).toEqual({
      result: false,
      errors: {
        "BadPasswordLength": "Password must be at least 20 and at most 50 characters long.",
        "BadUsernameLength": "Username must be at least 10 and at most 50 characters long.",
      }
    });
  });

  test('returns false with error and 404 status for request methods other than POST', async () => {
    const { req, res } = mockRequest({
      method: 'GET',
      body: {username: 'test_account2021', password: 'Anothertestpassword123!'},
    });

    await createNewAccount(req, res);

    expect(res._getStatusCode()).toBe(404);
    expect(res._getJSONData()).toEqual({
      result: false,
      errors: {
        "BadRequestMethod": "The /create_new_account endpoint only supports POST requests.",
      }
    });
  });

  test('returns false with error password lacking letters', async () => {
    const { req, res } = mockRequest({
      method: 'POST',
      body: {username: 'testaccount500', password: '123456789123456789!!'},
    });

    await createNewAccount(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(res._getJSONData()).toEqual({
      result: false,
      errors: {
        "NeedsLetter": "Password must contain at least one letter [a-z or A-Z]."
      }
    });
  });

  test('returns false with error password lacking numbers', async () => {
    const { req, res } = mockRequest({
      method: 'POST',
      body: {username: 'testaccount500', password: 'ABCDEFGHIJKLMNOPQRS!'},
    });

    await createNewAccount(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(res._getJSONData()).toEqual({
      result: false,
      errors: {
        "NeedsNumber": "Password must contain at least one number [0-9].",
      }
    });
  });

  test('returns false with error password lacking symbols', async () => {
    const { req, res } = mockRequest({
      method: 'POST',
      body: {username: 'testaccount500', password: 'ABCDEFGHIJKLMNOPQRS8'},
    });

    await createNewAccount(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(res._getJSONData()).toEqual({
      result: false,
      errors: {
        "NeedsSymbol": "Password must contain at least one symbol [!, @, #, $, or %].",
      }
    });
  });
});
