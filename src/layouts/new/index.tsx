import {
  JSXElementConstructor,
  ReactElement,
  useEffect,
  useState,
} from 'react';

import styles from './index.module.sass';

type NewLayout = {
  children: ReactElement<
    any,
    string | JSXElementConstructor<any>
  >;
};

const NewLayout: React.FC<NewLayout> = ({ children }) => {

  const [
    displayChildren,
    setDisplayChildren,
  ] = useState(children);

  const [
    transitionStage,
    setTransitionStage,
  ] = useState('fadeOut');

  useEffect(() => {
    setTransitionStage('fadeIn');
  }, []);

  useEffect(() => {
    if (
      typeof children.type === 'function'
      && typeof displayChildren.type === 'function'
      && children.type.name !== displayChildren.type.name
    ) {
      setTransitionStage('fadeout');
    }
  }, [children, displayChildren]);

  return (
    <div
      role='presentation'
      onTransitionEnd={() => {
        if (transitionStage === 'fadeOut') {
          setDisplayChildren(children);
          setTransitionStage('fadeIn');
        }
      }}
      className={`${styles.new} ${styles[transitionStage]}`}
    >
      {displayChildren}
    </div>
  );

};

export default NewLayout;
