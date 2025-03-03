import axios from "axios";
import _get from "lodash/get";

const apiBaseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

const axiosInstance = axios.create({
  baseURL: apiBaseURL,
  timeout: 30000,
  headers: {
    ContentType: "application/json",
  },
});

axiosInstance.interceptors.response.use(
  response => response,
  error => {
    if (error.code === "ERR_NETWORK") {

      window.location.href = `https://${process.env.NEXT_PUBLIC_API_DOMAIN}}/error`;
    } else {
      throw error;
    }
  }
);

const axiosPublicInstance = axios.create({
  baseURL: apiBaseURL,
  timeout: 30000,
  headers: {
    ContentType: "application/json",
  },
});



// const validateRecaptchaV2 = async (token: string): Promise<boolean | null> => {
//   try {
//     let response;

//     const params = new URLSearchParams();
//     params.append('secret', SECRET_KEY_V2);
//     params.append('response', token);

//     const config = {
//       headers: {
//         'Content-Type': 'application/x-www-form-urlencoded',
//       },
//     };

//     if (process.env.PROXY_SERVER) {
//       const proxy = {
//         host: process.env.PROXY_SERVER,
//         port: 30025,
//       };

//       response = await axios.post('https://www.google.com/recaptcha/api/siteverify', params, {
//         ...config,
//         proxy,
//       });
//     } else {
//       response = await axios.post('https://www.google.com/recaptcha/api/siteverify', params, config);
//     }

//     console.log('reCAPTCHAV2 response:', response.data);

//     if (response.data.success) {
//       return true;
//     }
//   } catch (error) {
//     console.error('Error validating reCAPTCHAV2:', error);
//   }

//   return false;
// };

// const validateRecaptchaV3 = async (token: string): Promise<any | null> => {
//   try {
//     let response = await axios.post(`https://www.google.com/recaptcha/api/siteverify?secret=${SECRET_KEY_V3}&response=${token}`);

//     console.log('reCAPTCHAV3 response:', response.data);

//     if (response.data.success && response.data.score > 0.5) {
//       return true;
//     }

//   } catch (error) {
//     console.error('Error validating reCAPTCHAV3:', error);
//   }
//   return false;

// }

const validateRecaptcha = async ({ token, ver = "v2" }) => {
  try {
    const response = await axiosPublicInstance.post(`/public/recaptcha`, { token, ver });
    console.log('API reCAPTCHAV3 response:', response.data);
    return _get(response.data, "data.success", false);
  } catch (error) {
    console.error('Error validating reCAPTCHAV3:', error);
  }
  return false;
}

export { axiosInstance, axiosPublicInstance, validateRecaptcha };

