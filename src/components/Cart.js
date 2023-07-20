import React from "react";
import { useHistory } from "react-router-dom";
import {
  Button,
  IconButton,
  Stack,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import {
  AddOutlined,
  RemoveOutlined,
  ShoppingCart,
  ShoppingCartOutlined,
  Close as CloseIcon,
} from "@mui/icons-material";
import "./Cart.css";

const ItemQuantity = ({ value, handleAdd, handleDelete }) => {
  return (
    <Stack direction="row" alignItems="center">
      <IconButton size="small" color="primary" onClick={handleDelete}>
        <RemoveOutlined />
      </IconButton>
      <Box padding="0.5rem" data-testid="item-qty">
        {value}
      </Box>
      <IconButton size="small" color="primary" onClick={handleAdd}>
        <AddOutlined />
      </IconButton>
    </Stack>
  );
};

export const getTotalCartValue = (items = []) => {
  if (!items.length) return 0;
  const total = items
    .map((item) => item.cost * item.qty)
    .reduce((total, n) => total + n);
  return total;
};

export const getTotalItems = (items = []) => {
  if (!items.length) return 0;
  const total = items.map((item) => item.qty).reduce((total, n) => total + n);
  return total;
};

const Cart = ({
  products,
  items = [],
  handleQuantity,
  handleDialogClose,
  isDialogOpen,
  isReadOnly,
}) => {
  const history = useHistory();

  if (!items.length) {
    return (
      <Dialog
        open={isDialogOpen}
        onClose={handleDialogClose}
        className="dialog"
      >
        <DialogTitle className="popup-title">
          <h3>Cart</h3>
          <Button
            className="title-btn"
            onClick={handleDialogClose}
            sx={{ color: "black" }}
          >
            <CloseIcon>X</CloseIcon>
          </Button>
        </DialogTitle>
        <DialogContent className="popup-content">
          <Box className="cart empty">
            <ShoppingCartOutlined className="empty-cart-icon" />
            <Box color="#aaa" textAlign="center">
              Cart is empty. Add more items to the cart to checkout.
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isDialogOpen} onClose={handleDialogClose} className="dialog">
      <DialogTitle className="popup-title">
        <h3>Cart</h3>
        <Button
          className="title-btn"
          onClick={handleDialogClose}
          sx={{ color: "black" }}
        >
          <CloseIcon>X</CloseIcon>
        </Button>
      </DialogTitle>
      <DialogContent className="popup-content">
        <Box className="cart">
          {items.map((item) => (
            <Box
              display="flex"
              alignItems="flex-start"
              padding="1rem"
              key={item.productId}
            >
              <Box className="image-container">
                <img
                  src={item.image}
                  alt={item.name}
                  width="100%"
                  height="100%"
                />
              </Box>
              <Box
                display="flex"
                flexDirection="column"
                justifyContent="space-between"
                height="6rem"
                paddingX="1rem"
              >
                <div>{item.name}</div>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  {!isReadOnly && (
                    <ItemQuantity
                      value={item.qty}
                      handleAdd={() =>
                        handleQuantity(item.productId, item.qty + 1)
                      }
                      handleDelete={() =>
                        handleQuantity(item.productId, item.qty - 1)
                      }
                    />
                  )}
                  <Box padding="0.5rem" fontWeight="700">
                    ${item.cost}
                  </Box>
                </Box>
              </Box>
            </Box>
          ))}
          <Box
            padding="1rem"
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box color="#3C3C3C" alignSelf="center">
              Order total
            </Box>
            <Box
              color="#3C3C3C"
              fontWeight="700"
              fontSize="1.5rem"
              alignSelf="center"
              data-testid="cart-total"
            >
              ${getTotalCartValue(items)}
            </Box>
          </Box>

          {!isReadOnly && (
            <Box
              display="flex"
              justifyContent="flex-end"
              className="cart-footer"
            >
              <Button
                color="primary"
                variant="contained"
                startIcon={<ShoppingCart />}
                className="checkout-btn"
                onClick={() => {
                  history.push("/checkout");
                }}
              >
                Checkout
              </Button>
            </Box>
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default Cart;
