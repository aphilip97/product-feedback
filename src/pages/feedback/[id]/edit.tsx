import type {
  NextPageWithLayout,
  Option,
  FeedbackForm,
  PatchBody,
} from '../../../../types';

import type {
  FormEventHandler,
  MouseEventHandler,
  ReactElement,
} from 'react';

import type {
  Feedback,
} from '@prisma/client';

import {
  useRouter,
} from 'next/router';

import {
  GetServerSideProps,
  Redirect,
} from 'next';

import {
  useState,
} from 'react';

import db from '../../../lib/prisma';

import TextInput from '../../../components/TextInput';
import SingleSelect from '../../../components/SingleSelect';
import CustomTextArea from '../../../components/CustomTextArea';
import Button from '../../../components/Button';

import EditLayout from '../../../layouts/edit';

type EditPageProps = {
  post: Feedback;
};

type EditPageQueryParams = {
  id: string;
}

const Edit: NextPageWithLayout<EditPageProps> = ({ post }) => {

  const router = useRouter();

  const [title, setTitle] = useState<string>(post.title);
  const [category, setCategory] = useState(post.category);
  const [status, setStatus] = useState(post.status);
  const [detail, setDetail] = useState<string>(post.content);

  const [categories] = useState<Option[]>([
    {
      content: "UI",
      acronym: true,
      expansion: 'User Interface'
    },
    {
      content: "UX",
      acronym: true,
      expansion: 'User Experience'
    },
    {
      content: "Enhancement"
    },
    {
      content: "Bug"
    },
    {
      content: "Feature"
    },
  ]);

  const [statuses] = useState<Option[]>([
    {
      content: "Suggestion",
    },
    {
      content: "Planned",
    },
    {
      content: "In-Progress"
    },
    {
      content: "Live"
    },
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
    FeedbackForm
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

      const _title = title.trim();
      const _detail = detail.trim();

      const body: PatchBody = {};

      if (_title !== post.title) body.title = _title;
      if (category !== post.category) body.category = category;
      if (status !== post.status) body.status = status;
      if (_detail !== post.content) body.content = _detail;

      const changed = Object.keys(body).length !== 0;

      if (!changed) {
        return;
      }

      const options = {
        method: 'PATCH',
        body: JSON.stringify(body),
      };

      fetch(`/api/feedback/${post.id}`, options)
      .then(res => res.json())
      .catch(console.error)
      .finally(() => router.back());

    }

  };

  const handleDelete: MouseEventHandler<
    HTMLButtonElement
  > = (evt) => {

    const options = {
      method: 'DELETE',
    };

    fetch(`/api/feedback/${post.id}`, options)
    .then(res => res.json())
    .catch(console.error)
    .finally(() => router.back());

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

        <h1>Editing '{post.title}'</h1>

        <TextInput
          ident="title"
          value={title}
          setValue={setTitle}
        >
          <label htmlFor="title">Feedback Title</label>
          <p id="title-help">
            Add a short, descriptive headline
          </p>
        </TextInput>

        <SingleSelect
          entityName="category"
          items={categories}
          selectedItem={category}
          setSelectedItem={setCategory}
        >
          <label id="category-select-label">Category</label>
          <p id="category-help">
            Choose a category for your feedback
          </p>
        </SingleSelect>

        <SingleSelect
          entityName="status"
          items={statuses}
          selectedItem={status}
          setSelectedItem={setStatus}
        >
          <label id="status-select-label">Update status</label>
          <p id="status-help">
            Change feedback state
          </p>
        </SingleSelect>

        <CustomTextArea
          ident="detail"
          value={detail}
          setValue={setDetail}
        >
          <label htmlFor="detail">Feedback Detail</label>
          <p id="detail-help">
            Include any specific comments on what should be
            improved, added, etc.
          </p>
        </CustomTextArea>

        <div role="presentation">
          <Button variant="primary-purple" type="submit">
            Add Feedback
          </Button>
          <Button variant="secondary" type="reset">
            Cancel
          </Button>
          <Button
            clickHandler={handleDelete}
            variant="danger"
            type="button"
          >
            Delete
          </Button>
        </div>

      </form>

    </>
  );
};

Edit.getLayout = (page: ReactElement<EditPageProps>) => {
  return (
    <EditLayout>{page}</EditLayout>
  );
};

export const getServerSideProps: GetServerSideProps<
  EditPageProps,
  EditPageQueryParams
> = async (context) => {

  const redirect = (dest: string): { redirect: Redirect } => ({
    redirect: {
      statusCode: 301,
      destination: dest,
    },
  });

  // Extract id from url
  const { id } = context.params ?? {};

  // Can't find a post without the id so rediret to home page
  if (!id) return { notFound: true };

  try {

    // Id exists so query the database
    const post = await db.feedback.findUnique({ where: { id } });

    // Post exists so return it
    if (post !== null) return { props: { post } };

    // Post does not exist so rediret to home page
    return { notFound: true }

  } catch (e) {

    return redirect('/500');

  }

};

export default Edit;
