#! /usr/bin/env node
import WebSocket from "ws";
import {Subject} from 'rxjs';


export function parseMessage(event: WebSocket.MessageEvent, signalNames:string[]): { [signalname: string]: string | number | boolean; } {
  if (! event.data) throw new Error("Missing data");
  
  let data: { [signalname: string]: string | number | boolean; } = {};
  const payload = JSON.parse(event.data.toString());
  if (payload.value && payload.msg_type === 'data:update') {
    const values = payload.value.split(',');
    data = {
      timestamp: values[0]
    };
    for (let signal of signalNames) {
      data[signal] = values[signalNames.indexOf(signal) + 1];
    }
  }
  return data;
}

export function teslaAPI(vehicleId:string,
  oAuthToken:string,
  signalNames = ['speed', 'odometer', 'soc', 'elevation', 'est_heading', 'est_lat', 'est_lng', 'power', 'shift_state', 'range', 'est_range', 'heading', 'locked' ],
  streamingUrl = 'wss://streaming.vn.teslamotors.com/streaming/'):Subject<{}> {
  const sub = new Subject<{}>();


  /*   
  const subscribeMessage = {
    msg_type: 'data:subscribe',
    token: Buffer.from(`${email}:${vehilce1stToken}`).toString('base64'),
    value: signalNames.join(','),
    tag: vehicleId,
  }; */

  const subscribeMessageOAuth = {
    msg_type: 'data:subscribe_oauth',
    token: oAuthToken,
    value: signalNames.join(','),
    tag: vehicleId,
  };

  const ws = new WebSocket(streamingUrl);

  ws.onmessage = (event) => {
    sub.next(parseMessage(event, signalNames));
  }

  ws.onerror = (err) => {
    console.log(`Error: ${err}`)
  }

  ws.onopen = () => {
    console.debug(`WebSocket connection established on \`${streamingUrl}\``);
    ws.send(JSON.stringify(subscribeMessageOAuth));
  }

  return sub;
}
