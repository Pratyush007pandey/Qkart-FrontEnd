import { Search, SentimentDissatisfied } from "@mui/icons-material";
import {
  CircularProgress,
  InputAdornment,
  TextField,
  Stack,
} from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Products.css";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
// import Grid from "@mui/material/Grid"; // Grid version 1
import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2
import ProductCard from "./ProductCard";
import Cart from "./Cart";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

export const generateCartItemsFrom = (cartData, productsData) => {
  if (!cartData) return;
  const nextCart = cartData.map((item) => ({
    ...item,
    ...productsData.find((product) => item.productId === product._id),
  }));
  return nextCart;
};

const Products = () => {
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [isloading, setIsloading] = useState(true);
  const [timeoutId, setTimeoutId] = useState(null);
  const [cartData, setCartData] = useState([]);
  const [cartLoad, setCartLoad] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const token = localStorage.getItem("token");

  const performAPICall = async () => {
    try {
      let response = await axios.get(`${config.endpoint}/products`);

      setProducts(response.data);
      setAllProducts(response.data);
      setCartLoad(true);
    } catch (error) {
      console.error(error);
    } finally {
      setIsloading(false);
    }
  };

  useEffect(() => {
    performAPICall();
    fetchCart(token);
  }, [cartLoad]);

  const performSearch = async (text) => {
    try {
      const url = config.endpoint + `/products/search?value=${text}`;
      const response = await axios.get(url);
      setProducts(response.data);
      return response.data;
    } catch (e) {
      setProducts([]);
      return e.message;
    } finally {
      setIsloading(false);
    }
  };

  let addInCart = async (productId, qty) => {
    try {
      let response = await axios.post(
        `${config.endpoint}/cart`,
        {
          productId: productId,
          qty: qty,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      //Update cartItems
      setCartData(generateCartItemsFrom(response.data, allProducts));
      // setCartData(response.data);
    } catch (e) {
      if (e.response && e.response.status === 400) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar("Could not add to cart. Something went wrong.", {
          variant: "error",
        });
      }
    }
  };

  const debounceSearch = (event, debounceTimeout) => {
    let text = event.target.value;
    // [IF true] Clear timoutId
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }
    // Set timeout & make the API call
    let timeOut = setTimeout(() => {
      performSearch(text);
    }, 500);
    // Update set timeoutId
    setTimeoutId(timeOut);
  };

  const isItemInCart = (items, productId) =>
    !!items.find((item) => item.productId === productId);

  const fetchCart = async (token) => {
    if (!token) return;

    try {
      // TODO: CRIO_TASK_MODULE_CART - Pass Bearer token inside "Authorization" header to get data from "GET /cart" API and return the response data
      let cartResponse = await axios.get(`${config.endpoint}/cart`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // let Data= await generateCartItemsFrom(cartResponse.data,allProducts);

      setCartData(generateCartItemsFrom(cartResponse.data, allProducts));
      console.log("hellomoto", cartResponse.data);
      // setCartData(cartResponse.data);
    } catch (e) {
      if (e.response && e.response.status === 400) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar(
          "Could not fetch cart details. Check that the backend is running, reachable and returns valid JSON.",
          {
            variant: "error",
          }
        );
      }
      return null;
    }
  };

  let handleQuantity = (productId, qty) => {
    addInCart(productId, qty);
  };

  const addToCart = async (
    token,
    items,
    products,
    productId,
    qty,
    options = { preventDuplicate: false }
  ) => {
    if (token) {
      if (!isItemInCart(items, productId)) {
        addInCart(productId, qty);
        // enqueueSnackbar("Item added successfully", {
        //   variant: "success",
        // });
      } else {
        enqueueSnackbar(
          "Item already in cart. Use the cart sidebar to update quantity or remove item.",
          {
            variant: "warning",
          }
        );
      }
    } else {
      enqueueSnackbar("Login to add an item to the Cart", {
        variant: "warning",
      });
    }
  };

  const handleAddToCart = (e) => {
    console.log(e.target.value);
    addToCart(token, cartData, allProducts, e.target.value, 1, {
      preventDuplicate: true,
    });
  };

  const handleDialogOpen = () => {
    setIsDialogOpen(true);
  };
  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

  return (
    <div>
      <Header handleDialogOpen={handleDialogOpen}>
        <TextField
          className="search-desktop"
          size="small"
          onChange={(event) => {
            debounceSearch(event, timeoutId);
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Search color="primary" />
              </InputAdornment>
            ),
          }}
          placeholder="Search for items/categories"
          name="search"
        />
      </Header>
      <Cart
        isDialogOpen={isDialogOpen}
        handleDialogClose={handleDialogClose}
        products={allProducts}
        items={cartData}
        handleQuantity={handleQuantity}
      />

      <TextField
        className="search-mobile"
        size="small"
        fullWidth
        onChange={(event) => {
          debounceSearch(event, timeoutId);
        }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Search color="primary" />
            </InputAdornment>
          ),
        }}
        placeholder="Search for items/categories"
        name="search"
      />
      <Box sx={{ width: "100%", padding: "20px" }}>
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid item className="product-grid">
            <Box className="hero">
              <p className="hero-heading">
                India’s <span className="hero-highlight">FASTEST DELIVERY</span>{" "}
                to your door step
              </p>
            </Box>
          </Grid>
          {isloading ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                width: "100vw",
                height: "100px",
                AlignItems: "center",
              }}
            >
              <Stack
                direction="column"
                justifyContent="center"
                alignItems="center"
                spacing={2}
              >
                <CircularProgress />
                <p>Loading products…</p>
              </Stack>
            </Box>
          ) : products.length > 0 ? (
            products.map((product) => (
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <Item
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: "1rem",
                  }}
                >
                  <ProductCard
                    product={product}
                    handleAddToCart={handleAddToCart}
                  />
                </Item>
              </Grid>
            ))
          ) : (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                width: "100vw",
                height: "200px",
                AlignItems: "center",
              }}
            >
              <Stack
                direction="column"
                justifyContent="center"
                alignItems="center"
                spacing={2}
              >
                <SentimentDissatisfied color="action" />
                <p>No products found...</p>
              </Stack>
            </Box>
          )}
        </Grid>
      </Box>
      <Footer />
    </div>
  );
};

export default Products;
