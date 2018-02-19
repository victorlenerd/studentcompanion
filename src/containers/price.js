import { connect } from 'react-redux';
import { GetPrice, MakePayment } from 'ducks/price';

const mapStateToProps = store => {
  return {
    price: store.priceState.price
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getPrice: () => dispatch(GetPrice()),
    makePayment: () => dispatch(MakePayment())
  };
};

export default com => connect(mapStateToProps, mapDispatchToProps)(com);
