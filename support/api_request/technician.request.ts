import { Environment } from "~environments/environments";
import { Technician } from "~models/technician.model";
import { makeHttpDelete, makeHttpGet, makeHttpPost, makeHttpPut } from "./api-base.request";

export class TechnicianRequest {

  public readonly techniciansPath = 'technician';

  constructor(private env: Environment) { }

  prepareTechnician(technician: Technician): any {
    return {
      ...technician
    }
  }

  async createTechnician(technician: Technician): Promise<any> {
    const technicianBody = this.prepareTechnician(technician);
    return makeHttpPost(this.env, this.techniciansPath, technicianBody);
  }

  async getTechnicians(): Promise<any> {
    return makeHttpGet(this.env, this.techniciansPath);
  }

  async deleteTechnicians(phone: string): Promise<any> {
    return makeHttpDelete(this.env, this.techniciansPath, phone);
  }

  async updateTechnicians(phone: string, technician: Technician): Promise<any> {
    return makeHttpPut(this.env, this.techniciansPath, phone, technician);
  }

  async deleteTechniciansBatch(phones: string[]) {
    for(const phone of phones){
      await this.deleteTechnicians(phone);
    }
  }

}