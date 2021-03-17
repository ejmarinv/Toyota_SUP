import * as fs from 'fs';
import csv = require('csv-parser');
import * as path from 'path';

export function getFullPath(filePath: string): string {
  return path.join(process.cwd(), filePath);
}

export function openCsv(fileName: string): Promise<any[]> {
  return new Promise((resolve, reject) => {
    const results: any[] = [];
    fs.createReadStream(path.join(process.cwd(), fileName))
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', (error) => reject(error));
  });
}

export function removeFile(fileName:string):Promise<void>{
  return new Promise((resolve, reject)=>{
    fs.unlink(path.join(process.cwd(), fileName), (error)=>{
      if(error  == null){
        resolve();
      }else{
        reject(error)
      }
    });
  });  
}