type JoinRequest = {
  partyId: string;
  name: string;
};

type JoinResponse = {
  success: boolean;
  sessionId?: string;
  message?: string;
  authToken?: string;
};

type RollRequest = {
  sessionId: string;
  description: string;
  bonus: number;
};

type RollResponse = {
  success: boolean;
  message?: string;
};

type Request = JoinRequest | RollRequest;
type Response = JoinResponse | RollResponse;

export default class PartyApi {
  constructUrl(path: string): string {
    return `https://dice-party-276102.wl.r.appspot.com${path}`;
  }

  async postData(path: string, data: Request): Promise<Response> {
    return fetch(this.constructUrl(path), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then((response) => {
      return response.json();
    });
  }

  async join(request: JoinRequest): Promise<JoinResponse> {
    return this.postData("/join", request);
  }

  async roll(request: RollRequest): Promise<RollResponse> {
    return this.postData("/roll", request);
  }
}
