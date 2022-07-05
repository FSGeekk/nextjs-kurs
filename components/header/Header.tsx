import { Header as HeaderUi, Group, UnstyledButton, Title, Button } from '@mantine/core';
import { supabaseClient } from '@supabase/auth-helpers-nextjs';
import { useUser } from '@supabase/auth-helpers-react';
import Link from 'next/link';

export const Header = () => {
  const { user } = useUser();

  return (
    <HeaderUi height={60} p="xs">
      <Group align="center" position="apart">
        <Link href="/" passHref>
          <UnstyledButton component="a">
            <Title order={1}>Twój blog</Title>
          </UnstyledButton>
        </Link>
        <Group>
          {user && (
            <Link href="new-post" passHref>
              <Button component="a">Dodaj Wpis</Button>
            </Link>
          )}
          {!user && (
            <Link href="login" passHref>
              <Button component="a">Zaloguj</Button>
            </Link>
          )}
          {user && (
            <Link href="api/auth/logout" passHref>
              <Button component="a">Wyloguj</Button>
            </Link>
          )}
        </Group>
      </Group>
    </HeaderUi>
  );
};
