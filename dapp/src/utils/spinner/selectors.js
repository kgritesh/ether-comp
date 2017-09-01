export const isVisible = (state, ownProps) =>
  state.spinners.getIn(['instances', ownProps.id, 'visible']);
