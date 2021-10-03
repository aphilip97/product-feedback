import { ButtonHTMLAttributes, MouseEventHandler } from 'react';
import styles from './index.module.sass';

type ButtonProps = {
  variant: 'primary-purple' | 'primary-blue' | 'secondary' | 'danger';
  type: ButtonHTMLAttributes<HTMLButtonElement>['type']
};

const Button: React.FC<ButtonProps> = ({
  children,
  variant,
  type,
}) => {

  const colorScheme: {
    [key: string]: string
  } = {};

  colorScheme[variant] = '';

  return (
    <button
      className={styles['button']}
      type={type}
      {...colorScheme}
    >
      {children}
    </button>
  );

};

export default Button;
