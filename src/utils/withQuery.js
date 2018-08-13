import React from 'react';
import qs from 'query-string';

export default function withQuery(Wrapped) {
  let queryString;
  let query;

  function mergeQuery(mergedQuery) {
    window.location.search = qs.stringify({...query, ...mergedQuery});
  }

  return props => {
    const { location } = props;
    if(location && location.search !== queryString) {
      query = qs.parse(location.search);
    }
    return (<Wrapped {...props} query={query} mergeQuery={mergeQuery}/>);
  };
}