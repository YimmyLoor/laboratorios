import { HttpHeaders } from "@angular/common/http";


export const environment = {
  production: true,
  rutaApi:"http://190.15.136.142/api/",
  tokenApp:'2022052617574171A30',
  options:{
    headers:new HttpHeaders(
      {
        'Content-Type':'application/json; charset=UTF-8',
      }
    )
  },
};
