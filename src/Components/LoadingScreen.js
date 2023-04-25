import React from "react";
import { Box, CircularProgress } from "@mui/material";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles({
  root: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#0D1A29",
  },
});

const LoadingScreen = () => {
  const classes = useStyles();
  return (
    <Box className={classes.root}>
      <CircularProgress color="secondary" />
    </Box>
  );
};

export default LoadingScreen;
