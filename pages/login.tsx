import { AppShell, Center, Container, Header, Space, Title } from '@mantine/core';
import { Post as PostPrisma } from '@prisma/client';
import { supabaseClient } from '@supabase/auth-helpers-nextjs';
import { Auth } from '@supabase/ui';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const Login: NextPage = () => {
  const router = useRouter();

  useEffect(() => {
    const { data: authListener } = supabaseClient.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        router.replace('/');
      }
    });

    return () => {
      authListener?.unsubscribe();
    };
  }, [router]);

  return (
    <>
      <Auth supabaseClient={supabaseClient} />
    </>
  );
};

export default Login;
