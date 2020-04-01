import React from 'react';
import _ from 'lodash';
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';
import currentWeekNumber from 'current-week-number';
import './App.css';

const Content = () => {
  const week_number = currentWeekNumber();
  return (
    <div>
      <Container>
        <Row>
          <Col>
            <DropdownButton id="dropdown-basic-button" title="Choose week">
              {_.range(week_number-2, week_number+10).map(
                  i => {
                    const item_str = i.toString();
                    return <Dropdown.Item href={item_str} key={item_str}>Week {item_str}</Dropdown.Item>;
                  }
              )}
            </DropdownButton>
          </Col>
        </Row>
        <Row>
          <Col>1 of 3</Col>
          <Col>2 of 3</Col>
          <Col>3 of 3</Col>
        </Row>
      </Container>
    </div>
  );
}

export default Content;

