import * as React from 'react';
import SkyLight from 'react-skylight';

export default class ErrorPopup extends React.Component<any, any> {
  constructor(props){
    super(props);
  }

  componentDidMount() {
    if (this.props.error) {
      this.refs.errorPopup.show();
    }
  }

  componentWillReceiveProps(newProps) {
    if (newProps.error) {
      this.refs.errorPopup.show();
    }
  }

  render() {
    var message = this.props.errorMessage ?
      this.props.errorMessage :
      'Oops.  Something went wrong. Please try again.';

    var style = {
          backgroundColor: '#F2DEDE',
          color: '#A94442',
          top: '50%',
          left: '50%',
          height: 'auto'
        };

    return (
      <SkyLight hideOnOverlayClicked dialogStyles={style} ref="errorPopup" title="Error">
        {message}
      </SkyLight>
    )
  }
}
