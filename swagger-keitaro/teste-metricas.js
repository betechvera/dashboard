import axios from "axios";

const url = "https://go.betvera.info/admin_api/v1/report/build";
const apiKey = "629d9090c9f4c3a2390f534f91b046dd";

const params = {
  range: {
    from: "2025-01-01",
    to: "2025-01-07",
    timezone: "Europe/Madrid",
  },
  dimensions: ["ts", "landing"],
  metrics: ["clicks", "bot_share", "cr", "cpc"],
  filters: [{ name: "campaign_id", operator: "EQUALS", expression: 5149 }],
};

axios
  .post(url, params, {
    headers: {
      "Content-Type": "application/json",
      "Api-Key": apiKey,
    },
  })
  .then((response) => {
    console.log(response.data);
  })
  .catch((error) => {
    console.error("Error:", error);
  });
