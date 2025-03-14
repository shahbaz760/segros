import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const { secretKey, saltRounds } = require("../../config/keys");

const extractToken = (authToken) => {
  if (authToken) {
    const split = authToken.split(" ");
    if (split.length > 1) {
      return split[1];
    }
    return authToken;
  }
  return authToken;
};

export const verifyToken = async (authorization) => {
  try {
    const token = extractToken(authorization);
    const decoded = jwt.verify(token, secretKey);
    return decoded;
  } catch (error) {
    return "invalid jwt"
  }
};
export const verifyClaimsToken = async (authorization, secret_key) => {
  try {
    const token = extractToken(authorization);
    const decoded = jwt.verify(token, secret_key);
    return decoded;
  } catch (error) {
    return "invalid jwt"
  }
};

export const refreshToken = (payload) => jwt.sign(payload, secretKey, { expiresIn: "24hr" }); /* TODO: need to enable the token expiry */
export const setResponseToken = (res, token) => res.set("authorization", token);
export const generateHash = async (text) => {
  const hash = await bcrypt.hash(text, saltRounds);
  return hash;
};
