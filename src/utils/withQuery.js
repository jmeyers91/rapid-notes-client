import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import qs from 'query-string';

export default function withQuery(Wrapped) {
  class WithQuery extends Component {
    cachedQueryString = null;
    cachedQueryObject = null;

    constructor(props) {
      super(props);
      this.set = this.set.bind(this);
      this.remove = this.remove.bind(this);
      this.replace = this.replace.bind(this);
    }

    getQueryObject() {
      const { cachedQueryString } = this;
      const { search } = this.props.location;

      if(search !== cachedQueryString) {
        this.cachedQueryString = search;
        this.cachedQueryObject = qs.parse(search);
      }

      return this.cachedQueryObject;
    }

    set(key, value) {
      const { history, location } = this.props;
      const query = this.getQueryObject();
      query[key] = value;

      history.push({
        ...location,
        search: qs.stringify(query)
      });
    }

    remove(key) {
      const { history, location } = this.props;
      const query = this.getQueryObject();
      delete query[key];

      history.push({
        ...location,
        search: qs.stringify(query)
      });
    }

    replace(values) {
      const { history, location } = this.props;

      history.push({
        ...location,
        search: qs.stringify(values)
      });
    }

    render() {
      const query = {
        values: this.getQueryObject(),
        set: this.set,
        remove: this.remove,
        replace: this.replace,
      };

      return (<Wrapped {...this.props} query={query}/>);
    }
  }

  return withRouter(observer(WithQuery));
}