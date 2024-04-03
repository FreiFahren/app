import { http, HttpResponse } from "msw";
import { setupServer } from "msw/native";

import { config } from "../src/config";
import {
  linesResponse,
  recentResponse,
  stationsResponse,
} from "./api-responses";

const apiRoute = (route: string) => `${config.FF_API_BASE_URL}${route}`;

export const server = setupServer(
  http.get(apiRoute("/recent"), () => {
    return HttpResponse.json(recentResponse);
  }),
  http.get(apiRoute("/list"), (info) => {
    const url = new URL(info.request.url);

    const wantsLines = url.searchParams.get("lines") === "true";
    const wantsStations = url.searchParams.get("stations") === "true";

    if (!wantsStations && !wantsLines) {
      return HttpResponse.json({
        lines: linesResponse,
        stations: stationsResponse,
      });
    }

    return HttpResponse.json(wantsLines ? linesResponse : stationsResponse);
  }),
  http.post(apiRoute("/newInspector"), () => {
    return HttpResponse.json({ success: true });
  })
);
