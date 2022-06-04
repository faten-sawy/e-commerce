import React, { PureComponent } from "react";
import { connect } from "react-redux";
import ProductCard from "./ProductCard";
import styles from "./ProductListing.module.css";
import { getProductsByCategory } from "../../Redux/actions/async";
import { AnimatePresence, motion } from "framer-motion";

export class ProductListing extends PureComponent {
  componentDidMount() {
    this.props.getProductsByCategory(this.props.categoryType);
  }
  componentDidUpdate(prevProps) {
    if (prevProps.categoryType !== this.props.categoryType) {
      this.props.getProductsByCategory(this.props.categoryType);
    }
  }

  render() {
    const { categoryType, overlayFlag, PLPProducts } = this.props;
    return (
      <div className={styles.container}>
        <div
          className={overlayFlag ? styles.overlayLayout : styles.layout}
        ></div>
        <h2>{categoryType}</h2>
        <div className={styles.products}>
          {PLPProducts?.map((item) => (
            <AnimatePresence>
              <motion.div
                key={item.id}
                initial={{ opacity: 0, top: 30 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, top: 0 }}
              >
                <ProductCard data={item} />
              </motion.div>
            </AnimatePresence>
          ))}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  categoryType: state.categoryType,
  overlayFlag: state.cart.overlayFlag,
  PLPProducts: state.products.PLPProducts,
});
const mapDispatchToProps = () => ({
  getProductsByCategory,
});

export default connect(mapStateToProps, mapDispatchToProps())(ProductListing);
