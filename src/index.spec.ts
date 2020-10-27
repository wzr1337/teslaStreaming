// mock websocket server
import { Subject } from "rxjs";
import {parseMessage, teslaAPI} from "./index";
import WebSocket from "ws";

describe('index', () => {
  beforeAll(() => {
  })

  it('should pass', () => {
    expect(true).toBeTruthy();
  });

  xit('teslaAPI', async () => {
    const stream = teslaAPI("1337", "notAJWT", ['speed', 'odometer'], "ws://localhost:1234");
    expect(stream).toBeInstanceOf(Subject);
  })

  it('parsemessage throwing', async () => {
    try {
      expect(parseMessage({data: Buffer.from("foo", "utf-8")} as WebSocket.MessageEvent, ['speed', 'odometer', 'soc'])).toThrow();
    } catch (error) {
    }
  })

  it('parsing empty message', async () => {
    const mockMessage = {
    }
    const message = parseMessage({data: Buffer.from(JSON.stringify(mockMessage), "utf-8")} as WebSocket.MessageEvent, ['speed', 'odometer', 'soc']);
    expect(message).toBeDefined();
  })

  it('parsing message partly', async () => {
    const mockMessage = {
      msg_type: 'data:update',
      tag: '703761509',
      value: '1603829556390,,2748.6,30,94,89,52.400612,10.717622,0,,90,61,90,'
    }
    const message = parseMessage({data: Buffer.from(JSON.stringify(mockMessage), "utf-8")} as WebSocket.MessageEvent, ['speed', 'odometer', 'soc']);
    expect(message).toBeDefined();
    expect(message).toEqual({
      "timestamp": "1603829556390",
      "speed": "",
      "odometer": "2748.6",
      "soc": "30"
    });
  });

  it('parsing message', async () => {
      const mockMessage = {
        msg_type: 'data:update',
        tag: '703761509',
        value: '1603829556390,,2748.6,30,94,89,52.400612,10.717622,0,,90,61,90,'
      }
      const  signalNames = ['speed', 'odometer', 'soc', 'elevation', 'est_heading', 'est_lat', 'est_lng', 'power', 'shift_state', 'range', 'est_range', 'heading', 'locked' ];
      const message = parseMessage({data: Buffer.from(JSON.stringify(mockMessage), "utf-8")} as WebSocket.MessageEvent, signalNames);
      expect(message).toBeDefined();
      expect(message).toEqual({
        "timestamp": "1603829556390",
        "speed": "",
        "odometer": "2748.6",
        "soc": "30",
        "elevation": "94",
        "est_heading": "89",
        "est_lat": "52.400612",
        "est_lng": "10.717622",
        "power": "0",
        "shift_state": "",
        "range": "90",
        "est_range": "61",
        "heading": "90",
        "locked": ""
      });
  })

  afterAll(() => {
    jest.resetAllMocks();
  });
});