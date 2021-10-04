import type {
  Dispatch,
  SetStateAction,
} from 'react';

import type {
  Option,
} from '../../../types';

import CategoryTag from '../CategoryTag';

import styles from './index.module.sass';

type CategoryFilter = {
  activeFilter: number;
  changeFilter: Dispatch<SetStateAction<number>>;
}

const CategoryFilter: React.FC<CategoryFilter> = ({
  activeFilter,
  changeFilter
}) => {

  const hardcodedCategories: Option[] = [
    {
      content: "UI",
      acronym: true,
      expansion: 'User Interface',
    },
    {
      content: "UX",
      acronym: true,
      expansion: 'User Experience',
    },
    {
      content: "Enhancement",
    },
    {
      content: "Bug",
    },
    {
      content: "Feature",
    },
  ];

  const createClickHandler = (index: number) => () => {
    changeFilter(index);
  };

  return (
    <div role='presentation' className={styles['container']}>
      <CategoryTag
        active={0 === activeFilter}
        clickHandler={createClickHandler(0)}
      >
        All
      </CategoryTag>
      {hardcodedCategories.map((category, index) => {
        return (
          <CategoryTag
            key={index}
            active={(index + 1) === activeFilter}
            clickHandler={createClickHandler(index + 1)}
          >
            {
              category.acronym
              ?
                <abbr title={category.expansion}>
                  {category.content}
                </abbr>
              :
                category.content
            }
          </CategoryTag>
        );
      })}
    </div>
  );

};

export default CategoryFilter;
