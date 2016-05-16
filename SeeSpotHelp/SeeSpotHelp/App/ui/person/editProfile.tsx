import * as React from 'react';

import EditorElement from '../shared/editor/editorelement';

import ProfileEditor from '../../core/editor/profileeditor';
import LoginStore from '../../stores/loginstore';

export default class EditProfile extends React.Component<any, any> {
  public refs: any;
  public context: any;

  constructor(props) {
    super(props);
  }

  // Required for page transitions via this.context.router.push.
  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }

  onChange() {
    this.forceUpdate();
  }

  goBackToPage() {
    this.context.router.push({ pathname: "profilePage"});
  }

  render() {
    return (
      <EditorElement
        title='Edit your profile'
        mode='edit'
        onEditOrInsert={this.goBackToPage.bind(this)}
        onDelete={this.goBackToPage.bind(this)}
        editor={new ProfileEditor(LoginStore.getUser())} />
    );
  }
}
