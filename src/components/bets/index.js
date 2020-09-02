import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { uniqueId } from 'lodash'
import { Table, Badge, Modal, Button } from 'react-bootstrap';
import { 
  initBets as initBetsAction,
  addBets as addBetsAction
} from '../../actions/bets';
import Layout from '../Layout'

class Bets extends React.Component {
  interval = null
  
  state = {
    counter: 0,
    selectedBet: null
  }

  componentDidMount () {
    this.websocketConnect()
    this.startTimer()
  }

  componentWillUnmount () {
    window.clearInterval(this.interval)
  }

  websocketConnect = () => {
    const socket = new WebSocket('ws://localhost:3001');
    socket.addEventListener('open', () => {
      console.log('ws connected');
      const message = 'init'
      socket.send(JSON.stringify(message));
    });
    socket.addEventListener('error', (e) => {
      console.log('ws error: ', e);
    });
    socket.onmessage = (e) => {
      const message = JSON.parse(e.data);
      switch(message.type) {
        case 'bets:init':
          console.log('init', message.data)
          this.props.initBetsAction(message.data)
          break;
        case 'bets:add':
          console.log('add', message.data)
          this.props.addBetsAction(message.data)
      }
    };
    socket.onclose = () => {
      console.log('ws closing');
      this.websocketConnect();
    };
  }

  startTimer = () => {    
    this.interval = window.setInterval(() => {
      this.displayTime()
    }, 1000);
  }

  displayTime = () => {
    this.setState({
      counter: this.state.counter + 1,
    })
  }

  toggleModal = (selectedBet) => {
    this.setState({
      selectedBet
    })
  }

  render() {
    const { bets } = this.props;
    const { selectedBet } = this.state;
    return (
      <Layout>
        <div>
          <Badge variant='secondary'>{ new Date(this.state.counter * 1000).toISOString().substr(11, 8) }</Badge>
        </div>
        {bets && <Table striped bordered hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>USER</th>
              <th>TIME</th>
              <th>BET</th>
              <th>MULTIPLIER</th>
              <th>GAME</th>
              <th>OUTCOME</th>
              <th>PROFIT</th>
            </tr>
          </thead>
          <tbody>
            {bets.map(bet => {
              return (
                <tr key={ uniqueId(bet.id) }>
                  <th>
                    <button onClick={() => this.toggleModal(bet) }>
                      { bet.id }
                    </button>
                  </th>
                  <th>{ bet.data.user.username }</th>
                  <th>{ new Date(bet.date * 1000).toISOString().substr(11, 8) }</th>
                  <th>{ bet.amount }</th>
                  <th>{ bet.data.multiplier }</th>
                  <th>{ bet.game }</th>
                  <th>{ bet.wagered }</th>
                  <th>{ bet.profit }</th>
                </tr>
              )
            })}
          </tbody>
        </Table>}
        <Modal show={ !!selectedBet } onHide={ () => this.toggleModal(null) }>
          <Modal.Header closeButton>
            <Modal.Title>Bet details</Modal.Title>
          </Modal.Header>
          {selectedBet && <Modal.Body>
            <div>
              Bets detail
            </div>
            <div>
              username: { selectedBet.data.user.username }
            </div>
          </Modal.Body>}
          <Modal.Footer>
            <Button variant='secondary' onClick={ () => this.toggleModal(null) }>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </Layout>
    )
  }
}

Bets.propTypes = {
  initBetsAction: PropTypes.func.isRequired,
  addBetsAction: PropTypes.func.isRequired,
  bets: PropTypes.array.isRequired
}

const mapStateToProps = (state) => ({
  bets: state.bets
})

const mapDispatchToProps = (dispatch) => bindActionCreators({
  initBetsAction,
  addBetsAction
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Bets)