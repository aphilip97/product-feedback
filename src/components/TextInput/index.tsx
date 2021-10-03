import type {
  ChangeEventHandler,
  Dispatch,
  InputHTMLAttributes,
  SetStateAction,
} from 'react';

import { useState } from 'react';
import styles from './index.module.sass';

type TextInputProps = {
  ident: string;
  value: InputHTMLAttributes<HTMLInputElement>['value'];
  setValue: Dispatch<SetStateAction<string>>;
};

const TextInput: React.FC<
  TextInputProps
> = ({
  ident,
  value,
  setValue,
  children,
}) => {

  const [invalid, setInvalid] = useState(false);

  const handleChange: ChangeEventHandler<
    HTMLInputElement
  > = (evt) => {
    const { currentTarget: { value } } = evt;
    const val = value.trim();
    val.length === 0 ? setInvalid(true) : setInvalid(false);
    setValue(value);
  };

  return (
    <fieldset className={styles['text-input']}>
      {children}
      <input
        type="text"
        id={`${ident}Input`}
        name={`${ident}`}
        aria-describedby={`${ident}-help`}
        value={value}
        onChange={handleChange}
        autoComplete="off"
        required
        minLength={1}
        maxLength={50}
        onInvalid={() => setInvalid(true)}
        data-invalid={invalid}
      />
      <small role="alert">Can't be empty</small>
    </fieldset>
  );
};

export default TextInput;
