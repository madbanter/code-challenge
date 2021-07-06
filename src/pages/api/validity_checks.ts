import type { NextApiRequest, NextApiResponse } from 'next';

interface CreateNewAccountParameters {
  username: string;
  password: string;
}

interface BooleanResult {
  result: boolean;
  errors?: Record<string, string>;
}

export interface Validation<T> {
  check: (criterion: T) => boolean;
  field: string;
  errorName: string;
  error: string;
}

export const exposedPasswordCheck = async function(password: string): Promise<boolean> {
  const response = await fetch('http://localhost:3000/api/password_exposed', {
    method: 'POST',
    body: JSON.stringify({password}),
  })
  const resolved = await response.json()
  return resolved.result;
};

export const validateCredentials = (credentials: CreateNewAccountParameters, criteria: Validation<string>[]): BooleanResult => {
  const validityChecks = { result: true, errors: {} };
  for (const [key, value] of Object.entries(credentials)) {
    const checks = criteria.filter(criterion => criterion.field === key);
    const credentialResult = validateCredential(value, checks);
    validityChecks.result = validityChecks.result && credentialResult.result;
    validityChecks.errors = { ...validityChecks.errors, ...credentialResult.errors };
  }
  return validityChecks;
}

export const validateCredential = (credential: string, criteria: Validation<string>[]): BooleanResult => {
  const checkedResults = criteria.map(criterion => {
    const checkResult = criterion.check(credential);
    return (
      {
        result: checkResult,
        errors: checkResult ? null : { [criterion.errorName]: criterion.error }
      }
    )
  });
  let result = { result: checkedResults.every(checkedResult => checkedResult.result === true) } as BooleanResult;
  if (!result.result) {
    result.errors = {};
    checkedResults.filter(checkedResult => checkedResult.result === false).forEach(checkedResult => {
      for (const [errorName, error] of Object.entries(checkedResult.errors)) {
        result.errors[errorName] = error;
      }
    });
  }
  return result;
}

// const validateCredential = async (credential: string, criteria: Validation<string>[]): Promise<BooleanResult> => {
//   const results = criteria.map(async criterion => {
//     const checkResult = await criterion.check(credential);
//     return (
//       {
//         result: checkResult,
//         errors: checkResult ? null : { [criterion.errorName]: criterion.error }
//       }
//     )
//   });
//   await Promise.all(results).then(values => {
//     let result = { result: values.every(item => item.result === true) } as BooleanResult;
//     if (!result.result) {
//       result.errors = {};
//       values.filter(item => item.result === false).forEach(item => {
//         for (const [errorName, error] of Object.entries(item.errors)) {
//           result.errors[errorName] = error;
//         }
//       });
//     }
//     return result;
//   });
// }

export const usernameChecks = [
  {
    check: (username: string) => 10 <= username.length && username.length <= 50,
    field: 'username',
    errorName: 'BadUsernameLength',
    error: 'Username must be at least 10 and at most 50 characters long.'
  }
] as const;


// Add checks
// Fix async for API calls to password_exposed endpoint
export const passwordChecks = [
  {
    check: (password: string) => 20 <= password.length && password.length <= 50,
    field: 'password',
    errorName: 'BadPasswordLength',
    error: 'Password must be at least 20 and at most 50 characters long.'
  },
  {
    check: (password: string) => /[!@#$%]/.test(password),
    field: 'password',
    errorName: 'NeedsSymbol',
    error: 'Password must contain at least one symbol [!, @, #, $, or %].'
  },
  {
    check: (password: string) => /[a-zA-Z]/.test(password),
    field: 'password',
    errorName: 'NeedsLetter',
    error: 'Password must contain at least one letter [a-z or A-Z].'
  },
  {
    check: (password: string) => /\d/.test(password),
    field: 'password',
    errorName: 'NeedsNumber',
    error: 'Password must contain at least one number [0-9].'
  },
  // {
  //   check: exposedPasswordCheck,
  //   field: 'password',
  //   errorName: 'PasswordExposed',
  //   error: 'Password provided has been exposed! Please select another password.'
  // },
] as const;

export const validations = [...usernameChecks, ...passwordChecks];
