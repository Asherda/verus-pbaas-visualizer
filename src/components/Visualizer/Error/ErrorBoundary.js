import React from 'react';
import { setError } from '../../../redux/reducers/error/error.actions';
import { closePlugin } from '../../../rpc/calls/closePlugin';
import { VERUS_PBAAS_VISUALIZER } from '../../../utils/constants';
import Error from './Error';
import { connect } from 'react-redux';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null, errorInfo: null };
    this.completeVisualization = this.completeVisualization.bind(this)
  }

  componentDidCatch(error, errorInfo) {
    // Catch errors in any components below and re-render with error message
    this.setState({
      error: error,
      errorInfo: errorInfo,
    });
    // You can also log error messages to an error reporting service here
  }

  async completeVisualization(result = null, error = null) {
    try {
      await closePlugin(
        VERUS_PBAAS_VISUALIZER,
        this.props.windowId,
        true,
        result != null
          ? result
          : { error: error != null ? error.message : error }
      );
    } catch(e) {
      this.props.dispatch(setError(e))
    }
  } 

  render() {
    if (this.state.errorInfo) {
      // Error path
      return (
        <Error
          completeVisualization={this.completeVisualization}
          error={this.state.error}
          errorInfo={this.state.errorInfo}
        />
      );
    }
    // Normally, just render children
    return this.props.children;
  }
}

const mapStateToProps = (state) => {
  return {
    windowId: state.rpc.windowId
  };
};

export default connect(mapStateToProps)(ErrorBoundary);