import type { Option, NextPageWithLayout } from '../../types';
import type { FormEventHandler } from 'react';
import { useRouter } from 'next/dist/client/router';
import { useState } from 'react';
import TextInput from '../components/TextInput';
import SingleSelect from '../components/SingleSelect';
import CustomTextArea from '../components/CustomTextArea';
import Button from '../components/Button';
import NewLayout from '../layouts/new';

interface NewFeedbackFormElements extends HTMLFormControlsCollection {
  titleInput: HTMLInputElement;
  detailInput: HTMLTextAreaElement;
}

interface NewFeedbackForm extends HTMLFormElement {
  readonly elements: NewFeedbackFormElements;
}

const New: NextPageWithLayout = () => {
  const router = useRouter();
  const [title, setTitle] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState('Feature');
  const [detail, setDetail] = useState<string>('');

  const [categories] = useState<Option[]>([
    { content: "Feature" },
    { content: "UI", acronym: true, expansion: 'User Interface' },
    { content: "UX", acronym: true, expansion: 'User Experience' },
    { content: "Enhancement" },
    { content: "Bug" },
  ]);

  const goBack = () => {
    router.back();
  };

  const handleCancel: FormEventHandler<
    HTMLFormElement
  > = () => {
    router.back();
  };

  const handleSubmit: FormEventHandler<
    NewFeedbackForm
  > = (evt) => {

    evt.preventDefault();

    const { currentTarget: { elements: {
      titleInput,
      detailInput,
    } } } = evt;

    const detailValid = detailInput.checkValidity();
    const titleValid = titleInput.checkValidity();

    if (!detailValid) {
      detailInput.focus();
    }

    if (!titleValid) {
      titleInput.focus();
    }

    if (titleValid && detailValid) {

      const options = {
        method: 'POST',
        body: JSON.stringify({
          title: title.trim(),
          category: selectedCategory,
          content: detail.trim(),
        }),
      };

      fetch('/api/p', options)
      .then(res => res.json())
      .catch(console.error)
      .finally(
        () => {
          setTitle('');
          setSelectedCategory('Feature');
          setDetail('');
          router.back();
        }
      );

    }

  };

  return (
    <>

      <nav>
        <button onClick={goBack} >Go Back</button>
      </nav>

      <form
        onSubmit={handleSubmit}
        onReset={handleCancel}
        noValidate
      >

        <h1>Create New Feedback</h1>

        <TextInput
          ident="title"
          value={title}
          setValue={setTitle}
        >
          <label htmlFor="title">Feedback Title</label>
          <p id="title-help">Add a short, descriptive headline</p>
        </TextInput>

        <SingleSelect
          entityName="category"
          items={categories}
          selectedItem={selectedCategory}
          setSelectedItem={setSelectedCategory}
        >
          <label id="category-select-label">Category</label>
          <p id="category-help">
            Choose a category for your feedback
          </p>
        </SingleSelect>

        <CustomTextArea
          ident="detail"
          value={detail}
          setValue={setDetail}
        >
          <label htmlFor="detail">Feedback Detail</label>
          <p id="detail-help">Include any specific comments on what should be improved, added, etc.</p>
        </CustomTextArea>

        <div role="presentation">
          <Button variant="primary-purple" type="submit">Add Feedback</Button>
          <Button variant="secondary" type="reset">Cancel</Button>
        </div>

      </form>

    </>
  );

};

New.getLayout = (page) => {
  return (
    <NewLayout>{page}</NewLayout>
  );
};

export default New;
