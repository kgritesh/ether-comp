import React from 'react';
import { Route } from 'react-router-dom';
import { ThemeProvider } from 'glamorous';

import { AppRoutes } from '../constants/routes';
import Login from '../auth/Login';

import { Container } from '../common/components/index';
import * as themes from '../common/theme';

export default function () {
  console.log(themes.registrationTheme);
  return (
    <ThemeProvider theme={themes.registrationTheme}>
      <Container >
        <Route path={AppRoutes.login} component={Login} />
      </Container>
    </ThemeProvider>
  );
}
