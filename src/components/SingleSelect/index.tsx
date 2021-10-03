import type {
  Dispatch,
  KeyboardEventHandler,
  SetStateAction,
} from 'react';

import type {
  AnimationStage,
  Option
} from '../../../types';

import { useState } from 'react';
import styles from './index.module.sass';

type SingleSelectProps = {
  items: Option[];
  selectedItem: Option['content'];
  setSelectedItem: Dispatch<
    SetStateAction<
      Option['content']
    >
  >;
  entityName: 'category' | 'progress'
};

const SingleSelect: React.FC<SingleSelectProps> = ({
  items,
  selectedItem,
  setSelectedItem,
  entityName,
  children,
}) => {

  const [
    open, setOpen
  ] = useState(false);

  const [
    listAnimStage, setListAnimStage
  ] = useState<AnimationStage>('start');

  const openList = () => {
    setListAnimStage('middle');
    setListAnimStage('end');
    setTimeout(() => {
      setOpen(!open);
    }, 200);
  };

  const closeList = () => {
    setListAnimStage('middle');
    setTimeout(() => {
      setListAnimStage('start');
      setOpen(!open);
    }, 200);
  };

  const toggleList = () => {
    if (listAnimStage === 'start') {
      openList();
    } else if (listAnimStage === 'end') {
      closeList();
    }
  };

  const changeSelectionTo = (content: Option['content']) => {
    setSelectedItem(content);
    if (open && listAnimStage === 'end') {
      closeList();
    }
  };

  const disableKeyboardScrolling: KeyboardEventHandler<
    HTMLButtonElement
  > = (evt) => {
    switch (evt.key) {
      case 'ArrowUp':
      case 'ArrowDown':
        if (open) evt.preventDefault();
        break;
      default: break;
    }
  };

  const keyUpHandler: KeyboardEventHandler<
    HTMLButtonElement
  > = (evt) => {

    if (!open) return;
    evt.preventDefault();

    switch (evt.key) {
      case 'ArrowDown':
        for (let i = 0; i < items.length; i++) {
          if (items[i].content === selectedItem) {
            if (i === items.length - 1) break;
            setSelectedItem(items[i + 1].content);
          }
        }
        break;
      case 'ArrowUp':
        for (let i = 0; i < items.length; i++) {
          if (items[i].content === selectedItem) {
            if (i === 0) break;
            setSelectedItem(items[i - 1].content);
          }
        }
        break;
      case 'Escape': closeList(); break;
      default: break;
    }

  };

  return (
    <fieldset className={styles['single-select']}>
      {children}
      <button
        type="button"
        id={entityName}
        aria-haspopup="listbox"
        aria-labelledby={`${entityName}-select-label`}
        aria-describedby={`${entityName}-help`}
        data-anim-stage={listAnimStage}
        onClick={toggleList}
        onBlur={() => open && toggleList()}
        onKeyDown={disableKeyboardScrolling}
        onKeyUp={keyUpHandler}
      >
        {selectedItem}
      </button>
      <ul
        id={`${entityName}-list`}
        role="listbox"
        data-anim-stage={listAnimStage}
        aria-activedescendant={
          `${entityName}-${selectedItem.toLowerCase()}`
        }
      >
        {
          items.map(
            ({ content, acronym, expansion }, index) => {
              return (
                <li
                  key={`${entityName}-${index}`}
                  id={
                    `${entityName}-${content.toLowerCase()}`
                  }
                  role='option'
                  aria-selected={content === selectedItem}
                  onClick={() => changeSelectionTo(content)}
                >
                  {
                    acronym ? (
                      <abbr
                        title={expansion}
                      >{content}</abbr>
                    ) : (
                      <span
                      >{content}</span>
                    )
                  }
                </li>
              );
            }
          )
        }
      </ul>
    </fieldset>
  );
};

export default SingleSelect;
