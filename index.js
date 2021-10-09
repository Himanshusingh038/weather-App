// 8d99458f268162273097437abc066227
// https://api.openweathermap.org/data/2.5/weather?q=ranchi&appid=fda4fdb514c0d5f0fcf3d52800bbe517
require('dotenv').config();
const http = require("http");
const fs = require("fs");
var requests = require("requests");

//getting the home.Html file 

const homefile = fs.readFileSync("home.html", "utf-8");// we don't want file to be read multiple times
const replaceVal = (tempVal, orgVal) => {
    let temperature = tempVal.replace("{%tempval%}", Math.round(orgVal.main.temp-273));
    temperature = temperature.replace("{%tempmin%}", Math.round(orgVal.main.temp_min-273));
    temperature = temperature.replace("{%tempmax%}", Math.round(orgVal.main.temp_max-273));
    temperature = temperature.replace("{%location%}", orgVal.name);
    temperature = temperature.replace("{%country%}", orgVal.sys.country);
    temperature= temperature.replace('{%tempstatus%}',orgVal.weather[0].main);
    return temperature;
}
//creating a server
const server = http.createServer((req, res) => {
    if (req.url == '/') {
        requests('https://api.openweathermap.org/data/2.5/weather?q=ranchi&appid=fda4fdb514c0d5f0fcf3d52800bbe517')
            .on("data", (chunk) => {
                const objdata = JSON.parse(chunk);
                const arrData = [objdata];
                // console.log(arrData[0].main.temp);
                const realTimeData = arrData
                    .map((val) => replaceVal(homefile, val))
                    .join("");
                res.write(realTimeData);
                // console.log(realTimeData);
            })
            .on("end", (err) => {
                if (err) return console.log("connection closed due to errors", err);
                res.end();
            });
    } else {
        res.end("File not found");
    }
});
// now we have to listen to the request
server.listen(8000, "127.0.0.1");