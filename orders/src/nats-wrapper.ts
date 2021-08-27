import { Stan, connect } from 'node-nats-streaming';

class NatsWrapper {
  private _client?: Stan;

  get client() {
    if(!this._client) {
      throw new Error('cannot access to NATS before connected');
    }

    return this._client;
  }

  connect(clusterId: string, clientId: string, url: string) {
    this._client = connect(clusterId, clientId, {url});
    
    return new Promise((resolve, reject) => {
      this.client.on("connect", () => {
        console.log("connecting with nats.");
        resolve({});
      });


      this.client.on("error", (err) => {
        reject(err);
      })
    });
  }
}

export const nats = new NatsWrapper();