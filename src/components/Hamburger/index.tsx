import { Dispatch, SetStateAction, useState } from 'react';
import styles from './index.module.sass';

type HamburgerProps = {
  open: boolean;
  clickHandler: Dispatch<SetStateAction<boolean>>;
};

const Hamburger: React.FC<HamburgerProps> = ({
  open,
  clickHandler: setOpen
}) => {

  type AnimationStage = 'start' | 'middle' | 'end';

  const [animStage, setAnimStage] = useState<AnimationStage>('start');

  const getAnimationStageOrder = (): [
    AnimationStage,
    AnimationStage,
    AnimationStage
  ] => {
    if (!open) return ['start', 'middle', 'end'];
    return ['end', 'middle', 'start'];
  };

  const clickHandler = () => {
    const order = getAnimationStageOrder();
    setAnimStage(order[0]);
    setTimeout(() => {
      setAnimStage(order[1]);
      setTimeout(() => {
        setAnimStage(order[2]);
        setOpen(!open);
      }, 300);
    }, 150);
  };

  return (
    <button
      data-open={open}
      data-animation-stage={animStage}
      className={styles['hamburger']}
      onClick={clickHandler}
    >
      <span aria-hidden='true'></span>
    </button>
  );

};

export default Hamburger;
