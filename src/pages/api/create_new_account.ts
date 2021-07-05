import type { NextApiRequest, NextApiResponse } from 'next';
import { Validation, validateCredentials, validations } from './validity_checks';

interface CreateNewAccountParameters {
  username: string;
  password: string;
}

interface BooleanResult {
  result: boolean;
  errors?: Record<string, string>;
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
  res.status(200).json({ result: credentialCheck.result, errors: credentialCheck.errors });
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