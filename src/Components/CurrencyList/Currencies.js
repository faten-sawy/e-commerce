import React, { PureComponent } from "react";
import { getCurrency } from "../../assets/utilize";
import { CurrencyQuery } from "../../Queries";
import { connect } from "react-redux";
import styles from "./Currencies.module.css";
import arrowSrc from "../../assets/icons/arrow.png";
import { getSymbol } from "../../Redux/actions/symbol";
import { motion } from "framer-motion";

export class Currencies extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      flag: false,
      variants: {},
    };

    this.listRef = React.createRef();
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  componentDidMount() {
    this.updateCurrency();
    document.addEventListener("mousedown", this.handleClickOutside);
  }
  componentDidUpdate(prevProps) {
    if (prevProps.symbol !== this.props.symbol) {
      this.updateCurrency();
    }
  }
  handleShow() {
    const { flag } = this.state;
    const up = { init: { height: 130 }, finish: { height: 0 } };
    const down = { init: { height: 0 }, finish: { height: 130 } };

    this.setState({ variants: flag ? up : down });
    this.setState({ flag: !this.state.flag });
  }
  handleCurrency(symbol) {
    const up = { init: { height: 130 }, finish: { height: 0 } };
    this.props.getSymbol(symbol);
    this.setState({ flag: !this.state.flag });
    this.setState({ variants: up });
  }
  updateCurrency() {
    getCurrency(CurrencyQuery).then((response) =>
      this.setState({
        data: response.filter((item) => item.symbol !== this.props.symbol),
      })
    );
  }
  handleClickOutside(event) {
    const up = { init: { height: 130 }, finish: { height: 0 } };
    if (this.listRef.current && !this.listRef.current.contains(event.target)) {
      this.setState({ flag: false });
      this.setState({ variants: up });
    }
  }
  render() {
    const { symbol } = this.props;
    const { variants } = this.state;

    return (
      <ul ref={this.listRef} className={styles.list}>
        <li onClick={() => this.handleShow()}>
          {symbol}
          <img src={arrowSrc} alt="currency symbol" />
        </li>
        <motion.div
          className={styles.inner}
          initial="init"
          animate="finish"
          variants={variants && variants}
          transition={{ duration: 0.3 }}
        >
          {this.state.flag &&
            this.state.data?.map((item, index) => (
              <li
                key={index}
                onClick={() => this.handleCurrency(item.symbol)}
              >{`${item.symbol} ${item.label}`}</li>
            ))}
        </motion.div>
      </ul>
    );
  }
}
const mapStateToProps = (state) => ({
  symbol: state.symbol,
  overlayFlag: state.cart.overlayFlag,
});
const mapDispatchToProps = () => ({ getSymbol });

export default connect(mapStateToProps, mapDispatchToProps())(Currencies);
