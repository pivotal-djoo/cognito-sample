import { CognitoJwtVerifier } from 'aws-jwt-verify';
import { APIGatewayProxyEventHeaders } from 'aws-lambda';

export type TokenPayload = {
  email: string;
};

export async function verifyToken(token: string): Promise<TokenPayload> {
  if (!process.env.USER_POOL_ID || !process.env.CLIENT_ID) {
    throw new Error(
      'Must be configured with valid User Pool ID and Client ID.'
    );
  }

  const verifier = CognitoJwtVerifier.create({
    userPoolId: process.env.USER_POOL_ID,
    tokenUse: 'id',
    clientId: process.env.CLIENT_ID,
  });

  try {
    return (await verifier.verify(token)) as unknown as TokenPayload;
  } catch (err) {
    throw new Error(`Token not valid!  ${err}`);
  }
}

export function getAuthToken(headers: APIGatewayProxyEventHeaders) {
  const authHeader = Object.keys(headers).find(
    (key) => key.toLowerCase() === 'authorization'
  );

  if (authHeader) {
    return headers[authHeader]?.replace(/^bearer\s/i, '');
  } else {
    throw new Error('Authorization token not found');
  }
}
