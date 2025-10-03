import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CallJsonApisService {
  httpClient = inject(HttpClient)
BASE_URL = 'assets/apis'

getDailyReports(){
  return this.httpClient.get<any>(`${this.BASE_URL}/dailyReports.json`)
}
getProjects(){
  return this.httpClient.get<any>(`${this.BASE_URL}/projects.json`)
}
getTasks(){
  return this.httpClient.get<any>(`${this.BASE_URL}/tasks.json`)
}
getUsers(){
  return this.httpClient.get<any>(`${this.BASE_URL}/users.json`)
}
getUsersById(id: string){
  return this.httpClient.get<any>(`${this.BASE_URL}/users/${id}.json`)
}
}
