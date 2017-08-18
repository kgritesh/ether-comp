import React from 'react';
import { Route } from 'react-router-dom';
import { ThemeProvider } from 'glamorous';

import { AppRoutes } from '../constants/routes';
import Home from '../App';

import { Container } from '../common/components/index';
import * as themes from '../common/theme';

export default function () {
  return (
    <ThemeProvider theme={themes.mainAppTheme}>
      <Container >
        <Route path={AppRoutes.home} exact component={Home} />
      </Container>
    </ThemeProvider>
  );
}
