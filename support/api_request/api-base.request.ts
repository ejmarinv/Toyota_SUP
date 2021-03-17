import axios from "axios";
import { Environment } from "~environments/environments";
import { getToken } from "~utils/utils";


export async function makeHttpPost(env: Environment, urlDef: any, data: any) {
  let response;
  try {
    response = await axios.post(
      `${env.apiUrl}${urlDef}`,
      data,
      { headers: { 'Authorization': (await getToken()) } }
    );
  } catch (error) {
    console.log(error);
    return undefined;
  }
  return response.data;
}

export async function makeHttpGet(env: Environment, urlDef: any) {
  let response;
  try {
    response = await axios.get(
      `${env.apiUrl}${urlDef}`,
      { headers: { 'Authorization': (await getToken()) } }
    );
  } catch (error) {
    console.log(error);
    return undefined;
  }
  return response.data;
}

export async function makeHttpDelete(env: Environment, urlDef: any, id: any) {
  let response;
  try {
    response = await axios.delete(
      `${env.apiUrl}${urlDef}/${encodeURI(id)}`,
      { headers: { 'Authorization': (await getToken()) } }
    );
    return response.data;
  } catch (error) {
    console.error(error);
    return undefined;
  }
}

export async function makeHttpPatch(env: Environment, urlDef: any, id: any, body:any) {

  try {
    const response = await axios.patch(`${env.apiUrl}${urlDef}/${encodeURI(id)}`,
      body,
      { headers: { 'Authorization': (await getToken()) } }
    );
    return response.data;
  } catch (error) {
    console.log(error);
    return undefined;
  }

}

export async function makeHttpPut(env: Environment, urlDef: any, id: any, body: any) {

  try {
    const response = await axios.put(`${env.apiUrl}/${urlDef}/${encodeURI(id)}`,
      body,
      { headers: { 'Authorization': (await getToken()) } }
    );
    return response.data;
  } catch (error) {
    console.log(error);
    return undefined;
  }

}


