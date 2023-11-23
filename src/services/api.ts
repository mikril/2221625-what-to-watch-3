import 'react-toastify/dist/ReactToastify.css';
import axios, {AxiosInstance, AxiosRequestConfig,AxiosResponse, AxiosError} from 'axios';
import {toast} from 'react-toastify';
import {StatusCodes} from 'http-status-codes';
import {getToken} from './token';

type DetailMessageType = {
  type: string;
  message: string;
}

const StatusCodeMapping: Record<number, boolean> = {
  [StatusCodes.BAD_REQUEST]: true,
  [StatusCodes.UNAUTHORIZED]: true,
  [StatusCodes.NOT_FOUND]: true
};

const BACKEND_URL = 'https://13.design.pages.academy/wtw';
const shouldDisplayError = (response: AxiosResponse) => !!StatusCodeMapping[response.status];
const REQUEST_TIMEOUT = 5000;

export const createAPI = (): AxiosInstance => {

  const api = axios.create({
    baseURL: BACKEND_URL,
    timeout: REQUEST_TIMEOUT,
  });

  api.interceptors.request.use(
    (config: AxiosRequestConfig)=> {
      const token = getToken();
      if (token && config.headers) {
        config.headers['x-token'] = token;
      }
      return config;
    }
  );

  api.interceptors.response.use(
    (response) => response,
    (error: AxiosError<DetailMessageType>) => {
      if (error.response && shouldDisplayError(error.response)) {
        const detailMessage = (error.message);
        toast.warn(detailMessage);
      }

      throw error;
    }
  );

  return api;
};
