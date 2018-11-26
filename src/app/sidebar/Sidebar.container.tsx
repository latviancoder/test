import React, { createElement, useEffect } from 'react';
import { connect } from 'react-redux';

import { fetchRepos } from '../../actions';
import { AsyncModel, Repo, RootState } from '../../interfaces';
import withLoader from '../../withLoader';

import SidebarComponent, { SidebarComponentProps } from './Sidebar.component';

interface ContainerStateProps {
  repos?: AsyncModel<Array<Repo>>;
}

interface ContainerDispatchProps {
  onMount: () => void;
}

// Waiting for an official 'useRedux' hook, meanwhile good old connect
const SidebarContainer = connect<ContainerStateProps, ContainerDispatchProps>(
  (state: RootState) => ({
    repos: state.repos
  }),
  (dispatch) => ({
    // Another approach would be to dispatch `appMounted` and make saga do all the logic, but this one is less boilerplate
    onMount: () => dispatch(fetchRepos.started())
  })
)((props: ContainerDispatchProps & ContainerStateProps) => {
  useEffect(props.onMount, []);

  return createElement(
    withLoader<SidebarComponentProps>(SidebarComponent), {
      // Optional chaining when?
      repos: props.repos && props.repos.payload,
      isFetching: props.repos && props.repos.isFetching
    }
  );
});

export default SidebarContainer;