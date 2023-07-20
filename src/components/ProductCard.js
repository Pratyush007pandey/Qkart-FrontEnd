import { AddShoppingCartOutlined } from "@mui/icons-material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { CardActionArea } from "@mui/material";
import { Button, CardActions, Rating } from "@mui/material";
import React from "react";
import "./ProductCard.css";

const ProductCard = ({ product, handleAddToCart }) => {
  const { cost, name, image, rating, _id } = product;
  return (
    <Card className="card" varient="outlined" id={_id}>
      <CardActionArea>
        <CardMedia
          component="img"
          height="250"
          image={image}
          alt="Product Image"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {name}
          </Typography>
          <Typography gutterBottom variant="h6" component="h3">
            ${cost}
          </Typography>
          <Rating name="read-only" value={rating} readOnly />
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Button
          variant="contained"
          size="large"
          fullWidth
          onClick={handleAddToCart}
          value={_id}
          className="button"
        >
          ADD TO CART
        </Button>
      </CardActions>
    </Card>
  );
};

export default ProductCard;
