import http from "k6/http";
import { check, sleep, group } from "k6";

export let options = {
  thresholds: {
    "group_duration{group:::firstGroup}": [
      "p(90)<5000", // Transactions shall not exceed 5 secs for 90% of the time
      "p(95)<7000", // Transactions shall not exceed 7 secs for 95% of the time
    ],
    http_req_failed: ["rate<0.02"], // Transaction failure rate shall not exceed 2% for all benchmark test scenario
  },

  scenarios: {
    normal_concurrent_load_factor: {
      executor: "ramping-vus",
      startVUs: 0,
      stages: [
        { duration: "10s", target: 10 },
        { duration: "20s", target: 20 },
        { duration: "20s", target: 20 },
        { duration: "20s", target: 0 },
      ],
    },
  },
};

export default function () {
  group("firstGroup", function () {
    const response = http.get("https://test.k6.io");

    check(response, {
      "status is 200": (r) => r.status === 200,
    });

    sleep(1);
  });
}
