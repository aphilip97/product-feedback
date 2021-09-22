import type { HamburgerProps } from '../../../types';
import styles from './index.module.sass';

const Hamburger: React.FC<HamburgerProps> = ({
  menuState,
  menuAnimStage,
  clickHandler,
}) => {

  return (
    <button
      data-open={menuState}
      data-animation-stage={menuAnimStage}
      disabled={menuAnimStage === 'middle'}
      className={styles['hamburger']}
      onClick={clickHandler}
    >
      <span aria-hidden='true'></span>
    </button>
  );

};

export default Hamburger;
