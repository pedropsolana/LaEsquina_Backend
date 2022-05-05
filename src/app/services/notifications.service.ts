import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
  })

export class NotificationsService  {
    url: string = 'https://fcm.googleapis.com/fcm/send';

    constructor (private http: HttpClient) { }

    sendPostRequest(estado: string, token: string) {
        let mensaje: string="";
        console.log("el token es:"+ token);
        if (estado === '1') {
            mensaje="Su pedido esta preparandose, le avisamos cuando esté listo para recoger. Gracias";     
          } else if (estado === '2') {
            mensaje="Su pedido está listo, puede recogerlo. Gracias";
          }
         const headers = new HttpHeaders()
             .set('cache-control', 'no-cache')
             .set('content-type', 'application/json')
             .set('Authorization', 'key=AAAAjzkrNZg:APA91bF25Zy7kWLPttUKXX8EbQPaAmBgxK5ga-8yRhsqu8JmN-kVtAzzN691Ghyt36T85MZGz9i15djOge3Pix6Z8UjU3CAyfOXpcSja-yrZ8FYrH8Uw42CuamqcVnybdm-93fwsWGqr');

         const body = {
            "notification": {
                "title": "AVISO",
                "body": mensaje,
                // "icon": "../assets/img/logo2.png",
            },
            "to": token
        }

         return this.http
                    .post(this.url, body, { headers: headers })
                    .subscribe(res => console.log(res));
    }

}