const _ = require('lodash');

const mapSeries = require('async/mapSeries');
const eachSeries = require('async/eachSeries');
const DIGAPI = require('../utils/dig-api');
const dataRepo = require('../repositories/data.rep');

const { readFile, writeFile } = require('../utils/file.utils');
const { log, errorLog } = require('../utils/utils');

const { ITERATIONS, MA_USERNAME, MA_PASSWORD, PROTOCOL_ID, MAX_REPORTS } = process.env;

class Tasks {
  #api;
  #token = {};
  #imeis = [];
  #sn = [];
  #changes = [];
  #modifiedChanges = [];

  init = async () => {
    //Iniliazimos api con credenciales de mygeotab para conectarnos
    this.#api = new DIGAPI({ username: MA_USERNAME, password: MA_PASSWORD });
    await this.#readAuthTokens();
    await this.#readDataTokens();
    this.#imeis = ['869066060003234', '860121060005835', '869066060001964', '867162029159696'];

    this.#sn = [
      {
        imei: "867162029612603",
        serialNumber: "K9D6215BEB66",
      },
      // {
      //   imei: "867162029159696",
      //   serialNumber: "K9D4215BEB64",
      // },
      // {
      //   imei: "867162029504297",
      //   serialNumber: "K9D8215BEB68",
      // },
      // {
      //   imei: "867162029498961",
      //   serialNumber: "K9D7215BEB67",
      // },
      // {
      //   imei: "867162029372125",
      //   serialNumber: "K9D5215BEB65",
      // },
      // {
      //   imei: "867162029376753",
      //   serialNumber: "K9D9215BEB69",
      // },
      // {
      //   imei: "863457051738498",
      //   serialNumber: "K9DA215BEB6A",
      // }
    ]
  };

  #readAuthTokens = async () => {
    const filePath = '../tokens.json';
    const tokens = await readFile(filePath);
    if (tokens) {
      this.#api.setCredentials(tokens);
    } else {
      await this.#api.authenticate();
      const { bearerToken, refreshToken } = this.#api;
      await writeFile(filePath, JSON.stringify({ bearerToken, refreshToken }));
    }
  };

  #readDataTokens = async () => {
    const token = await readFile('../tokens/records.json');
    this.#token = token || { alarmId: 0, heartbeatId: 0, locationId: 0, loginId: 0, transferId: 0 };
  };

  main = async () => {
    try {
      //Traerme los records del GPSRecords
      //Estos records son la info de los devices que esta en la bd 
      const records = await this.#getData(); //Obtenemos data de gps Records

      if (records) { //Tienes records?
        const chunks = _.chunk(records, 1000);
        await eachSeries(chunks, async chunk => {
          await this.#api.addRecords(chunk); //Chunk debe tener los devices que se van agregar
        });
      }
      console.log("Tarea Terminada");
      return true;
    } catch (ex) {
      console.log(ex.message);
      return ex.message;
    }
  };

  #getData = async () => {
    const { alarmId, heartbeatId, locationId, loginId, transferId } = this.#token;
    const devicesInfo = await dataRepo.findDevices(locationId, this.#imeis);

    const arrayDevices = mapDevices(devicesInfo);

    let gpsRecord = []; //Para insertarlo a mygeotab

    arrayDevices.data.forEach(gps => {
      const serialNo = this.#sn.find(e => e.imei === gps.IMEI)?.serialNumber;
      if (serialNo){
        const { ActualDateUTC, Latitude, Longitude, Speed } = gps;
        const dateTime = ActualDateUTC;
        gpsRecord.push(this.#createGpsRecord({ serialNo, dateTime, Latitude, Longitude, Speed }));
      }      
    });

    return [...gpsRecord].filter(e => e);
  };

  #createGpsRecord = ({ serialNo, dateTime, Latitude, Longitude, Speed }) => {
    const isIgnitionOn = true;
    return { type: 'GpsRecord', serialNo, dateTime, Latitude, Longitude, Speed, isGpsValid: true, isIgnitionOn };
  };

}

function mapDevices (devicesInfo) {
  const arrayDevices = {
    code: '',
    status: '',
    message: '',
    data: []
  }
  if(devicesInfo){
    for (let i = 0; i < devicesInfo.length; i++) {
      const element = devicesInfo[i].dataValues;
      arrayDevices.data.push(element);
    }
  }
  arrayDevices.code = 200;
  arrayDevices.status = true;
  arrayDevices.message = "Registros Encontrados"

  return arrayDevices;
}

module.exports = new Tasks();
