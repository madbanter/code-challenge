import type { NextApiRequest, NextApiResponse } from 'next';

interface CreateNewAccountParameters {
  username: string;
  password: string;
}

interface BooleanResult {
  result: boolean;
  errors?: Record<string, string>;
}

interface Validation<T> {
  check: (criterion: T) => boolean;
  field: string;
  errorName: string;
  error: string;
}

const exposedPasswordCheck = async function(password: string) {
  const response = await fetch('http://localhost:3000/api/password_exposed', {
    method: 'POST',
    body: JSON.stringify({password}),
  })
  const resolved = await response.json()
  // return resolved.result === false;
  const test = resolved.result === false;
  console.log(test)
  return test
};

export default function createNewAccount(req: NextApiRequest, res: NextApiResponse<BooleanResult>) {
  const body = JSON.parse(req.body);
  const credentials = {
    username: body.username || '',
    password: body.password || ''
  } as const;
  const credentialCheck = validateCredentials(credentials, validations);
  res.status(200).json({ result: credentialCheck.result, errors: { ...credentialCheck.errors } });
}


// Refactor to general case iterating over credentials (not having to have separate validateUsername and validatePassword functions)
const validateCredentials = (credentials: CreateNewAccountParameters, criteria: Validation<string>[]): BooleanResult => {
  const usernameValidity = validateUsername(credentials.username, criteria.filter(criterion => criterion.field === 'username'));
  const passwordValidity = validatePassword(credentials.password, criteria.filter(criterion => criterion.field === 'password'));
  return {
    result: usernameValidity.result && passwordValidity.result,
    errors: { ...usernameValidity?.errors, ...passwordValidity?.errors }
  }
}

const validateUsername = (username: string, criteria: Validation<string>[]): BooleanResult => {
  const results = criteria.map(criterion => {
    const checkResult = criterion.check(username);
    return (
      {
        result: checkResult,
        errors: checkResult ? null : { [criterion.errorName]: criterion.error }
      }
    )
  });
  let result = { result: results.every(item => item.result === true) } as BooleanResult;
  if (!result.result) {
    result.errors = {};
    results.filter(item => item.result === false).forEach(item => {
      for (const [errorName, error] of Object.entries(item.errors)) {
        result.errors[errorName] = error;
      }
    });
  }
  return result;
}

const validatePassword = (password: string, criteria: Validation<string>[]): BooleanResult => {
  const results = criteria.map(criterion => {
    const checkResult = criterion.check(password);
    return (
      {
        result: checkResult,
        errors: checkResult ? null : { [criterion.errorName]: criterion.error }
      }
    )
  });
  let result = { result: results.every(item => item.result === true) } as BooleanResult;
  if (!result.result) {
    result.errors = {};
    results.filter(item => item.result === false).forEach(item => {
      for (const [errorName, error] of Object.entries(item.errors)) {
        result.errors[errorName] = error;
      }
    });
  }
  return result;
}

const usernameChecks = [
  {
    check: (username: string) => 10 <= username.length && username.length <= 50,
    field: 'username',
    errorName: 'BadUsernameLength',
    error: 'Username must be at least 10 and at most 50 characters long.'
  }
] as const;


// Add checks
// Fix async for API calls to password_exposed endpoint
const passwordChecks = [
  {
    check: (password: string) => 20 <= password.length && password.length <= 50,
    field: 'password',
    errorName: 'BadPasswordLength',
    error: 'Password must be at least 20 and at most 50 characters long.'
  },
  // {
  //   check: exposedPasswordCheck,
  //   field: 'password',
  //   errorName: 'PasswordExposed',
  //   error: 'Password provided has been exposed! Please select another password.'
  // },
] as const;

const validations = [...usernameChecks, ...passwordChecks];
