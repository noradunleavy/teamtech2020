import React, {Component} from 'react';
import Sunburst from './Sunburst';
import ReactVirtualizedTable from '../Anomalies';
import './datavis.scss';
import DateTimeRangePicker from '@wojtekmaj/react-datetimerange-picker';
import Button from 'react-bootstrap/Button';
import ErrorModal from '../error';

import API from '../../api';

const flaskApiUrl = "https://teamtech2020.herokuapp.com";
// const flaskApiUrl = "http://127.0.0.1:5000";

const styles = {
  container: {
    textAlign: "center"
  },
  noTable: {
    display: "none"
  }
};

export default class DataVisualization extends Component {
  constructor(props) {
    super(props);
    this.state = {
      date: [null, null],
      defaultDate: [new Date('December 1, 2017 00:0:00'), new Date('December 31, 2017 00:00:00')],
      startTimestamp: undefined,
      endTimestamp: undefined,
      sunburstData: null,
      defaultSunburstData: null,
      showSunburst: false,
      anomalyData: null,
      defaultAnomalyData: null,
      showAnomalies: false,
      username: "",
      password: "",
      uuid: null,
      showErrorModal: false,
      errorText: "",
      token: null
    };
    this.tableRef = React.createRef();
    this.myAPI = new API({url: flaskApiUrl});
    this.myAPI.createEntity({name: 'get'});
  }

  handleUsernameChange = (input) => {
    this.setState({
      username: input,
    });
  }

  handlePasswordChange = (input) => {
    this.setState({
      password: input,
    });
  }

  handleModalClose = () => {
    this.setState({
      showErrorModal: false,
    });
  }

  showModalAuthErr = () => {
    this.setState({
      showErrorModal: true,
      errorText: "Session Expired. Please enter username and password.",
      showSunburst: false,
      showAnomalies: false,
      defaultSunburstData: null,
      defaultAnomalyData: null
    });
  }

  onChangeDateTime = async(selectedDate) => {
    // Convert date into start and end unix timestamps
    let start = Math.floor(selectedDate[0].getTime() / 1000);
    let end = Math.floor(selectedDate[1].getTime() / 1000);

    this.setState({
      date: selectedDate,
      showSunburst: false,
      showAnomalies: false,
      startTimestamp: start,
      endTimestamp: end
    });
  }

  getSunburstData = async(uuid, start, end, token) => {
    let resp = null;
    try {
      resp = await this.myAPI.endpoints.get.sunburstData({uuid: uuid}, {start_timestamp: start}, {end_timestamp: end}, {token: token});
      return resp.data;
    } catch (error) {
      if (error.response.status === 403) {
        this.showModalAuthErr();
      }
    }
  }

  getAnomalyData = async(uuid, start, end, token) => {
    let resp = null;
    try {
      resp = await this.myAPI.endpoints.get.anomalyData({uuid: uuid}, {start_timestamp: start}, {end_timestamp: end}, {token: token});
      return resp.data;
    } catch (error) {
      if (error.response.status === 403) {
        this.showModalAuthErr();
      }
    }
  }

  async toggleSunburst() {
    let newSunburstData = null;
    if (!this.state.showSunburst) {
      newSunburstData = await this.getSunburstData(this.state.uuid, this.state.startTimestamp, this.state.endTimestamp, this.state.token)
      if (newSunburstData === "No matches" && this.state.defaultSunburstData) {
        this.setState({
          sunburstData: this.state.defaultSunburstData,
          showSunburst: true,
          showErrorModal: true,
          errorText: "No data found in this time range. Showing all-time data."
        });
      } else if (newSunburstData) {
        this.setState({
          sunburstData: newSunburstData,
          showSunburst: true
        });
      }
    } else {
      this.setState({ showSunburst: false })
    }
  }

  displaySunburst = () => <Sunburst
    data={this.state.sunburstData}
    width="800"
    height="900"
    count_member="size"
    labelFunc={(node)=>node.data.name}
    _debug={false}
  />

  async toggleAnomalies() {
    let newAnomalyData = null;
    if (!this.state.showAnomalies) {
      newAnomalyData = await this.getAnomalyData(this.state.uuid, this.state.startTimestamp, this.state.endTimestamp, this.state.token);
      if (newAnomalyData === "No matches" && this.state.defaultAnomalyData) {
        this.setState({
          anomalyData: this.state.defaultAnomalyData,
          showAnomalies: true,
          showErrorModal: true,
          errorText: "No data found in this time range. Showing all-time data."
        });
      } else if (newAnomalyData) {
        this.setState({
          anomalyData: newAnomalyData,
          showAnomalies: true
        }, () => {
          setTimeout(() => {
            this.tableRef.current.scrollIntoView({behavior:"smooth"})
          }, 100);
        });
      }
    } else {
      this.setState({ showAnomalies: false })
    }
  }

  displayAnomalies() {
    return (
      <div ref={this.tableRef} style={this.state.showAnomalies ? {} : styles.noTable}>
        <ReactVirtualizedTable
          data={this.state.anomalyData}
        />;
      </div>
    )
  }

  async getUuid() {
    // Catch if no username has been entered
    if (this.state.username === "") {
      return;
    }

    // Get uuid
    let data = null;
    await this.myAPI.endpoints.get.uuid({username: this.state.username})
      .then(response => data = response.data);

    // Get default data
    let defaultSunburstData = null;
    let defaultAnomalyData = null;
    if (data !== "No matches") {
      defaultSunburstData = await this.getSunburstData(data["uuid"], undefined, undefined, data.token);
      defaultAnomalyData = await this.getAnomalyData(data["uuid"], undefined, undefined, data.token);

      // Update state
      this.setState({
        uuid: data["uuid"],
        defaultSunburstData,
        defaultAnomalyData,
        token: data.token
      });
    } else {
      this.setState({
        showErrorModal: true,
        errorText: "No user found.",
        defaultSunburstData: null,
        defaultAnomalyData: null,
        uuid: null,
        token: null
      });
    }
  }

  render() {
    return (
      <div className="data-vis-page">
        <br/>
        <div className = "uuid-prompt">
          <h4> How to use this application to understand your phone usage:</h4>
          <p> 1. Enter your username. </p>
          <p> 2. To see your individual app usage in the data visualization, click "View App Usage". The innermost ring breaks down your usage for each category (i.e. Productivity or Personalization).
                  If you click on a subsection of the inner ring, the visualization will zoom into the usage for the apps that fall under that category.
                  The category entitled "UNCATEGORIZED" is for applications that do not fall under the defined categories. This includes applications that run in the background of your phone. </p>
          <p> 3. To see any abnormal behavior in your cell usage, click "View Anomalies". An upward arrow indicates that you spent an abnormally large amount of time in that category during the specified period of time.
                  A downward arrow indicates that you spent an abnormally low amount of time in that category during the specified period of time.
          </p>
        </div>
        <br/>

        {this.state.uuid === null &&
          <div className="username-wrapper">
            <div className="form-group">
              <span className="uuid-prompt">Username:</span>
              <input className="form-field" type="text" placeholder="Please enter your username" onChange={e => this.handleUsernameChange(e.target.value)}/>
            </div>
            <div className="form-group">
              <span className="uuid-prompt">Password:</span>
              <input className="form-field" type="password" placeholder="Please enter your password" onChange={e => this.handlePasswordChange(e.target.value)}/>
            </div>
            <Button className="view_button submit_button" onClick={this.getUuid.bind(this)}>Submit</Button>
          </div>}

        {this.state.uuid === null ? null : <div className="datavis-options-container">
          <DateTimeRangePicker
            value = {this.state.date[0] === null ? this.state.defaultDate : this.state.date}
            onChange={this.onChangeDateTime}
            maxDetail = "second"
            clearIcon = {null}
          />
          <Button className="view_button" justify="center" onClick={this.toggleSunburst.bind(this)}>
            {this.state.showSunburst ? "Hide App Usage" : "View App Usage"}
          </Button>
          <Button className="view_button" justify="center" onClick = {this.toggleAnomalies.bind(this)}>
            {this.state.showAnomalies ? "Hide Anomalies" : "View Anomalies"}
          </Button>
        </div>}

        {this.state.showSunburst && this.displaySunburst()}
        {this.displayAnomalies()}

        <ErrorModal showErrorModal={this.state.showErrorModal} errorText={this.state.errorText} handleModalClose={this.handleModalClose} />
      </div>
    );
  }
}
