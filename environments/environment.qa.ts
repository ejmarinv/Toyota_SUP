import { Environment } from "./environments";

export const ENVIRONMENT_QA: Environment = {

  url: 'https://dealer.qa.toyota.com/sup',
  apiUrl: 'https://c1iznw8p1a.execute-api.us-west-2.amazonaws.com/qa/',
  users: {
    user1: { username: 'CANTORA2', password: 'ToyotaLexus12' },
    user2: { username: 'THACKEJ', password: 'ToyotaLexus123' },
    user3: { username: 'GOLDSMD', password: 'ToyotaLexus123' }
  }
}
