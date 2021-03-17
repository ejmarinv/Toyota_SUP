import { Environment } from "~environments/environments";
import { Vehicle, VehicleToRequest } from "~models/vehicle.model";
import { makeHttpDelete, makeHttpGet, makeHttpPatch, makeHttpPost } from "./api-base.request";

export class VehicleRequest {

  public readonly vehiclesPath = 'vehicle';

  constructor(private env: Environment) {
  }

  prepareVehicle(vehicle: Vehicle): any {
    return {
      ...vehicle
    }
  }

  async createVehiclesApiBatch(vehicles: VehicleToRequest[]): Promise<Vehicle[]> {
    const vehiclesResponse: Vehicle[] = [];
    for (const vehicle of vehicles) {
      const vehicleResp: Vehicle = await this.createVehicleApi(vehicle);
      vehiclesResponse.push(vehicleResp);
    }
    return vehiclesResponse;
  }

  async createVehicleApi(vehicle: VehicleToRequest): Promise<Vehicle> {
    const body = this.prepareVehicle(vehicle);
    return await makeHttpPost(this.env, this.vehiclesPath, body);
  }

  async moveVehiclesApiBatch(nextStepsAndIds: [idVehicle: string, nextStep: string, lastTimeMoved?: string][]): Promise<Vehicle[]> {
    const vehiclesResponse: Vehicle[] = [];
    for (const nextStepId of nextStepsAndIds) {
      const vehicleResp: Vehicle = await this.moveVehicleStepApi(nextStepId[0], nextStepId[1], nextStepId[2]);
      vehiclesResponse.push(vehicleResp);
    }
    return vehiclesResponse;
  }

  async moveVehicleStepApi(id: string, nextStep: string, lastTimeMoved?: string): Promise<Vehicle> {
    const urlVehicle = `${this.vehiclesPath}/move`;
    return await makeHttpPatch(this.env, urlVehicle, id, { nextStep, lastTimeMoved });

  }

  async getAllVehiclesByDealer(): Promise<Vehicle[]> {
    return await makeHttpGet(this.env, this.vehiclesPath);
  }

  async deleteVehicle(id: string): Promise<any> {
    return await makeHttpDelete(this.env, this.vehiclesPath, id);
  }

  async deleteVehicleBatch(ids: string[]): Promise<any> {
    for (const id of ids) {
      await this.deleteVehicle(id);
    }
  }

  async deleteVehicleByVinBatch(vins: string[]): Promise<any> {
    const vehicles = await this.getAllVehiclesByDealer();
    const vehiclesToDelete = vehicles
      .filter(vehicle => vins.includes(vehicle.vin));

    const ids = vehiclesToDelete.map(vehicle => vehicle.id);
    await this.deleteVehicleBatch(ids);
  }

  async getVehicleStepsRecordByAPI(vehicleId:string):Promise<Vehicle>{
    const urlStepsRecord = `${this.vehiclesPath}/steps/${vehicleId}`;
    return await makeHttpGet(this.env, urlStepsRecord);
  }

}

