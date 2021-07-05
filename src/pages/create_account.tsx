import Head from 'next/head';
import { FormEvent } from 'react';
import styles from 'src/styles/create_account.module.scss';
import { validateCredentials, validations } from './api/validity_checks';

export default function CreateAccount() {
  async function handleSubmit(evt: FormEvent<HTMLFormElement>) {
    evt.preventDefault();

    const credentials = { username: evt.currentTarget.username.value, password: evt.currentTarget.password.value }
    // const username = evt.currentTarget.username.value;
    // const password = evt.currentTarget.password.value;

    console.log(credentials.username, credentials.password);

    const credentialsValid = validateCredentials(credentials, validations);

    if (credentialsValid.result) {
      const response = await fetch('/api/create_new_account', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });
      console.log(await response.json());
    } else {
      console.log('Errors detected', credentialsValid.errors);
    }
  }

  return (
    <>
      <Head>
        <title>Create Account</title>
      </Head>
      <article className={styles.article}>
        <form className={styles.form} onSubmit={handleSubmit}>
          <h1>Create New Account</h1>
          <label htmlFor="username">Username</label>
          <input type="text" name="username" placeholder="E.g. new_user1234"/>
          <label htmlFor="password">Password</label>
          <input type="password" name="password" placeholder="E.g. Donotusethispassword1000!"/>
          <button>Create Account</button>
        </form>
      </article>
    </>
  );
}
