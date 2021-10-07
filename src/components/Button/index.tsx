import {
  ButtonHTMLAttributes,
  MouseEventHandler,
} from 'react';

import styles from './index.module.sass';

type ButtonProps = {

  variant: (
    'primary-purple'
    | 'primary-blue'
    | 'secondary'
    | 'danger'
  );

  type: ButtonHTMLAttributes<
    HTMLButtonElement
  >['type'];

  clickHandler?: MouseEventHandler<HTMLButtonElement>;

};

const Button: React.FC<ButtonProps> = ({
  variant,
  type,
  clickHandler,
  children,
}) => {

  const colorScheme: {
    [key: string]: string
  } = {};

  colorScheme[variant] = '';

  return (
    <button
      className={styles['button']}
      type={type}
      onClick={clickHandler}
      {...colorScheme}
    >
      {children}
    </button>
  );

};

export default Button;
