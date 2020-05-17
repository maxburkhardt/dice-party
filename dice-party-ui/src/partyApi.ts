type JoinRequest = {
  partyId: string;
  name: string;
};

type JoinResponse = {
  success: boolean;
  sessionId?: string;
  message?: string;
};

type RollRequest = {
  sessionId: string;
  description: string;
};

type RollResponse = {
  success: boolean;
  message?: string;
};

type Request = JoinRequest | RollRequest;
type Response = JoinResponse | RollResponse;

function constructUrl(path: string): string {
  return `https://dice-party-276102.wl.r.appspot.com${path}`;
}

async function postData(path: string, data: Request): Promise<Response> {
  return fetch(constructUrl(path), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  }).then((response) => {
    return response.json();
  });
}

export async function join(request: JoinRequest): Promise<JoinResponse> {
  return postData("/join", {
    partyId: request.partyId,
    name: request.name,
  });
}

export async function roll(request: RollRequest): Promise<RollResponse> {
  return postData("/roll", {
    sessionId: request.sessionId,
    description: request.description,
  });
}
