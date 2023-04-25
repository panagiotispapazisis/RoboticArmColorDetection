import React, { useEffect, useState } from "react";
import _ from "lodash";

let tempServoGripper = 0;
let tempServoBase = 0;
let tempServoShoulder = 0;
let tempTriggerSensor = false;
let tempColorValue = "";

let hexColor = "#ffffff";

var ws = new WebSocket("ws://160.40.91.240:81/ws");

function App() {
  const [connected, setConnected] = useState(false);
  const [servoGripper, setServoGripper] = useState(0);
  const [servoBase, setServoBase] = useState(0);
  const [servoShoulder, setServoShoulder] = useState(0);
  const [triggerSensor, setTriggerSensor] = useState(false);
  const [colorValue, setColorValue] = useState("");

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
          console.log("different servo gripper: ", tempServoGripper);
          setServoGripper(tempServoGripper);
        }
        if (tempServoBase !== servoBase) {
          console.log("different servo base: ", tempServoBase);
          setServoBase(tempServoBase);
        }
        if (tempServoShoulder !== servoShoulder) {
          console.log("different servo shoulder: ", tempServoShoulder);
          setServoShoulder(tempServoShoulder);
        }
        if (tempTriggerSensor !== triggerSensor) {
          console.log("different trigger sensor: ", tempTriggerSensor);
          setTriggerSensor(tempTriggerSensor);
        }
        if (tempColorValue !== colorValue) {
          console.log("different color value: ", tempColorValue);
          setColorValue(tempColorValue);
          const colorArray = tempColorValue.split(",");
          const r = parseInt(colorArray[0]);
          const g = parseInt(colorArray[1]);
          const b = parseInt(colorArray[2]);
          hexColor = `#${r.toString(16)}${g.toString(16)}${b.toString(16)}`;
        }
      };
    }
  };

  useEffect(() => {
    readFromSocket();
  });

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
      ws.send(`${key}${value}`);
    }
  };

  return (
    <div className="app">
      <main className="content">
        <h1> {connected ? "Connected" : "Disconnected"}</h1>
        <h2>Servo Gripper: {servoGripper}</h2>
        <input
          type="range"
          min="0"
          max="180"
          value={servoGripper}
          onChange={(e) => sendToSocket("servo_gripper", e.target.value)}
        />
        <h2>Servo Base: {servoBase}</h2>
        <input
          type="range"
          min="0"
          max="180"
          value={servoBase}
          onChange={(e) => sendToSocket("servo_base", e.target.value)}
        />
        <h2>Servo Shoulder: {servoShoulder}</h2>
        <input
          type="range"
          min="0"
          max="180"
          value={servoShoulder}
          onChange={(e) => sendToSocket("servo_shoulder", e.target.value)}
        />

        <button
          onClick={() =>
            sendToSocket("trigger_sensor", triggerSensor ? "0" : "1")
          }
        >
          Trigger
        </button>
        <h2
          style={{
            backgroundColor: hexColor,
          }}
        >
          color Value {colorValue}
        </h2>
      </main>
    </div>
  );
}

export default App;
