import React from 'react';
import { Switch } from 'react-router-dom';

import AuthRoute from '../auth/AuthRoute';
import UnAuthRoute from '../auth/UnAuthRoute';
import MainAppFlow from './MainAppFlow';
import RegistrationFlow from './RegistrationFlow';

export default function () {
  return (
    <div>
      <Switch>
        <UnAuthRoute path="/auth" component={RegistrationFlow} />
        <AuthRoute path="/" component={MainAppFlow} />
      </Switch>
    </div>
  );
}
