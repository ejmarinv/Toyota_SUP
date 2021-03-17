import { Vehicle } from "~models/vehicle.model";

export class State {
  static token: string;

  static gitBranchName: string;

  static createdVehicleIds: string[] = [];
  static createdVehicleVins: string[] = [];
  static createdTechnicians: string[] = [];

  static selectedPhones: string[] = [];
  static createdBaselinesMetrics: string[] = [];

  static addCreatedVehicles(info: string | Vehicle[]) {
    if (typeof info === 'string') {
      State.createdVehicleIds.push(info);
    } else {
      info.forEach(vehicle => State.createdVehicleIds.push(vehicle.id));
    }
  }

  static addCreatedVehiclesByVin(vin: string) {
    State.createdVehicleVins.push(vin);
  }

  static addCreateTechnician(phone: string) {
    State.createdTechnicians.push(phone);
  }

  static addSelectedPhone(phone: string) {
    State.selectedPhones.push(phone);
  }

  static addSelectedMetricsById(id: string) {
    State.createdBaselinesMetrics.push(id);
  }

  static clear() {
    this.token = null;
    this.createdVehicleIds = [];
    this.createdVehicleVins = [];
    this.createdTechnicians = [];
    this.selectedPhones = [];
    this.createdBaselinesMetrics = [];
  }

}
