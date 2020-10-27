import { teslaAPI } from "./index";

const vehicleId = '';
const token = '';

const messages = [];

teslaAPI(vehicleId, token).subscribe((event)=> {
  messages.push(event);
  console.log(`messages received: ${messages.length}`);
  console.log(`Tesla says: ${JSON.stringify(event, null, 2)}`)
});