import {Vehicle} from "~models/vehicle.model";

export const blackToyotaVehicleTest: Vehicle = {
  acquisitionDate: "2020-12-01",
  acquisitionMethod: 'auction',
  acv: 40000,
  brand: "Toyota",
  extColor: "black",
  intColor: "red",
  mileage: 12000,
  modelDescription: "Red And Black",
  modelYear: 2019,
  retailPrice: 31000,
  vin: "12345678901234567"
}

export const blueLexusVehicleTest: Vehicle = {
  acquisitionDate: "2021-01-15",
  acquisitionMethod: 'individual',
  acv: 55000,
  brand: "Lexus",
  extColor: "blue",
  intColor: "white",
  mileage: 35000,
  modelDescription: "Automation",
  modelYear: 2021,
  retailPrice: 65000,
  vin: "12345678901234568",
  transmissionType: 'manual',
  interiorTrim: 'vinyl'
}

export const vehiclesMock: Vehicle[] = [
  {
    acquisitionDate: "2020-10-10",
    acquisitionMethod: 'auction',
    acv: 40000,
    brand: "Lexus",
    extColor: "blue",
    intColor: "white",
    mileage: 12000,
    modelDescription: "Red And Black",
    modelYear: 2019,
    retailPrice: 31000,
    vin: "1234567890abckrwq",
    transmissionType: 'auto',
    interiorTrim: 'leather'
  }
]

export const greyTeslaVehicleTest: Vehicle = {
  acquisitionDate: "2023-10-27",
  acquisitionMethod: 'trade',
  acv: 88888,
  brand: "Tesla",
  extColor: "blue",
  intColor: "white",
  mileage: 35000,
  modelDescription: "Automation",
  modelYear: 2021,
  retailPrice: 65000,
  vin: "12345678901234568",
  transmissionType: 'manual',
  interiorTrim: 'vinyl'
}