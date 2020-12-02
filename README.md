# TeslaStreaming

[![Build Status](https://travis-ci.com/wzr1337/teslaStreaming.svg?branch=master)](https://travis-ci.com/wzr1337/teslaStreaming)

This module is used to connect to and listen on the Tesla streaming API, exposed via WebSocket. The API is a convenience method in extension of the regular REST API (<https://teslaapi.io>), which needs to be polled.

This module is **UNOFFICIAL**.

## prerequisites

In order to use the streaming API, you need to obtain an `access_token` via the auth REST API.

## Installation

Add this module to your project using

`$ npm i teslastreaming`

## Usage

The following example stores a log of messages into an array, a very basic logger if you will:

```typescript
import { teslaAPI } from "./index";

const vehicleId = '<yourVehicleId>';
const token = '<yourAccessToken>';

const messages = [];

teslaAPI(vehicleId, token).subscribe((event)=> {
  messages.push(event);
  console.log(`messages received: ${messages.length}`);
  console.log(`Tesla says: ${JSON.stringify(event, null, 2)}`)
});
```
