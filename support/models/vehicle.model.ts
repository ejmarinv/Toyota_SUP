export type AcquisitionMethod = 'auction' | 'dealer' | 'individual' | 'trade';
export type TransmissionType = 'auto' | 'manual';
export type InteriorTrim = 'fabric' | 'leather' | 'vinyl';

export interface Vehicle {
  id?: string;
  vin: string;
  mileage: number;
  brand: string;
  modelYear: number;
  modelDescription: string;
  extColor: string;
  intColor: string;
  retailPrice: number;
  acv: number;
  acquisitionDate: string;
  acquisitionMethod: AcquisitionMethod;
  transmissionType?: TransmissionType;
  interiorTrim?: InteriorTrim;
}

export interface VehicleToRequest extends Vehicle {
  creationDate?: string;
  lastTimeMoved?: string;
}
