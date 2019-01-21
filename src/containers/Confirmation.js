//
// Reggie Web
//
// Copyright © 2019 Province of British Columbia
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
// Created by Shelly Xue Han on 2019-01-15.
//

import React, { Component } from 'react';
import { connect } from 'react-redux';

class Confirmation extends Component {
  static displayName = '[Component Confirmation]';

  render() {
    console.log('-----------------------------------props');
    console.log(this.props);
    return (
      <div>
        <h1>Welcome back,</h1>
        {/* <h2>{this.props}</h2> */}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return null;
};

const mapDispatchToProps = dispatch => {
  return null;
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Confirmation);
