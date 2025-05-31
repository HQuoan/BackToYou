import * as signalR from '@microsoft/signalr';

export const notificationHub = new signalR.HubConnectionBuilder()
    .withUrl("https://localhost:5055/hubs/notification", {
          withCredentials: true
    })
    .withAutomaticReconnect()
    .build();


export default notificationHub;
