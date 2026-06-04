import { jwtVerify, createRemoteJWKSet } from "jose";
import ApiError from "@/utils/apiError";

const KEYCLOAK_ISSUER = `${process.env.NEXT_PUBLIC_KEYCLOAK_URL}/realms/${process.env.NEXT_PUBLIC_KEYCLOAK_REALM}`;
const JWKS = createRemoteJWKSet(
  new URL(`${KEYCLOAK_ISSUER}/protocol/openid-connect/certs`)
);

export async function checkUserAuthWithRole(request, role) {
  const authHeader = request.headers.get("Authorization");
  const token = authHeader ? authHeader.replace("Bearer ", "") : null;

  // Check if token is provided
  if (!token) {
    throw new ApiError("Authorization token is missing", 401);
  }

  // Verify token and get payload
  const payload = await verifyAccessToken(token);

  // If no payload, user is not authenticated
  if (!payload) {
    throw new ApiError("Invalid or expired token", 401);
  }

  // If no specific role is required, user is authenticated
  if (!role || role.length === 0) {
    return {
      payload,
    };
  }

  // check if user has the required role:
  const isValidUser = userHasRole(
    payload,
    role,
    process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID
  );

  if (!isValidUser) {
    throw new ApiError("User does not have the required role", 403);
  }

  return {
    payload,
  };
}

export function userHasRole(payload, role, clientId) {
  const realmRoles = payload?.realm_access?.roles || [];
  const clientRoles = clientId
    ? payload?.resource_access?.[clientId]?.roles || []
    : [];

  // Combine realm and client roles
  const allUserRoles = [...realmRoles, ...clientRoles];

  // If role is an array, check if user has at least one of the roles
  if (Array.isArray(role)) {
    return role.some((r) => allUserRoles.includes(r));
  }

  // If role is a string, check if user has that specific role
  return allUserRoles.includes(role);
}

export async function verifyAccessToken(token) {
  try {
    const { payload } = await jwtVerify(token, JWKS, {
      issuer: KEYCLOAK_ISSUER,
      algorithms: ["RS256"],
    });

    return payload; // contains roles, email, username, etc.
  } catch (e) {
    throw new ApiError("Token verification failed", 401);
  }
}
