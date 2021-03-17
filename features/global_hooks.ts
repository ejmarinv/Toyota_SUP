import { After, AfterAll, BeforeAll } from "cucumber";
import { LogoutPage } from "~pages/session_page";
import { State } from "~utils/state";
import { TimeOutOptions } from "~utils/times.constant";
import { driver, initConfig, technicianRequest, vehicleRequest, dealerConfigRequest} from "~utils/utils";

BeforeAll(async () => {
  await initConfig();
});

After({ timeout: TimeOutOptions.huge }, async () => {
  const logoutPage = new LogoutPage();
  await logoutPage.logout();
});


After({ timeout: TimeOutOptions.huge }, async () => {
  await vehicleRequest.deleteVehicleBatch(State.createdVehicleIds);
  await vehicleRequest.deleteVehicleByVinBatch(State.createdVehicleVins);
  await technicianRequest.deleteTechniciansBatch(State.createdTechnicians);
  await dealerConfigRequest.deleteMetricsByIdBatch(State.createdBaselinesMetrics);
  State.clear();
});

AfterAll(async () => {
  await driver.close();
});


