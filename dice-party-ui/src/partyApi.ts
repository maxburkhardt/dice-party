type JoinResponse = {
  success: boolean;
  sessionId?: string;
  message?: string;
};

type RollResponse = {
  success: boolean;
  message?: string;
};

export async function join(
  partyId: string,
  name: string
): Promise<JoinResponse> {
  return postData("/join", {
    partyId: partyId,
    name: name,
  });
}

export async function roll(
  sessionId: string,
  description: string
): Promise<RollResponse> {
  return postData("/roll", {
    sessionId: sessionId,
    description: description,
  });
}

async function postData(path: string, data: any) {
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

function constructUrl(path: string) {
  return `https://dice-party-276102.wl.r.appspot.com${path}`;
}
