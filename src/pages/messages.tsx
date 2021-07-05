import React from 'react';
import styles from 'src/styles/create_account.module.scss';

const processClass = (errorCode): string => {
  let prefix = '';
  if (/^Bad/.test(errorCode) || /^Needs/.test(errorCode)) {
    prefix = 'red';
  } else if (/^Success/.test(errorCode)) {
    prefix = 'green';
  } else {
    prefix = 'yellow';
  }
  return styles[`${prefix}Message`];
}

const Message = ({ errorCode, message }): React.ReactElement => {
  // const [text] = Object.values(message);
  // console.log(errorCode, message)
  return (
    <li className={processClass(errorCode)}>{message}</li>
  )
};

export default Message;