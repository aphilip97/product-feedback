import {
  JSXElementConstructor,
  ReactElement,
  useEffect,
  useState,
} from 'react';

import styles from './index.module.sass';

type EditLayout = {
  children: ReactElement<
    any,
    string | JSXElementConstructor<any>
  >;
};

const EditLayout: React.FC<EditLayout> = ({ children }) => {

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
      className={`${styles.edit} ${styles[transitionStage]}`}
    >
      {displayChildren}
    </div>
  );

};

export default EditLayout;
