import React, { Component } from 'react';
import { Input } from 'reactstrap';
import { updateScriptPath } from '../../store/actions';
import { getAppKey } from '../../utils/AppUtils';
import { getScriptsOptions } from '../../utils/InputUtils';
import { SCRIPT_TYPES } from '../../constants/InputConstants';

class ScriptItemRender extends Component {
  constructor() {
    super();
    this.handleChange = this.handleChange.bind(this);
    this.state = { value: '' };
  }

  componentDidMount() {
    const { data, type } = this.props;
    if (data) {
      if (type === SCRIPT_TYPES.POST_SCRIPT) {
        this.setState({ value: data.postScript });
      } else {
        this.setState({ value: data.preScript });
      }
    }
  }

  handleChange = (e) => {
    const { data, dispatch, type } = this.props;
    const val = e.target.value;
    this.setState({
      value: val,
    });
    dispatch(updateScriptPath({ data, type, val }));
  }

  renderOptions() {
    const { user, type } = this.props;
    const options = getScriptsOptions({ user, type });
    return options.map((op) => {
      const { value, label } = op;
      return (
        <option key={`${label}-${value}`} value={value}>
          {' '}
          { label}
          {' '}
        </option>
      );
    });
  }

  render() {
    const { value } = this.state;
    return (
      <Input type="select" id={getAppKey()} onSelect={this.handleChange} className="form-control form-control-sm custom-select" onChange={this.handleChange} value={value}>
        <option key={`${getAppKey()}-default`} value="-">  </option>
        {this.renderOptions()}
      </Input>
    );
  }
}

export default ScriptItemRender;
