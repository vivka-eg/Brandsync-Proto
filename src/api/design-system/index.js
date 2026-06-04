import { populate } from "@/strapi/populate";
import { strapi } from "@strapi/client";
import axios from "axios";

let _tokenPromise = null;

export default class ApiHandler {
  constructor(token, baseURL = process.env.NEXT_PUBLIC_STRAPI_API_URL) {
    this.client = strapi({
      baseURL,
      auth: token,
    });
    this.populate = populate;
  }

  static initServer() {
    return new ApiHandler(
      process.env.STRAPI_API_TOKEN,
      process.env.NEXT_PUBLIC_INTERNAL_API_URL
    );
  }

  static async init(baseURL = process.env.NEXT_PUBLIC_STRAPI_API_URL) {
    try {
      if (!_tokenPromise) {
        _tokenPromise = axios.get("/api/env").then((r) => r.data.STRAPI_API_TOKEN);
      }
      const token = await _tokenPromise;
      return new ApiHandler(token, baseURL);
    } catch (error) {
      console.error("Failed to initialize API handler:", error);
      _tokenPromise = null; // allow retry on next call
      return new ApiHandler(null, baseURL);
    }
  }

  async findOne(collection, id) {
    try {
      const response = await this.client.collection(collection).findOne(id, {
        populate: populate[collection].findOne,
      });
      return response.data;
    } catch (error) {
      return this.formatError(error);
    }
  }

  async find(
    collection,
    { filters = {}, page = 1, pageSize = 40, customPopulate, sort } = {}
  ) {
    try {
      const query = {
        populate: customPopulate ?? populate[collection].find,
        pagination: {
          page,
          pageSize,
        },
        filters,
      };
      if (sort) query.sort = sort;
      
      const response = await this.client.collection(collection).find(query);
      
      return response;
    } catch (error) {
      // Wrap in { data } so callers that destructure `data` don't crash
      return { data: null, ...this.formatError(error) };
    }
  }

  async getSingleType(type) {
    try {
      const response = await this.client.single(type).find({
        populate: populate.singleType[type],
      });
      return response.data;
    } catch (error) {
      return this.formatError(error);
    }
  }

  async findOneBySpecificKeyMatch(collection, key, value) {
    try {
      const response = await this.client.collection(collection).find({
        filters: {
          [key]: { $eq: value },
        },
        populate: populate[collection].findOne,
      });
      return response.data?.[0];
    } catch (error) {
      return this.formatError(error);
    }
  }

  formatError(error) {
    return { error: error.message || "Failed to fetch" };
  }
}

export const api = new ApiHandler();
