import React from 'react';
import styles from 'src/styles/create_account.module.scss';

const processMessageType = (errorCode): string => {
  let prefix = '';
  if (/^Bad/.test(errorCode) || /^Needs/.test(errorCode)) {
    prefix = 'Error';
  } else if (/^Success/.test(errorCode)) {
    prefix = 'Success';
  } else {
    prefix = 'Warning';
  }
  return prefix;
}

const Message = ({ errorCode, message }): React.ReactElement => {
  // const [text] = Object.values(message);
  // console.log(errorCode, message)
  const prefix = processMessageType(errorCode);
  return (
    <div className={styles[`${prefix}Message`]}>
      <li>{`${prefix}: ${message}`}</li>
    </div>
  )
};

export default Message;