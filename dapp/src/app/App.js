import React from 'react';

import { AppRoutes } from '../constants/routes';
import AuthRoute from '../auth/AuthRoute';
import UnAuthRoute from '../auth/UnAuthRoute';
import Home from '../App';
import Login from '../auth/Login';

export default function () {
  return (
    <div>
      <AuthRoute path={AppRoutes.home} exact component={Home} />
      <UnAuthRoute path={AppRoutes.login} component={Login} />
    </div>
  );
}
