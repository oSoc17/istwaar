import React, { Component } from 'react';
import { connect } from 'react-redux';
import { test } from '../redux/actions';
import { Route, Switch, Redirect } from 'react-router-dom';
import { ConnectedRouter } from 'connected-react-router';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import Home from './views/Home';
import CharacterQuiz from './views/CharacterQuiz';
import TeacherArea from './views/TeacherArea';
import './App.css';

class App extends Component {
  componentDidMount() {
    this.props.test();
  }

  render() {
    const { history, user } = this.props;
    const isAuthorizedTeacher = user.isAuthorized && user.token;

    return (
      <div className="app">
        <ConnectedRouter history={history}>
          <Switch>
            <Route
              path="/"
              exact
              render={props => <Home user={user} {...props} />}
            />
            <Route
              path="/quiz"
              exact
              render={props => <CharacterQuiz user={user} {...props} />}
            />
            <ProtectedRoute
              path="/teacher"
              isAuthorized={isAuthorizedTeacher}
              redirectUrl="/teacher/login"
              exact
              render={props => <TeacherArea user={user} {...props} />}
            />
            <ProtectedRoute
              path="/teacher/login"
              isAuthorized={!isAuthorizedTeacher}
              exact
              render={() => <div>login</div>}
            />
            <Route render={() => <Redirect to="/" />} />
          </Switch>
        </ConnectedRouter>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user,
  room: state.room
});

export default connect(mapStateToProps, { test })(App);
