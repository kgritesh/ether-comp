import React from 'react';
import glamorous from 'glamorous';
import Typography from 'material-ui/Typography';

export const Container = glamorous.div({
  display: 'flex',
  minHeight: '100vh',
  flexDirection: 'column'
}, ({ theme }) => ({
  backgroundColor: theme.container.backgroundColor
}));

export const CenterCard = glamorous.div({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  flex: 1
});

export const LogoTitle = () => (
  <Typography
    type="display1"
    gutterBottom
    noWrap
    align="center"
    style={{ color: 'white' }}
  >
    Ether Comp
  </Typography>
);
