import React from 'react';
import Button from '../../components/button/Button';
import { MapPin } from 'react-feather';
import { Link } from 'react-router-dom';
import ConfirmTeacher from './ConfirmTeacher';

class Home extends React.Component {
  render() {
    return (
      <div className="page">
        <Button to="/teacher">Leerkracht</Button>
        <Button to="/quiz" size="large">
          Ontdek een verhaal
        </Button>
        <div className="filters" />
        <MapPin size="48" />
      </div>
    );
  }
}

export default Home;
