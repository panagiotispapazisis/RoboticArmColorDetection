import React, { useEffect, useState } from "react";
import LoadingScreen from "./Components/LoadingScreen";
import {
  Box,
  Grid,
  Card,
  CardHeader,
  CardContent,
  Button,
  Typography,
  Slider,
  Container,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { GetColorName } from "hex-color-to-color-name";
import TouchAppIcon from "@mui/icons-material/TouchApp";

const useStyles = makeStyles({
  root: {
    padding: "20px",

    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0D1A29",
    height: "100vh",
  },
  btn: {
    height: "100%",
  },
  card: {
    backgroundColor: "#1A2027",
    color: "#F3F6F9",
  },
});

let tempServoGripper = 0;
let tempServoBase = 0;
let tempServoShoulder = 0;
let tempTriggerSensor = false;
let tempColorValue = "";

var ws = new WebSocket("ws://160.40.91.240:81/ws");

function App() {
  const classes = useStyles();
  const [connected, setConnected] = useState(false);
  const [servoGripper, setServoGripper] = useState(0);
  const [servoBase, setServoBase] = useState(0);
  const [servoShoulder, setServoShoulder] = useState(0);
  const [triggerSensor, setTriggerSensor] = useState(false);
  const [colorValue, setColorValue] = useState("");
  const [loadingForColor, setLoadingForColor] = useState(false);
  const [hexColor, setHexColor] = useState("");

  const readFromSocket = () => {
    if (connected) {
      ws.onmessage = (e) => {
        const data = e.data;
        let [key, value] = data.split(":");

        if (key === "servo_gripper") {
          tempServoGripper = parseInt(value);
        } else if (key === "servo_base") {
          tempServoBase = parseInt(value);
        } else if (key === "servo_shoulder") {
          tempServoShoulder = parseInt(value);
        } else if (key === "trigger_sensor") {
          tempTriggerSensor = parseInt(value);
        } else {
          tempColorValue = value;
        }

        if (tempServoGripper !== servoGripper) {
          //console.log("different servo gripper: ", tempServoGripper);
          setServoGripper(tempServoGripper);
        }
        if (tempServoBase !== servoBase) {
          //console.log("different servo base: ", tempServoBase);
          setServoBase(tempServoBase);
        }
        if (tempServoShoulder !== servoShoulder) {
          //console.log("different servo shoulder: ", tempServoShoulder);
          setServoShoulder(tempServoShoulder);
        }
        if (tempTriggerSensor !== triggerSensor) {
          //console.log("different trigger sensor: ", tempTriggerSensor);
          setTriggerSensor(tempTriggerSensor);
        }
        if (tempColorValue !== colorValue) {
          //console.log("different color value: ", tempColorValue);
          if (tempColorValue !== "") {
            const colorArray = tempColorValue.split(",");
            const r = parseInt(colorArray[0]);
            const g = parseInt(colorArray[1]);
            const b = parseInt(colorArray[2]);
            const hColor = `#${r.toString(16)}${g.toString(16)}${b.toString(
              16
            )}`;
            setHexColor(hColor);
          }
          setColorValue(tempColorValue);
        }
      };
    }
  };

  useEffect(() => {
    readFromSocket();
  });

  useEffect(() => {
    setLoadingForColor(false);
  }, [triggerSensor]);

  useEffect(() => {
    ws.onopen = () => {
      setConnected(true);
      console.log("connected");
    };
    ws.onclose = () => {
      console.log("disconnected");
      setConnected(false);
    };
  }, []);

  const sendToSocket = (key, value) => {
    if (connected) {
      if (key === "trigger_sensor") {
        setLoadingForColor(true);
      }
      ws.send(`${key}${value}`);
    }
  };

  if (loadingForColor) {
    return <LoadingScreen />;
  }

  return (
    <div className="app">
      <main className="content">
        <Box className={classes.root}>
          <Container maxWidth="md">
            <Grid container spacing={2}>
              <Grid item xs={12} md={12}>
                <Card>
                  <CardHeader
                    className={classes.card}
                    title={
                      <Box display="flex" justifyContent="center">
                        <Typography variant="h2" component="div">
                          Control Servo Gripper
                        </Typography>
                      </Box>
                    }
                  />
                  <CardContent className={classes.card}>
                    <Box display="flex" justifyContent="center">
                      <Typography variant="h5" gutterBottom>
                        {servoGripper} degrees
                      </Typography>
                    </Box>
                    <Slider
                      sx={{
                        "& .MuiSlider-markLabel": {
                          color: "#F3F6F9",
                        },
                      }}
                      value={servoGripper}
                      onChange={(e, value) => {
                        sendToSocket("servo_gripper", value);
                      }}
                      min={0}
                      max={180}
                      color="secondary"
                      marks={[
                        {
                          value: 0,
                          label: "0°",
                        },
                        {
                          value: 90,
                          label: "90°",
                        },
                        {
                          value: 180,
                          label: "180°",
                        },
                      ]}
                    />
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={12}>
                <Card>
                  <CardHeader
                    className={classes.card}
                    title={
                      <Box display="flex" justifyContent="center">
                        <Typography variant="h2" component="div">
                          Control Servo Base
                        </Typography>
                      </Box>
                    }
                  />
                  <CardContent className={classes.card}>
                    <Box display="flex" justifyContent="center">
                      <Typography variant="h5" gutterBottom>
                        {servoBase} degrees
                      </Typography>
                    </Box>
                    <Slider
                      value={servoBase}
                      onChange={(e, value) => {
                        sendToSocket("servo_base", value);
                      }}
                      min={0}
                      max={180}
                      color="secondary"
                      sx={{
                        //change the color of mark points
                        "& .MuiSlider-markLabel": {
                          color: "#F3F6F9",
                        },
                      }}
                      marks={[
                        {
                          value: 0,
                          label: "0°",
                        },
                        {
                          value: 90,
                          label: "90°",
                        },
                        {
                          value: 180,
                          label: "180°",
                        },
                      ]}
                    />
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={12}>
                <Card>
                  <CardHeader
                    className={classes.card}
                    title={
                      <Box display="flex" justifyContent="center">
                        <Typography variant="h2" component="div">
                          Control Servo Shoulder
                        </Typography>
                      </Box>
                    }
                  />
                  <CardContent className={classes.card}>
                    <Box display="flex" justifyContent="center">
                      <Typography variant="h5" gutterBottom>
                        {servoShoulder} degrees
                      </Typography>
                    </Box>
                    <Slider
                      value={servoShoulder}
                      onChange={(e, value) => {
                        sendToSocket("servo_shoulder", value);
                      }}
                      sx={{
                        "& .MuiSlider-markLabel": {
                          color: "#F3F6F9",
                        },
                      }}
                      min={0}
                      max={180}
                      color="secondary"
                      marks={[
                        {
                          value: 0,
                          label: "0°",
                        },
                        {
                          value: 90,
                          label: "90°",
                        },
                        {
                          value: 180,
                          label: "180°",
                        },
                      ]}
                    />
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={12}>
                <Card>
                  <CardHeader
                    className={classes.card}
                    title={
                      <Box display="flex" justifyContent="center">
                        <Typography variant="h2" component="div">
                          Color Sensor - Last Value
                        </Typography>
                      </Box>
                    }
                  />
                  <CardContent
                    sx={{
                      bgcolor: hexColor,
                    }}
                  >
                    <Typography gutterBottom align="center" variant="h2">
                      {hexColor !== ""
                        ? `${GetColorName(hexColor)}  ${hexColor}`
                        : "There is No Color. Please Trigger the Sensor"}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={12}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Button
                    className={classes.btn}
                    endIcon={<TouchAppIcon />}
                    color="secondary"
                    variant="contained"
                    onClick={() => {
                      sendToSocket("trigger_sensor", triggerSensor ? "0" : "1");
                    }}
                  >
                    Trigger The Color Sensor
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Container>
        </Box>
      </main>
    </div>
  );
}

export default App;
