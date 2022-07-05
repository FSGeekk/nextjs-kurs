import { Space, Button, Alert } from '@mantine/core';
import { yupResolver } from '@hookform/resolvers/yup';
import { Post as PostPrisma } from '@prisma/client';
import type { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { TextareaInput } from '../../components/form/TextareaInput';

import { prisma } from '../../lib/prisma';
import { PostSchema, postSchema } from '../../utils/postSchema';
import { TextInput } from '../../components/form/TextInput';
import { getUser, withPageAuth } from '@supabase/auth-helpers-nextjs';

export const getServerSideProps = withPageAuth({
  redirectTo: '/',
  async getServerSideProps(ctx) {
    const { user } = await getUser(ctx);

    if (typeof ctx.params?.slug !== 'string') {
      return {
        props: {},
        redirect: {
          destination: '/',
        },
      };
    }

    const post = await prisma.post.findFirst({ where: { slug: ctx.params?.slug } });

    if (!post) {
      return {
        props: {},
        redirect: {
          destination: '/',
        },
      };
    }

    if (user.id !== post.createdBy) {
      return {
        props: {},
        redirect: {
          destination: '/',
        },
      };
    }

    return { props: { post: JSON.parse(JSON.stringify(post)) as PostPrisma } };
  },
});

interface Props {
  post: PostPrisma;
}

const EditPost: NextPage<Props> = ({ post }) => {
  const router = useRouter();
  const [error, setError] = useState<null | string>(null);
  const { control, handleSubmit } = useForm<PostSchema>({
    resolver: yupResolver(postSchema),
    defaultValues: {
      title: post.title,
      content: post.content,
      slug: post.slug,
    },
  });

  const onSubmit = async (data: PostSchema) => {
    setError(null);
    const response = await fetch('/api/edit-post', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...post, ...data }),
    });

    if (response.status === 200) {
      return router.push('/');
    }

    const content = await response.json();
    setError(content.error);
  };

  return (
    <>
      {error && (
        <Alert title="Błąd!" color="red" withCloseButton onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextInput control={control} name="title" label="Tytuł" />
        <TextareaInput control={control} name="content" autosize minRows={10} maxRows={20} label="Treść" />
        <TextInput control={control} name="slug" label="Slug" />
        <Space h="xl" />
        <Button type="submit"> Edytuj wpis</Button>
      </form>
    </>
  );
};

export default EditPost;
