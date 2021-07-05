import Head from 'next/head';
import { FormEvent, useState, useEffect } from 'react';
import styles from 'src/styles/create_account.module.scss';
import { validateCredentials, validations } from './api/validity_checks';

export default function CreateAccount() {
  const [messages, setMessages] = useState([]);
  async function handleSubmit(evt: FormEvent<HTMLFormElement>) {
    evt.preventDefault();

    const credentials = { username: evt.currentTarget.username.value, password: evt.currentTarget.password.value }
    let credentialsValid = validateCredentials(credentials, validations);
    let messageList: string[];

    if (credentialsValid.result) {
      const response = await fetch('/api/create_new_account', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });
      credentialsValid = await response.json()
      if (credentialsValid.result) {
        messageList = ['Account created successfully!'];
      } else {
        messageList = Object.values(credentialsValid.errors);
      }
    } else {
      messageList = Object.values(credentialsValid.errors);
    }
    setMessages(messageList);
  }

  return (
    <>
      <Head>
        <title>Create Account</title>
      </Head>
      <article className={styles.article}>
        <form className={styles.form} onSubmit={handleSubmit}>
          <h1>Create New Account</h1>
          <ul>
            {messages.map((message) =>
              <li>{message}</li>
            )}
          </ul>
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
