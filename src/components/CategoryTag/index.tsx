import styles from './index.module.sass';

type CategoryTagProps = {
  active?: boolean;
  clickHandler?: () => void;
};

const CategoryTag: React.FC<CategoryTagProps> = ({
  children,
  active,
  clickHandler,
}) => {
  return (
    <button
      className={styles['category']}
      data-active={active}
      onClick={clickHandler}
    >
      {children}
    </button>
  );
};

export default CategoryTag;
