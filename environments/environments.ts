import { ENVIRONMENT_LOCAL } from "./environment.local";
import { ENVIRONMENT_DEV } from "./environment.dev";
import { ENVIRONMENT_QA } from "./environment.qa";
import { ENVIRONMENT_STAGE } from "./environment.stage";

export interface User {
  username: string;
  password: string;
}


export interface Environment {
  url: string;
  apiUrl: string;
  currentUser?: User,
  users: {
    user1: User,
    user2: User,
    user3: User
  },  
}

export function currentEnvironment() {
  const env = `${process.env.NODE_ENV}`.trim();

  let environment: Environment;
  switch (env) {
    case "local": environment = ENVIRONMENT_LOCAL; break;
    case "dev": environment = ENVIRONMENT_DEV; break;
    case "qa": environment = ENVIRONMENT_QA; break;
    case "stage": environment = ENVIRONMENT_STAGE; break;
    default: environment = ENVIRONMENT_DEV; break;
  }

  return environment;
}
