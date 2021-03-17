import { State } from "./state";
import { driver } from "./utils";

export function setRandomName<T>(obj: any): T {
  const objCloned = { ...obj };

  const branchSegments = State.gitBranchName.split('/');

  const largeSegment = branchSegments.length > 1 ? branchSegments[1] : branchSegments[0];
  const prefixSegment = branchSegments.length > 1 ? `${branchSegments[0][0]}/` : '';
  const endIndex = largeSegment.length > 15 ? 15 : largeSegment.length;

  const branch =`${prefixSegment}${largeSegment.slice(0, endIndex)}`;
  
  objCloned.name = `${objCloned.name} ${new Date().getTime()} ${branch}`;
  return objCloned;
}

export async function setMultipleRandomName<T>(objs: T[]): Promise<T[]> {
  const objsCloned = [];
  for (const obj of objs) {
    const objRandom: T = setRandomName(obj);
    objsCloned.push(objRandom);
    await driver.sleep(5);
  }
  return objsCloned;
}