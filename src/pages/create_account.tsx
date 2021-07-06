import Head from 'next/head';
import { FormEvent, useState, useEffect } from 'react';
import styles from 'src/styles/create_account.module.scss';
import Image from 'next/image'
import { validateCredentials, validations, exposedPasswordCheck } from './api/validity_checks';
import Message from './messages';

export default function CreateAccount() {
  const [messages, setMessages] = useState([]);

  async function handleSubmit(evt: FormEvent<HTMLFormElement>) {
    evt.preventDefault();

    const credentials = { username: evt.currentTarget.username.value, password: evt.currentTarget.password.value }
    let credentialsValid = validateCredentials(credentials, validations);
    let messageList: [string, string][];
    let additionalMessageList = [];

    const pwExposed = await exposedPasswordCheck(credentials.password);
    if (pwExposed) {
      additionalMessageList.push(['ExposedPassword', 'This password has been flagged as exposed!']);
    }

    if (credentialsValid.result) {
      const response = await fetch('/api/create_new_account', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });
      credentialsValid = await response.json()
      if (credentialsValid.result) {
        messageList = [['Success', 'Account created successfully!']];
      } else {
        messageList = Object.entries(credentialsValid.errors);
      }
    } else {
      messageList = Object.entries(credentialsValid.errors);
    }
    setMessages([...messageList, ...additionalMessageList]);
  }

  return (
    <>
      <Head>
        <title>Create Account</title>
      </Head>
      <article className={styles.article}>
        <form className={styles.form} onSubmit={handleSubmit} aria-label="form">
          <Image src="/Wealthfront_Logo.svg" alt="wealthfront logo" width="64" height="64" />
          <h1>Create New Account</h1>
          <ul aria-label="messages">
            {messages.map((item) => <Message key={item[0]} errorCode={item[0]} message={item[1]}/>)}
          </ul>
          <label htmlFor="username">Username</label>
          <input type="text" name="username" id="username" placeholder="E.g. new_user1234"/>
          <label htmlFor="password">Password</label>
          <input type="password" name="password" id="password" placeholder="E.g. Donotusethispassword1000!"/>
          <button type="submit" className={styles.createAccountButton}>Create Account</button>
        </form>
      </article>
    </>
  );
}
