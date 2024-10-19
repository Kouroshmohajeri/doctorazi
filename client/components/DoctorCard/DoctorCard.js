import * as React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

export default function DcotorCard({
  name,
  speciality,
  image,
  alt,
  buttonText,
}) {
  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardMedia component="img" alt={alt} height="180" image={image} />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {speciality}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="large">{buttonText}</Button>
      </CardActions>
    </Card>
  );
}
