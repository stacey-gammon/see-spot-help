import * as React from 'react';

interface propTypes {
  value?: string,
  btnText?: string,
  onSubmit: any
}

export default class InputCommentForm extends React.Component<propTypes, any> {
  constructor(props) {
    super(props);
    this.state = {
      value: this.props.value
    }
  }

  getValue() {
    return this.state.value;
  }

  clear() {
    this.setState({value: ''});
  }

  onSubmit(e) {
    this.setState({value: (this.refs['comment'] as any).value});
    e.preventDefault();
    this.props.onSubmit();
    return false;
  }

  getSendButton() {
    if (this.state.value && this.state.value.length > 0) {
      let btnText = this.props.btnText ? this.props.btnText : 'Send';
      return <button className='btn btn-info submit-comment-btn' type='submit'>{btnText}</button>
    }
  }

  render() {
    return (
      <form onSubmit={this.onSubmit.bind(this)} className='input-group'>
        <input type='text'
               className='add-comment-input'
               ref='comment'
               onInput={(e) => {this.setState({value: e.target.value})}}
               value={this.state.value}
               placeholder='add comment...'/>
        {this.getSendButton()}
      </form>
    );
  }
}
