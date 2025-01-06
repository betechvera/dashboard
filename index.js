// (async () => {
//   const test = fetch(
//     "https://go.betvera.info/admin_api/v1/traffic_sources/69",
//     {
//       headers: { "Api-Key": "fd54c3e353c0a26e767217829b0121d2" },
//     }
//   ).then((res) => res.json()).then(data => console.log(data));
// })();

const hourToMinutes = (hour) => {
  const parts = hour.split(":");

  const thisHour = Number(parts[0]);
  const minutes = Number(parts[1]);
  const seconds = Number(parts[2]);

  return thisHour * 60 * 60 + minutes * 60 + seconds;
};

const encrypt = (word) => {
  if (typeof word !== "string")
    throw new Error("A palavra precisa ser uma string.");

  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  return Array.from(word)
    .map((letter) => alphabet.indexOf(letter.toUpperCase()) + 1)
    .join("");
};

console.log(encrypt("AMOR"));

const ordenedList = (num) => {
  if (typeof num !== "number") throw new Error("Insira um número.");

  return String(num)
    .split("")
    .sort((a, b) => Number(a) - Number(b))
    .map((str) => Number(str));
};
