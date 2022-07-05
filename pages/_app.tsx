import { AppProps } from 'next/app';
import Head from 'next/head';
import { AppShell, Button, Container, MantineProvider, Title, UnstyledButton } from '@mantine/core';
import Link from 'next/link';
import { UserProvider } from '@supabase/auth-helpers-react';
import { supabaseClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { Header } from '../components/header/Header';

export default function App(props: AppProps) {
  const router = useRouter();
  const { Component, pageProps } = props;

  return (
    <>
      <Head>
        <title>Medium clone</title>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
      </Head>

      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{
          colorScheme: 'light',
        }}
      >
        <UserProvider supabaseClient={supabaseClient}>
          <AppShell
            padding="lg"
            header={<Header />}
            styles={(theme) => ({
              main: { height: '100%' },
            })}
          >
            <Container size="lg">
              <Component {...pageProps} />
            </Container>
          </AppShell>
        </UserProvider>
      </MantineProvider>
    </>
  );
}
