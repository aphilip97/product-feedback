import type {
  ChangeEventHandler,
  Dispatch,
  SetStateAction,
  TextareaHTMLAttributes,
} from 'react';

import {
  useState,
} from 'react';

import styles from './index.module.sass';

type CustomTextAreaProps = {

  ident: string;

  value: TextareaHTMLAttributes<
    HTMLTextAreaElement
  >['value'];

  setValue: Dispatch<
    SetStateAction<
      string
    >
  >;

  placeholder?: TextareaHTMLAttributes<
    HTMLTextAreaElement
  >['placeholder'];

};

const CustomTextArea: React.FC<
  CustomTextAreaProps
> = ({
  ident,
  value,
  setValue,
  placeholder,
  children,
}) => {

  const [invalid, setInvalid] = useState(false);

  const handleChange: ChangeEventHandler<
    HTMLTextAreaElement
  > = (evt) => {
    const { currentTarget: { value } } = evt;
    const val = value.trim();
    val.length === 0 ? setInvalid(true) : setInvalid(false);
    setValue(value);
  };

  return (
    <fieldset className={styles['custom-text-area']}>
      {children}
      <textarea
        id={`${ident}Input`}
        name={`${ident}`}
        aria-describedby={`${ident}-help`}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        required
        minLength={1}
        maxLength={250}
        onInvalid={() => setInvalid(true)}
        data-invalid={invalid}
      />
      <span>
        <small className={styles['error']} role="alert">
          Can't be empty
        </small>
      </span>
    </fieldset>
  );
};

export default CustomTextArea;
